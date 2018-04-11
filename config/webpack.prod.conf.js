const merge = require('webpack-merge')
const ZipPlugin = require('zip-webpack-plugin')

const baseConfig = require('./webpack.base.conf')

const config = merge(baseConfig, {
    plugins: [
        new ZipPlugin({
            path: '..',
            filename: 'extension.zip'
        }),
    ]
})

module.exports = config
