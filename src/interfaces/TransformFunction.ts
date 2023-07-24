import Awaitable from '@interfaces/Awaitable';

type BaseFunction<Input, Output> = (argument: Input) => Output;

export type AsyncTransformFunction<Input, Output> = BaseFunction<
    Input,
    Awaitable<Output>
>;

export type SyncTransformFunction<Input, Output> = BaseFunction<Input, Output>;
