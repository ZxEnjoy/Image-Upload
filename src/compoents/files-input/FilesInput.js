import './index.css'
import { useRef ,useEffect} from 'react'
const FilesInput = (props)=>{
    const filds = useRef()
    // const handleChange=(file)=>{
    //     const files = file.target.files
    //     console.log(file.target.files)    
    // }
    useEffect(
        ()=>{
            filds.current.webkitdirectory=true
        },
        [filds]
    )
    return(
        <div className='files-input'>
            <input
                ref={filds} 
                className='files-input-files'
                type='file' 
                onChange={props.onChange}
                onDragOver={(e)=>{
                    //console.log(e)
                    if(e.dataTransfer.items[0].type!==''){
                        filds.current.webkitdirectory=false
                    }else{
                        filds.current.webkitdirectory=true
                    }
                }}
                onMouseEnter={()=>{
                    filds.current.webkitdirectory=true
                }}
                multiple='multiple' 
                ></input>
        </div>
    )
}
export default FilesInput
// dataTransfer: DataTransfer
// dropEffect: "none"
// effectAllowed: "all"
// files: FileList {length: 0}
// items: DataTransferItemList {length: 0}
// types: Array(0)
// length: 0