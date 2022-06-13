const webCanvas = new OffscreenCanvas(0, 0);
const ctx = webCanvas.getContext("2d");
const RgbToHsv = (photo) => {
  const HsvPhoto = [];
  for (let i = 0; i < photo.length; i += 4) {
    const [r, g, b] = [photo[i], photo[i + 1], photo[i + 2]];
    const max = r > g && r > b ? r : g > b ? g : b;
    const min = r < g && r < b ? r : g < b ? g : b;
    let h, s, v;
    if (max === min) {
      h = 0;
    } else if (max === r && g >= b) {
      h = Math.round((60 * (g - b)) / (max - min));
    } else if (max === r && g < b) {
      h = Math.round((60 * (g - b)) / (max - min)) + 360;
    } else if (max === g) {
      h = Math.round((60 * (b - r)) / (max - min)) + 120;
    } else if (max === b) {
      h = Math.round((60 * (r - g)) / (max - min)) + 240;
    }
    s = max === 0 ? 0 : 1 - min / max;
    v = max;
    HsvPhoto.push(h, s, v);
  }
  return HsvPhoto;
};
const HsvToRgb = (HsvPhoto) => {
  const RgbPhoto = [];
  for (let i = 0; i < HsvPhoto.length; i += 3) {
    const [h, s, v] = [HsvPhoto[i], HsvPhoto[i + 1], HsvPhoto[i + 2]];
    let r, g, b;
    const hi = Math.floor(h / 60),
      f = h / 60 - hi,
      p = v * (1 - s),
      q = v * (1 - f * s),
      t = v * (1 - (1 - f) * s);
    switch (hi) {
      case 0:
        [r, g, b] = [v, t, p];
        break;
      case 1:
        [r, g, b] = [q, v, p];
        break;
      case 2:
        [r, g, b] = [p, v, t];
        break;
      case 3:
        [r, g, b] = [p, q, v];
        break;
      case 4:
        [r, g, b] = [t, p, v];
        break;
      case 5:
        [r, g, b] = [v, p, q];
        break;
    }
    RgbPhoto.push(r, g, b, 255);
  }
  return RgbPhoto;
};
const getIncrement = (HsvPhoto) => {
  const index = 2;
  const lightArr = new Array(256).fill(0),
    sArr = new Array(256).fill(0),
    rArr = new Array(256).fill(0);
  const newPhoto = HsvPhoto.slice();
  let min = 0,
    max;
  for (let i = 0; i < HsvPhoto.length; i += 3) {
    const light = HsvPhoto[i + index];
    lightArr[Math.round(light)]++;
  }
  sArr[0] = lightArr[0];
  for (let i = 1; i < lightArr.length; i++) {
    sArr[i] = lightArr[i] + sArr[i - 1];
    min = min < sArr[i] ? min : sArr[i];
    max = max > sArr[i] ? max : sArr[i];
  }
  for (let i = 0; i < HsvPhoto.length; i += 3) {
    const light = HsvPhoto[i + index];
    const trLight = Math.round(((sArr[light] - min) / (max - min)) * 255);
    newPhoto[i + index] = trLight;
    if (newPhoto[i + index] > 255) {
      newPhoto[i + index] = 255;
    }
    rArr[newPhoto[i + index]]++;
  }
  return [
    rArr.indexOf(Math.max(...rArr)),
    lightArr.indexOf(Math.max(...lightArr)),
  ];
};
const getSincrement = (HsvPhoto) => {
  const SaturationArr = new Array(256).fill(0),
    sArr = new Array(256).fill(0),
    resArr = new Array(256).fill(0);
  const newPhoto = HsvPhoto.slice();
  let min = 0,
    max;
  for (let i = 0; i < HsvPhoto.length; i += 3) {
    const Saturation = Math.round(HsvPhoto[i + 1] * 255);
    SaturationArr[Saturation]++;
  }
  sArr[0] = SaturationArr[0];
  for (let i = 1; i < SaturationArr.length; i++) {
    sArr[i] = SaturationArr[i] + sArr[i - 1];
    min = min < sArr[i] ? min : sArr[i];
    max = max > sArr[i] ? max : sArr[i];
  }
  for (let i = 0; i < HsvPhoto.length; i += 3) {
    const Saturation = Math.round(HsvPhoto[i + 1] * 255);
    const trSaturation = Math.round(
      ((sArr[Saturation] - min) / (max - min)) * 255
    );
    newPhoto[i + 1] = trSaturation;
    if (newPhoto[i + 1] > 255) {
      resArr[255]++;
    } else {
      resArr[newPhoto[i + 1]]++;
    }
  }
  const sumIndex = (arr) => {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      sum += i * arr[i];
    }
    return sum;
  };
  return [
    sumIndex(resArr) / (HsvPhoto.length / 3),
    sumIndex(SaturationArr) / (HsvPhoto.length / 3),
  ];
};
const global_saturationAndValue_adjustment = (photo) => {
  const HsvPhoto = RgbToHsv(photo);
  const [increV, initV] = getIncrement(HsvPhoto, "v");
  const [increS, initS] = getSincrement(HsvPhoto, "s");
  const addV = increV - initV > 30 ? 30 : increV - initV,
    addS = increS - initS > 30 ? 30 : increS - initS;
  //const add = increB - initB;
  HsvAdjustment(HsvPhoto, addS / 255, "s");
  HsvAdjustment(HsvPhoto, addV, "v");
  //console.log(addV, addS, "both add");
  const newRgbPhoto = HsvToRgb(HsvPhoto);
  return newRgbPhoto;
};
const HsvAdjustment = (Hsvphoto, param, type) => {
  const index = type === "v" ? 2 : 1;
  for (let i = 0; i < Hsvphoto.length; i += 3) {
    Hsvphoto[i + index] += param;
    if (Hsvphoto[i + index] < 0) {
      Hsvphoto[i + index] = 0;
    }
    if (Hsvphoto[i + index] > 255) {
      Hsvphoto[i + index] = 255;
    }
  }
  return Hsvphoto;
};
const global_brightness_adjustment = (photo) => {
  const HsvPhoto = RgbToHsv(photo);
  const [increB, initB] = getIncrement(HsvPhoto, "v");
  const add = increB - initB > 30 ? 30 : increB - initB;
  //const add = increB - initB;
  //if (add < 5) return HsvToRgb(HsvPhoto);
  HsvAdjustment(HsvPhoto, add, "v");
  //console.log(increB, initB, "?");
  const newRgbPhoto = HsvToRgb(HsvPhoto);
  return newRgbPhoto;
};
const global_saturation_adjustment = (photo) => {
  const HsvPhoto = RgbToHsv(photo);
  const [increB, initB] = getSincrement(HsvPhoto);
  const add = increB - initB > 30 ? 30 : increB - initB;
  //const add = increB - initB;
  //if (add < 5) return HsvToRgb(HsvPhoto);
  HsvAdjustment(HsvPhoto, add / 255, "s");
  //console.log(increB, initB, "?");
  const newRgbPhoto = HsvToRgb(HsvPhoto);
  return newRgbPhoto;
};
const allfun = (image, param, cut_param, hasBlob = false) => {
  const [x0, y0, x1, y1] = cut_param;
  if (param[2]) {
    webCanvas.width = x1 - x0;
    webCanvas.height = y1 - y0;
    ctx.drawImage(image, x0, y0, x1 - x0, y1 - y0, 0, 0, x1 - x0, y1 - y0);
  } else {
    webCanvas.width = image.width;
    webCanvas.height = image.height;
    ctx.drawImage(image, 0, 0);
  }
  let imgData = param[2]
    ? ctx.getImageData(0, 0, x1 - x0, y1 - y0)
    : ctx.getImageData(0, 0, image.width, image.height);
  //ctx.putImageData(imgData, 0, 0);
  if (param[0] && param[1]) {
    let RGB = global_saturationAndValue_adjustment(imgData.data);
    for (let i = 0; i < imgData.data.length; i++) {
      imgData.data[i] = RGB[i];
    }
    ctx.putImageData(imgData, 0, 0);
    if (hasBlob) {
      webCanvas.toBlob((blob) => {
        //console.log(blob, "bolbo");
        return blob;
      });
    } else {
      const url = webCanvas.toDataURL("image/jpeg");
      return url;
    }

    //return url);
  } else {
    if (param[0]) {
      let RGB = global_brightness_adjustment(imgData.data);
      for (let i = 0; i < imgData.data.length; i++) {
        imgData.data[i] = RGB[i];
      }
      ctx.putImageData(imgData, 0, 0);
      const url = webCanvas.toDataURL("image/jpeg");
      if (hasBlob) {
        webCanvas.toBlob((blob) => {
          //console.log(blob, "bolbo");
          return blob;
        });
      } else {
        return url;
      }
      //return url);
    }
    if (param[1]) {
      let RGB = global_saturation_adjustment(imgData.data);
      for (let i = 0; i < imgData.data.length; i++) {
        imgData.data[i] = RGB[i];
      }
      ctx.putImageData(imgData, 0, 0);
      const url = webCanvas.toDataURL("image/jpeg");
      if (hasBlob) {
        webCanvas.toBlob((blob) => {
          //console.log(blob, "bolbo");
          return blob;
        });
      } else {
        return url;
      }
      //return url);
    }
    if (!(param[0] && param[1])) {
      const url = webCanvas.toDataURL("image/jpeg");
      if (hasBlob) {
        webCanvas.toBlob((blob) => {
          //console.log(blob, "bolbo");
          return blob;
        });
      } else {
        return url;
      }
      //return url);
    }
  }
};
export default () => {
  onmessage = (image, param, cut_param, hasBlob) => {
    postMessage(allfun(image, param, cut_param, hasBlob));
  };
};
