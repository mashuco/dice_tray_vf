import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

  const routes = [
    {
      path: '/login',
      name: 'login',
      component: function () {
        return import(/* webpackChunkName: "diceTray" */ '../views/Login.vue')
      }
    },
    {
      path: '/session',
      name: 'session',
      component: function () {
        return import(/* webpackChunkName: "diceTray" */ '../views/SessionSelect.vue')
      }
    },
    {
      path: '/ticket',
      name: 'ticket',
      component: function () {
        return import(/* webpackChunkName: "diceTray" */ '../views/TicketSelect.vue')
      }
    },
    {
      path: '/onse',
      component: function () {
        return import(/* webpackChunkName: "diceTray" */ '../views/Onse.vue')
      },
      children:[
        {
          path: '/scene',
          name: 'scene',
          component: function () {
            return import(/* webpackChunkName: "diceTray" */ '../views/onse/Scene.vue')
          }
        },
        {
          path: '/member_profile',
          name: 'member_profile',
          component: function () {
            return import(/* webpackChunkName: "diceTray" */ '../views/onse/MemberProfile.vue')
          }   
        },
        {
          path: '/my_profile',
          name: 'my_profile',
          component: function () {
            return import(/* webpackChunkName: "diceTray" */ '../views/onse/MyProfile.vue')
          }   
        },
        {
          path: '/items',
          name: 'items',
          component: function () {
            return import(/* webpackChunkName: "diceTray" */ '../views/onse/Items.vue')
          }   
        },
      ]
    },

  ]

const router = new VueRouter({
  routes
})

export default router
