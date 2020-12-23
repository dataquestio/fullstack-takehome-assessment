const cssnano = require("cssnano");

module.exports = {
  ident: "postcss",
  plugins: [
    require("tailwindcss"),
    cssnano({
      autoprefixer: {
        add: true,
        remove: true,
        browsers: ["last 2 versions"]
      },
      discardComments: {
        removeAll: true
      },
      discardUnused: false,
      mergeIdents: false,
      reduceIdents: false,
      safe: true,
      sourcemap: true
    })
  ]
};