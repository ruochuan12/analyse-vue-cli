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
// 友好提示的插件
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

// host
const HOST = process.env.HOST
// 端口
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  // 在开发环境是cheap-module-eval-source-map选项更快
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    // 配置在客户端的日志等级，这会影响到你在浏览器开发者工具控制台里看到的日志内容。
    // clientLogLevel 是枚举类型，可取如下之一的值 none | error | warning | info。
    // 默认为 info 级别，即输出所有类型的日志，设置成 none 可以不输出任何日志。
    clientLogLevel: 'warning',
    // historyApiFallback 用于方便的开发使用了 HTML5 History API 的单页应用。
    historyApiFallback: {
      rewrites: [
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
    host: HOST || config.dev.host,
    // 端口号
    port: PORT || config.dev.port,
    // 打开浏览器，这里配置是不打开
    open: config.dev.autoOpenBrowser,
    // 是否在浏览器以遮罩形式显示报错信息
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    // 代理
    proxy: config.dev.proxyTable,
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
    // 更多查看：https://webpack.docschina.org/configuration/watch/#src/components/Sidebar/Sidebar.jsx
  },
  plugins: [
    // 定义为开发环境
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    // 热更新插件
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    // 把static资源复制到相应目录。
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        // 忽略.开头的文件。比如这里的.gitkeep，这个文件是指空文件夹也提交到git
        ignore: ['.*']
      }
    ])
  ]
})
// 导出一个promise
module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
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
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
