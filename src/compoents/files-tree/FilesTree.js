import { Tree } from "antd";
import { insert, getBykey } from "./tool";
const { DirectoryTree } = Tree;

const FilesTree = (props) => {
  const { treeData, updataTree, select, handleChecked } = props;
  console.log(treeData, "treeData");
  const onSelect = (selectedKeys, info) => {
    if (!info.node.children) {
      select(info.node.src);
    }
    //console.log(info.node.src, "info.node.src");
  };

  const onCheck = (checkedKeys, info) => {
    console.log("onCheck", checkedKeys, info);
    handleChecked(info.node.src ?? undefined, info.checked);
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
      //onDragEnter={handle}
      treeData={treeData}
    />
  );
};

export default FilesTree;
