'use strict'
// 控制台输入样式 chalk 更多查看：https://github.com/chalk/chalk
const chalk = require('chalk')
// 语义化控制版本的插件 更多查看：https://github.com/npm/node-semver
const semver = require('semver')
// package.json配置
const packageConfig = require('../package.json')
// shell 脚本 Unix shell commands for Node.js 更多查看：https://github.com/shelljs/shelljs
const shell = require('shelljs')

function exec (cmd) {
  return require('child_process').execSync(cmd).toString().trim()
}

const versionRequirements = [
  {
    name: 'node',
    currentVersion: semver.clean(process.version),
    // 这里配置是"node": ">= 6.0.0",
    versionRequirement: packageConfig.engines.node
  }
]
// 需要使用npm
if (shell.which('npm')) {
  versionRequirements.push({
    name: 'npm',
    currentVersion: exec('npm --version'),
    // 这里配置是"npm": ">= 3.0.0"
    versionRequirement: packageConfig.engines.npm
  })
}
// 导出一个检查版本的函数
module.exports = function () {
  const warnings = []

  for (let i = 0; i < versionRequirements.length; i++) {
    const mod = versionRequirements[i]

    // 当前版本不大于所需版本
    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
      warnings.push(mod.name + ': ' +
        chalk.red(mod.currentVersion) + ' should be ' +
        chalk.green(mod.versionRequirement)
      )
    }
  }

  // 如果有警告，全部输出到控制台
  if (warnings.length) {
    console.log('')
    console.log(chalk.yellow('To use this template, you must update following to modules:'))
    console.log()

    for (let i = 0; i < warnings.length; i++) {
      const warning = warnings[i]
      console.log('  ' + warning)
    }

    console.log()
    process.exit(1)
  }
}
