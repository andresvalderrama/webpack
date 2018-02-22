const path = require('path')
const glob = require('glob')

const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const HtmlLoader = require('html-loader')

const directory = process.env.npm_config_directory
const source = 'source'
const sourcePath = path.resolve(__dirname, `${source}`, `${directory}`)
const isValidDirectory = /landing|consola/.test(directory)

if (!directory || !isValidDirectory) {
  console.error('ERRRRRRRRRRRRRRRRRRRR! Por favor defina la variable directory. $ npm run watch:source --directory=landing | consola ')
  process.exit(1);
}


function toObject (paths) {
  let ret = {}

  for (let path of paths) {
    let file = path.split('/').slice(-1)[0]
    let name = file.split('.')[0]

    ret[name] = path;
  }
  return ret
}
module.exports = {
  entry: toObject(glob.sync(`${sourcePath}/js/*.*(js|jsx)`)), // https://github.com/webpack/webpack/issues/1189
  output: {
    path: path.join(__dirname, 'public', `${directory}`),
    filename: 'js/[name].js'
  },
  watch: true,
  devtool: 'inline-source-map',
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
              options: { importLoaders: 1 }
            },
            {
              loader: 'postcss-loader',
              options: { sourceMap: true }
            }
          ]
        })
      },
      {
        test: /\.(ttf|eot|woff)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            publicPath: '../fonts/',
            outputPath: 'fonts'
          }
        }
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            publicPath: '../img/',
            outputPath: 'img'
          }
        }
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            attrs: [':src'],
            root: path.resolve(__dirname)
          }
        }
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'css/[name].css'
    })
  ]
}
