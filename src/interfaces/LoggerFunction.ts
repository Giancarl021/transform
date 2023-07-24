import Awaitable from '@interfaces/Awaitable';

type LoggerFunction = (message: string) => Awaitable;

export default LoggerFunction;
