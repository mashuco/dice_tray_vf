export default  {
    created() {
    },
    data(){
        return {
          dialogLogout:false,
          loginUsers:[]   
        }
      },
    mounted(){
    },
    computed: {
    },
    methods:{
        fireBaseRegistLoginStatus(uid){
            if(Vue.config.debug ||this.$store.getters.nonLogin)
              return
      
            const userStatusDatabaseRef = firebase.database().ref('/login/'+this.$store.getters.trpgSessionId+'/'+uid)
            const isOnlineForDatabase = {
                state: 'online',
               last_changed: firebase.database.ServerValue.TIMESTAMP,
            }
      
            firebase.database().ref('.info/connected').on('value', function(snapshot) {
              if (snapshot.val() == false) {
                  return
              }
              userStatusDatabaseRef.onDisconnect().remove().then(function() {
                  userStatusDatabaseRef.set(isOnlineForDatabase)
              })
            })
      
          },
          fireBaseLiveUpdateLoginUsers(){      
            if(Vue.config.debug ||this.$store.getters.nonLogin)
            {
              //this.loginUsers = ['test']
              return
            }
            
            this.loginUsers = []
            var fbRef = firebase.database().ref('/login/'+this.$store.getters.trpgSessionId+'/')
            fbRef.on('value',this.UpdateLoginUsers)
          },
          UpdateLoginUsers(data){
            this.loginUsers=[]
            const rootList = data.val()
            const key = data.key
            if(rootList==null) 
              return
      
            Object.keys(rootList).forEach((val, key) => {
              rootList[val].id = val
              this.loginUsers.push(rootList[val].id)
            })
      
          },
    }
  }