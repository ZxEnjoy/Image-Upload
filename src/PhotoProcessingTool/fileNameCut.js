function fileNameCut(path){
    let tep = '',res=[]
    for(let i=0;i<path.length;i++){
        if(path[i]!=='/'){
            tep+=path[i]
        }else{
            res.push(tep)
            tep=''
        }
        if(i===path.length-1){
            res.push(tep)
        }
    }
    return res
}