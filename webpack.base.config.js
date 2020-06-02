/* eslint-disable no-unused-vars */
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const Dotenv = require('dotenv-webpack');

var path = require('path');

const MODE_LOCAL = 'local';
const MODE_DEV = 'development';
const MODE_PROD = 'production';

const isEnvLocal = (env, argv) => {
    return env.IS_LOCAL === 'true';
};

const isEnvDevelopment = (env, argv) => {
    return argv.mode === MODE_DEV;
};

const isEnvProduction = (env, argv) => {
    return argv.mode === MODE_PROD;
};

const mode = (env, argv) => {
    if (isEnvLocal(env, argv)) return MODE_LOCAL;
    else if (isEnvDevelopment(env, argv)) return MODE_DEV;
    else if (isEnvProduction(env, argv)) return MODE_PROD;
    else throw new Error('Unknown or unspecified mode');
};

const devPluginsDefault = (env, argv, cwd) => {
    return [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
        new CopyPlugin([
            { from: './public', ignore: ['index.html'] },
            { from: env.CONFIG_FILE, to: 'config.json' },
        ]),
        new AssetsPlugin({
            prettyPrint: true,
            filename: 'assets.json',
            path: path.resolve(cwd, 'dist/'),
        }),
    ];
};

const prodPluginsDefault = (env, argv, cwd) => {
    return [
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
};

const pluginsDefault = (env, argv, cwd) => {
    return isEnvProduction(env, argv)
        ? [...devPluginsDefault(env, argv, cwd), ...prodPluginsDefault(env, argv, cwd)]
        : devPluginsDefault(env, argv, cwd);
};

const entryDefault = (env, argv) => {
    return './src/index';
};

const outputDefault = (env, argv, cwd) => {
    return {
        path: path.join(cwd, '/dist'),
        filename: isEnvProduction(env, argv) ? '[name].[contenthash].js' : '[name].[hash].js',
        publicPath: '/',
    };
};

const resolveDefault = (env, argv) => {
    return {
        extensions: ['.ts', '.tsx', '.js', '.json'],
        alias: { 'react-dom': '@hot-loader/react-dom' },
    };
};

const devtoolDefault = (env, argv) => {
    return isEnvProduction(env, argv) ? '' : 'source-map';
};

const devServerDefault = (env, argv, cwd) => {
    return {
        contentBase: path.join(cwd, 'dist'),
        compress: true,
        port: 3000,
        hot: true,
        open: true,
    };
};

const moduleDefault = (env, argv) => {
    return {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    configFile: '../../../.babelrc.json',
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    };
};

const optimizationDefault = (env, argv) => {
    return {
        runtimeChunk: 'multiple',
        splitChunks: {
            chunks: 'all',
        },
    };
};

const webDefault = (env, argv, cwd) => {
    return {
        entry: entryDefault(env, argv),
        output: outputDefault(env, argv, cwd),
        resolve: resolveDefault(env, argv),
        devtool: devtoolDefault(env, argv),
        devServer: devServerDefault(env, argv, cwd),
        module: moduleDefault(env, argv),
        optimization: optimizationDefault(env, argv),
        plugins: pluginsDefault(env, argv, cwd),
    };
};

module.exports = {
    webDefault,

    isEnvLocal,
    isEnvDevelopment,
    isEnvProduction,
    mode,
    devPluginsDefault,
    prodPluginsDefault,
    pluginsDefault,
    entryDefault,
    outputDefault,
    resolveDefault,
    devtoolDefault,
    devServerDefault,
    moduleDefault,
    optimizationDefault,
};
