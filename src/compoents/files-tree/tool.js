const copyTree = (tree) => {
  const newTree = [];
  for (let i = 0; i < tree.length; i++) {
    const newChildren = tree[i].children && copyTree(tree[i].children);
    if (newChildren) {
      const newNode = { ...tree[i], children: newChildren };
      newTree.push(newNode);
    } else {
      const newNode = { ...tree[i] };
      newTree.push(newNode);
    }
  }
  return newTree;
};
const keyCut = (path) => {
  let tep = "",
    res = [];
  for (let i = 0; i < path.length; i++) {
    if (path[i] !== "-") {
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
};
const getBykey = (tree, key) => {
  const keyArr = keyCut(key);
  let node = tree;
  for (let i = 0; i < keyArr.length - 1; i++) {
    //console.log(node[Number(keyArr[i])], "tree[i]", i, tree, keyArr);
    node = node[Number(keyArr[i])].children;
  }
  return node[Number(keyArr[keyArr.length - 1])];
};
const updataKey = (tree, key) => {
  tree.key = key;
  if (tree.children !== undefined) {
    tree.children.forEach((i, index) => {
      updataKey(i, key + index);
    });
  }
  return tree;
};
const deleteNode = (tree, node) => {
  console.log("del", tree, node);
  return tree.children.filter((i) => {
    return i.key !== node.key;
  });
};
const getFatherNode = (tree, nodeKey) => {
  console.log(nodeKey.slice(0, nodeKey.lastIndexOf("-")), nodeKey, "node key ");
  return getBykey(tree, nodeKey.slice(0, nodeKey.lastIndexOf("-")));
};
const insert = (tree, insertKey, targetKey) => {
  const newTree = copyTree(tree);
  const inserP = getBykey(
    newTree,
    insertKey.slice(0, insertKey.lastIndexOf("-"))
  );
  const inserNode = getBykey(newTree, insertKey);
  let targetNode = getBykey(newTree, targetKey);
  if (!targetNode.children) {
    targetNode = getFatherNode(newTree, targetKey);
  }
  console.log(inserNode, targetNode, "in tg", insertKey, targetKey);
  targetNode.children.push(
    updataKey(inserNode, targetNode.key + "-" + targetNode.children.length)
  );
  console.log(inserP, inserNode, "p is");
  inserP.children = deleteNode(inserP, inserNode);
  console.log(deleteNode(inserP, inserNode), "insp");
  console.log(newTree, "inside");
  return newTree;
};
export { insert ,getBykey};
