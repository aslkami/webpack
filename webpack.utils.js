const fs = require("fs")
const path = require("path")
const glob = require("glob")
const HtmlWebpackPlugin = require("html-webpack-plugin") // html 模板

const whiteList = ["options"] // 入口白名单，在名单内的 不作为打包入口

const prefixRoot = "./src/pages/"
const JSFiles = glob.sync(`${prefixRoot}**/*.js`)
const HtmlFiles = glob.sync(`${prefixRoot}**/*.html`)

const fitlerJSFiles = (data) => {
  if (!data.length) return data

  return data.filter((v) => {
    const basename = path.basename(v, ".js")
    return !whiteList.includes(basename)
  })
}

// 获取入口文件
const entry = fitlerJSFiles(JSFiles).reduce((obj, filePath) => {
  const entryChunkName = filePath
    .replace(path.extname(filePath), "")
    .replace(prefixRoot, "")
  // const entryChunkName = path.basename(
  //   filePath.substring(filePath.lastIndexOf("/")),
  //   ".js"
  // )
  obj[entryChunkName] = filePath
  return obj
}, {})

// console.log(entry)

const HtmlPlugins = HtmlFiles.map((filePath) => {
  const fileName = filePath.replace(prefixRoot, "")
  // const chunkName = path.basename(
  //   filePath.substring(filePath.lastIndexOf("/")),
  //   ".js"
  // )
  return new HtmlWebpackPlugin({
    chunks: [fileName.replace(path.extname(fileName), ""), "vendor"],
    // chunks: [chunkName, "vendor"],
    template: filePath,
    filename: fileName,
    minify: {
      removeAttributeQuotes: true, // 移除属性的引号
      collapseWhitespace: false, // 文件压缩变成一行
    },
    hash: true,
  })
})

// console.log(HtmlPlugins)

// 获取指定后缀名文件
function getFilesFromDir(dir, fileTypes) {
  const [ext] = fileTypes
  const filesToReturn = []
  function walkDir(currentPath) {
    const files = fs.readdirSync(currentPath)

    for (let i in files) {
      const curFile = path.join(currentPath, files[i])
      if (
        fs.statSync(curFile).isFile() &&
        fileTypes.indexOf(path.extname(curFile)) !== -1 &&
        !whiteList.includes(path.basename(files[i], ext))
      ) {
        filesToReturn.push(curFile)
      } else if (fs.statSync(curFile).isDirectory()) {
        walkDir(curFile)
      }
    }
  }
  walkDir(dir)
  return filesToReturn
}

module.exports = {
  getFilesFromDir,
  entry,
  HtmlPlugins,
}
