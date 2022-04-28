import { Button } from "antd";
import { useState, useEffect } from "react";
import "./index.css";
const AutoTool = (props) => {
  const { handleChange } = props;
  //console.log(onClick, "Clicks");
  const [active, setActive] = useState([false, false]);
  useEffect(() => {
    handleChange(active, "auto_global");
  }, [active]);
  return (
    <div>
      <div className={"auto-button"}>
        <Button
          type={active[0] ? "primary" : "dashed"}
          onClick={() => {
            const cp = active.slice();
            cp[0] = !cp[0];
            setActive(cp);
          }}
        >
          亮度自适应调节
        </Button>
      </div>
      <div className={"auto-button"}>
        <Button
          type={active[1] ? "primary" : "dashed"}
          onClick={() => {
            const cp = active.slice();
            cp[1] = !cp[1];
            setActive(cp);
          }}
        >
          对比度自适应调节
        </Button>
      </div>
    </div>
  );
};
export default AutoTool;
