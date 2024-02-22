import MicroBatcher from "./MicroBatcher.js";

function batchProcessor(jobs) {
    return new Promise(resolve => {
      setTimeout(() => {
        const results = jobs.map(job => `Processed: ${job}`);
        resolve(results);
      }, 1000); 
    });
  }
  
const microBatcher = new MicroBatcher(batchProcessor, 5, 1000);

// for (let i = 0; i < 10; i++) {
//     microBatcher.submitJob(`Job ${i + 1}`);
// }

microBatcher.start()
// console.log(microBatcher.jobQueue)
  

setTimeout(() => {
  for (let i = 0; i < 10; i++) {
    microBatcher.submitJob(`Job ${i + 1}`);
  }
})
// setTimeout(() => {
//     microBatcher.shutdown();
//     microBatcher.submitJob("Late job")
// }, 4000);