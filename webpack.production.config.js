var webpack           = require('webpack');
var path              = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var BUILD_DIR = path.resolve(__dirname, '');
var APP_DIR   = path.resolve(__dirname, 'js');
var STYLE_DIR = path.resolve(__dirname, 'css');


var definePlugin = new webpack.DefinePlugin({
  __DEV__ : false
});


var config = {
  entry : [
    APP_DIR   + '/app.js',
    STYLE_DIR + '/bundle.less'
  ],
  output : {
    path     : BUILD_DIR,
    filename : 'bundle.js'
  },
  module : {
    loaders : [
      {
        test    : /\.js?/,
        include : APP_DIR,
        loaders : ['babel']
      },
      {
        test    : /\.less$/,
        include : STYLE_DIR,
        loader  : ExtractTextPlugin.extract('css!less') 
      },
      {
        test    : /\.css$/,
        include : STYLE_DIR,
        loaders : ['style!css']
      }
    ]
  },
  plugins : [
    new ExtractTextPlugin('bundle.css'),
    definePlugin
  ]
};


module.exports = config;
