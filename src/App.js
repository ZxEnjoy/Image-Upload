import { useState, useRef, useEffect } from "react";
import {
  fileNameCut,
  createFileTree,
  downImg,
} from "./PhotoProcessingTool/filesTool";
import {
  equalization,
  equalizationS,
  RgbToHsv,
  HsvToRgb,
  tuenR,
  tuenS,
} from "./PhotoProcessingTool/tool";
import {
  readFile,
  showCanvas,
  initCanvas,
  brightness_adjustment,
  contrast_adjustment,
  cut_photo,
} from "./PhotoProcessingTool/canvas";
import "./index.css";
import "antd/dist/antd.css";
import FilesTree from "./compoents/files-tree/FilesTree";
import FilesInput from "./compoents/files-input/FilesInput";
import TopBar from "./compoents/top-bar/TopBar";
import OperationBar from "./compoents/operation-bar/OperationBar";
const adjust_rgb = () => {
  let time = undefined;
  return (newParam) => {
    if (time) {
      clearTimeout(time);
    }
    return (time = setTimeout(() => {
      console.log(newParam, "newParam");
    }, 2000));
  };
};
const time = adjust_rgb();
function App() {
  const canvas = useRef();
  const [filesrc, setsrc] = useState();
  const [files, setfiles] = useState([{ title: "root", key: "root" }]);
  const [imagesrc, setimagesrc] = useState();
  const [param, setParam] = useState([0, 1, 0]);
  const autoClick = [
    () => {
      const newImageSrc = brightness_adjustment(filesrc);
      newImageSrc.then((url) => {
        showCanvas(url, canvas.current);
      });
    },
    () => {
      const newImageSrc = contrast_adjustment(filesrc);
      newImageSrc.then((url) => {
        showCanvas(url, canvas.current);
      });
    },
  ];
  useEffect(() => {
    initCanvas(canvas.current, 600);
  }, [files]);
  useEffect(() => {
    if (filesrc) {
      setimagesrc(URL.createObjectURL(filesrc));
      readFile(filesrc, canvas.current);
    }
  }, [filesrc]);
  const handleChange = (value, index) => {
    const newParam = param.slice();
    newParam[index] = value;
    setParam(newParam);
    time(newParam);
  };
  return (
    <div>
      <TopBar></TopBar>
      <div className={"main-box"}>
        <canvas
          width="600"
          height="600"
          ref={canvas}
          className={"canvas"}
        ></canvas>
        <div className={"right-tool"}>
          <FilesInput
            onChange={(e) => {
              const reg = /image/;
              //console.log(e.target.files, "filssss");
              const photos = [];
              const newFiles = new DataTransfer();
              for (let i of e.target.files) {
                reg.test(i.type) &&
                  createFileTree(i.webkitRelativePath, photos, i) &&
                  newFiles.items.add(i);
              }
              e.target.files = newFiles.files;
              setfiles(photos);
            }}
          />
          <FilesTree
            treeData={files}
            updataTree={(tree) => {
              //console.log(tree, "tree");
              setfiles(tree);
            }}
            select={(filesrc) => {
              setsrc(filesrc);
            }}
          ></FilesTree>
          <OperationBar
            Clicks={autoClick}
            param={param}
            handleChange={handleChange}
          ></OperationBar>
        </div>
      </div>
    </div>
  );
}

export default App;
