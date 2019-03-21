const HtmlWebpackPlugin = require('html-webpack-plugin');
const functions = require('./functions');
const rootPath = functions.getRootPath();

const defaultConfig = {
  devServer: {
    port: 9002,
    open: true
  },
  watchOptions: {
    aggregateTimeout: 3000,
    poll: 1000
  },
  entry: ['@babel/polyfill', rootPath + '/template/script.ts'],
  output: {
    filename: 'watch.js',
    path: rootPath + '/watch'
  },
  plugins: []
};

const getDefaultConfig = () => {
  defaultConfig.plugins.push(
    new HtmlWebpackPlugin({
      template: rootPath + '/template/index.html'
    })
  );
  return defaultConfig;
};

module.exports = argv => {
  if (functions.checkWatch(argv)) {
    return getDefaultConfig();
  }
  return {};
};
