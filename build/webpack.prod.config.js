const path = require('path');
const rootDir = path.join(__dirname, '..');

module.exports = {
  mode: 'production',
  entry: path.join(rootDir, 'src/index.js'),
  output: {
    environment: {
      arrowFunction: false,
      const: false,
    },
    path: path.join(rootDir, 'dist'),
    filename: 'index.js',
    clean: true,
    chunkFilename: '[name]_[chunkhash].js',
    library: {
      type: 'umd',
    },
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
  },
};
