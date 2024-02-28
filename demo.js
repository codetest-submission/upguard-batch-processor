import MicroBatcher from "./MicroBatcher.js";

// Mock a batchProcessor function
function batchProcessor(jobs) {
    return new Promise(resolve => {
      setTimeout(() => {
        const results = jobs.map(job => `Processed: ${job}`);
        resolve(results);
      }, 1000); 
    });
  }
  
const microBatcher = new MicroBatcher(batchProcessor, 5, 5000);

// Submit jobs
for (let i = 0; i < 10; i++) {
    microBatcher.submitJob(`Job ${i + 1}`);
}

// Start processor
microBatcher.start()

// Simulate shutting down later and subtmit job after shutting down
setTimeout(() => {
    microBatcher.shutdown();
    microBatcher.submitJob("Late job")
}, 4000);