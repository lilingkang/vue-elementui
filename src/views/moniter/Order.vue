<template>
  <div>
    <div id="order-list" class="box">
      <el-table
        :data="tableData"
        border
        max-height="580px"
        style="width: 100%">
        <el-table-column
          prop="userName"
          label="用户名"
          width="70">
        </el-table-column>
        <el-table-column
          prop="submitTime"
          label="订单提交时间"
          width="160">
        </el-table-column>
        <el-table-column
          prop="orderText"
          label="订单内容">
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
  </div>
</template>

<script>
import {mapMutations, mapState} from 'vuex'

export default {
  name: 'Order',
  data () {
    return {
      tableData: []
    }
  },
  computed: {
    ...mapState('order', ['orderList']),
    ...mapState('customer', ['userInfo']),
    ...mapState('product', ['productType'])
  },
  methods: {
    handleClick (row) {
      this.tableData.splice(this.tableData.indexOf(row), 1)
      this.DEL_ORDER(row.orderId)
    },
    init () {
      this.tableData = []
      for (let i = 0; this.orderList[i].orderId !== null; i++) {
        let ins = {}
        // if (this.orderList[i].uid !== this.$cookies.get('user_session').uid) continue
        ins.orderId = this.orderList[i].orderId
        ins.userName = this.userInfo.find(el => el.uid === this.orderList[i].uid).name
        ins.submitTime = new Date(this.orderList[i].submitTime).toLocaleDateString() + ' ' +
          new Date(this.orderList[i].submitTime).toLocaleTimeString()
        let orderText = []
        for (let j = 0; j < this.orderList[i].productsList.length - 1; j++) {
          orderText.push(this.productType.find(el => el.typeId === this.orderList[i].productsList[j].productTypeId).name +
            ': ' + this.orderList[i].productsList[j].productNum)
        }
        ins.orderText = orderText.join(', ')
        this.tableData.unshift(ins)
      }
    },
    ...mapMutations('order', ['DEL_ORDER'])
  },
  mounted () {
    this.init()
  }
}
</script>

<style scoped>
#order-list{
  /*position: fixed;*/
  /*left: 225px;*/
  /*top: 110px;*/
  float: left;
  width: 50%;
  height: 600px;
  padding: 10px;
  margin: 10px 10px 10px 20px;
  border-radius: 10px;
}
</style>
