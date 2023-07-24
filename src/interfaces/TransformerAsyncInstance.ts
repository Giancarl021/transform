/**
 * A `TransformerAsync` instance, containing the available asynchronous methods for transformation
 */
interface TransformerAsyncInstance<Input, Output> {
    /**
     * Converts a single `Input` item into a `Promise` with an `Output` item using the `transformFunction`
     * @param input The `Input` item to be transformed
     * @returns A promise with the generated `Output` item
     */
    transformSingle: (input: Input) => Promise<Output>;
    /**
     * Converts an array of `Input` items into a `Promise` with an `Output` items array iterating one
     * by one linearly, using the `transformFunction`
     * @param inputArray The `Input` items array to be transformed
     * @returns A `Promise` with the generated `Output` items array
     */
    transformLinearly: (inputArray: Input[]) => Promise<Output[]>;

    /**
     * Converts an array of `Input` items into a `Promise` with an `Output` items array iterating one
     * by one linearly, using the `transformFunction`
     * @param inputArray The `Input` items array to be transformed
     * @param throttle The maximum amount of concurrent transformations, `undefined` to no limit
     * @returns A `Promise` with the generated `Output` items array
     */
    transformParallel: (
        inputArray: Input[],
        throttle?: number
    ) => Promise<Output[]>;
}

export default TransformerAsyncInstance;
