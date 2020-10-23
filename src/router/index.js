import Vue from 'vue'
import VueRouter from 'vue-router'


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
      path: '/story',
      name: 'story',
      component: function () {
        return import(/* webpackChunkName: "diceTray" */ '../views/Story.vue')
      }
    },

  ]

const router = new VueRouter({
  routes
})

export default router
