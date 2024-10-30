const path = require('path');

module.exports = {
    entry: {
        app: './public/app/index.ts',
    },
    output: {
        filename: 'app.js',
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
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: 'tsconfig.dev.json',
                        }
                    }
                ],
                exclude: /node_modules/,
            },
        ],
    },
    mode: 'development',
};
