<template>
  <div>
    <div id="task-seq" class="box">
      <b>机器人任务序列</b>
      <el-table
        @cell-mouse-enter="handleEnter"
        @cell-mouse-leave="handleLeave"
        :data="tableData"
        border
        max-height="560px"
        style="width: 100%">
        <el-table-column
          prop="index"
          label="序号"
          width="50">
        </el-table-column>
        <el-table-column
          align="center"
          label="时间">
          <el-table-column
            prop="startTime"
            label="开始"
            width="50">
          </el-table-column>
          <el-table-column
            prop="endTime"
            label="结束"
            width="50">
          </el-table-column>
        </el-table-column>
        <el-table-column
          prop="product"
          label="产品名称"
          width="80">
        </el-table-column>
        <el-table-column
          prop="transOrder"
          label="移动指令">
        </el-table-column>
      </el-table>
    </div>
    <div id="gantt" class="box">
      <div id="gantt-container" style="height: 310px;width: 100%"></div>
    </div>
    <div class="Echarts box">
      <div id="myEchartrs" class="box" style="width: 100%;height:270px;"></div>
    </div>
    <div id="select-order" class="box">
      <p>
        <b>请选择机器人所要执行的订单</b>
      </p>
      <el-form status-icon
               ref="ruleForm"
               :model="form"
               class="demo-form-inline">
        <el-form-item label="订单" prop='orderId'
                      :rules="{required: true, message: '订单不能为空', trigger: 'blur'}">
          <el-select v-model="form.orderId" placeholder="请选择订单" style="width: 200px">
            <el-option v-for="(subItem, subIndex) in form.label"
                       :key="subIndex"
                       :label="'订单' + subIndex + ': ' +
                       form.label.find(el => el.orderId === subItem.orderId).userName + ' (' +
                       form.label.find(el => el.orderId === subItem.orderId).orderText + ')'"
                       :value="subItem.orderId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="position: relative;bottom: 0px">
          <el-button type="primary" @click="onSubmit('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Simulator from './simulator'
import {mapMutations, mapState} from 'vuex'

