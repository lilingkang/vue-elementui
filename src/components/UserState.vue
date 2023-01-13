<template>
  <div id="head">
    <el-col :span="12">
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          <el-avatar shape="square" :size="40">{{$cookies.get('user_session').name}}</el-avatar>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-user-solid">
            <router-link to="/userinfo" class="link">用户信息</router-link>
          </el-dropdown-item>
          <el-dropdown-item v-if="$cookies.get('user_session').identity==='customer'"
                            icon="el-icon-s-check" @click.native="applyAdmin">申请成为管理员</el-dropdown-item>
          <el-dropdown-item v-if="$cookies.get('user_session').identity==='administrator'"
                            icon="el-icon-check">您已经成为管理员</el-dropdown-item>
          <el-dropdown-item icon="el-icon-switch-button" @click.native="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      width="30%"
      >
      <span>请输入管理员激活码</span>
      <span>
        <el-input type="text" placeholder="请输入激活码" v-model="key"/>
      </span>
      <span slot="footer" class="dialog- footer">
        <el-button type="primary" @click="handleClose2">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'

export default {
  name: 'UserState',
  data: () => ({
    dialogVisible: false,
    key: null
  }),
  computed: {
    ...mapState('customer', ['userInfo'])
  },
  methods: {
    logout () {
      this.$cookies.remove('user_session')
      this.$store.commit('navTab/SET_ACTIVE_TABS', '/home')
      this.$router.push({path: '/home'})
      // 刷新网页
      window.location.reload()
    },
    applyAdmin () {
      this.dialogVisible = true
    },
    handleClose2 () {
      if (this.key === 'root') {
        let name = this.$cookies.get('user_session').name
        this.UPDATE_IDENTITY([this.$cookies.get('user_session').uid, 'administrator'])
        this.$cookies.set('user_session', {
          ...this.userInfo.find(el => el.name === name)}, '60MIN')
        // 刷新网页
        window.location.reload()
      } else {
        alert('激活码错误，申请失败！')
      }
      this.key = ''
      this.dialogVisible = false
    },
    ...mapMutations('customer', ['UPDATE_IDENTITY'])
  }
}
</script>

<style scoped>
#head{
  z-index: 2;
}
.link {
  text-decoration: none;
  color: #606060FF;
}
.link:active{
  color: #3afdfb;
}
</style>
