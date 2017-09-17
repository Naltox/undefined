'use strict'

const CleanWebpackPlugin = require('clean-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

const NODE_ENV = process.env.NODE_ENV
const BUILD_DIR = 'build'
const APP_DIR = 'src'

module.exports = {
    entry: {
        app: "./src/compiler/main.js"
    },

    output: {
        path: path.join(__dirname, BUILD_DIR),
        filename:  (NODE_ENV === 'production' ? "[name].[hash].js" : "[name].js?[hash]")
    },

    module : {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader', // 'babel-loader' is also a legal name to reference
                query: {
                    presets: ['es2015', 'stage-0'],
                    plugins: [
                        'transform-runtime',
                        'add-module-exports',
                        'transform-decorators-legacy',
                        'syntax-async-functions'
                    ]
                }
            }
        ]
    },

    plugins: [
        new CleanWebpackPlugin(['public'], {
            root: __dirname,
            verbose: true,
            dry: false
        })
    ]
}