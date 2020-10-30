import Cookies from 'js-cookie'

export default {
  async getKeyTestModeFromDejangoRestAuth(axios,path){
    var csrftoken = Cookies.get('csrftoken')
    await axios.post(path+'/rest-auth/login/', //for django rest auth
    { 
      username:process.env.VUE_APP_TEST_USER_NAME, 
      password:this.testUserPassWord,//process.env.VUE_APP_TEST_USER_PASS,
    },
    {
      headers: {'X-CSRFToken': csrftoken,},}
    ).then(response => {
      return response.data.key
    }).catch(error => {
      return ''
    })
  },
  async getKeyFromDejangoRestAuthSocialTw(axios,path,twToken,twSecretToken){
    var csrftoken = Cookies.get('csrftoken')
    await axios.post(path+'/twitter/', //for django rest auth 
    { 
      access_token:twToken, 
      token_secret:twSecretToken,
    },
    {
      headers: {'X-CSRFToken': csrftoken,},}
    ).then(response => {
      return response.data.key
    }).catch(error => {
      return ''
    })
  },
}