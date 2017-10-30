const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");


module.exports = {
    entry: {
        app: './src/index.js',
        // signalling: './src/signalling.js',
        // peer: './src/peer.js',
        // ui: './src/ui.js'
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new ExtractTextPlugin("style.css"),
        new HtmlWebpackPlugin({
            title: 'Output Management',
            template: './src/index.html',
            hash: true
        })
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            }
        ]
    }
};
