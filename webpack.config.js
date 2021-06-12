const path = require("path");
// const htmlWebpackPlugin = require("html-webpack-plugin");
// const miniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const CopyPlugin = require("copy-webpack-plugin");
module.exports = {
    mode: "development",
    entry: path.resolve(__dirname, 'main.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "script.js",
        chunkFilename: "[name].chunk.js"
    },
    optimization: {
        minimize: false,

        // minimizer: [new UglifyJsPlugin({
        //     exclude: /\/node_modules/,
        //     chunkFilter: (chunk) => {
        //         // Exclude uglification for the `vendor` chunk
        //         if (chunk.name === 'vendor') {
        //             return false;
        //         }

        //         return true;
        //     },
        //     sourceMap: true,
        //     parallel: 4,
        //     uglifyOptions: {
        //         beautify: true,
        //         compress: false,
        //         keep_classnames: true,
        //         keep_fnames: true
        //     }
        // }),],
    },
    // devServer: {
    //     contentBase: path.join(__dirname, 'dist'),
    //     port: 3000,
    //     open: true,
    // },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,//排除掉node_module目录
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'] //转码规则
                    }
                }
            },
            {
                test: /(\.scss|\.css)$/i,
                use: ['css-loader', 'sass-loader'],
            },

        ]
    }
};