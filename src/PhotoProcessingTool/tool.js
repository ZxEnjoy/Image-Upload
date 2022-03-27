const equalization = (photo) => {
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

const brightness_Hsv = (photo, contrast) => {
  for (let i = 0; i < photo.length; i += 4) {
    photo[i + 2] += contrast;
    if (photo[i + 2] > 255) {
      photo[i + 2] = 255;
    }
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
    const addSaturation = trSaturation - Saturation;
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
export {
  equalization,
  RgbToHsv,
  HsvToRgb,
  tuenR,
  tuenS,
  equalizationS,
  adjustment_RGB,
};
