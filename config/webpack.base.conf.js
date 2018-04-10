const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ZipPlugin = require('zip-webpack-plugin')

const isProduction = process.env.NODE_ENV == 'production'
const rootDir = path.resolve(__dirname, '..')

let resolve = (dir) => path.join(rootDir, 'src', dir)

let htmlPage = (filename, chunks, template) => new HtmlWebpackPlugin({
    // hash: true,
    cache: true,
    inject: true,
    filename: './pages/' + filename + '.html',
    template: template || resolve('./pages/' + filename + '.html'),
    chunks: chunks,
    minify: {
        removeAttributeQuotes: true,
        removeScriptTypeAttributes: true,
    }
})

const config = {
    mode: isProduction ? 'production' : 'development',
    entry: {
        background: resolve('js/background.js'),
        popup: resolve('js/popup.js'),
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
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
        ]
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
        htmlPage('popup', ['popup', 'runtime~popup']),
        htmlPage('options', ['options', 'runtime~options']),

        new webpack.HashedModuleIdsPlugin(),

        new CopyWebpackPlugin([
            {from: resolve('sounds'), to: path.join(rootDir, 'dist/sounds')},
            {from: resolve('images'), to: path.join(rootDir, 'dist/images')},
            {from: resolve('manifest.json')},
        ]),

        new ZipPlugin({
            path: '..',
            filename: 'extension.zip'
        }),
    ]
}

module.exports = config
