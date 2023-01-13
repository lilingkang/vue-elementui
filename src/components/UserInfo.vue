<template>
  <div>
    <el-form label-width="80px" id="info-box" class="box">
      <el-form-item label="用户ID">
        <el-input readonly :value="$cookies.get('user_session').uid"></el-input>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input readonly :value="$cookies.get('user_session').name"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input readonly :value="$cookies.get('user_session').password"></el-input>
      </el-form-item>
      <el-form-item label="注册时间">
        <el-input readonly :value="new Date($cookies.get('user_session').registerTime).toLocaleDateString() +
        ' ' + new Date($cookies.get('user_session').registerTime).toLocaleTimeString()"></el-input>
      </el-form-item>
      <el-form-item label="身份">
        <el-input readonly :value="$cookies.get('user_session').identity"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'UserInfo'
}
</script>

<style scoped>
#info-box {
  background-color: white;
  position: fixed;
  top: 20vh;
  left: 38vw;
  padding: 35px 35px 20px 15px;
  -webkit-border-radius: 20px;
}
</style>
