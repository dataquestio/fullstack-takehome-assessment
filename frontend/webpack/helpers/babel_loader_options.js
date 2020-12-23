const base_resolve = require("./base_resolve");

const env = process.env.NODE_ENV || "production";
const __DEV__ = env === "development";
const __TEST__ = env === "test";

const __NOT_COMPILE__ = __DEV__ || __TEST__;

module.exports = css_module_name => ({
  cacheDirectory: true,
  presets: [
    ["@babel/preset-env", { modules: false }],
    "@babel/preset-flow",
    "@babel/preset-react"
  ],
  plugins: [
    "babel-plugin-add-react-displayname",
    [
      "transform-react-remove-prop-types",
      {
        ignoreFilenames: __NOT_COMPILE__ ? [".*"] : undefined
      }
    ],
    [
      "react-css-modules",
      {
        context: base_resolve("src"),
        exclude: "node_modules",
        generateScopedName: css_module_name,
        webpackHotModuleReloading: __DEV__,
        filetypes: {
          ".scss": {
            syntax: "postcss-scss"
          }
        }
      }
    ],
    "@babel/plugin-proposal-class-properties"
  ]
});
