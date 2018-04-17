const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

// Create multiple instances
const extractCSS = new ExtractTextPlugin('css/[name].[sha1:contenthash:7]-1.css')
const extractSASS = new ExtractTextPlugin('css/[name].[sha1:contenthash:7]-2.css')

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
                use: extractCSS.extract({
                    use: [{ loader: 'css-loader', options: {minimize: isProduction} }],
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.(scss|sass)$/,
                use: extractSASS.extract({
                    use: [{
                        // translate CSS into CommonJS
                        loader: 'css-loader', options: {minimize: isProduction}
                    }, {
                        loader: 'sass-loader' // Compiles Sass to CSS
                    }],
                    fallback: 'style-loader'
                })
            },
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
        // minimize JS
        splitChunks: {
            chunks: 'all',
        },
        runtimeChunk: true
    },
    plugins: [
        new CleanWebpackPlugin(['*.zip', 'dist'], {root: rootDir}),
        new webpack.HashedModuleIdsPlugin(),

        htmlPage('background', ['background', 'runtime~background']),
        htmlPage('popup', ['popup', 'runtime~popup', 'vendors~popup']),

        extractCSS, extractSASS,

        new CopyWebpackPlugin([
            {from: resolve('sounds'), to: path.join(rootDir, 'dist/sounds')},
            {from: resolve('images'), to: path.join(rootDir, 'dist/images')},
            {from: resolve('manifest.json')},
        ]),
    ]
}

module.exports = config
