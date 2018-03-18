'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const InlineEnvironmentVariablesPlugin = require('inline-environment-variables-webpack-plugin');
const isProduction = process.env.NODE_ENV === 'production';

const plugins = [
    new HtmlWebpackPlugin({
        title: 'Hot Module Replacement',
        filename: 'public/index.html'
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru|en/)
];

if (!isProduction) {
    plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new InlineEnvironmentVariablesPlugin({
            API_HOST: 'localhost',
            HOST_PORT: '8000'
        })
    )
}

module.exports = {
    entry: './src/index.tsx',
    mode: isProduction ? 'production' : 'development',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'public'),
    },

    module: {
        rules: [
            {
                test: /\.(jsx|js)?$/,

                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader'
                }]
            },
            {
                test: /\.(tsx|ts)?$/,

                exclude: /node_modules/,
                use: [{
                    loader: 'ts-loader'
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
};
