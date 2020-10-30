import Cookies from 'js-cookie'

export default {
  async regist(axios,twUID,twName,twPhoto,sessionUserId){
    if(sessionUserId ==false)
      return

    var csrftoken = Cookies.get('csrftoken')
    await axios.patch(
      '/userTwUp/'+sessionUserId+'/', 
      { 
        tw_UID :twUID,
        tw_name:twName,
        tw_photo:twPhoto
      },
      {
        headers: {
          'X-CSRFToken': csrftoken,
        },
      }
    ).then(response => {
      return  response.data
    })
  }
}
