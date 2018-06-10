'use strict'
const path = require('path')
// 引入配置文件config/index.js
const config = require('../config')
// 提取css的插件
const ExtractTextPlugin = require('extract-text-webpack-plugin')
// 引入package.json配置
const packageConfig = require('../package.json')
// 返回路径
exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    // 二级目录 这里是 static
    ? config.build.assetsSubDirectory
    // 二级目录 这里是 static
    : config.dev.assetsSubDirectory

  // 生成跨平台兼容的路径
  // 更多查看Node API链接：https://nodejs.org/api/path.html#path_path_posix
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  // 作为参数传递进来的options对象
  // {
  //   // sourceMap这里是true
  //   sourceMap: true,
  //   // 是否提取css到单独的css文件
  //   extract: true,
  //   // 是否使用postcss
  //   usePostCSS: true
  // }
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  // 创建对应的loader配置
  function generateLoaders (loader, loaderOptions) {
    // 是否使用usePostCSS，来决定是否采用postcssLoader
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        // 合并 loaderOptions 生成options
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      // 如果提取使用ExtractTextPlugin插件提取
      // 更多配置 看插件中文文档：https://webpack.docschina.org/plugins/extract-text-webpack-plugin/
      return ExtractTextPlugin.extract({
        // 指需要什么样的loader去编译文件
        // loader 被用于将资源转换成一个 CSS 导出模块 (必填)
        use: loaders,
        // loader（例如 'style-loader'）应用于当 CSS 没有被提取(也就是一个额外的 chunk，当 allChunks: false)
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    // sass indentedSyntax 语法缩进，类似下方格式
    // #main
    //   color: blue
    //   font-size: 0.3em
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
// 最终会返回webpack css相关的配置
exports.styleLoaders = function (options) {
  // {
  //   // sourceMap这里是true
  //   sourceMap: true,
  //   // 是否提取css到单独的css文件
  //   extract: true,
  //   // 是否使用postcss
  //   usePostCSS: true
  // }
  const output = []
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

// npm run dev 出错时， FriendlyErrorsPlugin插件 配置 onErrors输出错误信息
exports.createNotifierCallback = () => {
  // 'node-notifier'是一个跨平台系统通知的页面，当遇到错误时，它能用系统原生的推送方式给你推送信息
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}
