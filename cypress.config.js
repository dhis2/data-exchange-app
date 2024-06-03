const {
    networkShim,
    chromeAllowXSiteCookies,
    cucumberPreprocessor,
} = require('@dhis2/cypress-plugins')
const { defineConfig } = require('cypress')

async function setupNodeEvents(on, config) {
    await cucumberPreprocessor(on, config)
    networkShim(on, config)
    chromeAllowXSiteCookies(on, config)
    return config
}

module.exports = defineConfig({
    video: false,
    projectId: 'efhyah',

    env: {
        dhis2DataTestPrefix: 'dhis2-dataexchange',
        networkMode: 'live',
        dhis2ApiVersion: '42',
    },

    experimentalSessionAndOrigin: true,
    experimentalInteractiveRunEvents: true,
    e2e: {
        setupNodeEvents,
        baseUrl: 'http://localhost:3000',
        specPattern: [
            'cypress/e2e/**/*.feature.js',
            'cypress/e2e/**/*.feature',
        ],
    },

    component: {
        devServer: {
            framework: 'create-react-app',
            bundler: 'webpack',
        },
    },
})
