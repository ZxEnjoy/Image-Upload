import { Tree } from "antd";
import { insert, getBykey } from "./tool";
const { DirectoryTree } = Tree;

const FilesTree = (props) => {
  const { treeData, updataTree, select, handleChecked } = props;
  console.log(treeData, "treeData");
  const onSelect = (selectedKeys, info) => {
    if (!info.node.children) {
      //select(info.node.src);
      info.node.img.then((node) => {
        console.log(node, "onselect");
        select(node);
      });
    }
    //console.log(info.node.src, "info.node.src");
  };

  const onCheck = (checkedKeys, info) => {
    console.log(info, "chekcsss");
    if (info.node.img) {
      info.node.img.then((node) => {
        handleChecked(
          info.node.src ? node : undefined,
          info.checked,
          info.checkedNodes
        );
      });
    } else {
      handleChecked(
        info.node.src ?? undefined,
        info.checked,
        info.checkedNodes
      );
    }
  };
  const handle = (info) => {
    console.log(info, "info");
    const newTree = insert(props.treeData, info.dragNode.key, info.node.key);
    //console.log(newTree, "newTree");
    updataTree(newTree);
    // let dragNode = getBykey(props.treeData, info.dragNode.key);
    // if (!dragNode.children) {
    //   dragNode = getFatherNode(props.treeData, dragNode.key);
    // }
    // const nowNode = getBykey(props.treeData, info.node.key);
    // deleteNode()
  };
  return (
    <DirectoryTree
      checkable
      multiple
      draggable
      //defaultExpandedKeys={["0-0-0", "0-0-1"]}
      //defaultSelectedKeys={["0-0-0", "0-0-1"]}
      //defaultCheckedKeys={["0-0-0", "0-0-1"]}
      onSelect={onSelect}
      onCheck={onCheck}
      onDrop={handle}
      height={300}
      //onDragEnter={handle}
      treeData={treeData}
    />
  );
};

export default FilesTree;
