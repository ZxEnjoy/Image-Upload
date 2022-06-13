import { useState, useRef, useEffect, useContext } from "react";
import {
  fileNameCut,
  createFileTree,
  downImg,
  downList,
  downByWoker,
} from "./PhotoProcessingTool/filesTool";
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
  allfun,
  retinex,
} from "./PhotoProcessingTool/canvas";
import "./index.css";
import "antd/dist/antd.css";
import FilesTree from "./compoents/files-tree/FilesTree";
import FilesInput from "./compoents/files-input/FilesInput";
import TopBar from "./compoents/top-bar/TopBar";
import OperationBar from "./compoents/operation-bar/OperationBar";
import Down from "./compoents/down/down";
import CorpBox from "./compoents/cropBox/corpBox";
let checkList = [];
const param = {
  type: "auto_global",
  value: [false, false],
  active: false,
};
let loading,
  readCount = 0,
  sumCount = 0;
const hasRead = new Promise((re, rj) => {
  loading = re;
});
function App() {
  const canvas = useRef();
  const [filesrc, setsrc] = useState();
  const [paramCuted, setParamCuted] = useState({
    hasCuted: false,
    value: [0, 0, 0, 0],
  });
  const [size, setSize] = useState([600, 600, 1]);
  const [files, setfiles] = useState([{ title: "root", key: "root" }]);
  const [over, setOver] = useState(undefined);
  const RenderPhoto = (param) => {
    console.log(param.value, "param.value");
    const newImageSrc = allfun(filesrc, [...param.value, false], [0, 0, 0, 0]);
    //const newImageSrc = retinex(filesrc);
    newImageSrc.then((url) => {
      console.log("render");
      showCanvas(url, canvas.current);
    });
  };

  useEffect(() => {
    initCanvas(canvas.current, 600);
  }, [files]);
  useEffect(() => {
    const RecoHeight = (baseWidth, width, height) => {
      //console.log(width, height);
      //console.log(Math.round((baseWidth / width) * height), "newheight");
      return Math.round((baseWidth / width) * height);
    };
    if (filesrc) {
      console.log("imgSize is", filesrc.width, filesrc.height);
      param.value[0] || param.value[1]
        ? RenderPhoto(param)
        : readFile(filesrc, canvas.current);
      setSize([
        600,
        RecoHeight(600, filesrc.width, filesrc.height),
        600 / filesrc.width,
      ]);
    }
    //console.log(filesrc.height, "fucking size");

    //console.log(canvas.current.height);
  }, [filesrc]);
  const handleChange = (value, type) => {
    param.value = value;
    param.type = type;
  };

  const handleChecked = (src, hasChecked, checkedNodes) => {
    console.log("handleChecked");
    param.active = hasChecked;
    src === filesrc && !hasChecked
      ? readFile(filesrc, canvas.current)
      : RenderPhoto(param);
    //console.log(src, hasChecked, "chek");
    console.log(checkedNodes, "checkedNodes");
    const fillterList = [];
    readCount = 0;
    sumCount = 0;
    checkedNodes.forEach((node) => {
      if (node.src !== undefined) {
        sumCount++;
        node.img.then((img) => {
          //console.log(img, "ffff");
          readCount++;
          if (readCount === sumCount) loading(true);
          fillterList.push({ img: img, title: node.title });
        });
      } else {
        console.log(node);
      }
    });
    checkList = fillterList;
    console.log(fillterList, "checkList");
  };
  const handleCut = (target) => {
    console.log(target, "targer");
    if (target.length !== 2) {
      setParamCuted({ hasCuted: false, value: [] });
    } else {
      setParamCuted({ hasCuted: true, value: target });
    }
  };
  const handleDown = () => {
    //console.log("real down");
    hasRead.then(
      (flg) => {
        downByWoker(
          checkList,
          [...param.value, paramCuted.hasCuted],
          paramCuted.value,
          setOver
        );
      },
      (v) => {
        console.log("bukn");
      }
    );

    // downList(
    //   checkList,
    //   [...param.value, paramCuted.hasCuted],
    //   paramCuted.value
    // );
  };
  // useEffect(() => {
  //   console.log(size, "size is");
  // }, [size]);
  return (
    <div>
      <TopBar></TopBar>
      <div className={"main-box"}>
        <div className={"canvas-box"}>
          <canvas
            width="600"
            height="600"
            ref={canvas}
            className={"canvas"}
          ></canvas>
          {paramCuted.hasCuted ? (
            <CorpBox Coordinate={paramCuted.value} size={size} />
          ) : null}
        </div>

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
          <OperationBar
            handleChange={handleChange}
            handleCut={handleCut}
          ></OperationBar>
          <Down
            onClick={() => {
              handleDown();
            }}
            //percent={30}
          ></Down>
        </div>
      </div>
    </div>
  );
}

export default App;
