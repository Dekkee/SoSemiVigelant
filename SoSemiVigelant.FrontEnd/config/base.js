'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');


module.exports = (_path) => {
    const plugins = [
        new HtmlWebpackPlugin({
            title: 'Hot Module Replacement',
            filename: 'index.html',
            template: path.join(_path, 'src/template/index.html'),
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ];

    return {
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
                    use: 'awesome-typescript-loader'
                },
                {
                    test: /\.scss$/,
                    use: [
                        "style-loader", // creates style nodes from JS strings
                        "css-loader",   // translates CSS into CommonJS
                        "sass-loader"   // compiles Sass to CSS
                    ]
                },
                {
                    test: /\.jpe?g$|\.ico$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$/,
                    loader: 'file-loader?name=[name].[ext]'
                }
            ]
        },

        plugins,

        resolve: {
            extensions: ['.js', '.ts', '.tsx']
        },

        optimization: {
            namedChunks: true,
            splitChunks: {
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "vendors",
                        chunks: "all"
                    }
                }
            }
        }
    }
};
