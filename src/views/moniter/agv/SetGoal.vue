<template>
  <div>
    <el-button type="success" id="start" size="small" @click="handleClick1(index)" :disabled="isDisable.start">{{buttonText}}</el-button>
    <el-button type="warning" id="pause" size="small" @click="handleClick2" :disabled="isDisable.pause">暂停</el-button>
    <el-button type="danger" id="stop" size="small" @click="handleClick3" :disabled="isDisable.stop">停止</el-button>
    <div id="task-list" class="box">
      <el-table
        :row-style="tableStyle"
        :data="tableData"
        border
        max-height="250px"
        style="width: 100%">
        <el-table-column
          prop="index"
          label="序号"
          width="50">
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

    <!--<div id="set-goal">-->
    <!--  <el-form :model="numberValidateForm" ref="numberValidateForm" label-width="100px" class="demo-ruleForm">-->
    <!--    <el-form-item-->
    <!--      label="x坐标"-->
    <!--      prop="x"-->
    <!--      :rules="[-->
    <!--  { required: true, message: '坐标不能为空'},-->
    <!--  { type: 'number', message: '坐标必须为数字值'}]"-->
    <!--    >-->
    <!--      <el-input type="x" v-model.number="numberValidateForm.x" autocomplete="off"></el-input>-->
    <!--    </el-form-item>-->
    <!--    <el-form-item-->
    <!--      label="y坐标"-->
    <!--      prop="y"-->
    <!--      :rules="[-->
    <!--  { required: true, message: '坐标不能为空'},-->
    <!--  { type: 'number', message: '坐标必须为数字值'}]"-->
    <!--    >-->
    <!--      <el-input type="y" v-model.number="numberValidateForm.y" autocomplete="off"></el-input>-->
    <!--    </el-form-item>-->
    <!--    <el-form-item>-->
    <!--      <el-button type="primary" @click="submitForm('numberValidateForm')">提交</el-button>-->
    <!--      <el-button @click="resetForm('numberValidateForm')">重置</el-button>-->
    <!--    </el-form-item>-->
    <!--  </el-form>-->
    <!--</div>-->

  </div>
</template>

<script>
import ROSLIB from 'roslib'
import {mapMutations, mapActions, mapState} from 'vuex'

