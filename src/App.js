import { useState, useRef, useEffect, useContext } from "react";
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
  global_brightness_adjustment,
} from "./PhotoProcessingTool/tool";
import {
  readFile,
  showCanvas,
  initCanvas,
  brightness_adjustment,
  contrast_adjustment,
  cut_photo,
  tepshowCanvas,
  globalBrightness_adjustment,
  globalBrightnessAndSaturation_adjustment,
  globalSaturation_adjustment,
} from "./PhotoProcessingTool/canvas";
import "./index.css";
import "antd/dist/antd.css";
import FilesTree from "./compoents/files-tree/FilesTree";
import FilesInput from "./compoents/files-input/FilesInput";
import TopBar from "./compoents/top-bar/TopBar";
import OperationBar from "./compoents/operation-bar/OperationBar";
// const adjust_rgb = () => {
//   let time = undefined;
//   return (newParam) => {
//     if (time) {
//       clearTimeout(time);
//     }
//     return (time = setTimeout(() => {
//       console.log(newParam, "newParam");
//     }, 2000));
//   };
// };
// const time = adjust_rgb();
const checkList = [],
  param = {
    type: "auto_global",
    value: [false, false],
    active: false,
  };
function App() {
  const canvas = useRef();
  const [filesrc, setsrc] = useState();
  const [files, setfiles] = useState([{ title: "root", key: "root" }]);
  const RenderPhoto = (param) => {
    const value = param.value;
    switch (param.type) {
      case "auto_global":
        (value[0] && value[1] && photoFn.brightnessAndContrast()) ||
          (value[0] && photoFn.brightness()) ||
          (value[1] && photoFn.contrast());
        break;
      case "RGB":
        photoFn.rgb();
        break;
      case "auto_equalization":
        (value[0] && value[1] && photoFn.brightnessAndContrast()) ||
          (value[0] && photoFn.brightness()) ||
          (value[1] && photoFn.contrast());
        break;
      default:
        console.log(value, param.type);
    }
  };
  const photoFn = {
    brightness: () => {
      //const newImageSrc = brightness_adjustment(filesrc);
      const newImageSrc = globalBrightness_adjustment(filesrc);
      newImageSrc.then((url) => {
        showCanvas(url, canvas.current);
      });
    },
    contrast: () => {
      //const newImageSrc = contrast_adjustment(filesrc);
      const newImageSrc = globalSaturation_adjustment(filesrc);
      newImageSrc.then((url) => {
        showCanvas(url, canvas.current);
      });
    },
    cut: (xy) => {
      const newImageSrc = cut_photo(filesrc, ...xy);
      newImageSrc.then(({ url, size }) => {
        tepshowCanvas(url, canvas.current, xy, size);
        downImg(url, "cut");
      });
    },
    brightnessAndContrast: () => {},
    rgb: () => {},
  };
  useEffect(() => {
    initCanvas(canvas.current, 600);
  }, [files]);
  useEffect(() => {
    if (filesrc) {
      param.value[0] || param.value[1]
        ? RenderPhoto(param)
        : readFile(filesrc, canvas.current);
    }
  }, [filesrc]);
  const handleChange = (value, type) => {
    param.value = value;
    param.type = type;
  };
  const handleChecked = (src, hasChecked) => {
    param.active = hasChecked;
    src === filesrc && !hasChecked
      ? readFile(filesrc, canvas.current)
      : RenderPhoto(param);
    //console.log(src, hasChecked, "chek");
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
            handleChecked={handleChecked}
          ></FilesTree>
          <OperationBar handleChange={handleChange}></OperationBar>
        </div>
      </div>
    </div>
  );
}

export default App;
