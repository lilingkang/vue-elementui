<template>
  <div style="height: 100%;width: 100%;position: relative">

    <div id="connect_url" class="box">
      <form action="post">
        <label>
          请输入连接的url:
          <input type="url" v-model="connectUrl" />
        </label>
        <br/>
        <input type="button" value="连接" @click="connect" />
        <input type="reset" value="重置" />
      </form>
    </div>

    <vel-panel></vel-panel>

    <voltage-and-weight></voltage-and-weight>

    <div class="box" style="width: 200px;height: 200px;position: absolute;right: 4%;bottom: 8.5%;border-radius: 100px;">
      <JoyStick></JoyStick>
    </div>

    <Map></Map>

    <state-control></state-control>

    <set-goal></set-goal>

  </div>
</template>

<script>
import JoyStick from './JoyStick'
import VelPanel from './VelPanel'
import VoltageAndWeight from './VoltageAndWeight'
import Map from './Map'
import StateControl from './StateControl'
import {mapState, mapMutations} from 'vuex'
import SetGoal from './SetGoal'

export default {
  name: 'Agv',
  components: {
    SetGoal,
    JoyStick,
    VelPanel,
    VoltageAndWeight,
    Map,
    StateControl
  },
  data: () => ({
    connectUrl: null
  }),
  mounted () {
    this.connectUrl = this.url
  },
  computed: {
    ...mapState('navTab', ['url'])
  },
  methods: {
    connect () {
      this.SET_URL(this.connectUrl)
      // window.location.reload()
      // console.log(this.connectUrl)
    },
    ...mapMutations('navTab', ['SET_URL'])
  }
}
</script>

<style scoped>
#connect_url{
  position: absolute;
  padding: 10px;
  left: 10px;
  top: 10px;
  width: 350px;
  /*margin: 10px;*/
  /*float: left;*/
  border-radius: 10px;
}
</style>
