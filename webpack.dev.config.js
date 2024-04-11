const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const rootDir = path.join(__dirname, '..');

module.exports = {
  mode: 'development',
  entry: {
    index: path.join(rootDir, 'demo/index.js'),
  },
  output: {
    filename: '[name].bundle.js',
    path: path.join(rootDir, 'dist'),
  },
  devtool: 'inline-source-map',
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    port: 3000,
    open: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Development',
      template: './demo/index.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
