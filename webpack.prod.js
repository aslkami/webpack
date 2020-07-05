const { smart } = require("webpack-merge")
const path = require("path")
const baseConfig = require("./webpack.base.js")
const distAbsolutePath = path.resolve(__dirname, "dist")

const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin") // 压缩 css
const TerserJSPlugin = require("terser-webpack-plugin") // 压缩 js
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const Webpack = require("webpack")

module.exports = smart(baseConfig, {
  mode: "production",
  output: {
    publicPath: "../",
  },
  optimization: {
    minimizer: [
      new TerserJSPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
    // 多页面打包优化 抽离公共文件
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: "initial", // 一开始就抽离
          minSize: 0, // 引入 大于 0 的模块
          minChunks: 2, //  引入 2 次 以上的
        },
        vendor: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: "vendor",
          chunks: "all",
          minSize: 0, // 引入 大于 0 的模块
          minChunks: 2, //  引入 2 次 以上的
          priority: 1,
        },
      },
    },
  },

  plugins: [
    // new CleanWebpackPlugin(), // 使用 动态 链接库的化 就不需要这个了
    new Webpack.DllReferencePlugin({
      manifest: path.resolve(distAbsolutePath, "manifest.json"),
    }),
  ],
})
