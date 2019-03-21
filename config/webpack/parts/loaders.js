module.exports = function(argv) {
  return {
    module: {
      rules: [
        {
          test: /\.ts?$/,
          exclude: /node_modules/,
          use: ['babel-loader']
        }
      ]
    }
  };
};
