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
    })
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
    entry: './src/index.jsx',

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
        extensions: ['.js', '.jsx']
    }
};
