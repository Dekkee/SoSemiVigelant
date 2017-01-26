module.exports = {
    entry: './src/App.jsx',

    output: {
        filename: 'bundle.js',
        path: './public',
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: ['react-hot', 'babel-loader']
            }
        ]
    },

    devtool: 'eval-source-map',
    
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};