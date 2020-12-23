const path = require('path');
const {
  NamedModulesPlugin,
  HotModuleReplacementPlugin
} = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

const base_resolve = require("./helpers/base_resolve");
const postcss_options = require("./helpers/postcss_options");
const babel_loader_options = require("./helpers/babel_loader_options");


const env = process.env.NODE_ENV || "production";
const __DEV__ = env === "development";
const __STAGE__ = env === "stage";
const __PROD__ = env === "production";
const __TEST__ = env === "test";
const __BUNDLE_ANALYZE__ = process.env.BUNDLE_ANALYZE;
const __NOT_COMPILE__ = __DEV__ || __TEST__;

const css_module_name = "[name]__[local]";

const paths = {
  DIST: path.resolve(__dirname, 'build'),
  SRC: path.resolve(__dirname, 'src'),
};

// Webpack configuration
module.exports = {
  entry: {
    app: "./src/main"
  },
  output: {
    path: paths.DIST,
    filename: 'app.bundle.js',
  },
  devtool: __DEV__ ? "eval-cheap-module-source-map" : "source-map",
  devServer: {
    compress: true,
    historyApiFallback: true,
    overlay: true,
    hot: __DEV__,
    noInfo: true,
    stats: "minimal",
    inline: !__BUNDLE_ANALYZE__,
    watchOptions: {
      aggregateTimeout: 3000
    }
  },
  optimization: {
    usedExports: true,
    minimize: !(__NOT_COMPILE__ || __BUNDLE_ANALYZE__)
  },
  resolve: {
    modules: [base_resolve("src"), "node_modules"],
    alias: {
      file_saver: "file-saver",
      moment: "moment/min/moment.min.js",
    },
    symlinks: !__DEV__
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          __NOT_COMPILE__ ? "style-loader" : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1
            }
          },
          {
            loader: "postcss-loader",
            options: __TEST__ ? {} : postcss_options
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          __NOT_COMPILE__ ? "style-loader" : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: true,
              localIdentName: css_module_name,
              importLoaders: 1
            }
          },
          {
            loader: "postcss-loader",
            options: __TEST__ ? {} : postcss_options
          },
          {
            loader: "sass-loader"
          }
        ]
      },
      {
        test: /moment\.min\.js$/,
        use: "imports-loader?require=>null"
        // fixes issue with ./locate
      },
      {
        test: /\.(mp3|png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: "file-loader",
        options: {
          name: __NOT_COMPILE__
            ? "[path][name].[ext]"
            : "assets/[name][hash].[ext]"
        }
      },
      {
        test: /\.js$/,
        exclude: [base_resolve("node_modules")],
        loader: "babel-loader",
        options: babel_loader_options(css_module_name)
      },
      {
        test: /\.(js|jsx)$/,
        include: /react-transition-group/,
        loader: "babel-loader",
        options: babel_loader_options(css_module_name)
      }
    ]
  },
    plugins: [new ProgressBarPlugin()]
    .concat(
      !__DEV__
        ? []
        : [
            // Dev only
            new NamedModulesPlugin(),
            new HotModuleReplacementPlugin()
          ]
    )
    .concat(
      __NOT_COMPILE__
        ? []
        : [
            // Production only
            new CleanWebpackPlugin(["dist"], {
              root: base_resolve()
            }),
            new CopyWebpackPlugin([base_resolve("src/static")]),
            new MiniCssExtractPlugin({
              filename: "[name].[contenthash].css",
              chunkFilename: "[name].[contenthash].css"
            })
          ]
    )
};
