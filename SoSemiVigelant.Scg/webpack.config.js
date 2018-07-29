const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
module.exports = (env) => ({
    entry: './src/index.tsx',
    mode: env || 'development',
    module:{
        rules: [
            { test: /\.tsx?/, use: 'awesome-typescript-loader' },
            {
                test: /\.scss$/,
                use: [
                    "style-loader", // creates style nodes from JS strings
                    "css-loader",   // translates CSS into CommonJS
                    "sass-loader"   // compiles Sass to CSS
                ]
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.join('./src/template/index.html'),
        }),
        env && new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(env)
        })
    ],
    resolve: {
        extensions: ['.js', '.ts', '.tsx']
    },
    devServer: {
        compress: true,
        contentBase: './dist',
        hot: true
    },
    devtool: env && 'cheap-source-map',
});
