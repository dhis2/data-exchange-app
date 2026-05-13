module.exports = {
    setupFilesAfterEnv: ['<rootDir>/src/test-utils/setup-tests.js'],
    collectCoverageFrom: ['src/**/*.{js,jsx}', '!src/test-utils/**'],
    coveragePathIgnorePatterns: ['/node_modules/', '/src/locales/'],
}
