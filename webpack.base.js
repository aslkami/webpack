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

const { entry, HtmlPlugins } = require("./webpack.utils")

module.exports = {
  mode: "development", // development production
  entry: entry,
  output: {
    filename: "[name].js", // bundle.[hash:8].js
    path: distAbsolutePath, // 推荐绝对路径
    // publicPath: devMode ? "/" : "../",
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
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "../../../",
            },
          },
          "css-loader",
          "postcss-loader",
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "../../../",
            },
          },
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
            outputPath: "assets/images/", // 打包归类
            // publicPath: "../assets/images/",
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
    ...HtmlPlugins,
    new MiniCssExtractPlugin({
      filename: "assets/css/[name].css",
      // filename: "[name].css",
      chunkFilename: "assets/css/[id].css",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: staticPath,
          to: "assets/static/",
          force: true,
        },
      ],
    }),
    new Webpack.DefinePlugin({
      DEV_MODE: JSON.stringify("development"),
    }),
    new Webpack.IgnorePlugin(/\.\/locale/, /moment/), // 不打包 moment.js 引入的 locale
    new DashboardPlugin(),
  ],
  // watch: true,
  // watchOptions: {
  //   poll: 1000, // 每秒询问 1000 次 是否打包
  //   aggregateTimeout: 500, // 防抖
  //   ignored: /node_moudles/,
  // },

  resolve: {
    modules: [path.resolve("node_modules")], // // 解析 第三方包
    alias: {
      "@": srcPath,
      components: componentsPath,
    },
  },
}
