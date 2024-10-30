const path = require('path');

module.exports = {
    entry: './public/lib/index.ts',
    output: {
        filename: 'lib.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        library: 'crashme',
        libraryTarget: 'umd',
        globalObject: 'this',
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: 'tsconfig.prod.json',
                        }
                    }
                ],
                exclude: /node_modules/,
            },
        ],
    },
    mode: 'production',
};
