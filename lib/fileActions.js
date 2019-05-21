const { logger, parseContent } = require('../utils')
const glob = require('glob')
const path = require('path')
const fs = require('fs-extra')

module.exports = class FileActions {
  constructor(opts = {}) {
    this.opts = Object.assign({}, opts)

    this.templates = glob.sync(path.join(this.opts.templatesDir, '**'), {
      nodir: true,
      dot: true
    })
  }

  create() {
    this.templates.forEach(filepath => {
      const fileName = path.relative(this.opts.templatesDir, filepath)
      const target = path.join(this.opts.outDir, fileName)
      const content = parseContent(fs.readFileSync(filepath, 'utf8'), this.opts.componentName)

      fs.outputFileSync(target, content)

      logger.fileAction('magenta', 'Created', path.relative(process.cwd(), target))
    })
  }

  move(opts = {
    patterns: {}
  }) {
    Object.keys(opts.patterns).forEach(pattern => {
      const files = glob.sync(pattern, {
        cwd: this.opts.outDir,
        absolute: true
      })

      const from = files[0]
      const to = path.join(this.opts.outDir, opts.patterns[pattern])
      fs.moveSync(from, to, {
        overwrite: true
      })

      logger.fileMoveAction(from, to)
    })
  }

  upgrade(extraFiles = []) {
    const filesFromCli = this.opts.argv.get('files') || ''

    const files = [
      '.grenrc.js',
      '.prettierrc',
      '.travis.yml',
      'build.sh',
      'notify.sh'
    ].concat(extraFiles, filesFromCli.split(','))

    const upgradeFiles = glob.sync(
      `*(${files.join('|')})`,
      {
        cwd: this.opts.templatesDir,
        nodir: true,
        dot: true,
        absolute: true
      }
    )

    upgradeFiles.forEach(filepath => {
      const fileName = path.relative(this.opts.templatesDir, filepath)
      const target = path.join(process.cwd(), fileName)
      const content = parseContent(fs.readFileSync(filepath, 'utf8'), this.opts.componentName)

      fs.outputFileSync(target, content)

      logger.fileAction('yellow', 'Upgraded', path.relative(process.cwd(), target))
    })

    fs.chmodSync(path.join(process.cwd(), 'build.sh'), '755')
    fs.chmodSync(path.join(process.cwd(), 'notify.sh'), '755')

    upgradePackageJson({
      pkg: this.opts.pkg,
      source: fs.readFileSync(path.join(this.opts.templatesDir, 'package-json'), 'utf8'),
      componentName: this.opts.componentName
    })
  }
}

function upgradePackageJson({ pkg, source, componentName }) {
  const properties = ['scripts', 'devDependencies']
  const cliVersion = require('../package.json').version

  const templatePkg = JSON.parse(parseContent(source, componentName))
  const currentPkg = pkg

  properties.forEach(key => {
    currentPkg[key] = Object.assign(pkg[key], templatePkg[key])
  })

  currentPkg['vue-sfc-cli'] = cliVersion

  fs.outputJSONSync(path.join(process.cwd(), 'package.json'), currentPkg, {
    spaces: 2
  })

  logger.fileAction('yellow', 'Upgraded', 'package.json')
}
