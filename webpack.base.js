const path = require("path")
const srcPath = path.resolve(__dirname, "src")
const distAbsolutePath = path.resolve(__dirname, "dist")
const htmlTemplatePath = path.resolve(__dirname, "public/index.html")
const staticPath = path.resolve(__dirname, "public/static")
const componentsPath = path.resolve(srcPath, "components")

const HtmlWebpackPlugin = require("html-webpack-plugin") // html 模板
const MiniCssExtractPlugin = require("mini-css-extract-plugin") // 抽离 css
const CopyWebpackPlugin = require("copy-webpack-plugin") // 复制文件
const DashboardPlugin = require("webpack-dashboard/plugin") // webpack-dev-server 强化插件

const Webpack = require("webpack")

const devMode = process.env.NODE_ENV !== "production"

module.exports = {
  mode: "development", // development production
  entry: "./src/index.js",
  output: {
    filename: "[name].bundle.js", // bundle.[hash:8].js
    path: distAbsolutePath, // 必须是绝对路径
    // chunkFilename: "[name].bundle.js",
  },
  module: {
    noParse: /jquery/, // 不去解析 jQuery 的依赖关系
    rules: [
      /*-------------  js处理 start  ------------*/
      // {
      //   test: /\.js$/i,
      //   include: path.resolve(__dirname, "src"),
      //   exclude: /node_modules/,
      //   use: {
      //     loader: "eslint-loader",
      //     options: {
      //       enforce: "pre", // 'previous' 表示最先执行 , 'post' 表示在 之后执行
      //     },
      //   },
      // },
      {
        test: /\.js$/i,
        include: path.resolve(__dirname, "src"),
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: "entry", // 用于解析  'xxxx'.includes('xx')
                  corejs: { version: 3, proposals: true },
                },
              ],
              "@babel/preset-react",
            ],
            plugins: [
              ["@babel/plugin-proposal-decorators", { legacy: true }],
              ["@babel/plugin-proposal-class-properties", { loose: true }],
              "@babel/plugin-transform-runtime", // 如 generator 那些，class 那些多次使用，统一走这个 runtime 生成的 helper 方法
            ],
          },
        },
      },
      /*-------------  js处理 end  ------------*/
      /*-------------  css 处理 start  ------------*/
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          },
          "postcss-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
              implementation: require("sass"),
              sassOptions: {
                fiber: require("fibers"),
              },
            },
          },
        ],
      },
      /*-------------  css 处理 end  ------------*/
      /*-------------  图片 处理 start  ------------*/
      {
        test: /\.html$/i,
        use: "html-withimg-loader", // 解决 <img src="xxx" />
      },
      {
        test: /\.(jpg|jpeg|gif|png|webpg)$/i,
        use: {
          loader: "url-loader",
          options: {
            limit: 8 * 1024,
            esModule: false,
            outputPath: "images/", // 打包归类
            // publicPath: "//fate.com",
          },
        },
      },
      // {
      //   test: /\.(jpg|jpeg|gif|png|webpg)$/i,
      //   use: {
      //     loader: "file-loader",
      //     options: {
      //       esModule: false, // 解决 上面 html-withimg-loader {"default": "xxxx"} 问题
      //     },
      //   },
      // },
      /*-------------  图片 处理 end  ------------*/
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: htmlTemplatePath,
      minify: {
        removeAttributeQuotes: true, // 移除属性的引号
        collapseWhitespace: false, // 文件压缩变成一行
      },
      hash: true,
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
      // filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: staticPath,
          to: "assets/",
          force: true,
        },
      ],
    }),
    new Webpack.DefinePlugin({
      DEV_MODE: JSON.stringify("development"),
    }),
    new Webpack.IgnorePlugin(/\.\/locale/, /moment/), // 不打包 moment.js 引入的 locale
    new DashboardPlugin(),
    // new Webpack.DllReferencePlugin({
    //   manifest: path.resolve(distAbsolutePath, "manifest.json"),
    // }),
  ],
  // watch: true,
  // watchOptions: {
  //   poll: 1000, // 每秒询问 1000 次 是否打包
  //   aggregateTimeout: 500, // 防抖
  //   ignored: /node_moudles/,
  // },

  // 解析 第三方包
  resolve: {
    modules: [path.resolve("node_modules")],
    alias: {
      "@": componentsPath,
    },
  },
}
