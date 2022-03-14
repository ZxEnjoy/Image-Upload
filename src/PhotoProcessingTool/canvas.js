const readFile = (file, canvas) => {
  if (file) {
    const ctx = canvas.getContext("2d");
    const image = new Image();

    image.onload = () => {
      console.log(image, "image");
      const [width, height] = [image.width, image.height];
      console.log(width, height, "fucking");
      ctx.drawImage(image, 0, 0, 1000, 1000);
    };
    image.src = URL.createObjectURL(file);
  }
};
export { readFile };
