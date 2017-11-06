const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');


module.exports = {
  watch: true,

  resolve: {
    extensions: ['.js', '.coffee']
  },

  entry: {
    // background: './source/background/',
    options:    './source/options',
    // popup:      './source/popup'
  },

  output: {
    path: path.resolve(__dirname, 'dev'),
    filename: '[name]/index.js'
  },

  module: {
    rules: [
      {
        test: /\.coffee$/,
        exclude: /node_modules/,
        use: [
          {loader: "babel-loader", options: {presets: ["react"]}},
          {loader: "coffee-loader"}
        ]
      },

      {
        test: /\.scss$/,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader"
        ]
      },
    ]
  },

  plugins: [
    new webpack.ProvidePlugin({
      React: 'react',
      ReactDOM: 'react-dom'
    })
  ]
};
