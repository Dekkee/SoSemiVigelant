'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

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
                use: ['babel-loader']
            }
        ]
    },

    devServer: {
        contentBase: './public',
        hot: true
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: 'Hot Module Replacement',
            filename: 'public/index.html'
        }),
        new webpack.HotModuleReplacementPlugin()
    ],

    devtool: 'eval-source-map',

    resolve: {
        extensions: ['.js', '.jsx']
    }
};
