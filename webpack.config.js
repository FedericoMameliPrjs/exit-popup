var path = require('path');
var webpack = require('webpack');
var miniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
    entry: {
        exitPopup: ['./src/js/index.js', './src/css/test.style.css']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: process.env.NODE_ENV === 'production' ? '[name].min.js' : '[name].dev.js'
    },
    devServer: {
        contentBase: './'
    },
    module:{
        rules: [
            {
                test: /\.css$/,
                use:[
                    //process.env.NODE_ENV === 'production' ? miniCssExtractPlugin.loader : 'style-loader',
                    miniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use:{loader: "babel-loader"}
            }
        ]
    },
    plugins: [
        /*new webpack.ProvidePlugin({
            $: 'jquery/dist/jquery.slim.min',
            jQuery: 'jquery/dist/jquery.slim.min'
        }),
        new htmlWebpackPlugin({
            filename: 'index.html',
            template: './index.html'
        }),*/
        new miniCssExtractPlugin({
            filename: process.env.NODE_ENV === 'production' ? '[name].min.css' : '[name].dev.css'
        })
    ]
};