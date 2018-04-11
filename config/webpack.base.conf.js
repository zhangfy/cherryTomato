const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const { rootDir, resolve, htmlPage } = require('./tools')

const isProduction = process.env.NODE_ENV == 'production'

const config = {
    mode: isProduction ? 'production' : 'development',
    entry: {
        background: resolve('js/background.js'),
        popup: path.join(rootDir, 'src', 'js/popup'),
        options: resolve('js/options.js'),
    },
    output: {
        path: path.join(rootDir, 'dist'),
        filename: isProduction ? 'js/[name].[hash].js' : 'js/[name].js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
        ]
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src')
        }
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        },
        runtimeChunk: true
    },
    plugins: [
        new CleanWebpackPlugin(['*'], {root: path.join(rootDir, 'dist')}),

        htmlPage('background', ['background', 'runtime~background']),
        htmlPage('popup', ['popup', 'runtime~popup', 'vendors~popup']),
        htmlPage('options', ['options', 'runtime~options']),

        new webpack.HashedModuleIdsPlugin(),

        new CopyWebpackPlugin([
            {from: resolve('sounds'), to: path.join(rootDir, 'dist/sounds')},
            {from: resolve('images'), to: path.join(rootDir, 'dist/images')},
            {from: resolve('manifest.json')},
        ]),
    ]
}

module.exports = config
