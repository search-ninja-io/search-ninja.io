const slsw = require('serverless-webpack');
module.exports = {
    target: 'node',
    entry: slsw.lib.entries,
    mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
    node: false,
    optimization: {
        minimize: false,
    },
    devtool: 'inline-cheap-module-source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env', { targets: { node: '12' }, useBuiltIns: 'usage', corejs: 3 }],
                            ],
                        },
                    },
                ],
            },
        ],
    },
};
