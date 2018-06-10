```
{
  "name": "analyse-vue-cli",
  "version": "1.0.0",
  "description": "analyse-vue-cli",
  "author": "轩辕Rowboat <lxchuan12@163.com>",
  "private": true,
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
    // eslint --ext 指定扩展名和相应的文件
    "lint": "eslint --ext .js,.vue src test/unit test/e2e/specs",
    // node 执行build/build.js文件
    "build": "node build/build.js"
  },
  // 生产环境依赖
  "dependencies": {
    "vue": "^2.5.2",
    "vue-router": "^3.0.1"
  },
  // 开发环境依赖
  "devDependencies": {
    "autoprefixer": "^7.1.2",
    "babel-core": "^6.22.1",
    "babel-eslint": "^8.2.1",
    "babel-helper-vue-jsx-merge-props": "^2.0.3",
    "babel-jest": "^21.0.2",
    "babel-loader": "^7.1.1",
    "babel-plugin-dynamic-import-node": "^1.2.0",
    "babel-plugin-syntax-jsx": "^6.18.0",
    "babel-plugin-transform-es2015-modules-commonjs": "^6.26.0",
    "babel-plugin-transform-runtime": "^6.22.0",
    "babel-plugin-transform-vue-jsx": "^3.5.0",
    "babel-preset-env": "^1.3.2",
    "babel-preset-stage-2": "^6.22.0",
    "babel-register": "^6.22.0",
    "chalk": "^2.0.1",
    "chromedriver": "^2.27.2",
    "copy-webpack-plugin": "^4.0.1",
    "cross-spawn": "^5.0.1",
    "css-loader": "^0.28.0",
    "eslint": "^4.15.0",
    "eslint-config-standard": "^10.2.1",
    "eslint-friendly-formatter": "^3.0.0",
    "eslint-loader": "^1.7.1",
    "eslint-plugin-import": "^2.7.0",
    "eslint-plugin-node": "^5.2.0",
    "eslint-plugin-promise": "^3.4.0",
    "eslint-plugin-standard": "^3.0.1",
    "eslint-plugin-vue": "^4.0.0",
    "extract-text-webpack-plugin": "^3.0.0",
    "file-loader": "^1.1.4",
    "friendly-errors-webpack-plugin": "^1.6.1",
    "html-webpack-plugin": "^2.30.1",
    "jest": "^22.0.4",
    "jest-serializer-vue": "^0.3.0",
    "nightwatch": "^0.9.12",
    // 系统通知的提示
    "node-notifier": "^5.1.2",
    "optimize-css-assets-webpack-plugin": "^3.2.0",
    "ora": "^1.2.0",
    "portfinder": "^1.0.13",
    "postcss-import": "^11.0.0",
    "postcss-loader": "^2.0.8",
    "postcss-url": "^7.2.1",
    // 删除文件和文件夹
    "rimraf": "^2.6.0",
    "selenium-server": "^3.0.1",
    "semver": "^5.3.0",
    "shelljs": "^0.7.6",
    "uglifyjs-webpack-plugin": "^1.1.1",
    "url-loader": "^0.5.8",
    "vue-jest": "^1.0.2",
    // 处理vue单文件的loader 中文文档：https://vue-loader-v14.vuejs.org/zh-cn/
    "vue-loader": "^13.3.0",
    // Vue单文件中的样式解析loader,类似于style-loader，使用vue-style-loader可以热更新，style-loader不能。
    "vue-style-loader": "^3.0.1",
    // 把 vue-loader 提取出的 HTML 模版编译成对应的可执行的 JavaScript 代码，这和 React 中的 JSX 语法被编译成 JavaScript 代码类似。预先编译好 HTML 模版相对于在浏览器中再去编译 HTML 模版的好处在于性能更好。
    "vue-template-compiler": "^2.5.2",
    "webpack": "^3.6.0",
    // 构建分析的插件
    "webpack-bundle-analyzer": "^2.9.0",
    "webpack-dev-server": "^2.9.1",
    "webpack-merge": "^4.1.0"
  },
  // 指定版本
  "engines": {
    "node": ">= 6.0.0",
    "npm": ">= 3.0.0"
  },
  // 浏览器列表
  "browserslist": [
    // 全球有超过1%的人使用的浏览器
    "> 1%",
    // 根据 http://caniuse.com 追踪的最后两个版本的所有浏览器
    "last 2 versions",
    // 不是IE8、IE7等浏览器
    "not ie <= 8"
  ]
}
```
