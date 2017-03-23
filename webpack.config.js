var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: path.join(__dirname, 'lib', 'tinyselector.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'tinyselector.js',
    library: '$',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    setImmediate: false
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({sourceMap:true})
  ]
};
