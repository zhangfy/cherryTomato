const merge = require('webpack-merge')

const baseConfig = require('./webpack.base.conf')

const config = merge(baseConfig, {
    // Refer to: https://webpack.js.org/configuration/devtool/#devtool
    devtool: ''
})

module.exports = config
