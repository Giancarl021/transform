import LoggerFunction from '@interfaces/LoggerFunction';
import {
    AsyncTransformFunction,
    SyncTransformFunction
} from '@interfaces/TransformFunction';
import TransformerSyncInstance from '@interfaces/TransformerSyncInstance';
import TransformerAsyncInstance from '@interfaces/TransformerAsyncInstance';
import constants from '@Constants';

const emptyLogger = constants.dev.getEmptyCallback<LoggerFunction>();

/**
 * A Transformer for asynchronous applications, with sequential and parallel transformations.
 * This transformer allow asynchronous transform functions
 */
export function TransformerAsync<Input, Output>(
    transformFunction: AsyncTransformFunction<Input, Output>,
    loggerFunction: LoggerFunction = emptyLogger
): TransformerAsyncInstance<Input, Output> {
    async function transformSingle(input: Input): Promise<Output> {
        loggerFunction('Transforming single input...');

        const output = await transformFunction(input);

        loggerFunction('Transformed successfully');

        return output;
    }

    async function transformLinearly(inputArray: Input[]): Promise<Output[]> {
        if (!inputArray.length) {
            loggerFunction('No items to transform');
            return [];
        }

        const output: Output[] = [];

        loggerFunction(`Transforming ${inputArray.length} input items...`);

        for (const item of inputArray)
            output.push(await transformFunction(item));

        loggerFunction(
            `Successfuly transformed ${output.length} input items into output items`
        );

        return output;
    }

    async function transformParallel(
        inputArray: Input[],
        throttle?: number
    ): Promise<Output[]> {
        if (!inputArray.length) {
            loggerFunction('No items to transform');
            return [];
        }

        loggerFunction(
            `Transforming ${inputArray.length} input items with ${
                throttle ? `limit ${throttle}` : 'no limit'
            }...`
        );

        const callbacks = inputArray.map(
            item => async () => await transformFunction(item)
        );

        if (!throttle) {
            const output = await Promise.all(
                callbacks.map(callback => callback())
            );

            loggerFunction(
                `Successfuly transformed ${output.length} input items into output items`
            );

            return output;
        }

        const output: Output[] = [];
        const promises: Promise<Output>[] = [];
        let chunkCounter = 1;

        loggerFunction(
            `Executing chunk${
                callbacks.length <= throttle ? '' : chunkCounter
            }...`
        );

        for (let i = 0; i < callbacks.length; i++) {
            const callback = callbacks[i];

            if (i && i % throttle === 0) {
                output.push(...(await Promise.all(promises)));
                promises.length = 0;
                loggerFunction(`Executing chunk ${++chunkCounter}...`);
            }
            promises.push(callback());
        }

        if (promises.length) output.push(...(await Promise.all(promises)));

        loggerFunction(
            `Successfully transformed ${output.length} input items into output items`
        );

        return output;
    }

    return {
        transformSingle,
        transformLinearly,
        transformParallel
    };
}
/**
 * A Transformer for synchronous applications, with only sequential transformations.
 * This transformer does not allow asynchronous transform functions
 */
export function TransformerSync<Input, Output>(
    transformFunction: SyncTransformFunction<Input, Output>,
    loggerFunction: LoggerFunction = emptyLogger
): TransformerSyncInstance<Input, Output> {
    function transformSingle(input: Input): Output {
        loggerFunction('Transforming single input...');

        const output = transformFunction(input);

        loggerFunction('Transformed successfully');

        return output;
    }

    function transformLinearly(inputArray: Input[]): Output[] {
        if (!inputArray.length) {
            loggerFunction('No items to transform');
            return [];
        }

        const output: Output[] = [];

        loggerFunction(`Transforming ${inputArray.length} input items...`);

        for (const item of inputArray) output.push(transformFunction(item));

        loggerFunction(
            `Successfuly transformed ${output.length} input items into output items`
        );

        return output;
    }

    return {
        transformSingle,
        transformLinearly
    };
}

export default TransformerAsync;
