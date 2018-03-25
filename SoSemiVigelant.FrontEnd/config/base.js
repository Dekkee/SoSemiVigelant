'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const plugins = [
    new HtmlWebpackPlugin({
        title: 'Hot Module Replacement',
        filename: 'public/index.html'
    })
];


module.exports = (_path) => ({
    entry: './src/index.tsx',
    mode: 'development',
    output: {
        filename: 'bundle.js',
        path: path.join(_path, 'public'),
    },

    module: {
        rules: [
            {
                test: /\.(tsx|ts)?$/,

                exclude: /node_modules/,
                use: [{
                    loader: 'awesome-typescript-loader'
                }]
            }
        ]
    },

    devServer: {
        contentBase: './public',
        hot: true
    },

    plugins,

    devtool: 'eval-source-map',

    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
    }
});
