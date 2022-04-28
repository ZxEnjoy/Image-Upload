const equalization = (photo, size = 256) => {
  const lightArr = new Array(256).fill(0),
    sArr = new Array(256).fill(0);
  const newPhoto = [];
  let min = 0,
    max;
  for (let i = 0; i < photo.length; i += 4) {
    const light = (photo[i] + photo[i + 1] + photo[i + 2]) / 3;
    lightArr[Math.round(light)]++;
  }
  sArr[0] = lightArr[0];
  for (let i = 1; i < lightArr.length; i++) {
    sArr[i] = lightArr[i] + sArr[i - 1];
    min = min < sArr[i] ? min : sArr[i];
    max = max > sArr[i] ? max : sArr[i];
  }
  //console.log(sArr, "sArr", lightArr, "lightArr");
  for (let i = 0; i < photo.length; i += 4) {
    const light = Math.round((photo[i] + photo[i + 1] + photo[i + 2]) / 3);
    const trLight = Math.round(((sArr[light] - min) / (max - min)) * 255);
    const addLight = trLight - light;
    photo[i] += addLight;
    photo[i + 1] += addLight;
    photo[i + 2] += addLight;
  }
};
const brightness_Rgb = (photo, brightness) => {
  for (let i = 0; i < photo.length; i += 4) {
    photo[i] += brightness;
    photo[i + 1] += brightness;
    photo[i + 2] += brightness;
  }
  return photo;
};

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
const equalizationHsv = (HsvPhoto, size = 255) => {
  const index = 2;
  const lightArr = new Array(256).fill(0),
    sArr = new Array(256).fill(0);
  const newPhoto = HsvPhoto.slice();
  let min = 0,
    max;
  for (let i = 0; i < HsvPhoto.length; i += 3) {
    const light = HsvPhoto[i + index];
    lightArr[light]++;
  }
  sArr[0] = lightArr[0];
  for (let i = 1; i < lightArr.length; i++) {
    sArr[i] = lightArr[i] + sArr[i - 1];
    min = min < sArr[i] ? min : sArr[i];
    max = max > sArr[i] ? max : sArr[i];
  }
  //console.log(sArr, "sArr", lightArr, "lightArr");
  for (let i = 0; i < HsvPhoto.length; i += 3) {
    const light = HsvPhoto[i + index];
    const trLight = Math.round(((sArr[light] - min) / (max - min)) * size);
    const addLight = trLight - light;
    newPhoto[i + index] += addLight;
    if (newPhoto[i + index] > 255) {
      newPhoto[i + index] = 255;
    }
  }
  return newPhoto;
};
const equalizationHsvS = (HsvPhoto) => {
  const SaturationArr = new Array(256).fill(0),
    sArr = new Array(256).fill(0);
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
  //console.log(max, min, "max -  min");
  //console.log(sArr, "sArr", lightArr, "lightArr");
  for (let i = 0; i < HsvPhoto.length; i += 3) {
    const Saturation = Math.round(HsvPhoto[i + 1] * 255);
    const trSaturation = Math.round(
      ((sArr[Saturation] - min) / (max - min)) * 255
    );
    //const addSaturation = trSaturation - Saturation;
    //console.log(trSaturation, "trSaturation",);
    newPhoto[i + 1] = trSaturation;
    if (newPhoto[i + 1] > 255) {
      newPhoto[i + 1] = 1;
    } else {
      newPhoto[i + 1] /= 255;
    }
    //console.log(newPhoto[i + 1]);
  }
  return newPhoto;
};
const tuenR = (photo, size = 255) => {
  const HsvPhoto = RgbToHsv(photo);
  const newHsvPhoto = equalizationHsv(HsvPhoto, size);
  const newRgbPhoto = HsvToRgb(newHsvPhoto);
  return newRgbPhoto;
};
const tuenS = (photo) => {
  const HsvPhoto = RgbToHsv(photo);
  const newHsvPhoto = equalizationHsvS(HsvPhoto);
  const newRgbPhoto = HsvToRgb(newHsvPhoto);
  return newRgbPhoto;
};
const equalizationS = (photo) => {
  const SaturationArr = new Array(256).fill(0),
    sArr = new Array(256).fill(0);
  const newPhoto = [];
  let min = 0,
    max;
  for (let i = 0; i < photo.length; i += 4) {
    const [r, g, b] = [photo[i], photo[i + 1], photo[i + 2]];
    const Saturation = Math.max(r, g, b) - Math.min(r, g, b);
    SaturationArr[Saturation]++;
  }
  sArr[0] = SaturationArr[0];
  for (let i = 1; i < SaturationArr.length; i++) {
    sArr[i] = SaturationArr[i] + sArr[i - 1];
    min = min < sArr[i] ? min : sArr[i];
    max = max > sArr[i] ? max : sArr[i];
  }
  console.log(sArr, "sArr", SaturationArr, "lightArr");
  for (let i = 0; i < photo.length; i += 4) {
    const [r, g, b] = [photo[i], photo[i + 1], photo[i + 2]];
    const Saturation = Math.max(r, g, b) - Math.min(r, g, b);
    const trSaturation = Math.round(
      ((sArr[Saturation] - min) / (max - min)) * 255
    );
    //const addSaturation = trSaturation - Saturation;
    i < 200 &&
      console.log(Saturation, "Saturation", trSaturation, "trSaturation");
    if (r === Math.max(r, g, b)) {
      photo[i] = trSaturation; //Math.round(r * (trSaturation / Saturation));
    } else if (g === Math.max(r, g, b)) {
      photo[i + 1] = trSaturation; //Math.round(r * (trSaturation / Saturation));
    } else {
      photo[i + 2] = trSaturation; //Math.round(r * (trSaturation / Saturation));
    }
    // photo[i] = Math.round(r * (trSaturation / Saturation));
    // photo[i + 1] = Math.round(g * (trSaturation / Saturation));
    // photo[i + 2] = Math.round(b * (trSaturation / Saturation));
  }
};
const adjustment_RGB = (photo, rgb) => {
  for (let i = 0; i < photo.length; i += 4) {
    const [r, g, b] = (rgb[(photo[i], photo[i + 1], photo[i + 2])] = [
      photo[i] + r,
      photo[i + 1] + g,
      photo[i + 2] + b,
    ]);
  }
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
  //console.log(max, min, "max -  min");
  //console.log(sArr, "sArr", lightArr, "lightArr");
  for (let i = 0; i < HsvPhoto.length; i += 3) {
    const Saturation = Math.round(HsvPhoto[i + 1] * 255);
    const trSaturation = Math.round(
      ((sArr[Saturation] - min) / (max - min)) * 255
    );
    //const addSaturation = trSaturation - Saturation;
    //console.log(trSaturation, "trSaturation",);
    newPhoto[i + 1] = trSaturation;
    if (newPhoto[i + 1] > 255) {
      // newPhoto[i + 1] = 1;
      resArr[255]++;
    } else {
      //newPhoto[i + 1] /= 255;
      resArr[newPhoto[i + 1]]++;
    }
    //console.log(newPhoto[i + 1]);
  }
  console.log(SaturationArr, "Sa");
  console.log(resArr, "res");
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
  // return [
  //   resArr.indexOf(Math.max(...resArr)),
  //   SaturationArr.indexOf(Math.max(...SaturationArr)),
  // ];
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
    // if (type === "s") {
    //   if (newPhoto[i + index] > 255) {
    //     newPhoto[i + index] = 1;
    //   } else {
    //     newPhoto[i + index] /= 255;
    //   }
    // } else
    if (newPhoto[i + index] > 255) {
      newPhoto[i + index] = 255;
    }
    rArr[newPhoto[i + index]]++;
  }
  //console.log(Math.max(...rArr), Math.max(...lightArr), "max is ");
  return [
    rArr.indexOf(Math.max(...rArr)),
    lightArr.indexOf(Math.max(...lightArr)),
  ];
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
  HsvAdjustment(HsvPhoto, add, "v");
  console.log(increB, initB, "?");
  const newRgbPhoto = HsvToRgb(HsvPhoto);
  return newRgbPhoto;
};
const global_saturation_adjustment = (photo) => {
  const HsvPhoto = RgbToHsv(photo);
  const [increB, initB] = getSincrement(HsvPhoto);
  const add = increB - initB > 30 ? 30 : increB - initB;
  //const add = increB - initB;
  HsvAdjustment(HsvPhoto, add / 255, "s");
  console.log(increB, initB, "?");
  const newRgbPhoto = HsvToRgb(HsvPhoto);
  return newRgbPhoto;
};

const global_saturationAndValue_adjustment = (photo) => {
  const HsvPhoto = RgbToHsv(photo);
  const [increV, initV] = getIncrement(HsvPhoto, "v");
  const [increS, initS] = getIncrement(HsvPhoto, "s");
  const addV = increV - initV > 30 ? 30 : increV - initV,
    addS = increS - initS > 30 ? 30 : increS - initS;
  //const add = increB - initB;
  HsvAdjustment(HsvPhoto, 50 / 255, "s");
  HsvAdjustment(HsvPhoto, addV, "v");
  console.log(addV, addS, "both add");
  const newRgbPhoto = HsvToRgb(HsvPhoto);
  return newRgbPhoto;
};
export {
  equalization,
  RgbToHsv,
  HsvToRgb,
  tuenR,
  tuenS,
  equalizationS,
  adjustment_RGB,
  global_brightness_adjustment,
  global_saturation_adjustment,
  global_saturationAndValue_adjustment,
};
