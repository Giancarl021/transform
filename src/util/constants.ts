export default {
    dev: {
        getEmptyCallback<T extends (...args: any[]) => any>() {
            return (() => {}) as T;
        }
    } as const
} as const;
