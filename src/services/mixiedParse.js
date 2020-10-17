export default  {
  parse(str){
    if(process.env.VUE_APP_MIXIED_IMGURL_PARSE==false)
        return str
        
    return str.replace('http', 'https')
  },
}