export default {
  name: 'SetGoal',
  data () {
    return {
      ros: null,
      connect: false,
      pub: null,
      cancel: null,
      listener: null,
      index: 0,
      numberValidateForm: {
        x: '',
        y: ''
      },
      tableData: [],
      currentOrder: null,
      isDisable: {
        start: false,
        pause: true,
        stop: true
      },
      buttonText: '开始'
    }
  },
  computed: {
    ...mapState('temp', ['tempList']),
    ...mapState('craft', ['start', 'end', 'craftType']),
    ...mapState('product', ['productType'])
  },
  methods: {
    init () {
      this.ros = new ROSLIB.Ros({
        url: this.$store.state.navTab.url
      })

      this.ros.on('connection', () => {
        this.connected = true
        console.log(this.connected)
      })

      this.pub = new ROSLIB.Topic({
        ros: this.ros,
        name: '/move_base_simple/goal',
        messageType: 'geometry_msgs/PoseStamped'
      })

      this.cancel = new ROSLIB.Topic({
        ros: this.ros,
        name: '/move_base/cancel',
        messageType: 'actionlib_msgs/GoalID'
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!')
          let goal = new ROSLIB.Message({
            header: {
              frame_id: 'map'
            },
            pose: {
              position: {
                x: Number(this.numberValidateForm.x),
                y: Number(this.numberValidateForm.y),
                z: 0.0
              },
              orientation: {
                x: 0.0,
                y: 0.0,
                z: 0.0,
                w: 1.0
              }
            }
          })
          this.pub.publish(goal)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    tableStyle ({row, rowIndex}) {
      let styleJson = {}
      if (row.state === 0) {
        styleJson = {
          'background-color': '#fbf4e5'
        }
      } else if (row.state === 1) {
        styleJson = {
          'background-color': '#eff8ea'
        }
      }
      return styleJson
    },
    handleClick1 (startIndex) {
      this.SET_UPDATE_FLAG()
      this.update_time()

      this.isDisable.start = true
      this.isDisable.pause = false
      this.isDisable.stop = false

      let offset

      if (startIndex === 0) {
        this.pubGoal('物料区')
      } else if (this.buttonText === '继续') {
        this.pubGoal(this.tableData[startIndex - 1].transOrder.split(' -> ')[1])
      }

      this.listener = new ROSLIB.Topic({
        ros: this.ros,
        name: '/move_base/result',
        messageType: 'move_base_msgs/MoveBaseActionResult'
      })

      this.listener.subscribe((message) => {
        console.log(message)
        // 引入纠错机制：防止极短时间到达目标(貌似是move_base的bug)
        let startTime = message.status.goal_id.stamp.secs + message.status.goal_id.stamp.nsecs * 1e-9
        let endTime = message.header.stamp.secs + message.header.stamp.nsecs * 1e-9
        if (message.status.status === 3 && endTime - startTime < 0.5 && this.index) {
          console.log('move_base error!')
          console.log('pub:' + this.tableData[this.index - 1].transOrder.split(' -> ')[1])
          this.pubGoal(this.tableData[this.index - 1].transOrder.split(' -> ')[1])
          offset++
        } else {
          console.log(message.status.goal_id.id.split('-')[1])
          if (this.index === startIndex) {
            offset = Number(message.status.goal_id.id.split('-')[1]) - this.index
          }
          if (message.status.status === 3 && this.index + offset === Number(message.status.goal_id.id.split('-')[1])) {
            // 上次任务执行完毕，判断小车上次任务是否是将物料放在某一机床
            if (this.index && this.tableData[this.index - 1].product !== '空载' &&
              this.tableData[this.index - 1].transOrder.split(' -> ')[1] !== '物料区' &&
              this.tableData[this.index - 1].transOrder.split(' -> ')[1] !== '码放区') {
              let productTypeId = this.productType.find(el => el.name === this.tableData[this.index - 1].product.slice(0, -2)).typeId
              let productObjectId = this.tempList[this.$cookies.get('strategy_index')].order.find(el => el.productTypeId === productTypeId).process.find(el => el.name === this.tableData[this.index - 1].product).productObjectId
              let craftIndex = this.craftType.findIndex(el => el.name[0] ===
                this.tableData[this.index - 1].transOrder.split(' -> ')[1][0])
              this.UPDATE_STATE({
                val: {
                  typeId: productTypeId,
                  objectId: productObjectId
                },
                index: craftIndex,
                action: 'add'
              })
            }

            // console.log(message)
            // console.log('start_index:' + startIndex)
            // console.log('index:' + this.index)
            // console.log(this.tableData)
            if (this.index === this.tableData.length) {
              this.tableData[this.index - 1].state = 1
              this.index = 0
              this.listener.unsubscribe()
              console.log('end')
            } else {
              if (this.index !== 0) {
                this.tableData[this.index - 1].state = 1
              }
              // 判断小车下一任务是否是从某一机床取走物料
              if (this.tableData[this.index].product !== '空载' &&
                this.tableData[this.index].transOrder.split(' -> ')[0] !== '物料区' &&
                this.tableData[this.index].transOrder.split(' -> ')[0] !== '码放区') {
                // 若是，则判断该物料在机床是否加工完成
                let productTypeId = this.productType.find(el => el.name === this.tableData[this.index].product.slice(0, -2)).typeId
                let productObjectId = this.tempList[this.$cookies.get('strategy_index')].order.find(el => el.productTypeId === productTypeId).process.find(el => el.name === this.tableData[this.index].product).productObjectId
                let craft = this.craftType.find(el => el.name[0] ===
                  this.tableData[this.index].transOrder.split(' -> ')[0][0])
                // 机床加工进度
                let process = Math.ceil(craft.remainTime / craft.time)
                let index = craft.state.findIndex(el => el.objectId === productObjectId)
                let wait = () => {
                  setTimeout(() => {
                    process = Math.ceil(craft.remainTime / craft.time)
                    if (process > index) {
                      wait()
                    } else {
                      this.UPDATE_STATE({
                        val: {
                          typeId: productTypeId,
                          objectId: productObjectId
                        },
                        index: this.craftType.findIndex(el => el.craftId === craft.craftId),
                        action: 'remove'
                      })
                      console.log('pub:' + this.tableData[this.index].transOrder.split(' -> ')[1])
                      this.pubGoal(this.tableData[this.index].transOrder.split(' -> ')[1])
                      this.tableData[this.index].state = 0
                      this.index++
                    }
                  }, 500)
                }
                wait()
              } else {
                console.log('pub:' + this.tableData[this.index].transOrder.split(' -> ')[1])
                this.pubGoal(this.tableData[this.index].transOrder.split(' -> ')[1])
                this.tableData[this.index].state = 0
                this.index++
              }
            }
          }
        }
      })
    },
    handleClick2 () {
      this.listener.unsubscribe()

      this.buttonText = '继续'
      this.isDisable.start = false
      this.isDisable.pause = true

      this.cancel.publish({})
    },
    handleClick3 () {
      this.RESET_UPDATE_FLAG()
      this.RESET_TIME()
      this.UPDATE_STATE({
        action: 'clear'
      })

      this.listener.unsubscribe()

      this.buttonText = '开始'
      this.isDisable.start = false
      this.isDisable.pause = true
      this.isDisable.stop = true

      this.cancel.publish({})
      this.index = 0
      this.tableData = JSON.parse(JSON.stringify(this.tempList[this.$cookies.get('task_list_index')]))
    },
    pubGoal (goal) {
      let position
      if (goal === '物料区') {
        position = this.start
      } else if (goal === '码放区') {
        position = this.end
      } else if (goal === '车床') {
        position = this.craftType[0].position
      } else if (goal === '铣床') {
        position = this.craftType[1].position
      } else if (goal === '钻床') {
        position = this.craftType[2].position
      } else if (goal === '磨床') {
        position = this.craftType[3].position
      }

      let message = new ROSLIB.Message({
        header: {
          frame_id: 'map'
        },
        pose: {
          position: {
            x: position[0],
            y: position[1],
            z: 0.0
          },
          orientation: {
            x: 0.0,
            y: 0.0,
            z: Math.sqrt(2) / 2,
            w: Math.sqrt(2) / 2
          }
        }
      })
      this.pub.publish(message)
    },
    ...mapActions('craft', ['update_time']),
    ...mapMutations('craft', ['RESET_TIME', 'SET_UPDATE_FLAG', 'RESET_UPDATE_FLAG', 'UPDATE_STATE'])
  },
  mounted () {
    this.init()
    if (this.$cookies.isKey('task_list_index') && this.$cookies.isKey('current_order')) {
      this.currentOrder = this.$cookies.get('current_order')
      this.tableData = JSON.parse(JSON.stringify(this.tempList[this.$cookies.get('task_list_index')]))
    }
  },
  activated () {
    if (this.currentOrder !== this.$cookies.get('current_order') && this.$cookies.isKey('task_list_index')) {
      this.currentOrder = this.$cookies.get('current_order')
      this.tableData = JSON.parse(JSON.stringify(this.tempList[this.$cookies.get('task_list_index')]))
    }
  }
}
</script>

<style scoped>
#set-goal{
  position: absolute;
  top: 150px;
  right: 50px;
}
#task-list{
  position: absolute;
  top: 50px;
  right: 10px;
  width: 300px;
  padding: 10px;
  border-radius: 10px;
}
#start{
  position: absolute;
  top: 0px;
  right: 250px;
}
#pause{
  position: absolute;
  top: 0px;
  right: 180px;
}
#stop{
  position: absolute;
  top: 0px;
  right: 110px;
}
</style>
