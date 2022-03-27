import { Button } from "antd";
import "./index.css";
const AutoTool = (props) => {
  const { onClick } = props;
  //console.log(onClick, "Clicks");
  return (
    <div>
      <div className={"auto-button"}>
        <Button type="dashed" onClick={onClick[0]}>
          self
        </Button>
      </div>
      <div className={"auto-button"}>
        <Button type="primary" onClick={onClick[1]}>
          self
        </Button>
      </div>
    </div>
  );
};
export default AutoTool;
