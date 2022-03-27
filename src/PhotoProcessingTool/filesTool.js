import { FileImageOutlined, StarFilled, StarTwoTone } from "@ant-design/icons";
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
  //console.log(prekey, "rekkk");
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
      icon: <FileImageOutlined />,
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
      const line = prekey.length === 0 ? "" : "-";
      prekey += line + treeLayer.length;
      treeLayer.push(newnode);
      treeLayer = newnode.children;
    }
  }
  // const treeSort = (a, b) => {
  //   if (a.children || b.children) {
  //     if (a.children && b.children) {
  //       a.children.sort(treeSort);
  //       b.children.sort(treeSort);
  //       return a.title > b.title ? 1 : -1;
  //     } else {
  //       return a.children
  //         ? a.children.sort(treeSort) && -1
  //         : b.children.sort(treeSort) && 1;
  //     }
  //   } else {
  //     return a.title > b.title ? 1 : -1;
  //   }
  // };
  // if (tree.length <= 1) {
  //   tree[0].children.sort(treeSort);
  // }
  // tree.sort(treeSort);
};
const downImg = (src, newName) => {
  const changeName = (uri, newName = "is") => {
    let link = document.createElement("a");
    link.setAttribute("download", newName + ".jpg");
    link.setAttribute("href", uri);
    link.click();
  };
  const downSrc = src.replace(
    /^data:image\/[^;]/,
    "data:application/octet-stream"
  );
  changeName(downSrc, newName);
  //window.open(downSrc);
};
export { fileNameCut, createFileTree, downImg };
