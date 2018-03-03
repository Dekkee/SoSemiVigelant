const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './parser.js',
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        libraryTarget: "commonjs"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'shebang-loader',
                include: [/node_modules[/\\]requirejs/]
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: [/node_modules/]
            }
        ]
    }
}