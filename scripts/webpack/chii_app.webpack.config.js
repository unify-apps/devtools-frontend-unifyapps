const path = require('path');

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, '../../front_end/entrypoints/chii_app/chii_app.ts'),
  output: {
    path: path.resolve(__dirname, '../../out/webpack/chii_app'),
    filename: 'chii_app.js',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
    ],
  },
};
