export default  {
  urlPrefix(){
      return process.env.VUE_APP_IMG_URL
  },
  mediaImgUrl(str){
    if(str==null)
      return ""
    if(str.length == 0)
      return ""
    return this.urlPrefix()+str
  },
}