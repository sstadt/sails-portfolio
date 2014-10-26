({
    appDir: "./",
    baseUrl: "./",
    dir: "../js-build",
    mainConfigFile: 'lib/config.js',
    findNestedDependencies: true,
    removeCombined: true,
    modules: [
        {
            name: 'app/admin'
        },

        {
            name: 'app/gallery'
        },

        {
            name: 'app/portfolio'
        }
    ]
})