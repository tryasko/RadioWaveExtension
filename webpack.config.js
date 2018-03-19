const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  watch: true,

  devtool: "source-map",

  resolve: {
    extensions: [".js", ".jsx", ".css"]
  },

  entry: {
    popup: "./source/popup",
    options: "./source/options",
    background: "./source/background"
  },

  output: {
    path: path.resolve(__dirname, "application"),
    filename: "[name]/index.js"
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        options: {
          plugins: [["transform-react-jsx", { pragma: "h" }]]
        }
      },

      {
        test: /\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }]
      }
    ]
  },

  plugins: [
    //new webpack.ProvidePlugin({
    //  h: "preact",
    //  render: "preact"
    //}),

    new CopyWebpackPlugin([
      { from: "source/manifest.json", to: "[name].[ext]" },

      { from: "source/background.html", to: "[name].[ext]" },
      { from: "source/options.html", to: "[name].[ext]" },
      { from: "source/popup.html", to: "[name].[ext]" },

      { from: "source/icons/", to: "icons/[name].[ext]" },
      { from: "source/popup/img/", to: "popup/img/[name].[ext]" }
    ])
  ]
};
