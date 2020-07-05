const { smart } = require("webpack-merge")
const baseConfig = require("./webpack.base.js")
const Webpack = require("webpack")
const path = require("path")
const distAbsolutePath = path.resolve(__dirname, "dist")

module.exports = smart(baseConfig, {
  mode: "development",
  output: {
    publicPath: "/",
  },
  devtool: "source-map",
  devServer: {
    port: 3000,
    progress: true,
    hot: true,
    contentBase: "./dist", // 基于express  运行静态服务的 目录
    open: true, // 自动打开
    compress: true, // gzip 压缩
  },
  plugins: [
    new Webpack.NamedModulesPlugin(), // 热更新的文件名
    new Webpack.HotModuleReplacementPlugin(), // 热更新插件
    new Webpack.DllReferencePlugin({
      manifest: path.resolve(distAbsolutePath, "manifest.json"),
    }),
  ],
})
