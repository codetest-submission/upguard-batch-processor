import MicroBatcher from "./MicroBatcher";
import {expect, jest, test} from '@jest/globals';

describe("MicroBatcher", () => {
    let batchProcessor;
    let consoleLogSpy;
    let consoleWarnSpy;

    beforeEach(() => {
        batchProcessorMock = jest.fn().mockResolvedValue('processed');
        consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    })
    
    afterEach(() => {
        jest.clearAllMocks()
    })


    beforeAll(() => {
        jest.useFakeTimers();
        // jest.spyOn(setInterval);
    })

    afterAll(() => {
        jest.useRealTimers();
    })
    
    test("should ba able to start and shutdown", () => {
        const testMicroBatcher = new MicroBatcher(batchProcessorMock, 2, 10000)
        testMicroBatcher.start()
        jest.runOnlyPendingTimers();
        expect(consoleLogSpy).toHaveBeenCalled()
    })

    test("should be able to ", () => {

    })
})