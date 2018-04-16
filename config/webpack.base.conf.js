const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const { rootDir, resolve, htmlPage } = require('./tools')

const isProduction = process.env.NODE_ENV == 'production'

const config = {
    mode: isProduction ? 'production' : 'development',
    entry: {
        background: resolve('js/background.js'),
        popup: path.join(rootDir, 'src', 'js/popup'),
    },
    output: {
        path: path.join(rootDir, 'dist'),
        filename: isProduction ? 'js/[name].[hash:7].js' : 'js/[name].js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: [{
                    loader: 'vue-loader',
                    options: {
                        loaders: {
                            'scss': 'vue-style-loader!css-loader!sass-loader',
                            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
                        }
                    }
                }]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: [{
                        loader: 'css-loader'
                    }, {
                        loader: 'sass-loader'
                    }],
                    // use in dev mode
                    fallback: 'style-loader'
                })
            },
            // {
            //     test: /\.(scss|sass)$/,
            //     use: [
            //         {loader: 'style-loader'},  // create style nodes from JS strings
            //         {loader: 'css-loader'}, // translate CSS into CommonJS
            //         {loader: 'sass-loader'},
            //     ],
            // },
            {
                test: /\.(woff2?|ttf|otf|svg|eot)(\?.*)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'fonts/[name].[hash:7].[ext]',
                    },
                }],
            }
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
            chunks: 'all',
        },
        runtimeChunk: true
    },
    plugins: [
        new CleanWebpackPlugin(['*'], {root: path.join(rootDir, 'dist')}),
        new webpack.HashedModuleIdsPlugin(),

        htmlPage('background', ['background', 'runtime~background']),
        htmlPage('popup', ['popup', 'runtime~popup', 'vendors~popup']),

        new ExtractTextPlugin({filename: 'css/[name].[hash:7].css'}),

        new CopyWebpackPlugin([
            {from: resolve('sounds'), to: path.join(rootDir, 'dist/sounds')},
            {from: resolve('images'), to: path.join(rootDir, 'dist/images')},
            {from: resolve('manifest.json')},
        ]),
    ]
}

module.exports = config
