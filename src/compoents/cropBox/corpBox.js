import { useState, useEffect } from "react";
const CorpBox = (props) => {
  const { Coordinate, size } = props;
  const [outBox, setOutBox] = useState({
    position: "absolute",
    width: "600px",
    height: `600px`,
    borderBottom: " 50px rgba(255, 255, 255, 0.4) solid",
    borderTop: " 50px rgba(255, 255, 255, 0.4) solid",
    borderLeft: " 50px rgba(255, 255, 255, 0.4) solid",
    borderRight: " 50px rgba(255, 255, 255, 0.4) solid",
    left: "50px",
    top: "0",
  });
  useEffect(() => {
    console.log(Coordinate, "Coordinate Coordinate");
    const [width, height] = Coordinate.map((i) => Math.round(i * size[2]));
    const [CanvasWidth, CanvasHeight, rate] = size;
    const newStyle = { ...outBox };
    const [moveWidth, moveHeight] = [
      Math.round((CanvasWidth - width) / 2),
      Math.round((CanvasHeight - height) / 2),
    ];
    newStyle.borderLeft = `${moveWidth}px solid rgba(255, 255, 255, 0.4)`;
    newStyle.borderTop = `${moveHeight}px solid rgba(255, 255, 255, 0.4)`;
    newStyle.borderBottom = `${moveHeight}px solid rgba(255, 255, 255, 0.4)`;
    newStyle.borderRight = `${moveWidth}px solid rgba(255, 255, 255, 0.4)`;
    newStyle.height = `${CanvasHeight}px`;
    // console.log(x1-x0,'?height')
    setOutBox({ ...newStyle });
  }, [Coordinate, size]);
  useEffect(() => {
    //let some = { ...outBox, height: `${size[1]}px` };
    console.log(Coordinate, "Coordinate Coordinate");
  }, [Coordinate]);
  return (
    <div style={outBox}>
      <div style={{ height: "100%", width: "100%", border: "1px solid" }}></div>
    </div>
  );
};
export default CorpBox;
