const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './parser.js',
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    }
}