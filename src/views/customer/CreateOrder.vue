<template>
  <div>
    <div id="order-form" class="box">
      <h3 class="order-form-title">欢迎 提交订单</h3>
      <el-form :inline="true"
               status-icon
               ref="ruleForm"
               :model="formInlines"
               class="demo-form-inline">
        <div v-for="(formInline, index) in formInlines.value" :key="index">
          <el-form-item label="产品" :prop="'value.' + index + '.productId'"
                        :rules="{required: true, message: '产品不能为空', trigger: 'blur'}">
            <el-select v-model="formInline.productId" placeholder="请选择产品">
              <el-option v-for="(subItem, subIndex) in productType"
                         v-if="subItem.typeId&&!isExist(subItem.typeId, index)"
                         :key="subIndex"
                         :label="subItem.name"
                         :value="subItem.typeId"
                         @click.native.prevent="showProductInfo(subItem)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数量" :prop="'value.' + index + '.num'"
                        :rules="{type: 'number', required: true, min: 1, message: '数量不能为空且要大于0', trigger: 'blur'}">
            <el-input-number v-model="formInline.num"></el-input-number>
          </el-form-item>
          <i v-if="index !== 0"
             :class="formInline.removeIcon"
             @click="removeItem(formInline, index)"
             @mousedown="changeStyle($event, index, 'down')"
             @mouseup="changeStyle($event, index, 'up')"
             style="position: relative;top: 10px"></i>
        </div>
        <i :class="plusIcon"
           @click="addDomain"
           @mousedown="changeStyle1($event, 'down')"
           @mouseup="changeStyle1($event, 'up')"
           style="position: relative;right: -40px;margin-bottom: 20px;"></i>
        <el-form-item style="position: relative;bottom: -32px">
          <el-button type="primary" @click="onSubmit('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div id="product-info" class="box">
      <h3 class="order-form-title" style="margin: 0 0 20px 0">产品详情</h3>
      <el-form label-position="left" inline class="info-form" label-width="100px">
        <el-form-item label="产品id">
          <span>{{productInfoForm.typeId}}</span>
        </el-form-item>
        <br/>
        <el-form-item label="产品名称" style="width: 45%">
          <span>{{productInfoForm.name}}</span>
        </el-form-item>
        <el-form-item label="所需物料类型">
          <span>{{productInfoForm.reqMaterialType}}</span>
        </el-form-item>
        <div v-for="(item, index) in productInfoForm.craftProcess" :key="index">
          <el-form-item :label="'工序' + index" style="width: 45%">
            <span>{{item.craftName}}</span>
          </el-form-item>
          <el-form-item label="加工时间">
            <span>{{item.time}}s</span>
          </el-form-item>
        </div>
        <el-form-item label="加工总时间">
          <span>{{productInfoForm.totalTime}}s</span>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
import {nanoid} from 'nanoid'

export default {
  name: 'CreateOrder',
  data () {
    return {
      formInlines: {
        value: [{
          productId: '',
          num: 0,
          removeIcon: 'el-icon-remove-outline'
        }]
      },
      productInfoForm: {
        typeId: null,
        name: null,
        reqMaterialType: null,
        craftProcess: [
          {
            craftName: null,
            time: null
          }
        ],
        totalTime: null
      },
      plusIcon: 'el-icon-circle-plus-outline'
    }
  },
  computed: {
    ...mapState('product', ['productType']),
    ...mapState('order', ['orderList']),
    ...mapState('material', ['materialType']),
    ...mapState('craft', ['craftType'])
  },
  methods: {
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let order = {...this.orderList.slice(-1)[0]}
          order.productsList = JSON.parse(JSON.stringify(order.productsList))
          order.orderId = 'O-' + nanoid()
          order.submitTime = Date.now()
          order.uid = this.$cookies.get('user_session').uid
          let productList = this.formInlines.value
          // eslint-disable-next-line no-unused-vars
          for (let i = 0; i < productList.length; i++) {
            let product = {...order.productsList.slice(-1)[0]}
            product.productTypeId = productList[i].productId
            product.productNum = productList[i].num
            order.productsList.unshift(product)
          }
          this.ADD_ORDER(order)
          alert('提交成功！')
          // this.resetForm(formName)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    removeItem (item, index) {
      if (index !== -1) {
        this.formInlines.value.splice(index, 1)
      }
    },
    addDomain () {
      this.formInlines.value.push({
        productID: '',
        num: 0,
        key: Date.now(),
        removeIcon: 'el-icon-remove-outline'
      })
    },
    changeStyle (event, index, type) {
      // event获取当前事件，event.currentTarget获取触发事件的标签
      if (type === 'down') {
        this.formInlines[index].removeIcon = 'el-icon-remove'
      } else {
        this.formInlines[index].removeIcon = 'el-icon-remove-outline'
      }
    },
    changeStyle1 (event, type) {
      if (type === 'down') {
        this.plusIcon = 'el-icon-circle-plus'
      } else {
        this.plusIcon = 'el-icon-circle-plus-outline'
      }
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    isExist (type, index) {
      for (let i = 0; i < this.formInlines.value.length; i++) {
        if (i !== index && type === this.formInlines.value[i].productId) {
          return 1
        }
      }
      return 0
    },
    showProductInfo (value) {
      this.productInfoForm.typeId = value.typeId
      this.productInfoForm.name = value.name
      this.productInfoForm.reqMaterialType = this.materialType.find(el => el.typeId === value.reqMaterialTypeId).name
      this.productInfoForm.craftProcess = []
      this.productInfoForm.totalTime = 0
      for (let i = 0; i < value.craftProcess.length; i++) {
        let ins = {}
        let result = {...this.craftType.find(el => el.craftId === value.craftProcess[i].craftId)}
        ins.craftName = result.name
        ins.time = result.time
        this.productInfoForm.craftProcess.push(ins)
        this.productInfoForm.totalTime += result.time
      }
    },
    ...mapMutations('order', ['ADD_ORDER'])
  }
}
</script>

<style scoped>
#order-form {
  /*position: fixed;*/
  /*left: 205px;*/
  /*top: 90px;*/
  float: left;
  height: 600px;
  width: 50%;
  background-color: white;
  margin: 10px 20px;
  padding: 35px 35px 15px 35px;
  border-radius: 10px;
  overflow: auto;
}

.order-form-title {
  text-align: center;
  margin: 0 auto 40px auto;
  color: rgba(0, 0, 0, 1);
}
#product-info{
  /*position: fixed;*/
  /*right: 50px;*/
  /*top: 90px;*/
  float: left;
  height: 600px;
  width: 40%;
  background-color: white;
  margin: 10px;
  padding: 20px;
  border-radius: 10px;
  overflow: auto;
}
.info-form .el-form-item{
  margin-right: 0;
  margin-bottom: 0;
  /*width: 40%;*/
}
</style>
