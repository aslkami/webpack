const { smart } = require("webpack-merge")
const baseConfig = require("./webpack.base.js")

const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin") // 压缩 css
const TerserJSPlugin = require("terser-webpack-plugin") // 压缩 js
const { CleanWebpackPlugin } = require("clean-webpack-plugin")

module.exports = smart(baseConfig, {
  mode: "production",
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
  plugins: [new CleanWebpackPlugin()],
})
