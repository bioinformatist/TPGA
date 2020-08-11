const airbnb = require('@neutrinojs/airbnb');
const react = require('@neutrinojs/react');
const jest = require('@neutrinojs/jest');
const web = require('@neutrinojs/web');

module.exports = {
  options: {
    root: __dirname,
    index: 'index',
  },
  use: [
    airbnb(),
    react({
      html: {
        title: 'TPGA'
      },
      styles: ({
        // Override the default file extension of `.css` if needed
        test: /\.css$/,
        modulesTest: /\.module.css$/,
        loaders: [
          // Define loaders as objects. Note: loaders must be specified in reverse order.
          // ie: for the loaders below the actual execution order would be:
          // input file -> sass-loader -> postcss-loader -> css-loader -> style-loader/mini-css-extract-plugin
          {
            loader: 'postcss-loader',
            options: {
              plugins: [require('autoprefixer')],
            },
          },
        ],
      },
      {
        test: /\styl$/,
        modulesTest: /\.module.styl$/,
        loaders: [
          {
            loader: 'stylus-loader',
            useId: 'stylus',
          },
        ],
      }),
      devServer: {
        proxy: {
          '**': {
            target: 'http://localhost:3333',
            changeOrigin: true,
          },
        },
      },
    }),
    jest(),
  ],
};
