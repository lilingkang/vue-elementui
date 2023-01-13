// 该文件用于创建Vuex中最为核心的store

// 引入Vuex
import Vuex from 'vuex'
import Vue from 'vue'
import createPersistedState from 'vuex-persistedstate'

const temp = {
  namespaced: true,
  actions: {},
  mutations: {
    ADD_TEMP (state, value) {
      state.tempList.push(value)
    },
    CLREA_TEMP (state) {
      state.tempList = []
    }
  },
  state: {
    tempList: []
  },
  getters: {}
}

const navTab = {
  namespaced: true,
  actions: {},
  mutations: {
    // 添加tabs
    ADD_TABS (state, data) {
      state.openTab.push(data)
    },
    // 删除tabs
    DELETE_TABS (state, route) {
      let index = 0
      for (let option of state.openTab) {
        if (option.route === route) {
          break
        }
        index++
      }
      state.openTab.splice(index, 1)
    },
    // 设置当前激活的tab
    SET_ACTIVE_TABS (state, index) {
      state.activeIndex = index
    },
    SET_URL (state, data) {
      state.url = data
    },
    INIT (state) {
      state.openTab = [{route: '/home', name: '首页'}]
      state.activeIndex = '/home'
    },
    STOP (state) {
      state.stopRender = true
    },
    START (state) {
      state.stopRender = false
    }
  },
  state: {
    openTab: [{route: '/home', name: '首页'}], // 所有打开的路由
    activeIndex: '/home', // 也可以是默认激活路径；激活状态
    url: 'ws://10.178.253.143:9090',
    // url: 'ws://ngrok.xiaomiqiu123.top:35394',
    // url: 'ws://10.178.253.143:35394',
    stopRender: false
  },
  getters: {}
}

const customer = {
  namespaced: true,
  actions: {

  },
  mutations: {
    ADD_USER (state, value) {
      state.userInfo.unshift(value)
    },
    DEL_USER (state, value) {
      state.userInfo.splice(state.userInfo.findIndex(el => el.name === value), 1)
    },
    UPDATE_IDENTITY (state, [uid, value]) {
      state.userInfo.find(el => el.uid === uid).identity = value
    }
  },
  state: {
    userInfo: [{
      uid: 'U-001',
      name: 'admin',
      password: '123',
      registerTime: 1654778856356,
      identity: 'administrator'
    }, {
      uid: null,
      name: null,
      password: null,
      registerTime: null,
      identity: null
    }
    ]
  },
  getters: {}
}

const order = {
  namespaced: true,
  actions: {},
  mutations: {
    ADD_ORDER (state, value) {
      state.orderList.unshift(value)
    },
    DEL_ORDER (state, value) {
      state.orderList.splice(state.orderList.findIndex(el => el.orderId === value), 1)
    }
  },
  state: {
    orderList: [
      {
        orderId: null,
        uid: null,
        productsList: [
          {
            productTypeId: null,
            productObjectId: null,
            productNum: null
          }
        ],
        submitTime: null,
        dateTime: null
      }
    ]
  },
  getters: {}
}

const product = {
  namespaced: true,
  actions: {},
  mutations: {
    ADD_PRODUCT (state, value) {
      state.productType.unshift(value)
    },
    DEL_PRODUCT (state, value) {
      state.productType.splice(state.productType.findIndex(el => el.typeId === value), 1)
    }
  },
  state: {
    productType: [
      {
        typeId: 'P-006',
        name: '产品6',
        reqMaterialTypeId: 'M-006',
        craftProcess: [
          {
            craftId: 'CR-003'
          },
          {
            craftId: 'CR-004'
          }
        ]
      },
      {
        typeId: 'P-005',
        name: '产品5',
        reqMaterialTypeId: 'M-005',
        craftProcess: [
          {
            craftId: 'CR-003'
          }
        ]
      },
      {
        typeId: 'P-004',
        name: '产品4',
        reqMaterialTypeId: 'M-004',
        craftProcess: [
          {
            craftId: 'CR-002'
          },
          {
            craftId: 'CR-004'
          }
        ]
      },
      {
        typeId: 'P-003',
        name: '产品3',
        reqMaterialTypeId: 'M-003',
        craftProcess: [
          {
            craftId: 'CR-002'
          }
        ]
      },
      {
        typeId: 'P-002',
        name: '产品2',
        reqMaterialTypeId: 'M-002',
        craftProcess: [
          {
            craftId: 'CR-001'
          },
          {
            craftId: 'CR-004'
          }
        ]
      },
      {
        typeId: 'P-001',
        name: '产品1',
        reqMaterialTypeId: 'M-001',
        craftProcess: [
          {
            craftId: 'CR-001'
          }
        ]
      },
      {
        typeId: null,
        name: null,
        reqMaterialTypeId: null,
        craftProcess: [
          {
            craftId: null
          }
        ]
      }
    ],
    productObject: [
      {
        objectId: null,
        typeId: null,
        useMaterialObjectId: null
      }
    ]
  },
  getters: {}
}

