'use strict'
// 引入工具函数
const utils = require('./utils')
// 引入webpack
const webpack = require('webpack')
// 引入config/index.js配置
const config = require('../config')
// 合并webpack配置
const merge = require('webpack-merge')
const path = require('path')
// 基本配置
const baseWebpackConfig = require('./webpack.base.conf')
// 拷贝插件
const CopyWebpackPlugin = require('copy-webpack-plugin')
// 生成html的插件
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 友好提示的插件 https://github.com/geowarin/friendly-errors-webpack-plugin
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
// 查找可用端口 // github仓库 https://github.com/indexzero/node-portfinder
const portfinder = require('portfinder')


// process模块用来与当前进程互动，可以通过全局变量process访问，不必使用require命令加载。它是一个EventEmitter对象的实例。

// 后面有些process模块用到的，所以这里统一列举下。
// 更多查看这篇阮一峰的这篇文章 http://javascript.ruanyifeng.com/nodejs/process.html

// process对象提供一系列属性，用于返回系统信息。
// process.pid：当前进程的进程号。
// process.version：Node的版本，比如v0.10.18。
// process.platform：当前系统平台，比如Linux。
// process.title：默认值为“node”，可以自定义该值。
// process.argv：当前进程的命令行参数数组。
// process.env：指向当前shell的环境变量，比如process.env.HOME。
// process.execPath：运行当前进程的可执行文件的绝对路径。
// process.stdout：指向标准输出。
// process.stdin：指向标准输入。
// process.stderr：指向标准错误。

// process对象提供以下方法：
// process.exit()：退出当前进程。
// process.cwd()：返回运行当前脚本的工作目录的路径。_
// process.chdir()：改变工作目录。
// process.nextTick()：将一个回调函数放在下次事件循环的顶部。

// host
const HOST = process.env.HOST
// 端口
const PORT = process.env.PORT && Number(process.env.PORT)

// 合并基本的webpack配置
const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    // cssSourceMap这里配置的是true
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  // 在开发环境是cheap-module-eval-source-map选项更快
  // 这里配置的是cheap-module-eval-source-map
  // 更多可以查看中文文档：https://webpack.docschina.org/configuration/devtool/#devtool
  // 英文 https://webpack.js.org/configuration/devtool/#development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    // 配置在客户端的日志等级，这会影响到你在浏览器开发者工具控制台里看到的日志内容。
    // clientLogLevel 是枚举类型，可取如下之一的值 none | error | warning | info。
    // 默认为 info 级别，即输出所有类型的日志，设置成 none 可以不输出任何日志。
    clientLogLevel: 'warning',
    // historyApiFallback boolean object 用于方便的开发使用了 HTML5 History API 的单页应用。
    // 可以简单true 或者 任意的 404 响应可以提供为 index.html 页面。
    historyApiFallback: {
      rewrites: [
        // config.dev.assetsPublicPath 这里是 /
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    // 开启热更新
    hot: true,
    // contentBase 配置 DevServer HTTP 服务器的文件根目录。
    // 默认情况下为当前执行目录，通常是项目根目录，所有一般情况下你不必设置它，除非你有额外的文件需要被 DevServer 服务。
    contentBase: false, // since we use CopyWebpackPlugin.
    // compress 配置是否启用 gzip 压缩。boolean 为类型，默认为 false。
    compress: true,
    // host
    // 例如你想要局域网中的其它设备访问你本地的服务，可以在启动 DevServer 时带上 --host 0.0.0.0
    // 或者直接设置为 0.0.0.0
    // 这里配置的是localhost
    host: HOST || config.dev.host,
    // 端口号 这里配置的是8080
    port: PORT || config.dev.port,
    // 打开浏览器，这里配置是不打开false
    open: config.dev.autoOpenBrowser,
    // 是否在浏览器以遮罩形式显示报错信息 这里配置的是true
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
      // 这里配置的是 /
    publicPath: config.dev.assetsPublicPath,
    // 代理 这里配置的是空{},有需要可以自行配置
    proxy: config.dev.proxyTable,
    // 启用 quiet 后，除了初始启动信息之外的任何内容都不会被打印到控制台。这也意味着来自 webpack 的错误或警告在控制台不可见。
    // 开启后一般非常干净只有类似的提示 Your application is running here: http://localhost:8080
    quiet: true, // necessary for FriendlyErrorsPlugin
    // webpack-dev-middleware
    // watch: false,
    // 启用 Watch 模式。这意味着在初始构建之后，webpack 将继续监听任何已解析文件的更改。Watch 模式默认关闭。
    // webpack-dev-server 和 webpack-dev-middleware 里 Watch 模式默认开启。
    // Watch 模式的选项
    watchOptions: {
      // 或者指定毫秒为单位进行轮询。
      // 这里配置为false
      poll: config.dev.poll,
    }
    // 更多查看中文文档：https://webpack.docschina.org/configuration/watch/#src/components/Sidebar/Sidebar.jsx
  },
  plugins: [
    // 定义为开发环境
    new webpack.DefinePlugin({
      // 这里是 { NODE_ENV: '"development"' }
      'process.env': require('../config/dev.env')
    }),
    // 热更新插件
    new webpack.HotModuleReplacementPlugin(),
    // 热更新时显示具体的模块路径
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    // 在编译出现错误时，使用 NoEmitOnErrorsPlugin 来跳过输出阶段。
    new webpack.NoEmitOnErrorsPlugin(),
    // github仓库 https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      // inject 默认值 true，script标签位于html文件的 body 底部
      // body 通true, header, script 标签位于 head 标签内
      // false 不插入生成的 js 文件，只是单纯的生成一个 html 文件
      inject: true
    }),
    // copy custom static assets
    // 把static资源复制到相应目录。
    new CopyWebpackPlugin([
      {
        // 这里是 static
        from: path.resolve(__dirname, '../static'),
        // 这里是 static
        to: config.dev.assetsSubDirectory,
        // 忽略.开头的文件。比如这里的.gitkeep，这个文件是指空文件夹也提交到git
        ignore: ['.*']
      }
    ])
  ]
})
// 导出一个promise
module.exports = new Promise((resolve, reject) => {
  // process.env.PORT 可以在命令行指定端口号，比如PORT=2000 npm run dev，那访问就是http://localhost:2000
  // config.dev.port 这里配置是 8080
  portfinder.basePort = process.env.PORT || config.dev.port
  // 以配置的端口为基准，寻找可用的端口，比如：如果8080占用，那就8081,以此类推
  // github仓库 https://github.com/indexzero/node-portfinder
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        // notifyOnErrors 这里配置是 true
        // onErrors 是一个函数，出错输出错误信息，系统原生的通知
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
