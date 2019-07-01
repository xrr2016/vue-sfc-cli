# Vue-sfc-cli

![](https://cdn.nlark.com/yuque/0/2019/svg/224563/1561711258691-65453c43-3c1f-4e5a-bed7-5599fcad01e3.svg#align=left&display=inline&height=20&originHeight=20&originWidth=90&size=0&status=done&width=90) [![](https://img.shields.io/npm/dm/vue-sfc-cli.svg#align=left&display=inline&height=20&originHeight=20&originWidth=140&status=done&width=140)](https://www.npmjs.com/package/vue-sfc-cli) [![](https://img.shields.io/npm/v/vue-sfc-cli.svg#align=left&display=inline&height=20&originHeight=20&originWidth=88&status=done&width=88)](https://www.npmjs.com/package/vue-sfc-cli) ![](https://img.shields.io/npm/l/vue-sfc-cli.svg#align=left&display=inline&height=20&originHeight=20&originWidth=76&status=done&width=76) [![](https://img.shields.io/badge/%F0%9F%A4%96-release%20notes-00B2EE.svg#align=left&display=inline&height=20&originHeight=20&originWidth=104&status=done&width=104)](https://github-tools.github.io/github-release-notes/)

vue-sfc-cli exists to provide the minimal setup necessary to compile a Vue Single File Component (SFC) into a form ready to share via npm.<br />[for detail look at this article](https://github.com/levy9527/blog/issues/2)

<a name="requirement"></a>
## requirement

Node.js 8.x

<a name="Usage"></a>
## Usage

```bash
npx vue-sfc-cli
# 接下来会有一串的提示，请务必填写
# 推荐kebab-case风格，小写字母，多个单词用-（dash）分隔，如my-component
# 填充完提示后
cd my-component
# to use precommit hook
git init
# install dependencies
yarn
# develop your sfc
yarn dev
# build your sfc
yarn build
# Ready to publish!
```

<a name="1056e4ed"></a>
## Cli options

<a name="dd3e81bf"></a>
### `--test`
generating component template for test

<a name="013c1021"></a>
### `-u, --upgrade`
update basic config of current project 

<a name="1eb9cefe"></a>
### `--files`

- Type: `string`

  update files

```sh
npx vue-sfc-cli --upgrade --files package.json
```

<a name="Notice"></a>
## Notice
It is not recommended to build components under Windows, because `.sh`  may not have execute permissions.

<a name="docs"></a>
## docs

You can write *.md files host in `docs/` as code example.<br />When you run `yarn dev` these markdown files will become live demos.<br />Every time you add a new _.md file, you should re-run `yarn dev` to load new _.md file.

<a name="dotenv"></a>
## dotenv

You might wanna use environment variable while development.<br />According to best practice, encourage using `dotenv` to config environment variable.

```sh
yarn add dotenv --dev
```

```javascript
// styleguide.config.js
const webpack = require('webpack')
const dotenv = require('dotenv')
module.exports = {
  webpackConfig: {
    // ...
    plugins: [
      new webpack.DefinePlugin({
        'process.env': JSON.stringify(dotenv.config().parsed)
      })
    ]
  }
}
```

<a name="12dad30a"></a>
## Working with 3rd-party library

e.g. [Element-UI](https://element.eleme.io)<br />Install element-ui:

```console
yarn add element-ui
```

In your `styleguide/element.js`

```javascript
import Vue from 'vue'
import Elm from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
 Vue.use(Elm)
```

In your `styleguide.config.js`

```javascript
module.exports = {
  // ...
  require: [
    './styleguide/element.js'
  ]
}
```

<a name="0d7d148c"></a>
## prettier and precommit hook

the generated scaffold use husky as tool for precommit hook, but it require you has `git init` first, that's why `git init` running before<br />`yarn`
