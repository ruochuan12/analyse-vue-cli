# analyse-vue-cli
# 分析vue-cli@2.9.3 搭建的webpack项目工程
### 使用vue-cli初始化webpack工程
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
或者直接查看[vue-cli github仓库源码](https://github.com/vuejs/vue-cli/tree/master)
### package.json
分析一个项目，一般从`package.json`开始。先从`scripts`的命令开始。
```
// Npm Script 底层实现原理是通过调用 Shell 去运行脚本命令
"scripts": {
  // dev webpack-dev-server --config 指定配置文件
  "dev": "webpack-dev-server --inline --progress --config build/webpack.dev.conf.js",
  // npm run start等同于运行npm run dev
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
> webpack-dev-server
其实是一个`node.js`的应用程序，它是通过JavaScript开发的。在命令行执行`npm run dev`命令等同于执行`node ./node_modules/webpack-dev-server/bin/webpack-dev-server.js --inline --progress --config build/webpack.dev.conf.js`
webpack等其他命令也类似。

更多`package.json`的配置项，可以查看[阮一峰老师的文章 package.json文件](http://javascript.ruanyifeng.com/nodejs/packagejson.html)
