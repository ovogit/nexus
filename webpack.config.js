// enable when you need to copy bulk files
//const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const buildPath = path.join(__dirname, './dist');
const sourcePath = path.join(__dirname, './src');
const jsSourcePath = path.join(__dirname, './src/js');
const imgPath = path.join(__dirname, './src/img');

module.exports = {
    mode: 'development',
    entry: './src/js/app.js',
    module: {
        rules: [
            {
                test: /\.(css|scss|sass)$/,
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract({ 
                    fallback: 'style-loader',
                    use: ['css-loader?name=css/[name].[ext]', 'sass-loader?name=css/[name].[ext]'],
                }),
            },

            {
                test: /\.(jpg|jpeg|gif|png)$/,
                exclude: /node_modules/,
                use:'url-loader?limit=1024&name=images/[name].[ext]'
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                exclude: /node_modules/,
                use: 'url-loader?limit=1024&name=fonts/[name].[ext]'
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }

        ]
    },
    plugins: [
        //new CopyWebpackPlugin([{from : path.join(sourcePath , './php/'), to : buildPath }]),
        new ExtractTextPlugin({
            filename: (getPath) => {
                return getPath('css/[name].css').replace('css/js', 'css');
            },
            allChunks: true
        })
    ],

    output: {
        path: __dirname + '/dist',
        filename: 'js/[name].js'
    },
    resolve: {
        extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx'],
        modules: [
            path.resolve(__dirname, 'node_modules'),
            jsSourcePath,
        ],
    }

};
