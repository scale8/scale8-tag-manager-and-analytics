module.exports = {
    testEnvironment: 'node',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
        'jsx',
        'json',
        'node',
    ],
    testRegex: '/tests/(unit|integration)/.+?(test|spec)\\.ts$',
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'src/**/*.{ts,tsx,js,jsx}',
        '!src/**/*index.d.ts',
    ],
};
