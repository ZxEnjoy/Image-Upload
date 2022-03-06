const FilesTree = (props)=>{
    const fileList = props.fileList
    
    return(
        <div>
            <ul>
                {fileList.map(
                    (i)=>{
                        return (<ol key={i.lastModified+i.size}>{i.name}</ol>)
                    }
                )}
            </ul>
        </div>
    )
}
export default FilesTree