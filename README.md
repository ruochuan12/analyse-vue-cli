# `analyse-vue-cli`
# 分析`vue-cli@2.9.3` 搭建的`webpack`项目工程
### 前言
>已经有很多分析`Vue-cli`搭建工程的文章，为什么自己还要写一遍呢。学习就好比是座大山，人们沿着不同的路登山，分享着自己看到的风景。你不一定能看到别人看到的风景，体会到别人的心情。只有自己去登山，才能看到不一样的风景，体会才更加深刻。
### 使用`vue-cli`初始化`webpack`工程
```
// # 安装
npm install -g vue-cli
// 安装完后vue命令就可以使用了。实际上是全局注册了vue、vue-init、vue-list几个命令

// # ubuntu 系统下
// [vue-cli@2.9.3] link /usr/local/bin/vue@ -> /usr/local/lib/node_modules/vue-cli/bin/vue
// [vue-cli@2.9.3] link /usr/local/bin/vue-init@ -> /usr/local/lib/node_modules/vue-cli/bin/vue-init
// [vue-cli@2.9.3] link /usr/local/bin/vue-list@ -> /usr/local/lib/node_modules/vue-cli/bin/vue-list

vue list
// 可以发现有browserify、browserify-simple、pwa、simple、webpack、webpack-simple几种模板可选，这里选用webpack。

// # 使用 vue init
vue init <template-name> <project-name>

// # 例子
vue init webpack analyse-vue-cli
```
更多`vue-cli`如何工作的可以查看这篇文章[vue-cli是如何工作的](https://juejin.im/post/5a7b1b86f265da4e8f049081)
或者分析Vue-cli源码，查看这篇[走进Vue-cli源码，自己动手搭建前端脚手架工具](https://segmentfault.com/a/1190000013975247)
再或者直接查看[vue-cli github仓库源码](https://github.com/vuejs/vue-cli/tree/master)
### `package.json`
分析一个项目，一般从`package.json`开始。先从`scripts`的命令开始。
```
"scripts": {
  // dev webpack-dev-server --inline 模式 --progress 显示进度 --config 指定配置文件（默认是webpack.config.js）
  "dev": "webpack-dev-server --inline --progress --config build/webpack.dev.conf.js",
  "start": "npm run dev",
  // jest测试
  "unit": "jest --config test/unit/jest.conf.js --coverage",
  // e2e测试
  "e2e": "node test/e2e/runner.js",
  // 运行jest测试和e2e测试
  "test": "npm run unit && npm run e2e",
  // eslint
  "lint": "eslint --ext .js,.vue src test/unit test/e2e/specs",
  // node 执行build/build.js文件
  "build": "node build/build.js"
},
```
`Npm Script` 底层实现原理是通过调用 `Shell` 去运行脚本命令。`npm run start`等同于运行`npm run dev`。
`Npm Script` 还有一个重要的功能是能运行安装到项目目录里的 `node_modules` 里的可执行模块。
例如在通过命令`npm i -D webpack-dev-server`将`webpack-dev-server`安装到项目后，是无法直接在项目根目录下通过命令 `webpack-dev-server` 去执行 `webpack-dev-server` 构建的，而是要通过命令 `./node_modules/.bin/webpack-dev-server` 去执行。

`Npm Script` 能方便的解决这个问题，只需要在 `scripts` 字段里定义一个任务，例如：
```
"dev": "webpack-dev-server --inline --progress --config build/webpack.dev.conf.js"
```
`Npm Script` 会先去项目目录下的 `node_modules` 中寻找有没有可执行的 `webpack-dev-server` 文件，如果有就使用本地的，如果没有就使用全局的。 所以现在执行 `webpack-dev-server` 启动服务时只需要通过执行 `npm run dev` 去实现。
> 再来看下 npm run dev
 `webpack-dev-server` 其实是一个`node.js`的应用程序，它是通过`JavaScript`开发的。在命令行执行`npm run dev`命令等同于执行`node ./node_modules/webpack-dev-server/bin/webpack-dev-server.js --inline --progress --config build/webpack.dev.conf.js`。你可以试试。

更多`package.json`的配置项，可以查看[阮一峰老师的文章 package.json文件](http://javascript.ruanyifeng.com/nodejs/packagejson.html)

`npm run dev`指定了`build/webpack.dev.conf.js`配置去启动服务，那么我们来看下这个文件做了什么。

### `build/webpack.dev.conf.js`
这个文件主要做了几件事情：
1、引入各种依赖
2、

