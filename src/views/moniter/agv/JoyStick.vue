<template>
  <div id="joy-stick"></div>
</template>

<script>
import ROSLIB from 'roslib'
import nipplejs from 'nipplejs'

export default {
  name: 'JoyStick',
  data: () => ({
    ros: null,
    connected: false,
    twist: {
      linear: {
        x: 0,
        y: 0,
        z: 0
      },
      angular: {
        x: 0,
        y: 0,
        z: 0
      }
    }
  }),
  mounted () {
    this.ros = new ROSLIB.Ros({
      url: this.$store.state.navTab.url
    })
    this.ros.on('connection', () => {
      this.connected = true
      console.log(this.connected)
    })

    // eslint-disable-next-line camelcase
    let joyStick = nipplejs.create({
      zone: document.getElementById('joy-stick'),
      mode: 'static', // mode: 'semi','dynamic'
      position: { right: '50%', bottom: '50%' },
      color: 'black',
      size: 200
    })

    var cmdVel = new ROSLIB.Topic({
      // eslint-disable-next-line no-undef
      ros: this.ros,
      name: '/cmd_vel',
      messageType: 'geometry_msgs/Twist'
    })

    joyStick.on('end', function (evt, data) {
      this.twist = {
        linear: {
          x: 0,
          y: 0,
          z: 0
        },
        angular: {
          x: 0,
          y: 0,
          z: 0
        }
      }
      cmdVel.publish(this.twist)
    })

    joyStick.on('move', function (evt, data) {
      this.twist = {
        linear: {
          x: 0.5 * data.vector.y,
          y: 0,
          z: 0
        },
        angular: {
          x: 0,
          y: 0,
          z: -1 * data.vector.x
        }
      }
      cmdVel.publish(this.twist)
    })
  }
}
</script>

<style scoped>

</style>
