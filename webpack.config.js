const path = require('path');

module.exports = {
  entry: './src/client/index.js',
  devtool: process.env.NODE_ENV === 'development' && 'inline-source-map',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'src/client/dist')
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['es2015', 'stage-2']
        }
      }
    }]
  }
};