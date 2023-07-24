import { describe, test, expect } from '@jest/globals';

import Transformer, { TransformerAsync, TransformerSync } from './index';
import { beforeEach } from '@jest/globals';
import { jest } from '@jest/globals';

const emptyTransformer = (_: any) => null;
const numberToStringTransformer = (n: number) => String(n);
const numberToStringArrayTransformer = (array: number[]) => array.map(String);
const delayedNumberToStringTransfomer = (n: number) =>
    new Promise(r => setTimeout(() => r(String(n)), 200));

const loggerSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

beforeEach(() => {
    jest.resetAllMocks();
});

const mark = () => {
    const start = Date.now();

    return {
        start,
        end() {
            return Date.now() - start;
        }
    };
};

describe('Base service checks', () => {
    test('Transformer must be equal to TransformerAsync', () => {
        expect(Transformer).toBe(TransformerAsync);
        expect(Transformer).toStrictEqual(TransformerAsync);
    });

    test('TransformerSync instance must have the `linear` and `single` transform methods', () => {
        const transformer = TransformerSync(emptyTransformer);

        expect(transformer).toHaveProperty('transformSingle');
        expect(transformer).toHaveProperty('transformLinearly');
    });

    test('TransformerAsync instance must have the `linear`, `single` and `parallel` transform methods', () => {
        const transformer = TransformerAsync(emptyTransformer);

        expect(transformer).toHaveProperty('transformSingle');
        expect(transformer).toHaveProperty('transformLinearly');
        expect(transformer).toHaveProperty('transformParallel');
    });
});

describe('TransformerSync functionality', () => {
    test('`transformSingle` functionality', () => {
        const transformer1 = TransformerSync(numberToStringTransformer);
        expect(transformer1.transformSingle(1)).toBe('1');
        expect(transformer1.transformSingle(10)).toBe('10');

        const transformer2 = TransformerSync(numberToStringArrayTransformer);

        expect(transformer2.transformSingle([1, 2, 3])).toEqual([
            '1',
            '2',
            '3'
        ]);
        expect(transformer2.transformSingle([])).toEqual([]);
    });

    test('`transformLinearly` functionality', () => {
        const transformer1 = TransformerSync(numberToStringTransformer);

        expect(transformer1.transformLinearly([1, 2, 3])).toEqual([
            '1',
            '2',
            '3'
        ]);
        expect(transformer1.transformLinearly([10])).toEqual(['10']);

        const transformer2 = TransformerSync(numberToStringArrayTransformer);

        expect(transformer2.transformLinearly([[1], [2], [3]])).toEqual([
            ['1'],
            ['2'],
            ['3']
        ]);
        expect(transformer2.transformLinearly([[1, 2, 3]])).toEqual([
            ['1', '2', '3']
        ]);
    });
});

describe('TransformerAsync functionality', () => {
    test('`transformSingle` functionality', async () => {
        const transformer1 = TransformerAsync(numberToStringTransformer);
        expect(await transformer1.transformSingle(1)).toBe('1');
        expect(await transformer1.transformSingle(10)).toBe('10');

        const transformer2 = TransformerAsync(numberToStringArrayTransformer);

        expect(await transformer2.transformSingle([1, 2, 3])).toEqual([
            '1',
            '2',
            '3'
        ]);
        expect(await transformer2.transformSingle([])).toEqual([]);
    });

    test('`transformLinearly` functionality', async () => {
        const transformer1 = TransformerAsync(numberToStringTransformer);

        expect(await transformer1.transformLinearly([1, 2, 3])).toEqual([
            '1',
            '2',
            '3'
        ]);
        expect(await transformer1.transformLinearly([10])).toEqual(['10']);

        const transformer2 = TransformerAsync(numberToStringArrayTransformer);

        expect(await transformer2.transformLinearly([[1], [2], [3]])).toEqual([
            ['1'],
            ['2'],
            ['3']
        ]);
        expect(await transformer2.transformLinearly([[1, 2, 3]])).toEqual([
            ['1', '2', '3']
        ]);

        const transformer3 = TransformerAsync(delayedNumberToStringTransfomer);

        const linearMarker = mark();

        expect(await transformer3.transformLinearly([1, 2, 3])).toEqual([
            '1',
            '2',
            '3'
        ]);

        expect(linearMarker.end()).toBeGreaterThanOrEqual(600);
    });

    test('`transformParallel` functionality', async () => {
        const transformer = TransformerAsync(delayedNumberToStringTransfomer);
        const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const expectedOutput = input.map(String);

        const noLimitsMarker = mark();

        expect(await transformer.transformParallel(input)).toEqual(
            expectedOutput
        );

        expect(noLimitsMarker.end()).toBeGreaterThanOrEqual(200);

        const halfTimeLimitMarker = mark();

        expect(await transformer.transformParallel(input, 5)).toEqual(
            expectedOutput
        );

        expect(halfTimeLimitMarker.end()).toBeGreaterThanOrEqual(400);
    });
});

describe('`loggerFunction` functionality', () => {
    test('`TransformerSync` must work with loggerFunction', () => {
        const transformer = TransformerSync(emptyTransformer, console.log);

        transformer.transformSingle(null);
        transformer.transformLinearly([1, 2]);
        expect(loggerSpy).toHaveBeenCalledTimes(4);
    });

    test('`TransformerAsync` must work with loggerFunction', async () => {
        const transformer = TransformerAsync(emptyTransformer, console.log);

        await transformer.transformSingle(null);
        await transformer.transformLinearly([1, 2]);
        await transformer.transformParallel([1, 2, 3, 4], 2);

        expect(loggerSpy).toHaveBeenCalledTimes(8);
    });
});
