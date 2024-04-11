const config = require('./webpack.dev.config');
const path = require('path');

module.exports = {
  ...config,
  output: {
    ...config.output,
    path: path.resolve(__dirname, '../docs'),
  },
};
