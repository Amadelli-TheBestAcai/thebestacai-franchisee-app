const path = require('path')

const rootPath = path.resolve(__dirname, '..')

module.exports = {
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devtool: 'source-map',
  entry: path.resolve(rootPath, 'electron', 'main.ts'),
  target: 'electron-main',
  externals: {
    serialport: 'commonjs serialport',
    knex: 'commonjs knex',
    bcrypt: 'commonjs bcrypt',
    printer: 'commonjs printer',
    typeorm: 'commonjs typeorm'
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/transform-runtime'],
          },
        },
      },
    ],
  },
  node: {
    __dirname: false,
  },
  output: {
    path: path.resolve(rootPath, 'dist'),
    filename: '[name].js',
  },
  optimization: {
    minimize: false
  }
}
