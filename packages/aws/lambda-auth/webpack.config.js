/*
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const StartServerPlugin = require('start-server-webpack-plugin');
const path = require('path');

const isProduction = typeof process.env.NODE_ENV !== 'undefined' && process.env.NODE_ENV === 'production';
const mode = isProduction ? 'production' : 'development';
const devtool = isProduction ? false : 'source-map'; //'inline-source-map';

module.exports = function (options) {
    console.log(options);
    const result = {
        ...options,
        entry: ['webpack/hot/poll?100', options.entry],
        mode,
        devtool,
        externals: [
            nodeExternals({
                whitelist: ['webpack/hot/poll?100'],
            }),
        ],
        plugins: [
            ...options.plugins,
            new webpack.HotModuleReplacementPlugin(),
            new webpack.WatchIgnorePlugin([/\.js$/, /\.d\.ts$/]),
            new webpack.IgnorePlugin({
                checkResource(resource) {
                    const lazyImports = [
                        '@nestjs/microservices/microservices-module',
                        '@nestjs/websockets/socket-module',
                        'fastify-swagger',
                        'amqp-connection-manager',
                        'amqplib',
                        'fastify-swagger',
                        'grpc',
                        'kafkajs',
                        'mqtt',
                        'nats',
                        'redis',
                    ];
                    if (!lazyImports.includes(resource)) {
                        return false;
                    }
                    try {
                        require.resolve(resource);
                    } catch (err) {
                        return true;
                    }
                    return false;
                },
            }),
            new StartServerPlugin({ name: options.output.filename }),
        ],
        output: {
            ...options.output,
            path: path.resolve(__dirname, 'dist/lambda'),
        },
    };
    console.log(result);
    return result;
};
*/

const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const isProduction = typeof process.env.NODE_ENV !== 'undefined' && process.env.NODE_ENV === 'production';
const mode = isProduction ? 'production' : 'development';
const devtool = isProduction ? false : 'inline-source-map';
module.exports = {
    entry: ['webpack/hot/poll?100', './src/lambda/main.ts'],
    optimization: {
        minimize: false,
    },
    target: 'node',
    mode,
    devtool,
    externals: [
        nodeExternals({
            whitelist: ['webpack/hot/poll?100'],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true,
                },
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new webpack.IgnorePlugin({
            checkResource(resource) {
                const lazyImports = [
                    '@nestjs/microservices',
                    '@nestjs/microservices/microservices-module',
                    '@nestjs/websockets',
                    '@nestjs/websockets/socket-module',
                    'fastify-swagger',
                    'amqp-connection-manager',
                    'amqplib',
                    'fastify-swagger',
                    'grpc',
                    'kafkajs',
                    'mqtt',
                    'nats',
                    'redis',
                ];
                if (!lazyImports.includes(resource)) {
                    return false;
                }
                try {
                    require.resolve(resource);
                } catch (err) {
                    return true;
                }
                return false;
            },
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.WatchIgnorePlugin([/\.js$/, /\.d\.ts$/]),
        new ForkTsCheckerWebpackPlugin({
            tslint: true,
        }),
        new webpack.DefinePlugin({
            CONFIG: JSON.stringify(require('config')),
        }),
    ],
    output: {
        path: path.join(__dirname, 'dist/lambda'),
        filename: 'server.js',
    },
};
