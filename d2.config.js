const config = {
    id: '', // Still needs an app-hub id
    type: 'app',
    name: 'aggregate-data-exchange',
    title: 'Data Exchange',
    minDHIS2Version: '2.39',
    coreApp: true,
    entryPoints: {
        app: './src/app/index.js',
    },
}

module.exports = config
