const Figma = require('figma-js');
const { ensureDir, writeFile } = require('fs-extra');
const axios = require('axios');
const path = require('path');
const dotenv = require('dotenv');
const { checkName } = require('./check');

dotenv.config();

// @todo: 这里需要配置化改造，暂时先写我的
const { FIGMA_TOKEN } = process.env;
const { FIGMA_FILE_ID } = process.env;

const client = Figma.Client({
  personalAccessToken: FIGMA_TOKEN,
});

client.file(FIGMA_FILE_ID)
  .then(({ data }) => {
    console.log('从Figma拉取文件');
    const components = {};

    function check(c) {
      if (c.type === 'COMPONENT') {
        const { name, id } = c;
        const { description = '', key } = data.components[c.id];
        const { width, height } = c.absoluteBoundingBox;

        components[id] = {
          name,
          id,
          key,
          file: FIGMA_FILE_ID,
          description,
          width,
          height,
        };
      } else if (c.children) {
        c.children.forEach(check);
      }
    }

    data.document.children.forEach(check);
    if (Object.values(components).length === 0) {
      throw Error('未获取到Figma组件');
    }
    console.log(`获取到${Object.values(components).length}个Figma组件`);

    checkName(components);

    return components;
  })
  .then((components) => {
    console.log('获取SVG资源的下载地址');
    return client.fileImages(
      FIGMA_FILE_ID,
      {
        format: 'svg',
        ids: Object.keys(components),
        scale: '1',
      },
    ).then(({ data }) => {
      Object.keys(data.images).forEach((id) => {
        // eslint-disable-next-line no-param-reassign
        components[id].image = data.images[id];
      });
      return components;
    });
  })
  .then((components) => {
    console.log('将拉Figma拉取到的信息保存为JSON');
    return ensureDir(path.join('./src/'))
      .then(() => writeFile(path.resolve('./src/', 'data.json'), JSON.stringify(components), 'utf8'))
      .then(() => components);
  })
  .then((components) => {
    console.log('正在下载SVG资源...');
    Object.keys(components).forEach((key) => {
      const { image, name } = components[key];
      axios.get(image, {
        headers: {
          'Content-Type': 'image/svg+xml',
        },
        responseEncoding: 'utf8',
      })
        .then(response => ensureDir(path.join('./src/', 'svg'))
          .then(() => writeFile(path.join('./src/', 'svg', `${name}.svg`), response.data, 'utf8')));
    });
    console.log('下载完成');
  })
  .catch((error) => {
    console.error(`从Figma拉取文件时发生错误: ${error}`);
    process.exit(1);
  });
