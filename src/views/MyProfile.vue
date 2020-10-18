<template >
    <v-container class="pa-0 my-0">
  <v-dialog v-model="dialog" max-width= "500">
    <Dialog
      v-on:clickSubmit="dialogClose"
      title="確認"
      :msgArr='dialogMsgArr'
      :notification = 'true'
    ></Dialog>
  </v-dialog>
      <v-card color="#385F73" width="100%"  class="py-1 my-1">
        <v-card-text class="pa-0 ma-0">
              <v-textarea
                  outlined
                  class="headline"
                  height="50"
                  v-model="character_name"
                  label="キャラクター名"
                  append-icon="mdi-fountain-pen-tip"
              ></v-textarea>
        </v-card-text>
        <v-card-subtitle class="pa-0 ma-0">
          <v-img 
            :src="media_url_prefix+character_image"   
            max-height="180" 
            contain />
          <v-file-input
            v-model="img_file"
            @change="getFileName"
            accept="image/*"
            label="File input"
          ></v-file-input>
        </v-card-subtitle>
        <v-card-text class="pa-1 ma-0">
            <v-textarea
              outlined
              v-model="character_profile"
              label="プロフィール"
              append-icon="mdi-fountain-pen-tip"
              class="pa-0 ma-0"
            />
        </v-card-text>
       <div
        align="center"
        style="padding:0px; margin:5px"
       >
        <v-btn 
          v-on:click="doRegistory" 
          block  
          color="warning"
          :loading="registLoading"          
          >登録</v-btn>
       </div>
      </v-card>
    </v-container>
</template>

<script>
import Vue from "vue"
import Cookies from 'js-cookie'
import mediaUtil from '../utils/mediaUtil'
import Dialog from '../components/Dialog'

export default {
  data() {
    return {
      character_name:'',
      character_profile:'',
      character_image:'',
      character_img_upfile:'',
      profileData:[],
      tw_user: {},  
      img_file:null ,
      dialogMsgArr:[],
      dialog:false,
      registLoading:false,
      dailogNotification:false
    }
  },
  components: {
    Dialog,
    
  },  
  created(){
    this.loadProfile()
  },
  computed: {
    media_url_prefix(){
        return mediaUtil.urlPrefix()
    },
  },  
  methods: {
    dialogClose(){
      this.dialog = false
    },
    async loadProfile(){
      await this.$axios.get('/uEntry/?format=json&session_user_id='+this.$store.getters.sessionUserId).then(response => {
            this.profileData = response.data
      }).catch(error => {this.dialogMsgArr.push("通信エラー"),this.dialog = true})
      this.character_name = this.profileData[0]['character_name']
      this.character_profile = this.profileData[0]['character_profile']  
      this.character_image = this.profileData[0]['character_image']  
      
    },
    getFileName(e) {
        this.imageFile = e.name
    },      
    async doRegistory(){

      this.registLoading = true   
      this.dialogMsgArr =[]

      var csrftoken = Cookies.get('csrftoken')
      const formData = new FormData()
      formData.append("character_name", this.character_name)
      formData.append("character_profile",  this.character_profile)
      if(this.img_file != null)
        formData.append("character_image", this.img_file)
 
      await this.$axios.patch(
        '/userUp/'+this.$store.getters.sessionUserId+'/', 
        formData,
        {
          headers: {
            'X-CSRFToken': csrftoken,
             'content-type': 'multipart/form-data',
          },
        }
      ).then(
        response => {this.postResuolt = response.data })  
      .catch(error => {
          if(!(error.response.data.character_name==null))
            this.dialogMsgArr.push(error.response.data.character_name[0])
          if(!(error.response.data.character_profile ==null))
            this.dialogMsgArr.push(error.response.data.character_profile[0])
          if(!(error.response.data.character_image ==null))
            this.dialogMsgArr.push("画像ファイルが不正です。png,jpgファイルを利用して下さい")

          if(this.dialogMsgArr == null)
            this.dialogMsgArr.push("不明なエラーが発生しました。")
            this.dialog = true
           this.registLoading =false
        }
      )

      if(this.dialogMsgArr.length == 0){
        this.dialogMsgArr =[]
        this.dialogMsgArr.push("登録しました")
        this.dialog = true
        this.registLoading =false
      }
      this.img_file = null
      this.loadProfile()
    },
  }
}
</script>
