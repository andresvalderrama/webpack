const path = require('path')
const glob = require('glob')

const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin")

const directory = process.env.npm_config_directory
const source = 'source'
const sourcePath = path.resolve(__dirname, `${source}`, `${directory}`)
const public = 'public'
const publicPath = path.resolve(__dirname, `${public}`, `${directory}`)

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
    entry: toObject(glob.sync(`${sourcePath}/js/*.*(js|jsx)`)), // https://github.com/webpack/webpack/issues/1189
    output: {
      path: path.join(__dirname, 'public', `${directory}`),
      filename: 'js/[name]_[hash].js'
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.jsx$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            use: [
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1,
                  minimize: true
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
        },
        {
          test: /\.(ttf|eot|woff)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash].[ext]',
              publicPath: '../fonts/',
              outputPath: 'fonts'
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
              outputPath: 'img'
            }
          }
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin([`${publicPath}`]),
      new UglifyJSPlugin({
        sourceMap: true
      }),
      new ExtractTextPlugin({
        filename: 'css/[name]_[hash].css'
      })
    ]
  }
}
