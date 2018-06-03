import Vue from 'vue'
import Router from 'vue-router'
import LoginRegister from '@/components/LoginRegister'
import ChatHome from '@/views/ChatHome'
import Room from '@/views/Room'
import Friends from '@/views/Friends'
import Homepage from '@/views/Homepage'



Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ChatHome',
      component: ChatHome
    },
    {
      path: '/room/:roomId',
      name: 'Room',
      component: Room
    },
    {
      path: '/friends',
      name: 'Friends',
      component: Friends,

    },
    {
      path: '/homepage',
      name: 'Homepage',
      component: Homepage
    },
    {
      path: '/loginRegister',
      name: 'LoginRegister',
      component: LoginRegister
    },
  ]
})
