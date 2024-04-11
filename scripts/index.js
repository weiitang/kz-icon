const fs = require('fs-extra');
const shell = require('shelljs');
const path = require('path');
const { transform } = require('@svgr/core');

const rootDir = path.resolve(__dirname, '..')
const srcDir = path.join(__dirname, '..', 'src');
const iconDir = path.join(rootDir, 'src', 'icon')
// /Users/tangwei/Documents/htdocs/icon/scripts

const creatDir = () => {
  if (!fs.existsSync(srcDir)) {
    fs.mkdirsSync(srcDir);
  } else if (!fs.existsSync(iconDir)) {
    fs.mkdirSync(iconDir)
  }
  fs.writeFileSync(path.join(iconDir, 'index.js'), 'test\n', 'utf-8');
}

const appendContent = () => {
  fs.appendFileSync(path.join(iconDir, 'index.js'), 'test1', 'utf-8');
}

const readSvgContent = async () => {
  const content = fs.readFileSync(path.join(srcDir, 'icon/index.js'))
  const svg = fs.readFileSync(path.join(srcDir, 'svg/add.svg'))

  const jsCode = await transform(
    svg,
    {
      icon: true,
      replaceAttrValues: {
        '#999999': 'currentColor',
      },
      exportType: 'named',
      namedExport: 'Add',
    },
    { componentName: 'Add' },
  );

  console.log('====', content, jsCode);
}

creatDir()
appendContent()
readSvgContent()
