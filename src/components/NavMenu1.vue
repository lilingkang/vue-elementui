<template>
  <div>
    <!--<h1 style="margin: 0;color: white;-->
    <!--text-align: center;-->
    <!--background-color: #545c64;-->
    <!--box-sizing:border-box;-->
    <!--width: 100vw;height: 46px;border-bottom: 3px solid #8f9298">AGV作业监控系统</h1>-->
    <div id="nav">
      <el-row class="tac">
        <el-col :span="12">
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            :collapse="isCollapse"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
            <el-submenu index="1" v-if="$cookies.isKey('user_session')&&
          $cookies.get('user_session').identity==='administrator'">
              <template slot="title">
                <i class="el-icon-s-home"></i>
                <span slot="title">控制中心</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="1-1">
                  <router-link to="/monitor/agv" class="link">
                    <i class="el-icon-s-data"></i>
                    AGV工况监控
                  </router-link>
                </el-menu-item>
                <el-menu-item index="1-2">
                  <router-link to="/monitor/product" class="link">
                    <i class="el-icon-s-goods"></i>
                    产品定制
                  </router-link>
                </el-menu-item>
                <el-menu-item index="1-3">
                  <router-link to="/monitor/order" class="link">
                    <i class="el-icon-notebook-1"></i>
                    订单管理
                  </router-link>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>

            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-s-custom"></i>
                <span slot="title">客户中心</span>
              </template>
              <el-menu-item-group title="">
                <el-menu-item index="2-1" v-if="!$cookies.isKey('user_session')">
                  <router-link to="/customer/login" class="link">
                    <i class="el-icon-user-solid"></i>
                    登录
                  </router-link>
                </el-menu-item>
                <el-menu-item index="2-2" v-if="!$cookies.isKey('user_session')">
                  <router-link to="/customer/register" class="link">
                    <i class="el-icon-user"></i>
                    注册
                  </router-link>
                </el-menu-item>
                <el-menu-item index="2-3" v-if="$cookies.isKey('user_session')">
                  <router-link to="/customer/createorder" class="link">
                    <i class="el-icon-s-order"></i>
                    创建订单
                  </router-link>
                </el-menu-item>
                <el-menu-item index="2-4" v-if="$cookies.isKey('user_session')">
                  <router-link to="/customer/myorder" class="link">
                    <i class="el-icon-star-off"></i>
                    我的订单
                  </router-link>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>

            <el-menu-item index="3" v-if="$cookies.isKey('user_session')&&
          $cookies.get('user_session').identity==='administrator'">
              <router-link to="/facility" class="link">
                <i class="el-icon-s-marketing"></i>
                <span>
              加工设备监测
            </span>
              </router-link>
            </el-menu-item>

            <el-menu-item index="4" v-if="$cookies.isKey('user_session')&&
          $cookies.get('user_session').identity==='administrator'">
              <router-link to="/dispatch" class="link">
                <i class="el-icon-s-opportunity"></i>
                <span>
              机器人调度
            </span>
              </router-link>
            </el-menu-item>

            <!--<el-submenu index="5">-->
            <!--  <template slot="title">-->
            <!--    <i class="el-icon-s-tools"></i>-->
            <!--    <span slot="title">设置</span>-->
            <!--  </template>-->
            <!--  <el-menu-item-group title="">-->
            <!--    <el-menu-item index="5-1">-->
            <!--      <router-link to="#" class="link">-->
            <!--        <i class="el-icon-switch-button"></i>-->
            <!--        选项1-->
            <!--      </router-link>-->
            <!--    </el-menu-item>-->
            <!--  </el-menu-item-group>-->
            <!--</el-submenu>-->
          </el-menu>
        </el-col>
      </el-row>
    </div>
    <div id="menu-header">
      <div id="user-state">
        <UserState v-if="$cookies.isKey('user_session')"></UserState>
      </div>
      <div id="fullScreen">
        <i :class="iconClass" @click="onClick"></i>
      </div>
      <div id="collapse">
        <i :class="iconClass1" @click="onClick1"></i>
      </div>
    </div>
  </div>
</template>

<script>
import screenfull from 'screenfull'
import UserState from './UserState'

export default {
  name: 'NavMenu1',
  data () {
    return {
      iconClass: 'el-icon-full-screen',
      iconClass1: 'el-icon-caret-left',
      isCollapse: false
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    onClick () {
      if (screenfull.isFullscreen) {
        this.iconClass = 'el-icon-full-screen'
        this.exitFullScreen()
      } else {
        this.iconClass = 'el-icon-aim'
        this.fullScreen()
      }
    },
    onClick1 () {
      if (!this.isCollapse) {
        this.isCollapse = true
        this.iconClass1 = 'el-icon-caret-right'
      } else {
        this.isCollapse = false
        this.iconClass1 = 'el-icon-caret-left'
      }
    },
    fullScreen () {
      if (screenfull.isEnabled && !screenfull.isFullscreen) {
        screenfull.request()
      }
    },
    exitFullScreen () {
      if (screenfull.isEnabled && screenfull.isFullscreen) {
        screenfull.exit()
      }
    }
  },
  components: {
    UserState
  }
}
</script>

<style scoped>
#nav{
  float: left;
  height: 100vh;
  z-index: 1;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}
.el-menu-vertical-demo{
  height: 100vh;
}
.link {
  text-decoration: none;
  color: white;
}
.link:active{
  color: #3afdfb;
}
#menu-header{
  height: 40px;
  width: 100vw;
  background-color: #D6DCE5FF;
  display: table-cell;
}
#user-state{
  display: inline-block;
  height: 40px;
  float: right;
  width: 40px;
  margin: 0 10px;
}
#fullScreen{
  display: inline-block;
  height: 100%;
  font-size: 25px;
  color: #8f9298;
  float: right;
  width: 40px;
  text-align: center;
  border-radius: 10px;
}
#fullScreen:hover{
  background: rgb(164, 169, 175);
}
#collapse{
  display: inline-block;
  height: 100%;
  font-size: 25px;
  color: #8f9298;
  float: left;
  width: 40px;
  text-align: center;
  border-radius: 10px;
}
#collapse:hover{
  background: rgb(164, 169, 175);
}
</style>
