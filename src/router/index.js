import Vue from 'vue'
import Router from 'vue-router'

import Home from '../views/Home'
import Login from '../views/customer/Login'
import Agv from '../views/moniter/agv/Agv'
import NotFound from '../components/NotFound'
import Register from '../views/customer/Register'
import CreateOrder from '../views/customer/CreateOrder'
import UserInfo from '../components/UserInfo'
import Facility from '../views/facility/Facility'
import Dispatch from '../views/dispatch/Dispatch'
import ProductCustomization from '../views/moniter/ProductCustomization'
import MyOrder from '../views/customer/MyOrder'
import Order from '../views/moniter/Order'

Vue.use(Router)

export default new Router({
  mode: 'history',
  // base: '/test/',
  routes: [
    {
      path: '/home',
      component: Home,
      meta: {
        hideMenu: false
      }
    },
    {
      path: '/customer/login',
      component: Login,
      meta: {
        hideMenu: true
      }
    },
    {
      path: '/customer/register',
      component: Register,
      meta: {
        hideMenu: true
      }
    },
    {
      path: '/monitor/agv',
      component: Agv,
      meta: {
        hideMenu: false
      }
    },
    {
      path: '/customer/createorder',
      component: CreateOrder,
      meta: {
        hideMenu: false
      }
    },
    {
      path: '/userinfo',
      component: UserInfo,
      meta: {
        hideMenu: false
      }
    },
    {
      path: '/facility',
      component: Facility,
      meta: {
        hideMenu: false
      }
    },
    {
      path: '/dispatch',
      component: Dispatch,
      meta: {
        hideMenu: false
      }
    },
    {
      path: '/monitor/product',
      component: ProductCustomization,
      meta: {
        hideMenu: false
      }
    },
    {
      path: '/customer/myorder',
      component: MyOrder,
      meta: {
        hideMenu: false
      }
    },
    {
      path: '/monitor/order',
      component: Order,
      meta: {
        hideMenu: false
      }
    },
    {
      path: '/:param+',
      component: NotFound,
      meta: {
        hideMenu: true
      }
    }
  ]
})
