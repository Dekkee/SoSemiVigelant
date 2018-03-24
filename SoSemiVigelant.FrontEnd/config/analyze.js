'use strict';

const path = require('path');
const merge = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = function (_path) {
    _path = _path || path.dirname(__dirname);
    return merge(require('./prod')(_path), {
        plugins: [
            new BundleAnalyzerPlugin()
        ]
    });
};
