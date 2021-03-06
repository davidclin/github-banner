const Html = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')
const ExtractText = require('extract-text-webpack-plugin')

const Define = webpack.DefinePlugin
const CommonsChunk = webpack.optimize.CommonsChunkPlugin
const NamedModules = webpack.NamedModulesPlugin
const HotModuleReplacement = webpack.HotModuleReplacementPlugin

const paths = {
  app: path.join(__dirname, './src/client/App.js'),
  index: path.join(__dirname, './src/client/index.html'),
  public: path.join(__dirname, './public'),
  client: path.join(__dirname, './src/client')
}

module.exports = {
  entry: {
    app: [paths.app]
  },
  output: {
    path: paths.public,
    filename: '[name].js',
    publicPath: '/github-banner'
  },
  resolve: {
    alias: {
      '~': paths.client
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: ExtractText.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: { importLoaders: true, modules: true }
            },
            { loader: 'sass-loader' }
          ]
        })
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new Define({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new Html({
      template: paths.index,
      inject: 'body',
      hash: true,
      filename: 'index.html'
    }),
    new CommonsChunk({
      name: 'vendor',
      minChunks: module => /node_modules/.test(module.context)
    }),
    new HotModuleReplacement(),
    new NamedModules(),
    new ExtractText('styles.css')
  ],
  devServer: {
    historyApiFallback: true
  }
}
