import Vue from 'vue'
import Router from 'vue-router'

import UserList from './views/user/UserList.vue'
import UserPageList from './views/user/UserPageList.vue'
import RoleList from './views/role/RoleList.vue'
import RolePageList from './views/role/RolePageList.vue'

Vue.use(Router)

export default new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: {
        name: 'UserList'
      }
    },
    {
      path: '/userList',
      name: 'UserList',
      component: UserList
    },
    {
      path: '/userPageList',
      name: 'UserPageList',
      component: UserPageList
    },
    {
      path: '/roleList',
      name: 'RoleList',
      component: RoleList
    },
    {
      path: '/rolePageList',
      name: 'RolePageList',
      component: RolePageList
    }
  ]
})
