const CleanWebpackPlugin = require('clean-webpack-plugin');
const functions = require('./functions');
const rootPath = functions.getRootPath();

module.exports = function(argv) {
  const prod = functions.checkProd(argv);
  const outputDirectory = rootPath + (prod ? '/public' : '/dist');
  const devTool = prod ? false : 'source-map';
  let plugins = [];
  if (!functions.checkWatch(argv)) {
    plugins.push(
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [outputDirectory],
        dangerouslyAllowCleanPatternsOutsideProject: true
      })
    );
  }

  return {
    mode: argv.mode,
    devtool: devTool,
    entry: {
      PreloaderDom: rootPath + '/src/PreloaderDom.ts',
      PreloaderDomWindow: rootPath + '/src/PreloaderDomWindow.ts'
    },
    output: {
      filename: '[name].js',
      path: outputDirectory
    },
    plugins: plugins,
    resolve: {
      extensions: ['.ts', '.js', '.json']
    }
  };
};
