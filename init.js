#! /usr/bin/env node

const { logger, kebabcasify } = require('./utils')
const FileActions = require('./lib/fileActions')
const parseArgs = require('./lib/parseArgs')
const kleur = require('kleur')
const path = require('path')
const readline = require('readline-sync')
const fs = require('fs-extra')

const argv = parseArgs(process.argv.slice(2))

let pkg = {}
/**
 * Prompt user for input to populate template files
 */
let npmName
let ownerName
const OWNER_NAME = 'femessage'

function isUpgrade() {
  return argv.has('u') || argv.has('upgrade')
}

if (isUpgrade()) {
  try {
    pkg = require(path.join(process.cwd(), 'package.json'))
    npmName = pkg.name.replace(/^@[\w-]*\//, '')
    ownerName = pkg.name.replace(/^@([\w-]*)\/[\w-]*/, '$1')
  } catch {}
}

if (argv.has('test')) {
  npmName = 'v-test'
  ownerName = OWNER_NAME
}

const promptAngle = kleur.dim('> ')
if (!npmName) {
  console.log(
    'The component name:'
  )
  npmName = readline.prompt({
    prompt: promptAngle
  })
}
if (!ownerName) {
  console.log(
    `The owner: ${kleur.dim(`(${OWNER_NAME})`)}`
  )
  ownerName = readline.prompt({
    prompt: promptAngle,
    defaultInput: OWNER_NAME
  })
}

const componentName = kebabcasify(npmName)
const outDir = path.join(process.cwd(), componentName)

const fileActions = new FileActions({
  argv,
  pkg,
  componentName,
  ownerName,
  outDir,
  templatesDir: path.join(__dirname, 'templates')
})

if (!isUpgrade()) {
  fileActions.create()

  fileActions.move({
    patterns: {
      gitignore: '.gitignore',
      'package-json': 'package.json',
      'src/component.vue': `src/${componentName}.vue`
    }
  })

  fs.chmodSync(path.join(outDir, 'build.sh'), '755')
  fs.chmodSync(path.join(outDir, 'notify.sh'), '755')

  logger.success(`Generated into ${kleur.underline(outDir)}`)
}

if (isUpgrade()) {
  fileActions.upgrade()
}
