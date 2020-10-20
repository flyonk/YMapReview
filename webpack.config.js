var HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
const path = require('path');

module.exports = {
    //название entry файлов потом подключаю в chunks ниже!
entry: {main: './src/js/main.js'},
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].build.js'
    },
    module: {
        rules: [
            {
            test: /\.(sa|sc|c)ss$/,
            use: [{
                    loader: MiniCssExtractPlugin.loader
                },
                'css-loader', 'sass-loader',
            ],
        }, 
        {
            test: /\.(png|jpe?g|gif|mp4|svg)$/i,
            use: [{
                loader: 'file-loader'
            }, ],
        },
        {
            test: /\.html$/i,
            loader: 'html-loader'
        }
    ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "[name].css"
        }),
        //один new это одна .html cтраница
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "./src/index.html",
            chunks: ["main"],
            minify: false
        }),

]
};