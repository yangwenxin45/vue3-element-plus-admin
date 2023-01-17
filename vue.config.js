// const { defineConfig } = require("@vue/cli-service");
// module.exports = defineConfig({
//   transpileDependencies: true,
// });
const path = require("path");

// const AutoImport = require("unplugin-auto-import/webpack");
// const Components = require("unplugin-vue-components/webpack");
// const { ElementPlusResolver } = require("unplugin-vue-components/resolvers");

module.exports = {
  // 基本路径
  publicPath: process.env.NODE_ENV === "production" ? "" : "./",
  // 输出文件目录
  outputDir: process.env.NODE_ENV === "production" ? "dist" : "devdist",
  // eslint-loader 是否在保存的时候检查
  lintOnSave: true,
  /** vue3.0内置了webpack所有东西，
   * webpack配置,see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
   **/
  chainWebpack: (config) => {},
  // configureWebpack: (config) => {
  //   config.plugins = [
  //     ...config.plugins,
  //     AutoImport({
  //       resolvers: [ElementPlusResolver()],
  //     }),
  //     Components({
  //       resolvers: [ElementPlusResolver()],
  //     }),
  //   ];
  // },
  // configureWebpack: {
  //   plugins: [
  //     AutoImport({
  //       resolvers: [ElementPlusResolver()],
  //     }),
  //     Components({
  //       resolvers: [ElementPlusResolver()],
  //     }),
  //   ],
  // },
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {
      scss: {
        additionalData: `@import "./src/styles/main.scss";`,
      },
    },
  },
  // use thread-loader for babel & TS in production build
  // enabled by default if the machine has more than 1 cores
  parallel: require("os").cpus().length > 1,
  /**
   *  PWA 插件相关配置,see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
   */
  pwa: {},
  // webpack-dev-server 相关配置
  devServer: {
    open: false,
    host: "0.0.0.0", // 编译完成是否自动打开网页
    port: 8080, // 指定使用地址
    proxy: {
      [process.env.VUE_APP_API]: {
        target: process.env.VUE_APP_DEV_TARGET, // API服务器地址
        changeOrigin: true, //  是否匀速跨域
        ws: false, // 是否启用websockets
        secure: false, // 是否启动https接口
        pathRewrite: {
          [`^${process.env.VUE_APP_API}`]: "", // 匹配开头为/devApi的字符串，并替换成空字符串
        },
      },
    },
  },
  /**
   * 第三方插件配置
   */
  pluginOptions: {},
};
