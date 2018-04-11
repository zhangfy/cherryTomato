const merge = require('webpack-merge')
// const ZipPlugin = require('zip-webpack-plugin')
const ExtractWebpackPlugin = require('extract-text-webpack-plugin')

const baseConfig = require('./webpack.base.conf')

const config = merge(baseConfig, {
    plugins: [
        new ExtractWebpackPlugin({filename: 'css/[name].[hash].css'}),

        // new ZipPlugin({
        //     path: '..',
        //     filename: 'extension.zip'
        // }),
    ]
})

module.exports = config
