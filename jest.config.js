/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: [
        'js',
        'mjs',
        'cjs',
        'jsx',
        'ts',
        'tsx',
        'json',
        'node',
        'd.ts'
    ],
    moduleNameMapper: {
        '^@interfaces/(.*)$': '<rootDir>/src/interfaces/$1',
        '^@util/(.*)$': '<rootDir>/src/util/$1',
        '^@Constants(.*)$': '<rootDir>/src/util/constants'
    }
};
