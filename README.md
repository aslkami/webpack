#### 基于 webpack 的 react 多页面

- [browserslist](https://github.com/browserslist/browserslist) (postcss-loader, autoprefixer 相关)
- [eslint](https://eslint.org/demo)

##### loader

1. expose-loader，暴露全局变量 例如 `Jquery` 挂载在 `window` 上面， `npm i -D expose-loader`, `import $ from 'expose-loader?$!jquery'`

```js
import $ from "jquery"

// webpack rules
rules: [
  {
    test: requrie.resolve("jquery"),
    use: "expose-loader?$",
  },
]

// webpack plugins, 每个模块中注入
new webpack.ProvidePlugin({
  $: "jquery",
})

// externals, 不需要打包的的模块
externals: {
  jquery: "JQuery"
}
```

##### devtool

1. source-map // 生成 map 文件， 会映射 ，有报错行和列
2. eval-source-map // 和 1 比 不会生成文件
3. cheap-module-source-map // 生成 map 文件， 不会映射 ，没有列
4. cheap-module-eval-source-map // 和 3 比 不会生成 map 文件

##### watch

- 实时监控打包文件

```js
watch: true,
watchOptions: {
  poll: 1000, // 每秒询问 1000 次 是否打包
  aggregateTimeout: 500, // 防抖
  ignored: /node_moudles/
}
```

##### plugins

1. clean-webpack-plugin
2. copy-webpack-plugin
3. BannerPlugin

##### resolve

1. `module: [path.resolve("node_modules")]`, 解析第三方模块，限定在 `node_modules` 找
2. alias, 配置别名
3. mainFields: ['style', 'main'], 依次找 `package.json` 里的 `style` 和 `main` 字段
4. mainFiles: [], 入口文件的名字, 默认 index.js
5. extensions: ['.js', '.css', '.json', '.vue'], `import './index'` 依次解析为对应的 后缀名

##### happypack 多线程打包

```js
const HappyPack = require('happypack') // 多线程打包

{
  test: /\.js$/i,
  include: path.resolve(__dirname, "src"),
  exclude: /node_modules/,
  use: 'HappyPack/loader?id=js'
}

new HappyPack({
  id: "js",
  use: [
    {
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
  ],
}),
```

##### webpack 自带的优化

1. tree shaking, 生产环境下，打包会自动忽略没有应用的内容
2. scope hosting

```js
let a = 1
let b = 2
let c = a + b
console.log(c)
// requrie 出来的变量 有 default 属性
// webpack 会自动 解析成 console.log(3), 也就是不会有 abc 3个变量
```

##### 懒加载

- vue-router , 原理是 jsonp 动态加载

```js
import("").then((data) => {
  console.log(data.default)
})
```

##### 热更新

```js
import str from "./source"
console.log(str)

if (module.hot) {
  module.hot.accept("./source.js", () => {
    const str = require("./source")
    console.log(str)
  })
}
```

#### react 相关

1. React Hot Loader
