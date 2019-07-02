const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: {
    app: path.join(__dirname, 'src', 'index.js')
  },
  output: {
    path: path.join(__dirname, 'public'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(css|scss)$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    alias: {
      'mapbox-gl$': path.resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js')
    }
  },
  plugins: [
    new Dotenv(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        MapboxAccessToken: JSON.stringify(process.env.MapboxAccessToken),
        LastAvailableDate: JSON.stringify(process.env.LastAvailableDate),
        GridDataAPI: JSON.stringify(process.env.GridDataAPI),
        DataVizAPI: JSON.stringify(process.env.DataVizAPI)
      }
    })
  ],
  devtool: 'source-map',
  devServer: {
    historyApiFallback: true,
    contentBase: './public',
    hot: true
  }
};
