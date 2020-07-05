const path = require("path")
const Webpack = require("webpack")

const distPath = path.resolve(__dirname, "dist")

module.exports = {
  mode: "production",
  entry: {
    react: ["react", "react-dom"],
  },
  output: {
    filename: "__dll__[name].js",
    path: distPath,
    library: "__dll__[name]", // 导出文件的变量
    libraryTarget: "var", // 打包方式 common.js var this
  },
  plugins: [
    new Webpack.DllPlugin({
      name: "__dll__[name]", // name === output.filename
      path: path.resolve(distPath, "manifest.json"), // 打包的清单
    }),
  ],
}
