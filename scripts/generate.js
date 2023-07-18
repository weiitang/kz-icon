const { transform } = require('@svgr/core');
const fs = require('fs-extra');
const upperCamelCase = require('uppercamelcase');
const path = require('path');


const rootDir = path.join(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const iconsDir = path.join(rootDir, 'src/icons');
const rnDir = path.join(rootDir, 'src/rn');

const parseName = name => ({
  name,
  componentName: upperCamelCase(name),
});

const getIcons = () => {
  const fs = require('fs-extra');
  const path = require('path');

  const folderPath = path.join('./src/', 'svg');
  const isFile = fileName => fs.lstatSync(fileName).isFile();

  const list = fs.readdirSync(folderPath).map(fileName => path.join(folderPath, fileName))
    .filter(isFile);

  const nameList = list.map(path => path.match(/svg\/(\S*).svg/)[1]);
  return nameList;
};

const generateIconsIndex = () => {
  if (!fs.existsSync(srcDir)) {
    fs.mkdirSync(srcDir);
    fs.mkdirSync(iconsDir);
    fs.mkdirSync(rnDir);
  } else if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir);
    fs.mkdirSync(rnDir);
  }

  const initialTypeDefinitions = `/// <reference types="react" />
    import { ComponentType, SVGAttributes } from 'react';

    interface Props extends SVGAttributes<SVGElement> {
      className?: string;
      fill?: string;
      stroke?: string;
      strokeWith?: number;
      width?: string | number;
      height?: string | number;
    }

    type Icon = ComponentType<Props>;
    `;

  fs.writeFileSync(path.join(srcDir, 'index.js'), '', 'utf-8');
  fs.writeFileSync(
    path.join(srcDir, 'index.d.ts'),
    initialTypeDefinitions,
    'utf-8',
  );
  fs.writeFileSync(path.join(srcDir, 'rn.js'), '', 'utf-8');
  fs.writeFileSync(
    path.join(srcDir, 'rn.d.ts'),
    initialTypeDefinitions,
    'utf-8',
  );
};

const generateIconCode = async ({ name }) => {
  const names = parseName(name);
  const location = path.join(rootDir, 'src/svg', `${names.name}.svg`);
  const destination = path.join(rootDir, 'src/icons', `${names.name}.js`);
  const destinationRN = path.join(rootDir, 'src/rn', `${names.name}.js`);
  const svgCode = fs.readFileSync(location);
  const ComponentName = `${names.componentName}Icon`;
  const jsCode = await transform(
    svgCode,
    {
      icon: true,
      replaceAttrValues: {
        '#999999': 'currentColor',
      },
      exportType: 'named',
      namedExport: ComponentName,
    },
    { componentName: ComponentName },
  );

  const styleSvgCode = await transform(svgCode, {
    plugins: ['@svgr/plugin-svgo'],
    svgo: true,
    svgoConfig: {
      plugins: [
        {
          name: 'addAttributesToSVGElement',
          params: {
            attributes: [
              {
                color: 'rgba(0, 0, 0, 0.9)',
              },
            ],
          },
        },
      ],
    },
  });

  const rnCode = await transform(
    styleSvgCode,
    {
      replaceAttrValues: {
        '#999999': 'currentColor',
      },
      native: true,
      exportType: 'named',
      namedExport: ComponentName,
    },
    { componentName: ComponentName },
  );

  const componentCode = `${jsCode}\n` + `export default ${ComponentName};`;
  const rnComponentCode = `${rnCode}\n` + `export default ${ComponentName};`;

  fs.writeFileSync(destination, componentCode, 'utf-8');
  fs.writeFileSync(destinationRN, rnComponentCode, 'utf-8');

  return { ComponentName, name: names.name };
};

const appendToIconsIndex = ({ ComponentName, name }) => {
  const exportString = `export { ${ComponentName} } from './icons/${name}';\r\n`;
  fs.appendFileSync(
    path.join(srcDir, 'index.js'),
    exportString,
    'utf-8',
  );
  const exportStringRn = `export { ${ComponentName} } from './rn/${name}';\r\n`;
  fs.appendFileSync(
    path.join(srcDir, 'rn.js'),
    exportStringRn,
    'utf-8',
  );
  const exportTypeString = `export const ${ComponentName}: Icon;\n`;
  fs.appendFileSync(
    path.join(srcDir, 'index.d.ts'),
    exportTypeString,
    'utf-8',
  );
  const exportTypeStringRn = `export const ${ComponentName}: Icon;\n`;
  fs.appendFileSync(
    path.join(srcDir, 'rn.d.ts'),
    exportTypeStringRn,
    'utf-8',
  );
};

generateIconsIndex();

const icons = getIcons();

icons.forEach((name) => {
  generateIconCode({ name })
    .then(({ ComponentName, name }) => {
      appendToIconsIndex({ ComponentName, name });
    });
});
