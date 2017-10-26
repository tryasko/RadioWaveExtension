const path = require('path');


module.exports = {
  entry: {
    background: './source/background',
    options:    './source/options',
    popup:      './source/popup'
  },

  output: {
    path: path.resolve(__dirname, 'dev'),
    filename: '[name]/index.js'
  },

  watch: true,

  module: {
    rules: [
      {
        test: /\.coffee$/,
        enforce: "pre",
        exclude: /node_modules/,
        loader: "coffee-loader"
      },

      {
        test: /\.coffee$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["react"]
        }
      },
    ]
  },

  resolve: {
    extensions: ['.js', '.coffee']
  }
};