const craft = {
  namespaced: true,
  actions: {
    update_time (context) {
      // eslint-disable-next-line no-implied-eval
      setTimeout(() => {
        if (context.state.updateFlag) {
          context.commit('UPDATE_TIME')
          context.dispatch('update_time')
        }
      }, 1000)
    }
  },
  mutations: {
    UPDATE_TIME (state) {
      for (let i = 0; i < state.craftType.length; i++) {
        if (state.craftType[i].remainTime) {
          state.craftType[i].remainTime--
        }
      }
    },
    RESET_TIME (state) {
      for (let i = 0; i < state.craftType.length; i++) {
        state.craftType[i].remainTime = 0
      }
    },
    SET_UPDATE_FLAG (state) {
      state.updateFlag = 1
    },
    RESET_UPDATE_FLAG (state) {
      state.updateFlag = 0
    },
    UPDATE_STATE (state, value) {
      if (value.action === 'add') {
        state.craftType[value.index].state.unshift(value.val)
        state.craftType[value.index].remainTime += state.craftType[value.index].time
      } else if (value.action === 'remove') {
        state.craftType[value.index].state.splice(state.craftType[value.index].state.findIndex(el => el.objectId === value.val.objectId), 1)
      } else if (value.action === 'clear') {
        state.craftType[0].state.splice(0, state.craftType[0].state.length)
        state.craftType[1].state.splice(0, state.craftType[1].state.length)
        state.craftType[2].state.splice(0, state.craftType[2].state.length)
        state.craftType[3].state.splice(0, state.craftType[3].state.length)
      }
    }
  },
  state: {
    // start: [0, 0],
    start: [6, -1],
    // end: [-11.9, 0],
    end: [7.85, -22.2],
    updateFlag: 0,
    craftType: [
      {
        craftId: 'CR-001',
        name: '车削',
        time: 30,
        // position: [-1.8, 3],
        position: [4, -5.7],
        state: [],
        remainTime: 0
      },
      {
        craftId: 'CR-002',
        name: '铣削',
        time: 40,
        // position: [0, 5],
        position: [9, -5],
        state: [],
        remainTime: 0
      },
      {
        craftId: 'CR-003',
        name: '钻孔',
        time: 20,
        // position: [-1.9, 9.1],
        position: [4.8, -14.2],
        state: [],
        remainTime: 0
      },
      {
        craftId: 'CR-004',
        name: '磨削',
        time: 50,
        // position: [-7.9, 5.15],
        position: [9.8, -13.5],
        state: [],
        remainTime: 0
      }
    ]
  },
  getters: {}
}

const material = {
  namespaced: true,
  actions: {},
  mutations: {},
  state: {
    materialType: [
      {
        typeId: 'M-001',
        name: '红色圆棒',
        shape: '圆棒',
        color: '红'
      },
      {
        typeId: 'M-002',
        name: '绿色圆棒',
        shape: '圆棒',
        color: '绿'
      },
      {
        typeId: 'M-003',
        name: '红色圆盘',
        shape: '圆盘',
        color: '红'
      },
      {
        typeId: 'M-004',
        name: '蓝色圆盘',
        shape: '圆盘',
        color: '蓝'
      },
      {
        typeId: 'M-005',
        name: '绿色平板',
        shape: '平板',
        color: '绿'
      },
      {
        typeId: 'M-006',
        name: '蓝色平板',
        shape: '平板',
        color: '蓝'
      }
    ],
    materialObject: [
      {
        objectId: null,
        typeId: null,
        surfaceQuality: null
      }
    ]
  },
  getters: {}
}

Vue.use(Vuex)

// 创建 并导出store
const store = new Vuex.Store({
  modules: {
    temp,
    customer,
    navTab,
    order,
    product,
    craft,
    material
  },
  plugins: [createPersistedState()]
})

export default store
