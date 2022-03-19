const templateObj = require('./template')
const path = require('path')
const fs = require('fs')
// chalk要安装4.0版本的
const chalk = require('chalk')
const reslove = (file) => path.resolve(__dirname, '../', file)
// 获取文件路径
const RouterSymbol = reslove('./config/modules')
const ViewsSymbol = reslove('./views')
const apiSymbol = reslove('./api')

// 打印函数封装
const errorLog = error => console.log(chalk.red(`${error}`))
const defaultLog = log => console.log(chalk.green(`${log}`))
// const errorLog = (error) => console.log(error)
// const defaultLog = (log) => console.log(log)

/**
 * 生成文件函数
 * @param {*} filePath 文件路径
 * @param {*} content 文件内容
 * @param {*} dirPath 文件夹路径
 */
const generateFile = async (filePath, content, filePathList = []) => {
  try {
    // 判断一级是否存在
    if (filePathList.length && !(await fs.existsSync(filePathList[0]))) {
      await fs.mkdirSync(filePathList[0])
      defaultLog(`created ${filePathList[0]}`)
    }
    // 判断二级是否存在
    if (filePathList.length && !(await fs.existsSync(filePathList[1]))) {
      await fs.mkdirSync(filePathList[1])
      defaultLog(`created ${filePathList[1]}`)
    }
    // 创建文件
    if (!(await fs.existsSync(filePath))) {
      // create file
      await fs.openSync(filePath, 'w+')
      defaultLog(`created ${filePath}`)
      // 不存在的才全部重新写入文件
      await fs.writeFileSync(filePath, content, 'utf8')
    } else {
      defaultLog(`该${filePath}文件已经存在`)
    }
    // await fs.writeFileSync(filePath, content, 'utf8')
  } catch (error) {
    errorLog(error)
  }
}

// map存储要创建的文件信息
const generates = new Map([
  [
    'view',
    async (module) => {
      let moduleStr = module
      const moduleList = moduleStr.split('/')
      // 一级菜单名称
      const filePath1 = path.join(ViewsSymbol, moduleList[0])
      // 二级菜单名称
      const filePath2 = path.join(filePath1, moduleList[1])
      // 菜单层级列表
      const filePathList = [filePath1, filePath2]
      // 文件名称,因为输入了回车按钮会生成\r导致生成文件失败，所以需要replace掉\r
      let fileName = moduleList[2] ? `/${moduleList[2].replace('\r', '')}.vue` : `/Index.vue`
      const vuePath = path.join(filePath2, fileName)
      await generateFile(vuePath, templateObj.vueFile(moduleList[1]), filePathList)
    }
  ],
  [
    'router',
    async (module) => {
      // 路由的文件名取的是一级菜单的名称
      let moduleStr = module
      const moduleList = moduleStr.split('/')
      const routerPath = path.join(RouterSymbol, `/${moduleList[0]}.js`)
      await generateFile(routerPath, templateObj.routerFile(moduleList[0]))
    }
  ],
  [
    'api',
    async (module) => {
      // api接口的文件名取的是二级菜单的名称
      let moduleStr = module
      const moduleList = moduleStr.split('/')
      const apiPath = path.join(apiSymbol, `/${moduleList[1]}.js`)
      await generateFile(apiPath, templateObj.apiFile(module))
    }
  ]
])
defaultLog(`请输入模块名称(英文)：`)

// 创建视图、路由和api三个文件
const files = ['view', 'router', 'api']

// 监听输入内容
process.stdin.on('data', (chunk) => {
  try {
    chunk = chunk.slice(0, -1) // 删除尾部多余换行符
    defaultLog(`new module name is ${chunk}`)
    // 输入文件的命令校验
    if (chunk.toString().indexOf('/') < 0) {
      defaultLog(`请输入正确的文件创建命令，即：'一级菜单/二级菜单/业务首页文件名'。如: 'templates/template/Index'`)
      process.stdin.emit('end', '创建不成功')
    }
    const promises = files.reduce(
      (promise, file) => promise.then(() => generates.get(`${file}`)(chunk.toString())),
      Promise.resolve()
    )
    promises.then(() => {
      process.stdin.emit('end')
    })
  } catch (error) {
    errorLog(error)
  }
})

// 生成结束，退出流程
process.stdin.on('end', (msg) => {
  defaultLog(msg || 'create module success')
  process.exit(0)
})