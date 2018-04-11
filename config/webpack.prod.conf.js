const merge = require('webpack-merge')
const ZipPlugin = require('zip-webpack-plugin')

const manifest = require('../src/manifest.json')
const baseConfig = require('./webpack.base.conf')

const config = merge(baseConfig, {
    plugins: [
        new ZipPlugin({
            path: '..',
            filename: manifest.name.replace(/\s+/g, '-').toLowerCase() + '-v' + manifest.version + '.zip',
        }),
    ]
})

module.exports = config
