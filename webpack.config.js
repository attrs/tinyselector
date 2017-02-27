var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: path.join(__dirname, 'lib', 'tinyselector.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'tinyselector.js',
    library: 'S',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({sourceMap:true})
  ]
};
