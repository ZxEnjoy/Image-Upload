import { Slider } from "antd";
import { useState, useEffect } from "react";
const SelfTool = (props) => {
  //const [rgb,setRgb] = useState([]);
  const { handleChange } = props;
  const [rgb, setRgb] = useState([0, 0, 0]);
  const [r, g, b] = rgb;
  useEffect(() => {
    handleChange(rgb, "RGB");
  }, [rgb]);
  return (
    <div>
      <div>
        select:R
        <Slider
          min={-100}
          value={r}
          onChange={(value) => {
            const newRgb = rgb.slice();
            newRgb[0] = value;
            setRgb(newRgb);
          }}
        ></Slider>
      </div>
      <div>
        select:G
        <Slider
          min={-100}
          value={g}
          onChange={(value) => {
            const newRgb = rgb.slice();
            newRgb[1] = value;
            setRgb(newRgb);
          }}
        ></Slider>
      </div>
      <div>
        select:B
        <Slider
          min={-100}
          value={b}
          onChange={(value) => {
            const newRgb = rgb.slice();
            newRgb[2] = value;
            setRgb(newRgb);
          }}
        ></Slider>
      </div>
    </div>
  );
};
export default SelfTool;
