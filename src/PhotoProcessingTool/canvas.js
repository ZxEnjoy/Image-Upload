import {
  tuenS,
  tuenR,
  adjustment_RGB,
  global_brightness_adjustment,
  global_saturationAndValue_adjustment,
  global_saturation_adjustment,
} from "./tool";
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
    showCanvas(URL.createObjectURL(file), canvas);
    //britness_adjustment(file);
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
      re(url);
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
      re(url);
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
      const url = drawMap.toDataURL("image/jpeg");
      const size = [image.width, image.height];
      re({ url, size });
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
      re(url);
    };
  });
  return url;
};
const globalBrightness_adjustment = (src) => {
  const image = new Image();
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
      re(url);
    };
  });
  return url;
};
//global_saturation_adjustment
const globalSaturation_adjustment = (src) => {
  const image = new Image();
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
      re(url);
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
      re(url);
    };
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
};
