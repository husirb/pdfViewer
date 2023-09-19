// 获取 gulp
const { series, watch } = require('gulp')
var del = require('del')

const fs = require('fs')
const { minify } = require('terser')

async function compileJs() {
  const dir = 'source/'
  const jsFiles = ['viewer', 'pdf', 'pdf.sandbox', 'pdf.worker']
  jsFiles.forEach(async fileName => {
    const viewerFile = fs.readFileSync(dir + fileName + '.js').toString()
    const options = {
      compress: {
        // V8 chokes on very long sequences, work around that.
        sequences: false
      },
      keep_classnames: true,
      keep_fnames: true
    }
    fs.writeFileSync(
      dir + fileName + '.min.js',
      (await minify(viewerFile, options)).code
    )
    // fs.unlinkSync(dir + '/viewer.js')
    fs.renameSync(dir + fileName + '.min.js', 'minjs/' + fileName + '.js')
  })
}

// 在命令行使用 gulp auto 启动此任务
function auto() {
  // 监听文件修改，当文件被修改则执行 script 任务
  return watch('source/*.js', ['compileJs'])
}

function clean() {
  return del(['minjs/**.js'])
}

exports.build = series(clean, compileJs)
exports.default = series(auto)
