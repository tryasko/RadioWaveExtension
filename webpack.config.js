const path = require("path");

module.exports = {
  watch: true,

  //devtool: "source-map",

  resolve: {
    extensions: [".js"]
  },

  entry: {
    popup: "./scripts/popup",
    options: "./scripts/options",
    background: "./scripts/background"
  },

  output: {
    path: path.resolve(__dirname, "application"),
    filename: "[name]/index.js"
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        options: {
          plugins: [["transform-react-jsx", { pragma: "h" }]]
        }
      }
    ]
  }
};
