const isProduction = process.env.NODE_ENV === "production"
const cdn = {
  js: ["https://cdn.bootcss.com/vue/2.6.10/vue.min.js"]
}
module.exports = {
  configureWebpack: config => {
    if (isProduction) {
      config.externals = {
        vue: "Vue"
      }
    }
  },
  chainWebpack: config => {
    if (isProduction) {
      config.plugin("html").tap(args => {
        args[0].cdn = cdn
        return args
      })
    }
  }
}
