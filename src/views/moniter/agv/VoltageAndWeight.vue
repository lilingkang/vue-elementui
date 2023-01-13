<template>
  <div>
    <dv-percent-pond id="voltage" :config="config" style="width:100px;height:50px;" />

    <div id="weight-figure" class="box">
      <div id="main" style="width: 100%;height: 100%;margin: 0;position: relative;bottom: -25px"></div>
    </div>
  </div>
</template>

<script>
import ROSLIB from 'roslib'

export default {
  name: 'VoltageAndWeight',
  data: () => ({
    config: {
      value: 0,
      borderWidth: 3,
      borderRadius: 5,
      borderGap: 3,
      lineDash: [5, 1],
      textColor: 'black'
    },
    ros: null,
    connected: false,
    listener: null,
    weight: null,
    stamp: null
  }),
  methods: {
    myEcharts () {
      const dom = document.getElementById('main')
      var chart = this.$echarts.init(dom)

      const data = []

      const option = {
        // 标题
        title: {
          text: '称重传感器示数',
          link: 'https://echarts.apache.org/examples/zh/editor.html?c=dynamic-data2',
          left: 'center'
        },
        xAxis: {
          type: 'time',
          splitLine: {
            show: false
          },
          axisLabel: {
            formatter: function (params, index) {
              let time = new Date(params)
              let h = time.getHours()
              let m = time.getMinutes()
              let s = time.getSeconds()
              // return (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s)
              // return (s === 0 ? (m === 0 ? ((h < 10 ? '0' + h : h) + '时') : ((m < 10 ? '0' + m : m) + '分')) : ((s < 10 ? '0' + s : s) + '秒'))
              if (index !== 1) {
                if (s % 10 === 0) {
                  return s === 0 ? (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) : (s < 10 ? '0' + s : s) + '秒'
                } else {
                  return ''
                }
              } else {
                return (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m)
              }
            }
          }
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: true
          }
        },
        // 提示框
        tooltip: {
          show: true,
          trigger: 'axis',
          formatter: function (params) {
            // console.log(params)
            let param = params[0]
            const date = new Date(param.value[0])
            const formatedDate = `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`
            return `<div>时间：${formatedDate}</div>` + `<div>数据：${param.value[1]}</div>`
          },
          axisPointer: {
            animation: false
          }
        },
        // 工具栏
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        series: [{
          type: 'line',
          name: '',
          showSymbol: false,
          // areaStyle: {},
          data: data
        }]
      }

      let value = 0
      let globalThis = this

      function randomData () {
        const now = new Date()

        value = globalThis.weight

        const obj = {
          name: now.toString(),
          value: [
            now, Math.round(value * 100) / 100
          ]
        }

        return obj
      }

      // 每一秒添加一个数据
      window.setInterval(function () {
        const obj = randomData()
        // console.log(obj)

        if (data.length > 100) {
          data.shift()
        }
        data.push(obj)

        chart.setOption({
          series: [{
            data: data
          }]
        })
      }, 1000)

      if (option && typeof option === 'object') {
        chart.setOption(option)
      }
    }
  },
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
      name: '/other_data',
      messageType: 'my_serial_node/voltageAndWeight'
    })

    this.listener.subscribe((message) => {
      // console.log(message.voltage)
      // console.log(this.config.data[0])
      this.weight = message.weight
      this.stamp = message.stamp
      if (message.voltage >= 12.6) {
        this.config.value = 100
      } else if (message.voltage >= 12.24) {
        this.config.value = 90
      } else if (message.voltage >= 12) {
        this.config.value = 80
      } else if (message.voltage >= 11.79) {
        this.config.value = 70
      } else if (message.voltage >= 11.61) {
        this.config.value = 60
      } else if (message.voltage >= 11.46) {
        this.config.value = 50
      } else if (message.voltage >= 11.37) {
        this.config.value = 40
      } else if (message.voltage >= 11.31) {
        this.config.value = 30
      } else if (message.voltage >= 11.19) {
        this.config.value = 20
      } else if (message.voltage >= 11.1) {
        this.config.value = 15
      } else if (message.voltage >= 11.04) {
        this.config.value = 10
      } else if (message.voltage >= 10.5) {
        this.config.value = 5
      } else {
        this.config.value = 0
      }
      this.config = {...this.config}
    })
    this.myEcharts()
  }
}
</script>

<style scoped>
#voltage{
  position: absolute;
  top: 0px;
  right: 0vw;
}
#weight-figure{
  position: absolute;
  top: 280px;
  left: 10px;
  /*margin: 10px;*/
  padding: 0px;
  width: 350px;
  height: 300px;
  /*border-radius: 10px;*/
  /*border-width: 0;*/
}
</style>
