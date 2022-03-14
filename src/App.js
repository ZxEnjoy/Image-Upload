import { useState, useRef, useEffect } from "react";
import { fileNameCut, createFileTree } from "./PhotoProcessingTool/filesTool";
import { equalization, RgbToHsv, HsvToRgb } from "./PhotoProcessingTool/tool";
import { readFile } from "./PhotoProcessingTool/canvas";
import "./index.css";
import "antd/dist/antd.css";
import FilesTree from "./compoents/files-tree/FilesTree";
import FilesInput from "./compoents/files-input/FilesInput";
function App() {
  const canvas = useRef();
  const tepa = useRef();
  const [filesrc, setsrc] = useState();
  const [files, setfiles] = useState([]);
  const [imagesrc, setimagesrc] = useState();
  const downimg = (src) => {
    const changeName = (uri) => {
      var link = document.createElement("a");
      link.setAttribute("download", "is.jpg");
      link.setAttribute("href", uri);
      tepa.current.appendChild(link);
      link.click();
      tepa.current.removeChild(tepa.current.lastChild);
    };
    const downSrc = src.replace(
      /^data:image\/[^;]/,
      "data:application/octet-stream"
    );
    changeName(downSrc);
    //window.open(downSrc);
  };
  const handleChange = (file) => {
    console.log(file.target.files);
    const ctx = canvas.current.getContext("2d");
    const image = new Image();
    image.src = URL.createObjectURL(file.target.files[0]);
    //window.open(image.src)
    //downimg(image.src)
    //ctx.drawImage(image,0,0)
    const src = URL.createObjectURL(file.target.files[0]);
    setsrc(src);
    image.onload = () => {
      ctx.drawImage(image, 0, 0);
      const canvasImg = ctx.getImageData(0, 0, 100, 100);
      const data = canvasImg.data;
      console.log(data);
      for (let i = 0; i < data.length; i += 4) {
        data[i + 3] = 255;
      }
      console.log(data);
      ctx.putImageData(canvasImg, 0, 0);
      let b64 = canvas.current.toDataURL("image/jpeg");
      //downimg(b64)
    };
  };
  useEffect(() => {
    console.log(files);

    //console.log(Caman,'AlloyImage')
  }, [files]);
  useEffect(() => {
    console.log(filesrc);
    if (filesrc) {
      setimagesrc(URL.createObjectURL(filesrc));
      readFile(filesrc, canvas.current);
      // const ctx = canvas.current.getContext("2d");
      // const image = new Image();
      // image.src = URL.createObjectURL(filesrc);
      // image.onload = () => {
      //   ctx.drawImage(image, 0, 0);
      // };
    }
    //console.log(Caman,'AlloyImage')
  }, [filesrc]);
  return (
    <div>
      <FilesInput
        onChange={(e) => {
          const reg = /image/;
          console.log(e.target.files, "filssss");
          const photos = [];
          const newFiles = new DataTransfer();
          for (let i of e.target.files) {
            reg.test(i.type) &&
              createFileTree(i.webkitRelativePath, photos, i) &&
              newFiles.items.add(i);
            //console.log(fileNameCut(i.webkitRelativePath));
            //const filePath = fileNameCut(i.webkitRelativePath);
            //createFileTree(i.webkitRelativePath, photos);
          }
          console.log(photos, "phss");
          e.target.files = newFiles.files;
          setfiles(photos);
        }}
      />
      <FilesTree
        treeData={files}
        updataTree={(tree) => {
          setfiles(tree);
        }}
        select={(filesrc) => {
          setsrc(filesrc);
        }}
      ></FilesTree>
      <canvas width="1000" height="1000" ref={canvas}></canvas>
      {/* {<img src={imagesrc} />} */}
      <div ref={tepa}></div>
      <div
        onClick={() => {
          const drawMap = document.createElement("canvas");

          const ctx = drawMap.getContext("2d");
          const image = new Image();
          image.src = URL.createObjectURL(filesrc);
          image.onload = () => {
            drawMap.width = image.width;
            drawMap.height = image.height;
            ctx.drawImage(image, 0, 0);
            const imgData = ctx.getImageData(0, 0, image.width, image.height);
            console.log(imgData.data, "befor");
            //equalization(imgData.data);
            const HSV = RgbToHsv(imgData.data);
            const RGB = HsvToRgb(HSV);
            for (let i = 0; i < imgData.data.length; i++) {
              imgData.data[i] = RGB[i];
            }
            console.log(imgData.data, "after");
            ctx.putImageData(imgData, 0, 0);
            downimg(drawMap.toDataURL("image/jpeg"));
            canvas.current.getContext("2d").putImageData(imgData, 0, 0);
          };
        }}
      >
        chekckkk
      </div>
    </div>
  );
}

export default App;
