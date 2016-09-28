var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var precss = require('precss');
var autoprefixer = require('autoprefixer');

var output = path.join(__dirname, '..');
var nodeModulePath = path.join(__dirname, 'node_modules');
var publicPath = '/static/js/dist/';

var plugins = [
    new webpack.DefinePlugin({
        __DEV__: process.env.NODE_ENV !== 'production',
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new webpack.ProvidePlugin({
        'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    })
];

module.exports = {
    devtool: "cheap-module-source-map",
    entry: {
	index: ['./src/index'],
    },
    output: {
        path: path.join(output, publicPath),
        filename: '[name].bundle.js',
        publicPath: publicPath
    },
    resolve: {
        extensions: ['', '.js', '.es6', '.jsx', '.css']
    },
    module: {
        preLoaders: [
            {
                test: /\.es6?$/,
                exclude: /node_modules/,
                loader: 'eslint'
            }
        ],
        loaders: [
            {
                test: /(\.es6|\.js|\.jsx)$/,
                exclude: /node_modules/,
                loader: 'babel'
            },
            {
                test: /vendor\.css$/,
                loader: 'style!css!postcss'
            },
            {
                test: /\.css$/,
                exclude: /vendor\.css$/,
                loader: 'style!css?modules!postcss'
            },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&minetype=application/font-woff&name=[name].[ext]' },
            { test: /\.(ttf|eot|svg|png)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader?name=/[name].[ext]' }
        ]
    },
    postcss: function () {
        return [precss, autoprefixer];
    },
    plugins: plugins
};
