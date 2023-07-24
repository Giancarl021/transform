/**
 * A `TransformerSync` instance, containing the available synchronous methods for transformation
 */
interface TransformerSyncInstance<Input, Output> {
    /**
     * Converts a single `Input` item into a `Output` item using the `transformFunction`
     * @param input The `Input` item to be transformed
     * @returns The generated `Output` item
     */
    transformSingle: (input: Input) => Output;
    /**
     * Converts an array of `Input` items into a `Output` items array iterating one by one linearly,
     * using the `transformFunction`
     * @param inputArray The `Input` items array to be transformed
     * @returns The generated `Output` items array
     */
    transformLinearly: (inputArray: Input[]) => Output[];
}

export default TransformerSyncInstance;
