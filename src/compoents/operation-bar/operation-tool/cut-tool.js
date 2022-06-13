import { Input, Button, Space, Cascader, Menu, InputNumber } from "antd";
import { useState } from "react";
import "./index.css";
const CutTool = (props) => {
  const [param, setParam] = useState([]);
  const [active, setActive] = useState(false);
  return (
    <div className={"tool-cut"}>
      <div className={"auto-button"}>
        <Button
          type={active ? "primary" : "dashed"}
          onClick={() => {
            if (active) {
              props.onClick([]);
            }
            setActive(!active);
          }}
        >
          裁剪
        </Button>
      </div>

      {active ? (
        <>
          <Input
            onChange={(e) => {
              const value = e.target.value;
              //console.log(param, "pa");
              const copyAr = [...param];
              copyAr[0] = value;
              setParam(copyAr);
              props.onClick(copyAr);
              //console.log();
            }}
            style={{ width: "100%" }}
            addonBefore="宽"
          />
          <Input
            onChange={(e) => {
              const value = e.target.value;
              const copyAr = [...param];
              copyAr[1] = value;
              setParam(copyAr);
              props.onClick(copyAr);
              //console.log();
            }}
            style={{ width: "100%" }}
            addonBefore="高"
          />
          {/* <Input
            onChange={(e) => {
              const value = e.target.value;
              const copyAr = [...param];
              copyAr[2] = value;
              setParam(copyAr);
              props.onClick(copyAr);
              console.log();
            }}
            style={{ width: "100%" }}
            addonBefore="x1"
          /> */}
          {/* <Input
            onChange={(e) => {
              const value = e.target.value;
              const copyAr = [...param];
              copyAr[3] = value;
              setParam(copyAr);
              props.onClick(copyAr);
              console.log();
            }}
            style={{ width: "100%" }}
            addonBefore="y1"
          /> */}
        </>
      ) : null}
    </div>
  );
};
export default CutTool;
