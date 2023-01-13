<template>
  <div id="vel" class="box">
    <el-progress id="linear" type="dashboard" :percentage="vel.linear*75+50" :color="colors" :format="setItemText1"></el-progress>
    <el-progress id="angular" type="dashboard" :percentage="vel.angular*40+50" :color="colors" :format="setItemText2"></el-progress>
    <p style="position: relative;top: -30px">线速度&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;角速度</p>
  </div>
</template>

<script>
import ROSLIB from 'roslib'

export default {
  name: 'VelPanel',
  data: () => ({
    ros: null,
    connected: false,
    listener: null,
    vel: {
      linear: 0,
      angular: 0
    },
    percentage: 0,
    colors: [
      {color: '#f56c6c', percentage: 20},
      {color: '#e6a23c', percentage: 40},
      {color: '#5cb87a', percentage: 60},
      {color: '#1989fa', percentage: 80},
      {color: '#6f7ad3', percentage: 100}
    ]
  }),
  mounted () {
    this.ros = new ROSLIB.Ros({
      url: this.$store.state.navTab.url
    })
    this.ros.on('connection', () => {
      this.connected = true
      console.log(this.connected)
    })

    this.listener = new ROSLIB.Topic({
      ros: this.ros,
      name: '/cmd_vel',
      messageType: 'geometry_msgs/Twist'
    })

    this.listener.subscribe((message) => {
      // console.log(message)
      this.vel.linear = message.linear.x
      this.vel.angular = message.angular.z
    })
  },
  methods: {
    setItemText1 () {
      return `${this.vel.linear.toFixed(2)}m/s`
    },
    setItemText2 () {
      return `${this.vel.angular.toFixed(2)}rad/s`
    }
  }
}
</script>

<style scoped>
#vel{
  text-align: center;
  margin: 20px;
  padding: 10px;
  border-radius: 20px;
  width: 23%;
  height: 140px;
  position: absolute;
  top: 100px;
  left: 10px;
  /*float: left;*/
  z-index: 0;
}
</style>
