require('dotenv/config');
const path = require('path');

const clientPath = path.join(__dirname, 'client/');
const publicPath = path.join(__dirname, 'server/public/');

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx']
  },
  entry: clientPath,
  mode: 'development',
  output: {
    filename: '[name].bundle.js',
    path: publicPath
  },
  module: {
    rules: [
      {
        test: /\.jsx/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              '@babel/plugin-transform-react-jsx'
            ]
          }
        }
      }
    ]
  },
  devtool: 'source-map',
  devServer: {
    contentBase: publicPath,
    historyApiFallback: true,
    host: '0.0.0.0',
    port: process.env.DEV_SERVER_PORT,
    proxy: {
      '/api': `http://localhost:${process.env.PORT}`,
      '/socket.io': {
        target: `http://localhost:${process.env.CHAT_PORT}`,
        ws: true
      }
    },
    stats: 'minimal',
    watchContentBase: true,
    watchOptions: {
      ignored: path.join(__dirname, 'server/public/images/')
    }
  }
};
