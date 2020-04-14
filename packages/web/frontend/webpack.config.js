/* eslint-disable @typescript-eslint/no-var-requires */
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const path = require('path');

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
module.exports = (env, argv) => {
    const isEnvProduction = argv.mode === 'production';

    const devPlugins = [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
        new CopyPlugin([{ from: './public', ignore: ['index.html'] }]),
        new AssetsPlugin({
            prettyPrint: true,
            filename: 'assets.json',
            path: path.resolve(__dirname, 'dist'),
        }),
    ];

    const prodPlugins = [
        new BrotliPlugin({
            asset: '[path].br[query]',
            test: /\.(js|css|html|svg)$/,
            threshold: 10240,
            minRatio: 0.8,
        }),
        new UglifyJsPlugin({
            cache: true,
            parallel: true,
            sourceMap: true,
        }),
    ];

    const pluginList = isEnvProduction ? [...devPlugins, ...prodPlugins] : devPlugins;

    return {
        entry: ['./src/index'],

        output: {
            path: path.join(__dirname, '/dist'),
            filename: isEnvProduction ? '[name].[contenthash].js' : '[name].[hash].js',
            publicPath: '',
        },

        resolve: {
            extensions: ['.ts', '.tsx', '.js'],
            alias: { 'react-dom': '@hot-loader/react-dom' },
        },

        devtool: isEnvProduction ? '' : 'inline-source-map',

        devServer: {
            contentBase: path.join(__dirname, 'dist'),
            compress: true,
            port: 3000,
            hot: true,
            open: true,
        },

        module: {
            rules: [
                {
                    test: /\/utils\/ConfigLoader.js$/,
                    use: [{ loader: 'val-loader' }],
                },
                {
                    test: /\.(ts|js)x?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-typescript', '@babel/preset-react'],
                            plugins: [
                                'react-hot-loader/babel',
                                '@babel/plugin-transform-runtime',
                                '@babel/proposal-class-properties',
                                '@babel/proposal-object-rest-spread',
                            ],
                        },
                    },
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader'],
                },
            ],
        },

        optimization: {
            runtimeChunk: 'multiple',
            splitChunks: {
                chunks: 'all',
            },
        },

        plugins: pluginList,
    };
};
