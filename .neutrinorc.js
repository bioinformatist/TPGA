const airbnb = require('@neutrinojs/airbnb');
const react = require('@neutrinojs/react');
const jest = require('@neutrinojs/jest');
const styles = require('@neutrinojs/style-loader');

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
      // https://github.com/neutrinojs/neutrino/issues/1561#issuecomment-640060434
      styles: ({
        test: /\.css$/,
        modulesTest: /\.module\.css$/,
        loaders: [
          {
            loader: 'postcss-loader',
            options: {
              plugins: [require('autoprefixer')],
            },
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
    styles({
      ruleId: 'style-stylus',
      loaders: [
        {
          loader: 'stylus-loader',
          useId: 'stylus',
        },
      ],
      test: /\.(styl)$/,
      modulesTest: /\.module.(styl)$/,
    }),
    jest(),
  ],
};
