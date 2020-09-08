
import Cookies from 'js-cookie'
import axios from 'axios'

export default async function (twUID,twName,twPhoto,sessionUserId){
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
  };
