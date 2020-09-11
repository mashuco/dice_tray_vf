import axios from 'axios'

export default async function(trpgSessionId) {
    var sceneAllData =[]
    await axios.get('/scene/?format=json&trpg_session_id='+trpgSessionId).then(response => {
        sceneAllData = response.data
    })
    return sceneAllData
}
