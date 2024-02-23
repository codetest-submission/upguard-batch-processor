import MicroBatcher from "./MicroBatcher";
import {expect, jest, test} from '@jest/globals';

describe("MicroBatcher", () => {
    let consoleLogSpy;
    let consoleWarnSpy;
    let consoleErrorSpy;
    let batchProcessorResolvedMock
    let batchProcessorRejectedMock

    beforeEach(() => {
        jest.useFakeTimers();
        batchProcessorResolvedMock  = jest.fn().mockResolvedValue('processed');
        batchProcessorRejectedMock = jest.fn().mockResolvedValue('processed').mockRejectedValue('rejected');
        consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    })
    
    afterEach(() => {
        jest.useRealTimers();
        jest.clearAllMocks()
    })
    
    test("should ba able to start and shutdown", async () => {
        const testMicroBatcher = new MicroBatcher(batchProcessorResolvedMock)
        testMicroBatcher.start()
        await jest.advanceTimersByTime(800)
        expect(consoleLogSpy).toHaveBeenCalledTimes(2)
    
        testMicroBatcher.shutdown()
        await jest.advanceTimersByTime(800)
        expect(consoleLogSpy).toHaveBeenCalledTimes(4)
    })

    test("should not be able to start again when processor has been started", () => {
        const testMicroBatcher = new MicroBatcher(batchProcessorResolvedMock)
        testMicroBatcher.start()
        testMicroBatcher.start()
        expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
    })

    test("should not be able to shutdown again when processor hasn't been started", () => {
        const testMicroBatcher = new MicroBatcher(batchProcessorResolvedMock)
        testMicroBatcher.shutdown()
        expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
    })

    test("should not be able to shutdown again when a previous shutdown requested", () => {
        const testMicroBatcher = new MicroBatcher(batchProcessorResolvedMock)
        testMicroBatcher.start()
        testMicroBatcher.shutdown()
        testMicroBatcher.shutdown()
        expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
    })

    test("should print error when batch processor failed",  () => {
        const testMicroBatcher = new MicroBatcher(batchProcessorRejectedMock)
        try{
            testMicroBatcher.start()
        } catch{
            expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
        }
    
    })

    test("should be able to submit jobs when shutdown not requeted", () => {
        const testMicroBatcher = new MicroBatcher(batchProcessorResolvedMock)
        testMicroBatcher.submitJob("test job")
        expect(consoleWarnSpy).toHaveBeenCalledTimes(0)
    })

    test("should not be able to submit jobs when shutdown requeted", () => {
        const testMicroBatcher = new MicroBatcher(batchProcessorResolvedMock)
        testMicroBatcher.start()
        testMicroBatcher.shutdown()
        testMicroBatcher.submitJob("test job")
        expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
    })

})