<template>
  <div>
    <ros3d-viewer
      :ros="ros"
      ref="viewer" id="viewer"
      @hook:mounted="rosViewerMounted"
      v-if="connected">
      <ros3d-axes />
      <ros3d-grid />
    </ros3d-viewer>
  </div>
</template>

<script>
import ROSLIB from 'roslib'
import { Ros3dViewer, Ros3dGrid, Ros3dAxes } from '../../plugin'

export default {
  name: 'ShowUrdf', // vue library dev component
  components: {
    Ros3dViewer,
    Ros3dGrid,
    Ros3dAxes
  },
  created () {
    window.addEventListener('resize', this.handleResize)
  },
  destroyed () {
    window.removeEventListener('resize', this.handleResize)
  },
  data: () => ({
    ros: null,
    connected: false
  }),
  mounted () {
    this.ros = new ROSLIB.Ros({
      url: this.$store.state.navTab.url
    })

    this.ros.on('connection', () => {
      this.connected = true
      console.log(this.connected)
    })
  },
  methods: {
    handleResize () {
      // this.$el.clientWidth, this.$el.clientHeight
      if (this.$refs.viewer && this.$refs.viewer.viewer) this.$refs.viewer.viewer.resize(400, 400)
    },
    rosViewerMounted () {
      this.handleResize()
    }
  }
}
</script>

<style scoped>
html { overflow-y: auto ! important }

body { margin: 0; }

div{
  text-align: center;
  color: white;
}

#viewer {
  position: fixed;
  width: 400px;
  height: 400px;
  top: 12vh;
  left: 38vw;
  box-shadow: 0 0 10px #000;
  margin: 10px;
  /*overflow: hidden;*/
}
</style>
