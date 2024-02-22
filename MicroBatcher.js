class MicroBatcher {
    #batchProcessor;
    #batchSize;
    #batchInterval;
    
    #jobQueue = [];
    #intervalRef = null;
    #shutdownRequested = false;
    
    constructor(batchProcessor, batchSize = 10, batchInterval = 1000) {
        this.#batchProcessor = batchProcessor
        this.#batchSize = batchSize
        this.#batchInterval = batchInterval
    }

    submitJob(job) {
        if(this.#shutdownRequested) {
            console.warn(`WARN [${new Date().toISOString()}] Shutting down, job can't be submitted.`)
        } else {
            this.#jobQueue.push(job)
        }
    }

    start() {
        if(!this.#intervalRef) {
            console.log(`INFO [${new Date().toISOString()}] Processor started.`)
            this.#processJobs()
            this.#intervalRef = setInterval(() => {this.#processJobs()}, this.#batchInterval)
        } else {
            console.warn(`WARN [${new Date().toISOString()}] Processor already started.`)
        }
    }

    #processJobs() {
        if(this.#shutdownRequested && this.#jobQueue.length === 0) {
            clearInterval(this.#intervalRef)
            this.#intervalRef = null
            console.log(`INFO [${new Date().toISOString()}] Remaining jobs finished, exit.`)
            return
        }
        const batchJobs = this.#jobQueue.splice(0, this.#batchSize)                
        this.#batchProcessor(batchJobs)
            .then(res => 
                console.log(`INFO [${new Date().toISOString()}] ${batchJobs.length} jobs processed: `, res))
            .catch(err => 
                console.error(`EROR [${new Date().toISOString()}] Batch processed error: `, err))
    }

    shutdown() {
        if(this.#intervalRef) {
            console.log(`INFO [${new Date().toISOString()}] Shutdown requested, ${this.#jobQueue.length} jobs left.`)
            this.#shutdownRequested = true
        } else {
            console.warn(`WARN [${new Date().toISOString()}] Jobs processing not started yet.`)
        }
    }

 }

 export default MicroBatcher;