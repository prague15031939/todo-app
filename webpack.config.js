const webpack = require('webpack');
const path = require('path')

module.exports = {
    entry: "./client/main.js",
    output: {
        path: path.resolve(__dirname,'./public/build'),
        publicPath: '/public/build/',
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: "babel-loader",
                exclude: [/node_modules/]
            },
            {
                test: /\.css$/,
                use:[
                    {loader:'style-loader'},
                    {loader:'css-loader'}
                ],
                exclude: [/node_modules/, /public/]
            },
            {
                test: /\.less$/,
                use: [
                    {loader:'style-loader'},
                    {loader:'css-loader'},
                    {loader:'less-loader'}
                ],
                exclude: [/node_modules/, /public/]
            },
            {
                test: /\.gif$/,
                use: "url-loader?limit=10000&mimetype=image/gif"
            },
            {
                test: /\.png$/,
                use: "url-loader?limit=10000&mimetype=image/png"
            },
            {
                test: /\.jpg$/,
                use: "url-loader?limit=10000&mimetype=image/jpg"
            },
            {
                test: /\.svg$/,
                use: "url-loader?limit=26000&mimetype=image/svg+xml"
            },
            {
                test: /\.jsx$/,
                use: "babel-loader",
                exclude: [/node_modules/]
            }
        ]
    }
}