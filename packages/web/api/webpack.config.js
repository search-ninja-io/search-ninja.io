// eslint-disable-next-line @typescript-eslint/no-var-requires
const { webDefault, pluginsDefault } = require('../../../webpack.base.config');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
    return {
        ...webDefault(env, argv, __dirname),
        plugins: [...pluginsDefault(env, argv, __dirname), new CopyPlugin([{ from: './src/docs/', to: './docs/' }])],
    };
};
