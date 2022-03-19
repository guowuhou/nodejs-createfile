const files = require.context('./', true, /\.js/)

let routerList = []

files.keys().forEach((key) => {
  // 回单管理report暂时没不需要，后续视情况删除
  if (key === './index.js' || key === './report.js') return
  // item(key).default 获取文件内容
  routerList = routerList.concat(files(key).default)
})

export default routerList