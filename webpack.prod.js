const path = require('path')
const glob = require('glob')

const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin")

const cssloaders = ExtractTextPlugin.extract({
  use: [
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: true
      }
    }
  ]
})

function toObject (paths) {
  let ret = {}

  for (let path of paths) {
    let file = path.split('/').slice(-1)[0]
    let name = file.split('.')[0]

    ret[name] = path;
  }
  return ret
}

module.exports = env => {
  return {
    entry: toObject(glob.sync('./source/js/*.js')), // https://github.com/webpack/webpack/issues/1189
    output: {
      publicPath: '/',
      path: path.join(__dirname),
      filename: 'public/js/[name]_[hash].js'
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.css$/,
          use: cssloaders
        },
        {
          test: /\.(ttf|eot|woff)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash].[ext]',
              publicPath: '../fonts/',
              outputPath: '/public/fonts/'
            }
          }
        },
        {
          test: /\.(png|svg)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash].[ext]',
              publicPath: '../img/',
              outputPath: '/public/img/'
            }
          }
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(['public']),
      new UglifyJSPlugin({
        sourceMap: true
      }),
      new ExtractTextPlugin({
        filename: 'public/css/[name]_[hash].css'
      })
    ]
  }
}
