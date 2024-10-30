const path = require('path');

module.exports = {
    entry: './public/lib/index.ts', // Your entry point
    output: {
        filename: 'lib.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true, // Clean the output directory before emit
        library: 'crashme',
        libraryTarget: 'umd',
        globalObject: 'this',
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    mode: 'production',
};