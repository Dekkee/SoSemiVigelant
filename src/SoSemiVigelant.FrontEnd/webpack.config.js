'use strict';

const path = require('path');

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
                use: ['react-hot-loader', 'babel-loader']
            }
        ]
    },

    devtool: 'eval-source-map',
    
    resolve: {
        extensions: ['.js', '.jsx']
    }
};