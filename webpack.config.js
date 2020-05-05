
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = [{
  mode: 'development',
  devtool: 'source-map',
  context: path.join(__dirname),
  entry: './src/js/index.js',
  output: {
    path: __dirname + '/dist/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: '../dist/index.html'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Sample',
      filename: __dirname + '/dist/index.html',
      template: __dirname + "/src/pug/index.pug"
    }),
    new MiniCssExtractPlugin({
      filename: './main.css'
    })
  ],
  resolve: {
    extensions: ['.js', '.css', '.scss']
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.scss$/,
          use: [ 
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.pug$/,
        use: [
          'pug-loader'

        ]
      },
      {
        test: /\.(ttf|eot|svg|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: "file-loader"
      },
      {
        test: require.resolve('snapsvg'),
        use: [
          {
            loader: 'imports-loader',
            options: {
              this: '>window',
              fix: '>module.exports=0'
            }
          }
        ]
      }
    ]
  }
}];