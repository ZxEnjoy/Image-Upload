import { useState } from "react";
import { Menu, Button } from "antd";
import AutoTool from "./operation-tool/auto-tool";
import SelfTool from "./operation-tool/self-tool";
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
        </Menu>
      </div>
      <div>
        {module === "auto" ? (
          <AutoTool onClick={props.Clicks} />
        ) : (
          <SelfTool {...props} />
        )}
      </div>
    </div>
  );
};
export default OperationBar;
