<template>
  <div id="app">
    <el-header v-if="!$route.meta.hideMenu" style="padding: 0;height: 40px">
      <NavMenu></NavMenu>
    </el-header>

    <el-main style="padding: 0;" v-if="!$route.meta.hideMenu">
      <NavTab></NavTab>
      <div style="width: 100%;height: 85vh">
        <keep-alive include="Agv">
          <router-view></router-view>
        </keep-alive>
      </div>
    </el-main>
    <router-view v-if="$route.meta.hideMenu"></router-view>
  </div>
</template>

<script>
import NavMenu from './components/NavMenu1'
import NavTab from './components/NavTab'

export default {
  name: 'App',
  created () {
    if (localStorage.vuex) {
      this.list = JSON.parse(localStorage.vuex)
    }
    if (!this.$cookies.isKey('user_session')) {
      this.$store.commit('navTab/INIT')
    }
  },
  components: {
    NavMenu,
    NavTab
  },
  data () {
    return {
      useHeader: true
    }
  },
  methods: {

  }
}
</script>

<style>
#app{
  height: 100vh;
  width: 100vw;
}
.box{
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  /*box-shadow: 0 2px 4px rgba(0, 0, 0, .12);*/
  /*box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);*/
}
</style>
