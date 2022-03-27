import { Slider } from "antd";
import { useState } from "react";
const SelfTool = (props) => {
  //const [rgb,setRgb] = useState([]);
  const { param, handleChange } = props;
  const [r, g, b] = param;
  return (
    <div>
      <div>
        select:R
        <Slider
          min={-100}
          value={r}
          onChange={(value) => {
            handleChange(value, 0);
          }}
        ></Slider>
      </div>
      <div>
        select:G
        <Slider
          min={-100}
          value={g}
          onChange={(value) => {
            handleChange(value, 1);
          }}
        ></Slider>
      </div>
      <div>
        select:B
        <Slider
          min={-100}
          value={b}
          onChange={(value) => {
            handleChange(value, 2);
          }}
        ></Slider>
      </div>
    </div>
  );
};
export default SelfTool;
