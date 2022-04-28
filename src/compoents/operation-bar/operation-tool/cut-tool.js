import { Input, Button, Space, Cascader, Menu, InputNumber } from "antd";
import { useState } from "react";
import "./index.css";
const CutTool = (props) => {
  const [param, setParam] = useState([0, 0, 0, 0]);
  return (
    <div>
      <Menu selectedKeys={"cut"} mode="horizontal">
        <Menu.Item key="cut">裁剪</Menu.Item>
      </Menu>
      <Input.Group compact>
        <Input
          onChange={(e) => {
            const value = e.target.value;
            console.log(param, "pa");
            const copyAr = [...param];
            copyAr[0] = value;
            setParam(copyAr);
            console.log();
          }}
          style={{ width: "30%" }}
          addonBefore="x0,y0"
        />
        <Input
          onChange={(e) => {
            const value = e.target.value;
            const copyAr = [...param];
            copyAr[1] = value;
            setParam(copyAr);
            console.log();
          }}
          style={{ width: "15%" }}
        />
      </Input.Group>
      <Input.Group compact>
        <Input
          onChange={(e) => {
            const value = e.target.value;
            const copyAr = [...param];
            copyAr[2] = value;
            setParam(copyAr);
            console.log();
          }}
          style={{ width: "30%" }}
          addonBefore="x1,y1"
        />
        <Input
          onChange={(e) => {
            const value = e.target.value;
            const copyAr = [...param];
            copyAr[3] = value;
            setParam(copyAr);
            console.log();
          }}
          style={{ width: "15%" }}
        />
      </Input.Group>
      <Button
        type="primary"
        onClick={() => {
          console.log(param);
          props.onClick(param);
        }}
      >
        cut
      </Button>
      {/* <div className="cut_tool">
        <div className="tool_iput">
          <Input addonBefore="x0" size="small"></Input>
        </div>
        <div className="tool_iput">
          <Input addonBefore="x1" size="small"></Input>
        </div>
        <div className="tool_iput">
          <Input addonBefore="y0" size="small"></Input>
        </div>
        <div className="tool_iput">
          <Input addonBefore="y1" size="small"></Input>
        </div>
      </div> */}
    </div>
  );
};
export default CutTool;
