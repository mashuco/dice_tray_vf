import Vue from 'vue'
import VueRouter from 'vue-router'
import Scene from '../views/Scene.vue'

Vue.use(VueRouter)

  const routes = [
    {
      path: '/items',
      name: 'items',
      component: function () {
        return import(/* webpackChunkName: "diceTray" */ '../views/Items.vue')
      }   
    },
    {
      path: '/member_profile',
      name: 'member_profile',
      component: function () {
        return import(/* webpackChunkName: "diceTray" */ '../views/MemberProfile.vue')
      }   
    },
    {
      path: '/my_profile',
      name: 'my_profile',
      component: function () {
        return import(/* webpackChunkName: "diceTray" */ '../views/MyProfile.vue')
      }   
    },
    {
      path: '/scene',
      name: 'scene',
      component:Scene
//      component: function () {
//        return import(/* webpackChunkName: "diceTray" */ '../views/Scene.vue')
//      }
    },

  ]

const router = new VueRouter({
  routes
})

export default router
