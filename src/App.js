import { useState,useRef,useEffect} from 'react';
import './index.css'
import FilesTree from './compoents/files-tree/FilesTree'
import FilesInput from './compoents/files-input/FilesInput';
function App() {
  const canvas = useRef()
  const tepa = useRef()
  const [filesrc,setsrc] = useState('')
  const [files,setfiles] = useState([])
  const downimg = (src)=>{
    const changeName=(uri)=>{
      var link = document.createElement('a');
      link.setAttribute("download", "is.jpg");
      link.setAttribute("href", uri);
      tepa.current.appendChild(link);
      link.click();
      tepa.current.removeChild(tepa.current.lastChild);
    }
    const downSrc = src.replace(/^data:image\/[^;]/,'data:application/octet-stream')
    console.log( src.length,downSrc.length)
    console.log(src === downSrc)
    console.log(src,'src')
    console.log(downSrc,'downSrc')
    changeName(downSrc)
    //window.open(downSrc)
  }
  const handleChange=(file)=>{
    console.log(file.target.files)
    const ctx = canvas.current.getContext('2d')
    const image = new Image()
    image.src = URL.createObjectURL(file.target.files[0])
    //window.open(image.src)
    //downimg(image.src)
    //ctx.drawImage(image,0,0)
    const src = URL.createObjectURL(file.target.files[0])
    setsrc(src)
    image.onload=()=>{
      ctx.drawImage(image,0,0);
      const canvasImg = ctx.getImageData(0,0,100,100)
      const data = canvasImg.data
      console.log(data)
      for(let i=0;i<data.length;i+=4){
        data[i+3]=255
      }
      console.log(data)
      ctx.putImageData(canvasImg,0,0)
      let b64 = canvas.current.toDataURL('image/jpeg');
      //downimg(b64)
    }

  }
  useEffect(()=>{
    console.log(files)
    //console.log(Caman,'AlloyImage')
  },[files])
  return (
    <div>
      
      <FilesInput onChange={(e)=>{
        const reg = /image/
        const photos = []
        const newFiles = new DataTransfer()
        for(let i of e.target.files){
          reg.test(i.type)&&photos.push(i)&&newFiles.items.add(i)
        }
        e.target.files=newFiles.files
        setfiles(photos)
      }}/>
      <FilesTree fileList={files}></FilesTree>
      <canvas width='1000' height='1000' ref={canvas}></canvas>
      <img src={filesrc}></img>
      <div ref={tepa}></div>
    </div>
  );
}

export default App;
