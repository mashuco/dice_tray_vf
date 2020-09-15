
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
  }).catch(error => {
    this.dialogMsgArr =[]

    if(!(error.response.data.tw_UID==null))
      this.dialogMsgArr.push(error.response.data.tw_UID[0])
    if(!(error.response.data.tw_name ==null))
      this.dialogMsgArr.push(error.response.data.tw_name[0])
    if(this.dialogMsgArr == null)
      this.dialogMsgArr.push("不正なTwitter情報です")

    this.dialog = true
  });
};