export default {
  name: 'Dispatch',
  data () {
    return {
      myChart: null,
      ganttChart: null,
      form: {
        orderId: '',
        label: []
      },
      option: {
        color: ['#6a7985'],
        title: {
          text: '算法收敛情况'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
              formatter: function (params) {
                return `${params.value.toFixed(0)}`
              }
            }
          }
          // formatter: function (params) {
          //   return `<div>数据：${params[0].value[1]}</div>`
          // }
        },
        // legend: {
        //   data: ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5']
        // },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          show: false,
          left: '3%',
          right: '13%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'log',
            name: '迭代次数'
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '订单完成时间/s',
            scale: true
          }
        ],
        series: [
          {
            name: '订单完成时间',
            type: 'line',
            smooth: true,
            lineStyle: {
              width: 3,
              color: '#cccccc'
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(128, 255, 165)'
                },
                {
                  offset: 1,
                  color: 'rgb(1, 191, 236)'
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: []
          }
        ]
      },
      strategy: {
        time: null,
        taskSeq: null,
        order: null,
        T: null
      },
      productNameList: [],
      series: [{
        type: 'line',
        color: '#9a9a9a'
      }],
      ganttOption: {},
      yAxisLabel: ['物料区', '车床', '铣床', '钻床', '磨床', '码放区'],
      tableData: []
    }
  },
  computed: {
    ...mapState('order', ['orderList']),
    ...mapState('customer', ['userInfo']),
    ...mapState('product', ['productType']),
    ...mapState('temp', ['tempList'])
  },
  methods: {
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$cookies.set('current_order', this.form.orderId, '60MIN')
          this.loadMyChart('reload')
          this.loadGantt()
          this.loadTaskTable()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    loadMyChart (type) {
      let strategy
      let orderId = this.$cookies.get('current_order')
      this.form.orderId = orderId
      this.myChart = this.$echarts.init(document.getElementById('myEchartrs'))
      this.option.series[0].data = []

      if (type === 'reload') {
        // eslint-disable-next-line no-new
        let simulator = new Simulator(this.orderList.find(el => el.orderId === orderId), this.$store.state)
        let result = simulator.simulate()
        strategy = result
        // 5 * Math.pow(2, strategy[1].length) 自适应迭代次数
        for (let i = 0; i < 1e4; i++) {
          simulator = new Simulator(this.orderList.find(el => el.orderId === orderId), this.$store.state)
          result = simulator.simulate()
          if (result[0] < strategy[0]) {
            strategy = result
          }
          this.option.series[0].data.push([i + 1, strategy[0]])
        }
        this.strategy.time = strategy[0]
        this.strategy.taskSeq = strategy[1]
        this.strategy.order = strategy[2]
        this.strategy.T = strategy[3]
      } else if (type === 'load last' && this.$cookies.isKey('strategy_index') && this.$cookies.isKey('series_index')) {
        this.strategy = this.tempList[this.$cookies.get('strategy_index')]
        this.option.series[0].data = this.tempList[this.$cookies.get('series_index')]
      }

      // console.log(strategy)
      // console.log(this.strategy)
      this.myChart.setOption(this.option, true)
    },
    initLabel () {
      for (let i = 0; this.orderList[i].orderId !== null; i++) {
        let ins = {}
        let orderText = []
        ins.orderId = this.orderList[i].orderId
        ins.userName = this.userInfo.find(el => el.uid === this.orderList[i].uid).name
        for (let j = 0; j < this.orderList[i].productsList.length - 1; j++) {
          orderText.push(this.orderList[i].productsList[j].productNum + '-' +
            this.productType.find(el => el.typeId === this.orderList[i].productsList[j].productTypeId).name)
        }
        ins.orderText = orderText.join(', ')
        this.form.label.unshift(ins)
      }
    },
    loadGantt () {
      this.series = [{
        type: 'line',
        color: '#9a9a9a'
      }]
      this.productNameList = []
      // eslint-disable-next-line no-unused-vars
      let time = 0
      let currentPos = '0'

      for (let i = 0; i < this.strategy.order.length; i++) {
        let order = this.strategy.order[i]
        for (let j = 0; j < order.process.length; j++) {
          let name = this.productType.find(el => el.typeId === order.productTypeId).name + '-' + j
          this.productNameList.push(name)
          order.process[j].name = name
          this.series.push({
            name: name,
            type: 'line',
            smooth: true,
            data: []
          })
        }
      }

      for (let i = 0; i < this.strategy.taskSeq.length; i++) {
        let task = this.strategy.taskSeq[i]
        if (task.productTypeId) {
          let name = this.strategy.order.find(el => el.productTypeId === task.productTypeId).process.find(el => el.productObjectId === task.productObjectId).name
          let product = this.series.find(el => el.name === name)
          time = task.startTime
          if (task.transOrder[0] !== currentPos) {
            // time += this.strategy.T[currentPos][task.transOrder[0]]
            currentPos = task.transOrder[0]
          }
          product.data.push([time, this.yAxisLabel[currentPos]])
          time += this.strategy.T[currentPos][task.transOrder[1]]
          currentPos = task.transOrder[1]
          product.data.push([time, this.yAxisLabel[currentPos]])
        } else {
          time = task.startTime
          time += this.strategy.T[task.transOrder[0]][task.transOrder[1]]
          currentPos = task.transOrder[1]
        }
      }
      // console.log(this.strategy.order)
      this.ganttChart = this.$echarts.init(document.getElementById('gantt-container'))
      this.ganttOption = {
        title: {
          text: '机器人调度策略'
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            let text = `${params[0].value[0]}<br/>`
            let circle = `<span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;left:5px;background-color:`
            for (let i = 0; i < params.length; i++) {
              text += `${circle}${params[i].color}"></span>${params[i].seriesName}&nbsp;&nbsp;&nbsp;&nbsp;`
              text += `<div style="float:right;"><b>${params[i].value[1]}</b></div><br/>`
            }
            return `${text}`
          }
        },
        legend: {
          data: this.productNameList
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'value',
          boundaryGap: false,
          axisPointer: {
            show: true
          }
        },
        yAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.yAxisLabel,
          axisPointer: {
            show: false
          }
        },
        series: this.series
      }
      this.ganttChart.setOption(this.ganttOption, true)
      // this.ganttChart.dispatchAction({
      //   type: 'highlight',
      //   seriesName: '产品2-0',
      //   // seriesIndex: 0,
      //   dataIndex: 1
      // })
    },
    loadTaskTable () {
      this.tableData = []
      let currentPos = '0'
      let time = 0
      for (let i = 0; i < this.strategy.taskSeq.length; i++) {
        let ins = {}
        let task = this.strategy.taskSeq[i]
        if (currentPos !== task.transOrder[0]) {
          let subIns = {}
          subIns.index = this.tableData.length
          subIns.startTime = time
          time += this.strategy.T[currentPos][task.transOrder[0]]
          subIns.endTime = time
          subIns.product = '空载'
          subIns.transOrder = this.yAxisLabel[currentPos] + ' -> ' + this.yAxisLabel[task.transOrder[0]]
          // currentPos = task.transOrder[0]
          this.tableData.push(subIns)
        }
        ins.index = this.tableData.length
        time = task.startTime
        ins.startTime = time
        time += this.strategy.T[task.transOrder[0]][task.transOrder[1]]
        ins.endTime = time
        if (task.productTypeId) {
          ins.product = this.strategy.order.find(el => el.productTypeId === task.productTypeId).process.find(el => el.productObjectId === task.productObjectId).name
        } else {
          ins.product = '空载'
        }
        ins.transOrder = this.yAxisLabel[task.transOrder[0]] + ' -> ' + this.yAxisLabel[task.transOrder[1]]
        currentPos = task.transOrder[1]
        this.tableData.push(ins)
      }
    },
    handleEnter (row, column, cell, event) {
      // console.log(column)
      if (row.product !== '空载') {
        this.ganttOption.series.find(el => el.name === row.product).markArea = {
          data: [
            [{
              xAxis: row.startTime
            }, {
              xAxis: row.endTime
            }]
          ]
        }
      } else {
        this.ganttOption.series[0].markArea = {
          data: [
            [{
              xAxis: row.startTime
            }, {
              xAxis: row.endTime
            }]
          ]
        }
      }
      this.ganttChart.setOption(this.ganttOption, true)
    },
    handleLeave (row, column, cell, event) {
      // console.log(column)
      if (row.product !== '空载') {
        this.ganttOption.series.find(el => el.name === row.product).markArea = {
          data: []
        }
      } else {
        this.ganttOption.series[0].markArea = {
          data: []
        }
      }
      this.ganttChart.setOption(this.ganttOption, true)
    },
    ...mapMutations('temp', ['ADD_TEMP', 'CLREA_TEMP'])
  },
  mounted () {
    this.initLabel()

    if (this.$cookies.isKey('current_order')) {
      this.loadMyChart('load last')
      this.loadGantt()
      this.loadTaskTable()
    }
  },
  beforeDestroy () {
    // console.log(this.option.series[0].data)
    this.CLREA_TEMP()
    this.ADD_TEMP({...this.strategy})
    this.$cookies.set('strategy_index', this.tempList.length - 1, '60MIN')
    this.ADD_TEMP(this.option.series[0].data)
    this.$cookies.set('series_index', this.tempList.length - 1, '60MIN')
    for (let i = 0; i < this.tableData.length; i++) {
      this.tableData[i].state = -1
    }
    this.ADD_TEMP(this.tableData)
    this.$cookies.set('task_list_index', this.tempList.length - 1, '60MIN')
  }
}
</script>

<style scoped>
.Echarts{
  /*position: fixed;*/
  /*left: 650px;*/
  /*top: 430px;*/
  width: 41%;
  border-radius: 10px;
  margin: 10px;
  float: left;
}
#select-order{
  /*position: fixed;*/
  /*left: 1220px;*/
  /*top: 430px;*/
  height: 270px;
  width: 22%;
  padding: 20px;
  border-radius: 10px;
  margin: 10px;
  float: left;
}
#gantt{
  /*position: fixed;*/
  /*left: 650px;*/
  /*top: 100px;*/
  width: 65%;
  border-radius: 10px;
  margin: 10px;
  float: left;
}
#task-seq{
  /*position: fixed;*/
  /*left: 220px;*/
  /*top: 100px;*/
  height: 600px;
  width: 30%;
  padding: 10px;
  border-radius: 10px;
  margin: 10px 10px 10px 20px;
  float: left;
}
</style>
