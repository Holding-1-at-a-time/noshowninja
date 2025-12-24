#!/usr/bin/env tsx

/**
 * Load simulation script for NoShowNinja baseline testing
 * Simulates cron processing and workpool consumption at target throughput
 * Measures queue depth, retry rates, and enqueue latency
 */

interface SimulationConfig {
  tenants: number;
  messagesPerTenant: number;
  cronFrequencyMinutes: number;
  aiLatencyMs: number;
  simulationDurationMinutes: number;
}

interface Metrics {
  totalMessages: number;
  enqueuedMessages: number;
  processedMessages: number;
  failedMessages: number;
  averageEnqueueLatency: number;
  maxQueueDepth: number;
  retryRate: number;
  throughputPerMinute: number;
}

class LoadSimulator {
  private config: SimulationConfig;
  private metrics: Metrics;
  private queue: Array<{ tenantId: string; messageId: string; sendAt: number }> = [];
  private startTime: number;

  constructor(config: SimulationConfig) {
    this.config = config;
    this.metrics = {
      totalMessages: 0,
      enqueuedMessages: 0,
      processedMessages: 0,
      failedMessages: 0,
      averageEnqueueLatency: 0,
      maxQueueDepth: 0,
      retryRate: 0,
      throughputPerMinute: 0,
    };
    this.startTime = Date.now();
  }

  async run(): Promise<Metrics> {
    console.log(`Starting load simulation with ${this.config.tenants} tenants, ${this.config.messagesPerTenant} messages/tenant`);
    console.log(`Cron frequency: ${this.config.cronFrequencyMinutes} minutes, AI latency: ${this.config.aiLatencyMs}ms`);

    // Generate initial message load
    this.generateMessages();

    // Simulate cron processing
    const cronInterval = setInterval(() => {
      this.processCron();
    }, this.config.cronFrequencyMinutes * 60 * 1000); // Convert to ms

    // Simulate workpool processing
    const workpoolInterval = setInterval(() => {
      this.processWorkpool();
    }, 1000); // Process every second

    // Run simulation for specified duration
    await new Promise(resolve => setTimeout(resolve, this.config.simulationDurationMinutes * 60 * 1000));

    // Cleanup
    clearInterval(cronInterval);
    clearInterval(workpoolInterval);

    // Calculate final metrics
    this.calculateFinalMetrics();

    console.log('Simulation completed');
    console.log(`Total messages: ${this.metrics.totalMessages}`);
    console.log(`Processed: ${this.metrics.processedMessages}, Failed: ${this.metrics.failedMessages}`);
    console.log(`Average enqueue latency: ${this.metrics.averageEnqueueLatency}ms`);
    console.log(`Max queue depth: ${this.metrics.maxQueueDepth}`);
    console.log(`Throughput: ${this.metrics.throughputPerMinute} messages/minute`);

    return this.metrics;
  }

  private generateMessages(): void {
    for (let tenant = 1; tenant <= this.config.tenants; tenant++) {
      for (let msg = 1; msg <= this.config.messagesPerTenant; msg++) {
        const message = {
          tenantId: `tenant-${tenant}`,
          messageId: `msg-${tenant}-${msg}`,
          sendAt: Date.now() + Math.random() * this.config.simulationDurationMinutes * 60 * 1000, // Random send time within simulation
        };
        this.queue.push(message);
        this.metrics.totalMessages++;
      }
    }
    console.log(`Generated ${this.metrics.totalMessages} messages`);
  }

  private processCron(): void {
    const now = Date.now();
    const dueMessages = this.queue.filter(msg => msg.sendAt <= now);

    dueMessages.forEach(msg => {
      // Simulate enqueue latency (time from due to enqueued)
      const latency = Math.random() * 60000; // 0-60 seconds
      this.metrics.averageEnqueueLatency = (this.metrics.averageEnqueueLatency + latency) / 2;
      this.metrics.enqueuedMessages++;
    });

    // Remove processed messages from queue (simplified - in real system they'd move to workpool)
    this.queue = this.queue.filter(msg => msg.sendAt > now);
    this.metrics.maxQueueDepth = Math.max(this.metrics.maxQueueDepth, this.queue.length);
  }

  private processWorkpool(): void {
    if (this.queue.length === 0) return;

    // Process messages (simulate AI generation + send)
    const messagesToProcess = Math.min(10, this.queue.length); // Process up to 10 per second

    for (let i = 0; i < messagesToProcess; i++) {
      const message = this.queue.shift();
      if (!message) break;

      // Simulate processing with AI latency
      setTimeout(() => {
        // Random failure rate
        if (Math.random() < 0.05) { // 5% failure rate
          this.metrics.failedMessages++;
          // Simulate retry
          if (Math.random() < 0.8) { // 80% of failures retry successfully
            this.metrics.processedMessages++;
          }
        } else {
          this.metrics.processedMessages++;
        }
      }, this.config.aiLatencyMs);
    }
  }

  private calculateFinalMetrics(): void {
    const durationMinutes = (Date.now() - this.startTime) / (1000 * 60);
    this.metrics.throughputPerMinute = this.metrics.processedMessages / durationMinutes;
    this.metrics.retryRate = this.metrics.failedMessages > 0 ? (this.metrics.processedMessages / this.metrics.failedMessages) : 0;
  }
}

// CLI interface
async function main() {
  const config: SimulationConfig = {
    tenants: parseInt(process.env.TENANTS || '100'),
    messagesPerTenant: parseInt(process.env.MESSAGES_PER_TENANT || '500'),
    cronFrequencyMinutes: parseInt(process.env.CRON_FREQUENCY || '1'),
    aiLatencyMs: parseInt(process.env.AI_LATENCY_MS || '2000'),
    simulationDurationMinutes: parseInt(process.env.SIMULATION_DURATION || '10'),
  };

  const simulator = new LoadSimulator(config);
  const metrics = await simulator.run();

  // Output metrics as JSON for analysis
  console.log('\n=== METRICS ===');
  console.log(JSON.stringify(metrics, null, 2));
}

if (require.main === module) {
  main().catch(console.error);
}

export { LoadSimulator, SimulationConfig, Metrics };