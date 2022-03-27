import { tuenS, tuenR, adjustment_RGB } from "./tool";
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
  console.log("????");
};
const readFile = (file, canvas) => {
  if (file) {
    showCanvas(URL.createObjectURL(file), canvas);
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
      drawMap.width = image.width;
      drawMap.height = image.height;
      ctx.drawImage(image, 0, 0);
      let imgData = ctx.getImageData(x0, y0, x1, y1);
      ctx.putImageData(imgData, 0, 0);
      const url = drawMap.toDataURL("image/jpeg");
      re(url);
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
export {
  readFile,
  showCanvas,
  initCanvas,
  brightness_adjustment,
  contrast_adjustment,
  cut_photo,
};
