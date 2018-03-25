const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const InlineEnvironmentVariablesPlugin = require('inline-environment-variables-webpack-plugin');

module.exports = function (_path) {
    _path = _path || path.dirname(__dirname);
    return merge(require('./base')(_path), {
        mode: 'development',
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new InlineEnvironmentVariablesPlugin({
                API_HOST: 'localhost',
                HOST_PORT: '8000'
            })
        ],
        devServer: {
            contentBase: './public',
            hot: true
        }
    });
};
