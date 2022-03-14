function fileNameCut(path) {
  let tep = "",
    res = [];
  for (let i = 0; i < path.length; i++) {
    if (path[i] !== "/") {
      tep += path[i];
    } else {
      res.push(tep);
      tep = "";
    }
    if (i === path.length - 1) {
      res.push(tep);
    }
  }
  return res;
}
const creatNode = (filePathArr, dep, treeLayer, prekey, isFolder, src) => {
  console.log(prekey, "rekkk");
  if (prekey.length !== 0) prekey += "-";
  if (isFolder === true) {
    return {
      title: filePathArr[dep],
      key: prekey + treeLayer.length,
      children: [],
    };
  } else {
    return {
      title: filePathArr[dep],
      key: prekey + treeLayer.length,
      src: src,
    };
  }
};
const find = (arr, getOne) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].title === getOne) {
      return arr[i];
    }
  }
  return false;
};
const createFileTree = (filePath, tree, src) => {
  const filePathArr = fileNameCut(filePath);
  let treeLayer = tree,
    prekey = "";
  for (let i = 0; i < filePathArr.length; i++) {
    const tep = find(treeLayer, filePathArr[i]);
    if (tep) {
      prekey = tep.key;
      treeLayer = tep.children;
    } else {
      const newnode = creatNode(
        filePathArr,
        i,
        treeLayer,
        prekey,
        i === filePathArr.length - 1 ? false : true,
        src
      );
      prekey += "-" + treeLayer.length;
      treeLayer.push(newnode);
      treeLayer = newnode.children;
    }
  }
};

export { fileNameCut, createFileTree };
