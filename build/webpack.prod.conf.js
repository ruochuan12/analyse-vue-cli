'use strict'
// 引入node路径相关
const path = require('path')
// 引入utils工具函数
const utils = require('./utils')
// 引入webpack
const webpack = require('webpack')
// 引入config/index.js配置文件
const config = require('../config')
// 合并webpack配置的插件
const merge = require('webpack-merge')
// 基本的webpack配置
const baseWebpackConfig = require('./webpack.base.conf')
// 拷贝文件和文件夹的插件
const CopyWebpackPlugin = require('copy-webpack-plugin')
// 压缩处理HTML的插件
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
// 压缩处理css的插件
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
// 压缩处理js的插件
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

// 用DefinePlugin定义环境
const env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : require('../config/prod.env')
// 合并基本webpack配置
const webpackConfig = merge(baseWebpackConfig, {
  module: {
    // 通过styleLoaders函数生成样式的一些规则
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  // 配置使用sourceMap
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    // 定义具体是什么环境
    new webpack.DefinePlugin({
      'process.env': env
    }),
    // 压缩js插件
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          // 警告
          warnings: false
          // 构建后的文件
          // 去除console.log 默认为false。  传入true会丢弃对console函数的调用。
          // drop_console: true,
          // 去除debugger
          // drop_debugger: true,
          // 默认为null. 你可以传入一个名称的数组，而UglifyJs将会假定那些函数不会产生副作用。
          // pure_funcs: [ 'console.log', 'console.log.apply' ],
        }
      },
      //
      sourceMap: config.build.productionSourceMap,
      // 平行处理（同时处理）加快速度
      parallel: true
    }),
    // extract css into its own file
    // 提取css到单独的css文件
    new ExtractTextPlugin({
      // 提取到相应的文件名 使用内容hash contenthash
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`,
      // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
      // allChunks 默认是false,true指提取所有chunks包括动态引入的组件。
      allChunks: true,
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      // 输出html名称
      filename: process.env.NODE_ENV === 'testing'
        ? 'index.html'
        : config.build.index,
      // 使用哪个模板
      template: 'index.html',
      inject: true,
      minify: {
        // 删除注释
        removeComments: true,
        // 删除空格
        collapseWhitespace: true,
        // 删除html标签中属性的双引号
        removeAttributeQuotes: true
        // 更多配置查看html-minifier插件
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    // keep module.id stable when vendor modules does not change
    // 根据代码内容生成普通模块的id，确保源码不变，moduleID不变。
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    // 开启作用域提升 webpack3新的特性，作用是让代码文件更小、运行的更快
    new webpack.optimize.ModuleConcatenationPlugin(),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks (module) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    // 提取公共代码
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    // This instance extracts shared chunks from code splitted chunks and bundles them
    // in a separate chunk, similar to the vendor chunk
    // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    // 提取动态组件
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      // 最小3个，包含3，chunk的时候提取
      minChunks: 3
    }),

    // copy custom static assets
    // 把static资源复制到相应目录。
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        // 忽略.开头的文件。比如这里的.gitkeep，这个文件是指空文件夹也提交到git
        ignore: ['.*']
      }
    ])
  ]
})
// 如果开始gzip压缩，使用compression-webpack-plugin插件处理。默认是false
// 需要使用是需要安装 npm i compression-webpack-plugin -D
if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

// 输出分析的插件 npm run build --report
// build结束后会自定打开 http://127.0.0.1:8888 链接
if (config.build.bundleAnalyzerReport) {
  // 更多查看链接地址：https://www.npmjs.com/package/webpack-bundle-analyzer
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}
// 当然也可以用官方提供的网站 http://webpack.github.io/analyse/#home
// 运行类似 webpack --profile --json > stats.json 命令
// 把生成的构建信息stats.json上传即可


// 最终导出 webpackConfig
module.exports = webpackConfig
