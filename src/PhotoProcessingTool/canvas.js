import {
  tuenS,
  tuenR,
  adjustment_RGB,
  global_brightness_adjustment,
  global_saturationAndValue_adjustment,
  global_saturation_adjustment,
} from "./tool";
import { gaussBlur1 } from "./gaosi";
import { saveAs } from "file-saver";
const copyAr = (arr) => {
  const newAr = [];
  arr.forEach((element) => {
    newAr.push(element);
  });
  return newAr;
};
const drawMap = document.createElement("canvas");
const ctx = drawMap.getContext("2d");
const initCanvas = (canvas, size) => {
  const ctx = canvas.getContext("2d");
  //ctx.fillStyle = "black";
  for (let i = 0; i < size; i += 14) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 7, 0);
    ctx.moveTo(i, size);
    ctx.lineTo(i + 7, size);
    ctx.moveTo(0, i);
    ctx.lineTo(0, i + 7);
    ctx.moveTo(size, i);
    ctx.lineTo(size, i + 7);
  }
  ctx.font = "30px Arial";
  ctx.fillText("请在右侧选择处理的图片", 100, 100);
  ctx.stroke();
  //console.log("????");
};
const drawxLine = (xy, canvas) => {
  const [x0, x1, y] = xy;
  const ctx = canvas.getContext("2d");
  for (let i = x0; i <= x1; i += 14) {
    ctx.moveTo(i, y);
    ctx.lineTo(i + 7, y);
  }
  ctx.stroke();
};
const drawyLine = (xy, canvas) => {
  const [y0, y1, x] = xy;
  const ctx = canvas.getContext("2d");
  for (let i = y0; i <= y1; i += 14) {
    ctx.moveTo(x, i);
    ctx.lineTo(x, i + 7);
  }
  ctx.stroke();
};
const drawCutline = (xy, canvas) => {
  const [x1, y1, x2, y2] = xy;
  const ctx = canvas.getContext("2d");
  const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < image.data.length; i += 4) {
    const x = (i / 4) % canvas.width,
      y = Math.trunc(i / 4 / canvas.width);
    if (!(x > x1 && x < x2 && y > y1 && y < y2)) {
      image.data[i + 4] = 0.5;
    }
  }
  ctx.putImageData(image, 0, 0);
  drawxLine([0, canvas.width, y1], canvas);
  drawxLine([0, canvas.width, y2], canvas);
  drawyLine([0, canvas.height, x1], canvas);
  drawyLine([0, canvas.height, x2], canvas);
  //read data
};
const readFile = (file, canvas) => {
  if (file) {
    //showCanvas(URL.createObjectURL(file), canvas);
    showImage(file, canvas);
  }
};
const showCanvas = (url, canvas) => {
  const ctx = canvas.getContext("2d");
  const image = new Image();
  image.onload = () => {
    const [width, height] = [image.width, image.height];
    canvas.height = Math.round(height / (width / 600));
    ctx.drawImage(image, 0, 0, 600, Math.round(height / (width / 600)));
  };
  image.src = url;
};
const showImage = (image, canvas) => {
  const ctx = canvas.getContext("2d");
  const [width, height] = [image.width, image.height];
  canvas.height = Math.round(height / (width / 600));
  ctx.drawImage(image, 0, 0, 600, Math.round(height / (width / 600)));
};
const tepshowCanvas = (url, canvas, xy, size) => {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const [x, y] = xy;
  const image = new Image();
  image.onload = () => {
    const [width, height] = size;
    canvas.height = Math.round(height / (width / 600));
    ctx.drawImage(image, x, y, 600, Math.round(height / (width / 600)));
  };
  image.src = url;
};
const brightness_adjustment = (src) => {
  const image = new Image();
  image.src = URL.createObjectURL(src);
  const url = new Promise((re, rs) => {
    image.onload = () => {
      drawMap.width = image.width;
      drawMap.height = image.height;
      ctx.drawImage(image, 0, 0);
      let imgData = ctx.getImageData(0, 0, image.width, image.height);
      let RGB = tuenR(imgData.data);
      for (let i = 0; i < imgData.data.length; i++) {
        imgData.data[i] = RGB[i];
      }
      ctx.putImageData(imgData, 0, 0);
      const url = drawMap.toDataURL("image/jpeg");
      //re(url);
    };
  });
  return url;
};
const contrast_adjustment = (src) => {
  const image = new Image();
  image.src = URL.createObjectURL(src);
  const url = new Promise((re, rs) => {
    image.onload = () => {
      drawMap.width = image.width;
      drawMap.height = image.height;
      ctx.drawImage(image, 0, 0);
      let imgData = ctx.getImageData(0, 0, image.width, image.height);
      let RGB = tuenS(imgData.data);
      for (let i = 0; i < imgData.data.length; i++) {
        imgData.data[i] = RGB[i];
      }
      ctx.putImageData(imgData, 0, 0);
      const url = drawMap.toDataURL("image/jpeg");
      //re(url);
    };
  });
  return url;
};
const cut_photo = (src, x0, y0, x1, y1) => {
  const image = new Image();
  image.src = URL.createObjectURL(src);
  const url = new Promise((re, rs) => {
    image.onload = () => {
      drawMap.width = x1 - x0;
      drawMap.height = y1 - y0;
      ctx.drawImage(image, x0, y0, x1 - x0, y1 - y0, 0, 0, x1 - x0, y1 - y0);
      let imgData = ctx.getImageData(0, 0, x1 - x0, y1 - y0);
      ctx.putImageData(imgData, 0, 0);
      // const url = drawMap.toDataURL("image/jpeg");
      const size = [image.width, image.height];
      re({ ctx, size });
    };
  });
  return url;
};
const rgb_adjustment = (src, rgb) => {
  const image = new Image();
  image.src = URL.createObjectURL(src);
  const url = new Promise((re, rs) => {
    image.onload = () => {
      drawMap.width = image.width;
      drawMap.height = image.height;
      ctx.drawImage(image, 0, 0);
      let imgData = ctx.getImageData(0, 0, image.width, image.height);
      adjustment_RGB(imgData, rgb);
      ctx.putImageData(imgData, 0, 0);
      const url = drawMap.toDataURL("image/jpeg");
      //re(url);
    };
  });
  return url;
};
const globalBrightness_adjustment = (src) => {
  const image = new Image();
  //console.log(src, "src br");
  image.src = URL.createObjectURL(src);
  const url = new Promise((re, rs) => {
    image.onload = () => {
      drawMap.width = image.width;
      drawMap.height = image.height;
      ctx.drawImage(image, 0, 0);
      let imgData = ctx.getImageData(0, 0, image.width, image.height);
      let RGB = global_brightness_adjustment(imgData.data);
      for (let i = 0; i < imgData.data.length; i++) {
        imgData.data[i] = RGB[i];
      }
      ctx.putImageData(imgData, 0, 0);
      const url = drawMap.toDataURL("image/jpeg");
      //re(url);
    };
  });
  return url;
};
//global_saturation_adjustment
const globalSaturation_adjustment = (src) => {
  const image = new Image();
  console.log(src, "sa src");
  image.src = URL.createObjectURL(src);
  const url = new Promise((re, rs) => {
    image.onload = () => {
      drawMap.width = image.width;
      drawMap.height = image.height;
      ctx.drawImage(image, 0, 0);
      let imgData = ctx.getImageData(0, 0, image.width, image.height);
      let RGB = global_saturation_adjustment(imgData.data);
      for (let i = 0; i < imgData.data.length; i++) {
        imgData.data[i] = RGB[i];
      }
      ctx.putImageData(imgData, 0, 0);
      const url = drawMap.toDataURL("image/jpeg");
      //re(url);
    };
  });
  return url;
};
const globalBrightnessAndSaturation_adjustment = (src) => {
  const image = new Image();
  image.src = URL.createObjectURL(src);
  const url = new Promise((re, rs) => {
    image.onload = () => {
      drawMap.width = image.width;
      drawMap.height = image.height;
      ctx.drawImage(image, 0, 0);
      let imgData = ctx.getImageData(0, 0, image.width, image.height);
      let RGB = global_saturationAndValue_adjustment(imgData.data);
      for (let i = 0; i < imgData.data.length; i++) {
        imgData.data[i] = RGB[i];
      }
      ctx.putImageData(imgData, 0, 0);
      const url = drawMap.toDataURL("image/jpeg");
      //re(url);
    };
  });
  return url;
};
const retinex = (src) => {
  const image = new Image();
  image.src = URL.createObjectURL(src);
  const url = new Promise((re, rs) => {
    image.onload = () => {
      drawMap.width = image.width;
      drawMap.height = image.height;
      ctx.drawImage(image, 0, 0);
      let imgData = ctx.getImageData(0, 0, image.width, image.height);
      const Iimg = copyAr(imgData.data);
      console.log(imgData.data, "imgData.data");
      let Limg = gaussBlur1(imgData, 100).data;
      const R_arry = [];
      console.log(Iimg, "Iimg");
      console.log(Limg, "Limg");
      for (let i = 0; i < imgData.data.length; i += 4) {
        const R = [
          Math.log(Iimg[i] + Math.E) - Math.log(Limg[i] + Math.E),
          Math.log(Iimg[i + 1] + Math.E) - Math.log(Limg[i + 1] + Math.E),
          Math.log(Iimg[i + 2] + Math.E) - Math.log(Limg[i + 2] + Math.E),
          1,
        ];
        R_arry.push(...R);
      }
      console.log(R_arry, "R_arry");
      const Mean = [0, 0, 0],
        Var = [0, 0, 0];
      for (let i = 0; i < R_arry.length; i += 4) {
        Mean[0] += R_arry[i];
        Mean[1] += R_arry[i + 1];
        Mean[2] += R_arry[i + 2];
      }
      Mean[0] /= R_arry.length;
      Mean[1] /= R_arry.length;
      Mean[2] /= R_arry.length;
      for (let i = 0; i < R_arry.length; i += 4) {
        Var[0] += Math.pow(R_arry[i] - Mean[0], 2);
        Var[1] += Math.pow(R_arry[i + 1] - Mean[1], 2);
        Var[2] += Math.pow(R_arry[i + 2] - Mean[2], 2);
      }
      Var[0] /= R_arry.length;
      Var[1] /= R_arry.length;
      Var[2] /= R_arry.length;
      console.log(Mean, Var, "Mean Var");
      const [Min, Max] = [
        [Mean[0] - 2 * Var[0], Mean[1] - 2 * Var[1], Mean[2] - 2 * Var[2]],
        [Mean[0] + 2 * Var[0], Mean[1] + 2 * Var[1], Mean[2] + 2 * Var[2]],
      ];
      const res_photo = [];
      console.log(Min, Max, "MIN and Max");
      for (let i = 0; i < R_arry.length; i += 4) {
        let newValue = [
          ((R_arry[i + 0] - Min[0]) / (Max[0] - Min[0])) * 255,
          ((R_arry[i + 1] - Min[1]) / (Max[1] - Min[1])) * 255,
          ((R_arry[i + 2] - Min[2]) / (Max[2] - Min[2])) * 255,
        ];
        res_photo.push(...newValue, 1);
      }
      console.log(res_photo, "resph");
      for (let i = 0; i < imgData.data.length; i += 4) {
        imgData.data[i] = res_photo[i];
        imgData.data[i + 1] = res_photo[i + 1];
        imgData.data[i + 2] = res_photo[i + 2];
      }
      ctx.putImageData(imgData, 0, 0);
      const url = drawMap.toDataURL("image/jpeg");
      console.log("reminx over");
      //re(url);
    };
  });
  return url;
};
const allfun = (image, param, cut_param, hasBlob = false) => {
  // const image = new Image();
  // console.log("allfun", param);
  // image.src = URL.createObjectURL(src);
  const [width, height] = cut_param;
  const url = new Promise((re, rs) => {
    //need cuted?
    //console.log(e.currentTarget);
    if (param[2]) {
      drawMap.width = width; //x1 - x0;
      drawMap.height = height; //y1 - y0;
      const [moveHeight, moveWidth] = [
        Math.round((image.height - height) / 2),
        Math.round((image.width - width) / 2),
      ];
      ctx.drawImage(
        image,
        moveWidth,
        moveHeight,
        width,
        height,
        0,
        0,
        width,
        height
      );
      //ctx.drawImage(image, x0, y0, x1 - x0, y1 - y0, 0, 0, x1 - x0, y1 - y0);
    } else {
      drawMap.width = image.width;
      drawMap.height = image.height;
      ctx.drawImage(image, 0, 0);
    }
    let imgData = param[2]
      ? ctx.getImageData(0, 0, width, height)
      : ctx.getImageData(0, 0, image.width, image.height);
    //ctx.putImageData(imgData, 0, 0);
    if (param[0] && param[1]) {
      let RGB = global_saturationAndValue_adjustment(imgData.data);
      for (let i = 0; i < imgData.data.length; i++) {
        imgData.data[i] = RGB[i];
      }
      ctx.putImageData(imgData, 0, 0);
      if (hasBlob) {
        drawMap.toBlob((blob) => {
          //console.log(blob, "bolbo");
          re(blob);
        });
      } else {
        const url = drawMap.toDataURL("image/jpeg");
        re(url);
      }

      //re(url);
    } else {
      if (param[0]) {
        let RGB = global_brightness_adjustment(imgData.data);
        for (let i = 0; i < imgData.data.length; i++) {
          imgData.data[i] = RGB[i];
        }
        ctx.putImageData(imgData, 0, 0);
        const url = drawMap.toDataURL("image/jpeg");
        if (hasBlob) {
          drawMap.toBlob((blob) => {
            //console.log(blob, "bolbo");
            re(blob);
          });
        } else {
          re(url);
        }
        //re(url);
      }
      if (param[1]) {
        let RGB = global_saturation_adjustment(imgData.data);
        for (let i = 0; i < imgData.data.length; i++) {
          imgData.data[i] = RGB[i];
        }
        ctx.putImageData(imgData, 0, 0);
        const url = drawMap.toDataURL("image/jpeg");
        if (hasBlob) {
          drawMap.toBlob((blob) => {
            //console.log(blob, "bolbo");
            re(blob);
          });
        } else {
          re(url);
        }
        //re(url);
      }
      if (!(param[0] && param[1])) {
        const url = drawMap.toDataURL("image/jpeg");
        if (hasBlob) {
          drawMap.toBlob((blob) => {
            //console.log(blob, "bolbo");
            re(blob);
          });
        } else {
          re(url);
        }
        //re(url);
      }
    }
  });
  return url;
};
export {
  readFile,
  showCanvas,
  initCanvas,
  brightness_adjustment,
  globalBrightness_adjustment,
  contrast_adjustment,
  cut_photo,
  tepshowCanvas,
  globalSaturation_adjustment,
  globalBrightnessAndSaturation_adjustment,
  allfun,
  retinex,
};
