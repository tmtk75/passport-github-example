module.exports = {
    entry: "./assets/entry.js",
    output: {
        filename: 'bundle.js',
        path: "assets",
        publicPath: 'http://localhost:8090/assets',
    },
    externals: {
        "jquery": "jQuery",
        "coffee-script": "CoffeeScript"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.styl$/, loader: "style-loader!css-loader!stylus-loader" },
            //{ test: /\.coffee$/, loader: "coffee-loader" },
        ]
    },
    resolve: {
        modulesDirectories: [
            "assets/js",
            "assets/css",
        ]
    },
};
