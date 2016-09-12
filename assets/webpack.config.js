var fs = require('fs');
var path = require('path');
var webpack = require('webpack');

var output = path.join(__dirname, '..');
var nodeModulePath = path.join(__dirname, 'node_modules');
var publicPath = '/static/js/dist/';

var plugins = [
    new webpack.DefinePlugin({
        __DEV__: process.env.NODE_ENV !== 'production',
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
];

module.exports = {
    devtool: "source-map",
    entry: {
		    index: "./src/index"
	  },
    output: {
        path: path.join(output, publicPath),
        filename: '[name].bundle.js',
        publicPath: publicPath
    },
    resolve: {
        extensions: ['', '.js', '.es6']
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
                test: /(\.es6|\.js)$/,
                exclude: /node_modules/,
                loader: 'babel'
            }
        ]
    },
    plugins: plugins
};
