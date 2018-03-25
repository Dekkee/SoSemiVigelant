const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');

module.exports = function (_path) {
    _path = _path || path.dirname(__dirname);
    return merge(require('./base')(_path), {
        mode: 'production',
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('production')
            })
        ]
    });
};
