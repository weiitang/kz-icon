// 检查组件名称
const checkName = (components) => {
  const nameArray = [];
  const duplicatesNameArray = [];
  const errorNameArray = [];
  Object.keys(components).forEach((key) => {
    if (nameArray.indexOf(components[key].name) !== -1) {
      duplicatesNameArray.push(components[key].name);
    } else {
      nameArray.push(components[key].name);
    }
    if (!(/^[a-z-]*$/g.test(components[key].name))) {
      errorNameArray.push(components[key].name);
    }
  });

  if (duplicatesNameArray.length > 0) {
    throw new Error(`
            检查到存在重复名称的组件：${duplicatesNameArray.join(',')}
            检查到不符合命名规范的组件：${errorNameArray.join(',')}
        `);
  }
};

module.exports = {
  checkName,
};
