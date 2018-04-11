const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const rootDir = path.resolve(__dirname, '..')
const resolve = (dir) => path.join(rootDir, 'src', dir)

exports.rootDir = rootDir
exports.resolve = resolve
exports.htmlPage = (filename, chunks, template) => new HtmlWebpackPlugin({
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