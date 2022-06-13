import { DownloadOutlined } from "@ant-design/icons";
import { Progress } from "antd";
import "./index.css";
const Down = (props) => {
  return (
    <div
      className={"down-box"}
      onClick={() => {
        console.log("down");
        props.onClick();
      }}
    >
      <div className={"down-text"}>Download the selected files</div>
      <DownloadOutlined style={{ fontSize: "24px", color: "#08c" }} />
      {props.percent ? <Progress percent={props.percent}></Progress> : null}
    </div>
  );
};
export default Down;
