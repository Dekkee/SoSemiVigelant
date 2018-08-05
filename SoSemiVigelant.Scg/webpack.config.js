const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const OfflinePlugin = require('offline-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const PreloadWebpackPlugin = require('preload-webpack-plugin');

const webpack = require('webpack');
const path = require('path');

module.exports = (env) => {
    const plugins = [
        new CleanWebpackPlugin(['dist']),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(env)
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            favicon: './src/icons/favicon.ico',
            template: path.join('./src/template/index.html'),
            title: 'Tuktuk SCG scrapper',
            meta: {
                viewport: 'width=device-width, initial-scale=1',
                author: require('./package').author,
                charset: 'utf-8',
                description: 'starcitygames.com shop price srapper'
            },
            versions: {
                react: require('./package').dependencies.react,
                'react-dom': require('./package').dependencies['react-dom']
            }
        }),
        new WebpackPwaManifest({
            name: "Tuktuk SCG scrapper",
            short_name: "Tuktuk",
            lang: "en-GB",
            start_url: "/",
            display: "standalone",
            theme_color: "#ccffcc",
            background_color: "#FFFFFF",
            ios: true,
            icons: [
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
        new OfflinePlugin({
            ServiceWorker: {
                events: true
            }
        }),
        new MiniCssExtractPlugin(),
        new PreloadWebpackPlugin({
            rel: 'preload',
            include: 'allChunks' // or 'initial'
        })
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
                        env ? MiniCssExtractPlugin.loader : 'style-loader', // creates style nodes from JS strings
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
        externals: env && {
            "react": "React",
            "react-dom": "ReactDOM"
        },
        optimization: env && {
            minimizer: [
                new UglifyJsPlugin({
                    cache: true,
                    parallel: true,
                    sourceMap: true // set to true if you want JS source maps
                }),
                new OptimizeCSSAssetsPlugin({})
            ]
        },
    }
};
