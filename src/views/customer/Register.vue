<template>
  <div>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="80px" class="register-box">
      <h3 class="register-title">欢迎 注册</h3>
      <el-form-item label=" 用户名" prop="username">
        <el-input type="text" placeholder="请输入用户名" v-model="ruleForm.username"/>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      title="温馨提示"
      :visible.sync="dialogVisible1"
      width="30%"
      :before-close="handLeClose">
      <span>请输入用户名和密码 并确认密码</span>
      <span slot="footer" class="dialog- footer">
        <el-button type="primary" @click="dialogVisible1 = false">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {mapMutations, mapState} from 'vuex'
import {nanoid} from 'nanoid'

export default {
  name: 'Register',
  data () {
    var validateUserame = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('用户名不能为空'))
      } else if (this.userInfo.findIndex(el => el.name === value) !== -1) {
        callback(new Error('该用户名已占用'))
      } else {
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        username: '',
        pass: '',
        checkPass: ''
      },
      rules: {
        username: [
          { validator: validateUserame, required: true, trigger: 'blur' }
        ],
        pass: [
          { validator: validatePass, trigger: 'blur', required: true }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur', required: true }
        ]
      },
      dialogVisible1: false
    }
  },
  computed: {
    ...mapState('customer', ['userInfo'])
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let userInfo = {...this.userInfo.slice(-1)[0]}
          userInfo.uid = 'U-' + nanoid()
          userInfo.name = this.ruleForm.username
          userInfo.password = this.ruleForm.pass
          userInfo.registerTime = Date.now()
          userInfo.identity = 'customer'
          this.ADD_USER(userInfo)
          this.$router.push(this.$store.state.navTab.activeIndex)
        } else {
          this.dialogVisible1 = true
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    handLeClose () {},
    ...mapMutations('customer', ['ADD_USER'])
  }
}
</script>

<style lang="scss" scoped>
.register-box {
  background-color: white;
  width: 350px;
  margin: 180px auto;
  padding: 35px 35px 15px 35px;
  border-radius: 5px;
  -webkit-border-radius: 20px;
  -moz-border-radius: 5px;
  box-shadow: 0 0 25px #909399;
}

.register-title {
  text-align: center;
  margin: 0 auto 40px auto;
  color: rgba(0, 0, 0, 1);
}
</style>
