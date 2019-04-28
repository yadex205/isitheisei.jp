const TsconfigPathsWebpackPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  onCreateWebpackConfig({ actions }) {
    const { setWebpackConfig } = actions;

    setWebpackConfig({
      resolve: {
        plugins: [
          new TsconfigPathsWebpackPlugin({ extensions: ['.ts', '.tsx'] })
        ]
      }
    });
  }
};
