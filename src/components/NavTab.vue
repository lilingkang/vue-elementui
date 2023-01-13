<template>
  <div id="navTab">
    <!-- 内容区 -->
    <el-tabs
      :value="activeIndex"
      type="card"
      closable
      v-if="openTab.length"
      @tab-click='tabClick'
      @tab-remove='tabRemove'
      tab-position="top"
      style="width: 100%;height: 100%;"
    >
      <!-- 获取vuex中的openTab数组数据，循环展示 -->
      <el-tab-pane
        :key="index"
        v-for="(item, index) in openTab"
        :label="item.name"
        :name="item.route"
      >
        <!-- 展示路由内容 -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {mapMutations, mapState} from 'vuex'

export default {
  name: 'NavTab',
  data () {
    return {

    }
  },
  computed: {
    ...mapState('navTab', ['openTab', 'activeIndex'])
  },
  methods: {
    // tab标签点击时，切换相应的路由
    tabClick (tab) {
      this.SET_ACTIVE_TABS(tab.name)
      this.$router.push({path: this.activeIndex})
    },
    // 移除tab标签
    tabRemove (targetName) {
      // 首页不删
      if (targetName === '/home') {
        return
      }
      this.DELETE_TABS(targetName)
      if (this.activeIndex === targetName) {
        // 设置删除后，重新激活的路径
        // 设置路由展示，为索引前一个路由
        this.SET_ACTIVE_TABS(this.openTab[this.openTab.length - 1].route)
        // 跳转路由
        this.$router.push({path: this.activeIndex})
      }
    },
    ...mapMutations('navTab', ['ADD_TABS', 'DELETE_TABS', 'SET_ACTIVE_TABS'])
  },
  mounted () {
    if (this.$route.path === '/') {
      this.SET_ACTIVE_TABS('/home')
      this.$router.push({path: '/home'})
    } else {
      this.SET_ACTIVE_TABS(this.$route.path)
    }
  },
  watch: {
    '$route' (to, from) {
      // 判断路由是否已经打开
      // 已经打开的 ，将其置为active
      // 未打开的，将其放入队列里
      var toPathIndex = this.openTab.findIndex(el => el.route === to.path)
      if (toPathIndex !== -1) { // 路由已经打开
        this.SET_ACTIVE_TABS(to.path)
      } else {
        if (to.path === '/monitor/agv') {
          this.ADD_TABS({route: to.path, name: 'AGV工况监控'})
          this.SET_ACTIVE_TABS(to.path)
        }
        if (to.path === '/customer/createorder') {
          this.ADD_TABS({route: to.path, name: '创建订单'})
          this.SET_ACTIVE_TABS(to.path)
        }
        if (to.path === '/userinfo') {
          this.ADD_TABS({route: to.path, name: '用户信息'})
          this.SET_ACTIVE_TABS(to.path)
        }
        if (to.path === '/facility') {
          this.ADD_TABS({route: to.path, name: '加工设备监测'})
          this.SET_ACTIVE_TABS(to.path)
        }
        if (to.path === '/dispatch') {
          this.ADD_TABS({route: to.path, name: '机器人调度'})
          this.SET_ACTIVE_TABS(to.path)
        }
        if (to.path === '/monitor/product') {
          this.ADD_TABS({route: to.path, name: '产品定制'})
          this.SET_ACTIVE_TABS(to.path)
        }
        if (to.path === '/customer/myorder') {
          this.ADD_TABS({route: to.path, name: '我的订单'})
          this.SET_ACTIVE_TABS(to.path)
        }
        if (to.path === '/monitor/order') {
          this.ADD_TABS({route: to.path, name: '订单管理'})
          this.SET_ACTIVE_TABS(to.path)
        }
      }
    }
  }
}
</script>

<style scoped>
#navTab{
  /*position: fixed;*/
  /*left: 200px;*/
  /*top: 46px;*/
  /*right: 0px;*/
  /*bottom: 0px;*/
}
</style>
