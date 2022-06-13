import { FileImageOutlined, StarFilled, StarTwoTone } from "@ant-design/icons";
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
} from "./canvas";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import WorkerBuilder from "./WorkerBuilder";
//import woker from "./woker";
import woker from "./woker";
//const drawCanvas = new OffscreenCanvas(0, 0);
const drawCanvas = document.createElement("canvas");
const ctx = drawCanvas.getContext("2d");
function fileNameCut(path) {
  let tep = "",
    res = [];
  for (let i = 0; i < path.length; i++) {
    if (path[i] !== "/") {
      tep += path[i];
    } else {
      res.push(tep);
      tep = "";
    }
    if (i === path.length - 1) {
      res.push(tep);
    }
  }
  return res;
}
const creatNode = (filePathArr, dep, treeLayer, prekey, isFolder, src) => {
  //console.log(prekey, "rekkk");
  if (prekey.length !== 0) prekey += "-";
  if (isFolder === true) {
    return {
      title: filePathArr[dep],
      key: prekey + treeLayer.length,
      children: [],
    };
  } else {
    const image = new Image();
    image.src = URL.createObjectURL(src);
    const imgThen = new Promise((re, rs) => {
      image.onload = (e) => {
        re(e.currentTarget);
      };
    });
    return {
      title: filePathArr[dep],
      key: prekey + treeLayer.length,
      src: src,
      icon: <FileImageOutlined />,
      img: imgThen,
    };
  }
};
const find = (arr, getOne) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].title === getOne) {
      return arr[i];
    }
  }
  return false;
};
const createFileTree = (filePath, tree, src) => {
  const filePathArr = fileNameCut(filePath);
  let treeLayer = tree,
    prekey = "";
  for (let i = 0; i < filePathArr.length; i++) {
    const tep = find(treeLayer, filePathArr[i]);
    if (tep) {
      prekey = tep.key;
      treeLayer = tep.children;
    } else {
      const newnode = creatNode(
        filePathArr,
        i,
        treeLayer,
        prekey,
        i === filePathArr.length - 1 ? false : true,
        src
      );
      const line = prekey.length === 0 ? "" : "-";
      prekey += line + treeLayer.length;
      treeLayer.push(newnode);
      treeLayer = newnode.children;
    }
  }
  // const treeSort = (a, b) => {
  //   if (a.children || b.children) {
  //     if (a.children && b.children) {
  //       a.children.sort(treeSort);
  //       b.children.sort(treeSort);
  //       return a.title > b.title ? 1 : -1;
  //     } else {
  //       return a.children
  //         ? a.children.sort(treeSort) && -1
  //         : b.children.sort(treeSort) && 1;
  //     }
  //   } else {
  //     return a.title > b.title ? 1 : -1;
  //   }
  // };
  // if (tree.length <= 1) {
  //   tree[0].children.sort(treeSort);
  // }
  // tree.sort(treeSort);
};
const downImg = (src, newName) => {
  const changeName = (uri, newName = "is") => {
    let link = document.createElement("a");
    //link.setAttribute("download", newName + ".jpg");
    link.setAttribute("download", newName);
    link.setAttribute("href", uri);
    link.click();
  };
  const downSrc = src.replace(
    /^data:image\/[^;]/,
    "data:application/octet-stream"
  );
  changeName(downSrc, newName);
  //window.open(downSrc);
};
const axDownImg = (src, newName) => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", src, true);
  xhr.onload = function () {
    console.log(this, "xhr");
    if (this.status === 200) {
      var blob = this.response;
      //if (navigator.msSaveBlob == null) {
      const a = document.createElement("a");
      //var headerName = xhr.getResponseHeader("Content-disposition");
      //var fileName = decodeURIComponent(headerName).substring(20);
      //a.download = fileName;
      a.download = newName;
      a.href = URL.createObjectURL(blob);
      //$("body").append(a);    // 修复firefox中无法触发click
      a.click();
      URL.revokeObjectURL(a.href);
      //$(a).remove();
      // } else {
      //   navigator.msSaveBlob(blob, fileName);
      // }
    }
    console.log("down over");
  };
};
const downList = (list, param, cutParam) => {
  //console.log("?? doneeeee", list);
  let downlist = [],
    namelist = [];
  for (let i = 0; i < list.length; i++) {
    const element = list[i];
    const img = element.img,
      name = element.title;
    let newImg = allfun(img, param, cutParam, true);
    downlist.push(newImg);
    namelist.push(name);
  }
  Promise.all(downlist).then((list) => {
    console.log(list, "list");
    // for (let i = 0; i < list.length; i++) {
    //   console.log(list[i]);
    // }
    let index = 0,
      length = list.length;
    const axdown = () => {
      if (length > index + 1) {
        setTimeout(() => {
          downImg(list[index], namelist[index]);
          index++;
          axdown();
        }, 300);
      }
    };
    const zip = new JSZip();
    var img = zip.folder("images");
    list.forEach((src, index) => {
      img.file(namelist[index], src, { base64: true });
    });
    zip.generateAsync({ type: "blob" }).then(function (content) {
      var filename = "images" + ".zip";
      var eleLink = document.createElement("a");
      eleLink.download = filename;
      eleLink.style.display = "none";
      eleLink.href = URL.createObjectURL(content);
      document.body.appendChild(eleLink);
      eleLink.click();
      document.body.removeChild(eleLink);
    });
  });
};
const downByWoker = (list, param, cutParam, setOver) => {
  let downlist = [];
  const zip = new JSZip();
  const img = zip.folder("images");
  const woker = new Worker("woker.js");
  let downNums = 0;
  console.log("start", Date());
  woker.onmessage = (e) => {
    // console.log(e.data.imgdata, "woker e");
    const imgData = e.data.imgdata;
    drawCanvas.width = imgData.width;
    drawCanvas.height = imgData.height;
    ctx.drawImage(imgData, 0, 0);
    drawCanvas.toBlob((blob) => {
      //console.log(e, "wijj");
      img.file(e.data.name, blob, { base64: true });
      downNums++;
      console.log(
        downNums,
        "downNums",
        list.length,
        "list.length",
        typeof downNums === typeof list.length
      );
      //setOver(Math.round(downNums / list.length));
      if (downNums === list.length) {
        console.log("over", Date(), "down nums is", downList);
        zip.generateAsync({ type: "blob" }).then(function (content) {
          var filename = "images" + ".zip";
          var eleLink = document.createElement("a");
          eleLink.download = filename;
          eleLink.style.display = "none";
          eleLink.href = URL.createObjectURL(content);
          document.body.appendChild(eleLink);
          eleLink.click();
          document.body.removeChild(eleLink);
        });
      }
    });
  };
  // woker.onmessage = (file) => {
  //   downlist.push(file);
  //   if (downlist.length === list.length) {
  //     const zip = new JSZip();
  //     var img = zip.folder("images");
  //     downlist.forEach((file) => {
  //       img.file(file.name, file.blob, { base64: true });
  //     });
  //     zip.generateAsync({ type: "blob" }).then(function (content) {
  //       var filename = "images" + ".zip";
  //       var eleLink = document.createElement("a");
  //       eleLink.download = filename;
  //       eleLink.style.display = "none";
  //       eleLink.href = URL.createObjectURL(content);
  //       document.body.appendChild(eleLink);
  //       eleLink.click();
  //       document.body.removeChild(eleLink);
  //     });
  //   }
  // };
  for (let i = 0; i < list.length; i++) {
    const element = list[i];
    const img = element.img,
      name = element.title;
    //console.log(img, "realimg");
    const tmpCanvas = new OffscreenCanvas(img.width, img.height),
      ctx = tmpCanvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    // console.log(
    //   tmpCanvas.transferToImageBitmap(),
    //   "tmpCanvas.transferToImageBitmap()"
    // );
    woker.postMessage({
      imgdata: tmpCanvas.transferToImageBitmap(),
      param: param,
      cutParam: cutParam,
      name: name,
    });
    // woker.postMessage([
    //   ctx.getImageData(0, 0, img.width, img.height),
    //   param,
    //   cutParam,
    //   true,
    //   name,
    // ]);
  }
};
export { fileNameCut, createFileTree, downImg, downList, downByWoker };
