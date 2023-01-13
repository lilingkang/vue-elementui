<template>
  <div>
    <div id="product-list" class="box">
      <el-table
        :data="tableData"
        border
        max-height="580px"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="产品名称"
          width="100">
        </el-table-column>
        <el-table-column
          prop="materialTypeName"
          label="所需物料类型"
          width="120">
        </el-table-column>
        <el-table-column
          prop="craftProcessText"
          label="工艺路线">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button @click.native.prevent="handleClick(scope.row)" type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div id="product-form" class="box">
      <el-form :model="form" status-icon :rules="rules" ref="ruleForm" label-width="110px">
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入产品名称"></el-input>
        </el-form-item>
        <el-form-item label="所需物料类型" prop="materialType">
          <el-select v-model="form.materialType" placeholder="请选择物料类型">
            <el-option v-for="(item1, index1) in materialType"
                       :key="index1"
                       :value="item1.typeId"
                       :label="item1.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-for="(item2, index2) in form.craftProcess"
          :label="'工序' + index2"
          :key="index2"
          :prop="'craftProcess.' + index2 + '.craftId'"
          :rules="{required: true, message: '工艺类型不能为空', trigger: 'blur'}">
          <el-select v-model="item2.craftId" placeholder="请选择工艺类型">
            <el-option v-for="(subItem, subIndex) in craftType"
                       :key="subIndex"
                       :value="subItem.craftId"
                       :label="subItem.name+' (工艺耗时 '+subItem.time+'s)'">
            </el-option>
          </el-select>
          <!--{{item2}}-->
          <el-button v-if="index2 !== 0" @click.prevent="removeItem(item2)">删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('ruleForm')">提交</el-button>
          <el-button @click="addItem">添加工序</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {mapMutations, mapState} from 'vuex'
import {nanoid} from 'nanoid'

export default {
  name: 'ProductCustomization',
  data () {
    return {
      tableData: [],
      form: {
        name: '',
        materialType: '',
        craftProcess: [
          {
            craftId: ''
          }
        ]
      },
      rules: {
        name: [
          { required: true, message: '产品名称不能为空', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        materialType: [
          { required: true, message: '物料类型不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState('product', ['productType']),
    ...mapState('craft', ['craftType']),
    ...mapState('material', ['materialType'])
  },
  methods: {
    init () {
      this.tableData = []
      for (let i = 0; this.productType[i].typeId !== null; i++) {
        let craftText = []
        let model = {
          typeId: '',
          name: '',
          materialTypeName: '',
          craftProcessText: ''
        }
        let productIns = {...this.productType[i]}
        for (let j = 0; j < productIns.craftProcess.length; j++) {
          craftText.push(this.craftType.find(el => el.craftId === productIns.craftProcess[j].craftId).name)
        }
        let ins = {...model}
        ins.typeId = productIns.typeId
        ins.name = productIns.name
        ins.materialTypeName = this.materialType.find(el => el.typeId === productIns.reqMaterialTypeId).name
        ins.craftProcessText = craftText.join(' -> ')
        this.tableData.unshift(ins)
      }
    },
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let product = {...this.productType.slice(-1)[0]}
          product.typeId = 'P-' + nanoid()
          product.name = this.form.name
          product.reqMaterialTypeId = this.form.materialType
          product.craftProcess = JSON.parse(JSON.stringify(this.form.craftProcess)) // 数组深拷贝
          this.ADD_PRODUCT(product)
          alert('提交成功！')
          // this.resetForm(formName)
          this.init()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    removeItem (item) {
      let index = this.form.craftProcess.indexOf(item)
      if (index !== -1) {
        this.form.craftProcess.splice(index, 1)
      }
    },
    addItem () {
      this.form.craftProcess.push({
        craftId: ''
      })
    },
    handleClick (row) {
      this.tableData.splice(this.tableData.indexOf(row), 1)
      this.DEL_PRODUCT(row.typeId)
    },
    ...mapMutations('product', ['ADD_PRODUCT', 'DEL_PRODUCT'])
  },
  mounted () {
    this.init()
    // console.log(this.tableData)
  }
}
</script>

<style scoped>
#product-list{
  /*position: fixed;*/
  /*left: 225px;*/
  /*top: 110px;*/
  /*bottom: 20px;*/
  float: left;
  height: 600px;
  width: 58%;
  padding: 10px;
  margin: 10px 10px 10px 20px;
  border-radius: 10px;
}
#product-form{
  /*position: fixed;*/
  /*right: 20px;*/
  /*top: 110px;*/
  /*bottom: 20px;*/
  float: left;
  height: 600px;
  width: 36%;
  padding: 10px;
  margin: 10px;
  overflow: auto;
  border-radius: 10px;
}
</style>
