const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
  watch: true,

  resolve: {
    extensions: [".js", ".coffee"]
  },

  entry: {
    background: "./source/background/",
    options:    "./source/options",
    popup:      "./source/popup"
  },

  output: {
    path: path.resolve(__dirname, "dev"),
    filename: "[name]/index.js"
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
        use: ExtractTextPlugin.extract({
          use: ["css-loader", "sass-loader"]
        })
      },
    ]
  },

  plugins: [
    new webpack.ProvidePlugin({
      React: "react",
      ReactDOM: "react-dom"
    }),

    new ExtractTextPlugin({
      filename: getPath => getPath("[name]/index.css")
    }),

    new CopyWebpackPlugin([
      {
        context: path.resolve(__dirname),
        from: "source/manifest.json",
        to: "manifest.json"
      },
      {
        context: path.resolve(__dirname),
        from: "source/icons",
        to: "icons"
      },
      {
        context: path.resolve(__dirname),
        from: "source/background/index.html",
        to: "background/index.html"
      },
      {
        context: path.resolve(__dirname),
        from: "source/options/index.html",
        to: "options/index.html"
      },
      {
        context: path.resolve(__dirname),
        from: "source/popup/index.html",
        to: "popup/index.html"
      }
    ])
  ]
};
