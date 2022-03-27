import "./index.css";
import { useRef, useEffect } from "react";
import {
  HomeOutlined,
  SettingFilled,
  SmileOutlined,
  SyncOutlined,
  LoadingOutlined,
  FolderAddOutlined,
} from "@ant-design/icons";
const FilesInput = (props) => {
  const filds = useRef();
  useEffect(() => {
    filds.current.webkitdirectory = true;
  }, [filds]);
  return (
    <div className="files-input">
      <input
        ref={filds}
        className="files-input-files"
        type="file"
        onChange={props.onChange}
        onDragOver={(e) => {
          //console.log(e)
          if (e.dataTransfer.items[0].type !== "") {
            filds.current.webkitdirectory = false;
          } else {
            filds.current.webkitdirectory = true;
          }
        }}
        onMouseEnter={() => {
          filds.current.webkitdirectory = true;
        }}
        multiple="multiple"
      ></input>
      <div className={"files-input-div"}>
        <div className={"files-input-div-icon"}>
          <FolderAddOutlined style={{ fontSize: "24px", color: "#08c" }} />
        </div>
        <p className={"files-input-div-p"}>Drag files here to add</p>
        <p className={"files-input-div-p"}>
          Or{" "}
          <a
            href={"#"}
            className={"files-input-div-a"}
            onClick={() => {
              filds.current.click();
            }}
          >
            choose your files
          </a>
        </p>
      </div>
    </div>
  );
};
export default FilesInput;
