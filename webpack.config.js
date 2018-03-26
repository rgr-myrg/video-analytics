const {resolve} = require('path');

module.exports = {
    entry: './src/main/ts/index.ts',
    output: {
        filename: 'bundle.js',
        path: resolve(__dirname, 'build'),
        publicPath: "build/"

    },
    resolve: {
        modules: [
            'src',
            'node_modules'
        ],
        extensions: [
            '.js',
            '.ts'
        ]
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                use: "source-map-loader"
            },
            {
                enforce: 'pre',
                test: /\.ts?$/,
                use: "source-map-loader"
            },
            {
                // For our normal typescript
                test: /\.ts?$/,
                use: [
                    {
                        loader: 'awesome-typescript-loader',
                        options: {
                            configFileName: 'tsconfig.json'
                        }
                    }
                ],
                exclude: /(?:node_modules)/,
            },
        ]
    },
    devtool: 'source-map'
};
