<template>
  <div>
    <!--<el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">-->
    <!--  <el-radio-button :label="false">展开</el-radio-button>-->
    <!--  <el-radio-button :label="true">收起</el-radio-button>-->
    <!--</el-radio-group>-->

    <div id="decisionArea" v-on:mouseover="handleOpen" v-on:mouseleave="handleClose">
      <el-menu
        default-active=""
        class="el-menu-vertical-demo"
        :collapse="isCollapse&&!value"
        background-color="rgba(0,0,0,0.1)"
        text-color="#ffffff"
        active-text-color="#3afdfb"
        style="border-bottom: 5px inset rgba(255,255,255,0.5);border-right: 5px inset rgba(255,255,255,0.5);">
        <el-switch
          v-model="value"
          active-color="#13ce66"
          inactive-color="#ff4949"
          v-if="(!isCollapse||value)">
        </el-switch>

        <el-submenu index="1">
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
              <router-link to="#" class="link">选项2</router-link>
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>

        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-s-custom"></i>
            <span slot="title">客户中心</span>
          </template>
          <el-menu-item-group title="">
            <el-menu-item index="2-1">
              <router-link to="/customer/login" class="link">
                <i class="el-icon-user-solid"></i>
                登录
              </router-link>
            </el-menu-item>
            <el-menu-item index="2-2">
              <router-link to="/customer/register" class="link">
                <i class="el-icon-user"></i>
                注册
              </router-link>
            </el-menu-item>
            <el-menu-item index="2-3">
              <router-link to="/customer/createorder" class="link">
                <i class="el-icon-s-order"></i>
                创建订单
              </router-link>
            </el-menu-item>
            <el-menu-item index="2-4">
              <router-link to="#" class="link">
                <i class="el-icon-star-off"></i>
                我的订单
              </router-link>
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>

        <el-menu-item index="3">
          <router-link to="#" class="link">
            <i class="el-icon-s-marketing"></i>
            <span>
              加工设备监控
            </span>
          </router-link>
        </el-menu-item>

        <el-menu-item index="4">
          <router-link to="#" class="link">
            <i class="el-icon-s-opportunity"></i>
            <span>
              机器人调度
            </span>
          </router-link>
        </el-menu-item>

        <el-submenu index="5">
          <template slot="title">
            <i class="el-icon-s-tools"></i>
            <span slot="title">设置</span>
          </template>
          <el-menu-item-group title="">
            <el-menu-item index="5-1">
              <router-link to="#" class="link">
                <i class="el-icon-switch-button"></i>
                退出登录
              </router-link>
            </el-menu-item>
            <el-menu-item index="5-2">
              <router-link to="#" class="link">选项2</router-link>
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>

      </el-menu>
    </div>

  </div>
</template>

<script>
export default {
  name: 'NavMenu',
  data () {
    return {
      isCollapse: true,
      value: false
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      let area = document.getElementById('decisionArea')
      area.style.width = '210px'
      this.isCollapse = false
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      let area = document.getElementById('decisionArea')
      area.style.width = '74px'
      this.isCollapse = true
      console.log(key, keyPath)
    }
  }
}
</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.link {
  text-decoration: none;
  color: #ffffff;
}
.link:active{
  color: #3afdfb;
}
#decisionArea {
  position: fixed;
  top: 0px;
  bottom: 0px;
  left: 0px;
  width: 74px;
  z-index: 1;
  /*border: 1px solid;*/
}
</style>
