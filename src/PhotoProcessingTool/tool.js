const cut_photo = () => {};
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
  console.log(sArr, "sArr", lightArr, "lightArr");
  for (let i = 0; i < photo.length; i += 4) {
    const light = Math.round((photo[i] + photo[i + 1] + photo[i + 2]) / 3);
    const trLight = Math.round(((sArr[light] - min) / (max - min)) * 255);
    const addLight = trLight - light;
    i < 200 && console.log(light, trLight, "lt trl", min, max);
    photo[i] += addLight;
    photo[i + 1] += addLight;
    photo[i + 2] += addLight;
  }
};
const brightness_adjustment = (photo, brightness) => {
  for (let i = 0; i < photo.length; i += 4) {
    photo[i] += brightness;
    photo[i + 1] += brightness;
    photo[i + 2] += brightness;
  }
  return photo;
};
const contrast_adjustment = (photo, contrast) => {
  for (let i = 0; i < photo.length; i += 4) {
    photo[i] += contrast;
    photo[i + 1] += contrast;
    photo[i + 2] += contrast;
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
export { equalization, RgbToHsv, HsvToRgb };
