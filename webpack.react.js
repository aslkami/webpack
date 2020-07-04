const path = require("path")
const Webpack = require("webpack")

const distPath = path.resolve(__dirname, "dist")

module.exports = {
  mode: "production",
  entry: {
    react: ["react", "react-dom"],
  },
  output: {
    filename: "_dll_[name].js",
    path: distPath,
    library: "_dll_[name]", // 导出文件的变量
    libraryTarget: "var", // 打包方式 common.js var this
  },
  plugins: [
    new Webpack.DllPlugin({
      name: "_dll_[name]", // name === output.filename
      path: path.resolve(distPath, "manifest.json"), // 打包的清单
    }),
  ],
}
