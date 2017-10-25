const path = require('path');


module.exports = {
  entry: {
    // background: '',
    options:    './source/options/index.jsx'
    // popup:      ''
  },

  output: {
    path: path.resolve(__dirname, 'dev'),
    filename: '[name]/index.js'
  },

  watch: true,

  module: {
    rules: [
      {test: /\.js$/, use: 'babel-loader'},
      {test: /\.jsx$/, use: 'babel-loader'}
    ]
  }
};
