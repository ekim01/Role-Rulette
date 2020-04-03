const createExpoWebpackConfig = require("@expo/webpack-config");
const path = require("path");
const merge = require("webpack-merge");

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfig(env, argv);

  return merge(config, {
    resolve: {
      alias: {
        "react-native/Libraries/Renderer/shims/ReactNativePropRegistry":
          "react-native-web/dist/modules/ReactNativePropRegistry",
        "react-native": "react-native-web"
      }
    },
    module: {
      rules: [
        {
          test: /\.[jt]s?x?$/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["babel-preset-expo"],
              plugins: ["@babel/plugin-proposal-class-properties"],
              cacheDirectory: true
            }
          },
          include: [
            path.resolve("node_modules/react-navigation"),
            path.resolve("node_modules/react-native-web"),
            path.resolve("node_modules/static-container")
          ]
        }
      ]
    }
  });
};
