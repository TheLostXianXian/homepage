const isProduction = process.env.NODE_ENV === "production"
module.exports = {
  configureWebpack: config => {
    if (isProduction) {
      config.externals = {
        vue: "Vue"
      }
    }
  }
}
