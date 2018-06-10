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
  // 这里是 { NODE_ENV: '"testing"' }
  ? require('../config/test.env')
  // 这里是 { NODE_ENV: '"production"' }
  : require('../config/prod.env')
// 合并基本webpack配置
const webpackConfig = merge(baseWebpackConfig, {
  module: {
    // 通过styleLoaders函数生成样式的一些规则
    rules: utils.styleLoaders({
      // sourceMap这里是true
      sourceMap: config.build.productionSourceMap,
      // 是否提取css到单独的css文件
      extract: true,
      // 是否使用postcss
      usePostCSS: true
    })
  },
  // 配置使用sourceMap true 这里是 #source-map
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    // 这里是根目录下的dist
    path: config.build.assetsRoot,
    // 文件名称 chunkhash
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    // chunks名称 chunkhash
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
          // 构建后的文件 常用的配置还有这些
          // 去除console.log 默认为false。  传入true会丢弃对console函数的调用。
          // drop_console: true,
          // 去除debugger
          // drop_debugger: true,
          // 默认为null. 你可以传入一个名称的数组，而UglifyJs将会假定那些函数不会产生副作用。
          // pure_funcs: [ 'console.log', 'console.log.apply' ],
        }
      },
      // 是否开启sourceMap 这里是true
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
      // 这里配置是true
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
        // 这里是 根目录下的dist/index.html
        : config.build.index,
      // 使用哪个模板
      template: 'index.html',
      // inject 默认值 true，script标签位于html文件的 body 底部
      // body 通true, header, script 标签位于 head 标签内
      // false 不插入生成的 js 文件，只是单纯的生成一个 html 文件
      inject: true,
      // 压缩
      minify: {
        // 删除注释
        removeComments: true,
        // 删除空格和换行
        collapseWhitespace: true,
        // 删除html标签中属性的双引号
        removeAttributeQuotes: true
        // 更多配置查看html-minifier插件
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      // 在chunk被插入到html之前，你可以控制它们的排序。允许的值 ‘none’ | ‘auto’ | ‘dependency’ | {function} 默认为‘auto’.
      // dependency 依赖（从属）
      chunksSortMode: 'dependency'
    }),
    // keep module.id stable when vendor modules does not change
    // 根据代码内容生成普通模块的id，确保源码不变，moduleID不变。
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    // 开启作用域提升 webpack3新的特性，作用是让代码文件更小、运行的更快
    new webpack.optimize.ModuleConcatenationPlugin(),
    // split vendor js into its own file
    // 提取公共代码
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
      // 把公共的部分放到 manifest 中
      name: 'manifest',
      // 传入 `Infinity` 会马上生成 公共chunk，但里面没有模块。
      minChunks: Infinity
    }),
    // This instance extracts shared chunks from code splitted chunks and bundles them
    // in a separate chunk, similar to the vendor chunk
    // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    // 提取动态组件
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      // 如果设置为 `true`，一个异步的  公共chunk 会作为 `options.name` 的子模块，和 `options.chunks` 的兄弟模块被创建。
      // 它会与 `options.chunks` 并行被加载。可以通过提供想要的字符串，而不是 `true` 来对输出的文件进行更换名称。
      async: 'vendor-async',
      // 如果设置为 `true`，所有  公共chunk 的子模块都会被选择
      children: true,
      // 最小3个，包含3，chunk的时候提取
      minChunks: 3
    }),

    // copy custom static assets
    // 把static资源复制到相应目录。
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        // 这里配置是static
        to: config.build.assetsSubDirectory,
        // 忽略.开头的文件。比如这里的.gitkeep，这个文件是指空文件夹也提交到git
        ignore: ['.*']
      }
    ])
  ]
})
// 如果开始gzip压缩，使用compression-webpack-plugin插件处理。这里配置是false
// 需要使用是需要安装 npm i compression-webpack-plugin -D
if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      // asset： 目标资源名称。 [file] 会被替换成原始资源。
      // [path] 会被替换成原始资源的路径， [query] 会被替换成查询字符串。默认值是 "[path].gz[query]"。
      asset: '[path].gz[query]',
      // algorithm： 可以是 function(buf, callback) 或者字符串。对于字符串来说依照 zlib 的算法(或者 zopfli 的算法)。默认值是 "gzip"。
      algorithm: 'gzip',
      // test： 所有匹配该正则的资源都会被处理。默认值是全部资源。
      // config.build.productionGzipExtensions 这里是['js', 'css']
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      // threshold： 只有大小大于该值的资源会被处理。单位是 bytes。默认值是 0。
      threshold: 10240,
      // minRatio： 只有压缩率小于这个值的资源才会被处理。默认值是 0.8。
      minRatio: 0.8
    })
  )
}

// 输出分析的插件 运行npm run build --report
// config.build.bundleAnalyzerReport这里是 process.env.npm_config_report
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
