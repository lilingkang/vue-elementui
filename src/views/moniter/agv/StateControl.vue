<template>
  <div>
    <div id="state-control" class="box">
      <el-table
        :data="tableData"
        :row-style="tableRowClassName">
        <el-table-column
          prop="device"
          label="设备"
          width="80">
        </el-table-column>
        <el-table-column
          prop="state"
          label="状态"
          width="80">
        </el-table-column>
        <el-table-column
          prop="topic"
          label="话题类型"
          width="80">
        </el-table-column>
        <el-table-column
          prop="hz"
          label="发布频率"
          width="80">
        </el-table-column>
        <el-table-column
          label="操作"
          width="60">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.switchState"
              active-color="#13ce66"
              inactive-color="#dadde5"
              :disabled="scope.row.isDisable"
              @click.native.prevent="handleClick1(scope)">
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div id="mode-control" class="box">
      <el-table
        :data="tableData1"
        :row-style="tableRowClassName">
        <el-table-column
          prop="mode"
          label="功能"
          width="80">
        </el-table-column>
        <el-table-column
          label="操作"
          width="60">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.switchState"
              active-color="#13ce66"
              inactive-color="#dadde5"
              :disabled="scope.row.isDisable"
              @click.native.prevent="handleClick2(scope)">
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import ROSLIB from 'roslib'
import { mapMutations } from 'vuex'

export default {
  name: 'StateControl',
  data () {
    return {
      tableData: [{
        device: '底盘',
        type: 'car',
        state: 'stopped',
        topic: '/odom',
        hz: '0hz',
        header: null,
        switchState: false,
        isDisable: false,
        listener: null
      }, {
        device: '激光雷达',
        type: 'lidar',
        state: 'stopped',
        topic: '/scan',
        hz: '0hz',
        header: null,
        switchState: false,
        isDisable: false,
        listener: null
      }, {
        device: 'imu',
        type: 'imu',
        state: 'stopped',
        topic: '/imu',
        hz: '0hz',
        header: null,
        switchState: false,
        isDisable: false,
        listener: null
      }],
      tableData1: [
        {
          mode: '定位',
          type: 'localization',
          state: 'stopped',
          switchState: false,
          isDisable: false
        }, {
          mode: '导航',
          type: 'nav',
          state: 'stopped',
          switchState: false,
          isDisable: false
        }
      ],
      ros: null,
      connected: false,
      server: null
    }
  },
  methods: {
    tableRowClassName ({row, rowIndex}) {
      let styleJson = {}
      if (row.isDisable) {
        styleJson = {
          'background-color': '#fbf4e5'
        }
      } else if (row.switchState) {
        styleJson = {
          'background-color': '#eff8ea'
        }
      }
      return styleJson
    },
    handleClick1 (scope) {
      // eslint-disable-next-line no-unused-vars
      let request = null
      if (scope.row.switchState) {
        request = new ROSLIB.ServiceRequest({
          type: scope.row.type,
          action: 'launch'
        })
        scope.row.listener.subscribe(function (message) {
          // console.log(message)
          if (scope.row.header !== null && message.header.seq - scope.row.header.seq === 1) {
            // console.log(message.header.seq - scope.row.header.seq)
            let dsecs = message.header.stamp.secs - scope.row.header.stamp.secs
            let dnsecs = message.header.stamp.nsecs - scope.row.header.stamp.nsecs
            let hz = 1 / (dsecs + dnsecs * 1e-9)
            scope.row.hz = hz.toFixed(2) + 'hz'
          }
          scope.row.header = message.header
        })

        if (scope.row.device === '底盘') {
          this.START()
        }
      } else {
        request = new ROSLIB.ServiceRequest({
          type: scope.row.type,
          action: 'shutdown'
        })
        scope.row.isDisable = true
        scope.row.state = 'stopping'
        scope.row.listener.unsubscribe()
        scope.row.hz = '0hz'
        scope.row.header = null

        if (scope.row.device === '底盘') {
          this.STOP()
        }
      }
      this.server.callService(request, function (result) {
        scope.row.state = result.state
        scope.row.isDisable = false
      })
    },
    handleClick2 (scope) {
      // eslint-disable-next-line no-unused-vars
      let request = null
      if (scope.row.switchState) {
        request = new ROSLIB.ServiceRequest({
          type: scope.row.type,
          action: 'launch'
        })
      } else {
        request = new ROSLIB.ServiceRequest({
          type: scope.row.type,
          action: 'shutdown'
        })
        scope.row.isDisable = true
        scope.row.state = 'stopping'
      }
      this.server.callService(request, function (result) {
        scope.row.state = result.state
        scope.row.isDisable = false
      })
    },
    init () {
      this.ros = new ROSLIB.Ros({
        url: this.$store.state.navTab.url
      })
      this.ros.on('connection', () => {
        this.connected = true
        console.log(this.connected)
      })
      this.server = new ROSLIB.Service({
        ros: this.ros,
        name: '/launch_programs',
        serviceType: 'my_serial_node/launch_programs'
      })
      this.tableData[0].listener = new ROSLIB.Topic({
        ros: this.ros,
        name: '/odom',
        messageType: 'nav_msgs/Odometry'
      })
      this.tableData[1].listener = new ROSLIB.Topic({
        ros: this.ros,
        name: '/scan',
        messageType: 'sensor_msgs/LaserScan'
      })
      this.tableData[2].listener = new ROSLIB.Topic({
        ros: this.ros,
        name: '/imu',
        messageType: 'sensor_msgs/Imu'
      })
    },
    ...mapMutations('navTab', ['STOP', 'START'])
  },
  mounted () {
    this.init()
    if (this.$cookies.isKey('car_state')) {
      let state = this.$cookies.get('car_state')
      // console.log(state)
      this.tableData[0].switchState = state[0]
      this.tableData[1].switchState = state[1]
      this.tableData[2].switchState = state[2]
      this.tableData1[0].switchState = state[3]
      this.tableData1[1].switchState = state[4]
    }
  },
  beforeDestroy () {
    let state = []
    state.push(Number(this.tableData[0].switchState))
    state.push(Number(this.tableData[1].switchState))
    state.push(Number(this.tableData[2].switchState))
    state.push(Number(this.tableData1[0].switchState))
    state.push(Number(this.tableData1[1].switchState))
    this.$cookies.set('car_state', state, '60MIN')
  }
}
</script>

<style scoped>
#state-control{
  position: absolute;
  left: 400px;
  top: 60%;
  height: 200px;
  width: 390px;
  padding: 5px;
  border-radius: 10px;
  border-width: 0;
}
#mode-control{
  position: absolute;
  top: 60%;
  left: 820px;
  height: 200px;
  width: 150px;
  padding: 5px;
  border-radius: 10px;
  border-width: 0;
}
</style>
