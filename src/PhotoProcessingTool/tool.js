const cut_photo = ()=>{

}
const brightness_adjustment = (photo,brightness)=>{
    for(let i =0 ;i<photo.length;i+=4){
        photo[i]+=brightness
        photo[i+1]+=brightness
        photo[i+2]+=brightness
    }
    return photo
}
const contrast_adjustment= (photo,contrast)=>{
    for(let i =0 ;i<photo.length;i+=4){
        photo[i]+=contrast
        photo[i+1]+=contrast
        photo[i+2]+=contrast
    }
    return photo
}