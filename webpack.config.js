var webpack           = require('webpack');
var path              = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var BUILD_DIR = path.resolve(__dirname, '');
var APP_DIR   = path.resolve(__dirname, 'js');
var STYLE_DIR = path.resolve(__dirname, 'css');


var definePlugin = new webpack.DefinePlugin({
  __DEV__                : true,
  'process.env.DEV_HOST' : JSON.stringify(process.env.DEV_HOST || 'localhost')
});

function getEntrySources(sources) {
    if (process.env.NODE_ENV === 'dev') {
        sources.push("webpack-dev-server/client?http://" + (process.env.DEV_HOST || 'localhost') + ":8080");
        sources.push('webpack/hot/only-dev-server');
    }
    return sources;
}


var config = {
  entry : getEntrySources([
    APP_DIR   + '/app.js',
    STYLE_DIR + '/bundle.less'
  ]),
  output : {
    path     : BUILD_DIR,
    filename : 'bundle.js'
  },
  module : {
    loaders : [
      {
        test    : /\.js?/,
        include : APP_DIR,
        loaders : ['react-hot', 'babel']
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
  ],
  devServer : {
    host : (process.env.DEV_HOST || 'localhost'),
    port : 8080,
    hot  : true
  },
  devtool : 'eval'
};


module.exports = config;
