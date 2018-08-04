const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const OfflinePlugin = require('offline-plugin');

module.exports = (env) => {
    const plugins = [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(env)
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            favicon: './src/icons/favicon.ico',
            template: path.join('./src/template/index.html'),
        }),
        new WebpackPwaManifest({
            name: "Tuktuk, the SCG scrapper",
            short_name: "Tuktuk",
            lang: "en-GB",
            start_url: "/",
            display: "standalone",
            theme_color: "#ccffcc",
            background_color: "#FFFFFF",
            fingerprints: false,
            inject: true,
            ios: true,
            "icons": [
                {
                    src: path.resolve(__dirname, './src/icons/android-icon-192x192.png'),
                    sizes: [36, 48, 72, 144, 192],
                    type: "image/png",
                    destination: path.join('icons', 'android')
                },
                {
                    src: path.resolve(__dirname, './src/icons/apple-icon-1024x1024.png'),
                    sizes: [57, 60, 72, 76, 114, 120, 144, 152, 180, 1024],
                    type: "image/png",
                    destination: path.join('icons', 'ios'),
                    ios: true
                },
                {
                    src: path.resolve(__dirname, './src/icons/apple-icon-1024x1024.png'),
                    sizes: 1024,
                    type: "image/png",
                    destination: path.join('icons', 'ios'),
                    ios: 'startup'
                },
                {
                    src: path.resolve(__dirname, './src/icons/ms-icon-310x310.png'),
                    sizes: [70, 144, 150, 310],
                    type: "image/png",
                    destination: path.join('icons', 'ms')
                },
            ]
        }),
        new OfflinePlugin()
    ];
    if (env !== 'production') {
        plugins.push(new webpack.HotModuleReplacementPlugin());
    }

    return {
        entry: './src/index.tsx',
        mode: env || 'development',
        module: {
            rules: [{
                test: /\.tsx?/,
                use: 'awesome-typescript-loader'
            },
                {
                    test: /\.scss$/,
                    use: [
                        "style-loader", // creates style nodes from JS strings
                        "css-loader", // translates CSS into CommonJS
                        "sass-loader" // compiles Sass to CSS
                    ]
                },
                {
                    test: /\.jpe?g$|\.gif$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$/,
                    loader: 'file-loader?name=[name].[ext]'
                }
            ]
        },
        plugins,
        resolve: {
            extensions: ['.js', '.ts', '.tsx']
        },
        devServer: {
            compress: true,
            contentBase: './dist',
            hot: true
        },
        devtool: env && 'cheap-source-map',
    }
};
