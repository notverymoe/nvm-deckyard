const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, './src/script/index.tsx'),
    devtool: 'inline-source-map',
    output: {
        clean: true,
        filename: '[name].js',
        path: path.resolve(__dirname, './dist')
    },
    devServer: {
      static: './dist',
    },
    module: {
        rules: [
            { 
                test: /\.tsx?$/, 
                loader: "ts-loader" 
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "sass-loader",
                        options: {
                            sassOptions: {
                                sourceMap: true,
                                sourceMapEmbed: true,
                                indentWidth: 4,
                            },
                        }
                    }
                ],
            },
            {
                test: /\.(png|jpe?g|gif|webp|json|gz)$/i,
                loader: 'file-loader',
                type: 'javascript/auto',
                options: {
                    name: '[name].[ext]',
                    publicPath: "/",
                }
            },
            {
                test: /\.svg$/i,
                issuer: /\.[jt]sx?$/,
                loader: '@svgr/webpack',
                options: { 
                    typescript: true,
                    ref: true,
                },
            },
        ],
    },
    resolve: { 
        extensions: [".tsx", ".ts", ".jsx", ".js"],
        modules: [
            "node_modules",
            path.resolve(__dirname, "./src/script/"),
            path.resolve(__dirname, "./src/")
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Temporary Title',
            
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
    ]
};
