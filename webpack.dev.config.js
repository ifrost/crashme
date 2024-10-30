const path = require('path');

module.exports = {
    entry: {
        app: './public/app/app.ts',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dev'),
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    devtool: 'eval-source-map',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    mode: 'development',
};