const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = {
    entry: {
        app: './src/index.js'
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist'
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new ExtractTextPlugin("style.css"),
        new HtmlWebpackPlugin({
            title: 'Web RTC smth',
            template: './src/index.html',
            hash: true
        })
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                ],
            },
            {
                test: [/\.wexbim$/, /\.docx$/, /\.csv$/, /\.mp4$/, /\.xlsx$/, /\.doc$/, /\.avi$/, /\.webm$/, /\.mov$/, /\.mp3$/, /\.pdf$/],
                use: [
                    'file-loader',
                ],
            },
            {
                test: /\.(png|jpg)$/,
                use: [
                    'url-loader?limit=200000',
                ],
            },
            {
                test: /\.(gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            query: {
                                name: 'assets/[name].[ext]',
                            },
                        },
                    },
                ],
            },
            {
                test: /\.jsx\.html$/,
                exclude: /node_modules/,
                use: [
                    'babel!react-pure-html-component',
                ],
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.jsx.html'],
        modules: [
            path.join(__dirname, 'node_modules'),
        ]
    }
};
