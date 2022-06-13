import { useState } from "react";
import { Menu, Button } from "antd";
import AutoTool from "./operation-tool/auto-tool";
import SelfTool from "./operation-tool/self-tool";
import CutTool from "./operation-tool/cut-tool";
const OperationBar = (props) => {
  const [module, setModule] = useState("auto");

  return (
    <div>
      <div>
        <Menu
          onClick={(e) => {
            setModule(e.key);
          }}
          selectedKeys={module}
          mode="horizontal"
        >
          <Menu.Item key={"auto"}>Auto</Menu.Item>
          <Menu.Item key={"open"}>Open-loop</Menu.Item>
          <Menu.Item key={"auto/host"}>auto/host</Menu.Item>
        </Menu>
      </div>
      <div>
        {module === "auto" ? (
          <AutoTool handleChange={props.handleChange} />
        ) : (
          <SelfTool {...props} />
        )}
      </div>
      <CutTool onClick={props.handleCut}></CutTool>
    </div>
  );
};
export default OperationBar;
