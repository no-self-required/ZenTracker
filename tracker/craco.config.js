const webpack = require('webpack');

module.exports = {
  // ...
  webpack: {
    alias: { /* ... */ },
    plugins: {
      add: [ /* ... */ ],
      remove: [ /* ... */ ],
    },
    configure: { /* ... */},
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.resolve.fallback = {
        "buffer": require.resolve("buffer/"),
        "util": require.resolve("util/"),
        "stream": require.resolve("stream-browserify"),
        "crypto": require.resolve("crypto-browserify"),
        "vm": require.resolve("vm-browserify")
      };      
      webpackConfig.plugins = [
        ...webpackConfig.plugins,
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
      ];
      return webpackConfig;
    },
  },
};