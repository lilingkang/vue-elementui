<template>
  <div>
    <div id="container" class="box">
      <el-switch
        style="position: absolute;right: 0"
        v-model="isFollow"
        active-text="相机跟随"
        inactive-text="自由移动">
      </el-switch>
    </div>
  </div>
</template>

<script>
import ROSLIB from 'roslib'
import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import Stats from 'three/examples/js/libs/stats.min.js'
import { mapState } from 'vuex'

export default {
  name: 'Map',
  data () {
    return {
      isFollow: true,
      ros: {
        map: null,
        tfAmrToOdom: null,
        tfOdomToMap: null
      },
      connected: {
        map: null,
        tfAmrToOdom: null,
        tfOdomToMap: null
      },
      listener: {
        map: null,
        tfAmrToOdom: null,
        tfOdomToMap: null
      },
      tf: {
        amrToOdom: null,
        odomToMap: null
      },
      mapMetadata: null,
      mapSize: {
        width: null,
        height: null
      },
      camera: null,
      carLight: null,
      target: null,
      scene: null,
      renderer: null,
      requestId: null,
      loader: null,
      clock: null,
      controls: null,
      stats: null,
      geometry: {
        plane: null,
        floor: null,
        amr: null
      },
      material: {
        plane: null,
        floor: null,
        amr: null
      },
      mesh: {
        plane: null,
        floor: null,
        amr: null
      }
    }
  },
  computed: {
    ...mapState('navTab', ['stopRender'])
  },
  methods: {
    init () {
      let container = document.getElementById('container')
      this.scene = new Three.Scene()
      this.loader = new STLLoader()

      let width = container.offsetWidth// 窗口宽度
      let height = container.offsetHeight // 窗口高度
      let k = width / height // 窗口宽高比
      let s = 1000000 // 场景显示范围控制系数，系数越大，显示范围越大
      this.camera = new Three.PerspectiveCamera(60, k, 1, s)
      this.camera.position.set(-80, 40, 0) // 设置相机位置
      // console.log(this.camera.position)
      this.camera.lookAt(0, 0, 0) // 设置相机方向(指向的场景对象)

      // 光源设置
      // 点光源
      let point1 = new Three.PointLight(0xffffff)
      point1.castShadow = true
      point1.position.set(-100, 3000, -100) // 点光源位置
      // point1.position.set(100, 100, -150) // 点光源位置
      this.scene.add(point1) // 点光源添加道场景中

      // 车灯
      this.carLight = new Three.SpotLight(0xffffff)
      this.carLight.castShadow = true
      this.carLight.position.set(0, 100, 0)
      this.carLight.intensity = 1.5
      this.carLight.angle = 5 * Math.PI / 12

      this.target = new Three.Object3D()
      this.target.position.set(0, 0, 0)
      this.scene.add(this.target)

      this.carLight.target = this.target
      this.scene.add(this.carLight)

      // 环境光
      let ambient = new Three.AmbientLight(0xaaaaaa)
      this.scene.add(ambient)

      let axesHelper = new Three.AxesHelper(40)
      this.scene.add(axesHelper)

      // let cameraHelper1 = new Three.CameraHelper(point1.shadow.camera)
      // this.scene.add(cameraHelper1)
      // let cameraHelper2 = new Three.CameraHelper(this.carLight.shadow.camera)
      // this.scene.add(cameraHelper2)

      // 创建平面，并贴图
      this.geometry.plane = new Three.PlaneGeometry(this.mapSize.width, this.mapSize.height, 320)
      this.geometry.plane.rotateX(-Math.PI / 2)
      this.geometry.plane.translate(this.mapSize.width / 2, 0, this.mapSize.height / 2)
      let textureLoader = new Three.TextureLoader() // 纹理加载器
      let texture = textureLoader.load('../../../static/img/floor1_fix.png')

      this.material.plane = new Three.MeshLambertMaterial({
        map: texture,
        side: Three.FrontSide
      })
      this.mesh.plane = new Three.Mesh(this.geometry.plane, this.material.plane)
      this.mesh.plane.receiveShadow = true
      this.scene.add(this.mesh.plane)

      // 加载渲染器
      this.renderer = new Three.WebGLRenderer({alpha: true, antialias: true})
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(width, height)
      this.renderer.setClearColor(0xf0ffff)
      this.renderer.shadowMap.enabled = true
      container.appendChild(this.renderer.domElement)
      this.stats = new Stats()
      this.stats.dom.style.position = 'absolute'
      this.stats.dom.style.left = '0px'
      this.stats.dom.style.top = '0px'
      container.appendChild(this.stats.dom)
      console.log('append child!')
      // this.renderer.render(this.scene, this.camera)
    },
    loadScene () {
      this.loader.load('../../../static/models/scene_floor1.STL', geometry => {
        this.geometry.floor = geometry
        // geometry.translate(-3890 / 2, 0, -6223 / 2)
        this.material.floor = new Three.MeshLambertMaterial({
          color: 0x556B2F,
          opacity: 0.9,
          transparent: true
        }) // 材质对象Material
        this.mesh.floor = new Three.Mesh(geometry, this.material.floor) // 网格模型对象Mesh
        this.mesh.floor.castShadow = true
        // this.mesh.floor.receiveShadow = true
        this.scene.add(this.mesh.floor) // 网格模型添加到场景中
      })
    },
    loadAmr () {
      this.loader.load('../../../static/models/amr.STL', geometry => {
        this.geometry.amr = geometry
        this.material.amr = new Three.MeshLambertMaterial({
          color: 0xaaaaaa
        }) // 材质对象Material
        this.mesh.amr = new Three.Mesh(geometry, this.material.amr) // 网格模型对象Mesh
        this.mesh.amr.castShadow = true
        geometry.center()
        // geometry.translate(0, 0, 0)
        geometry.rotateY(Math.PI / 2)
        geometry.scale(1 / 50, 1 / 50, 1 / 50)
        this.scene.add(this.mesh.amr) // 网格模型添加到场景中
      })
    },
    // 创建轨道控制器
    createControls () {
      this.clock = new Three.Clock() // 创建THREE.Clock对象，用于计算上次调用经过的时间
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      // this.controls.autoRotate = true // 是否自动旋转
    },
    subcribeMap () {
      this.ros.map = new ROSLIB.Ros({
        url: this.$store.state.navTab.url
      })
      this.ros.map.on('connection', () => {
        this.connected.map = true
        console.log(this.connected.map)
      })

      this.listener.map = new ROSLIB.Topic({
        ros: this.ros.map,
        name: '/map_metadata',
        messageType: 'nav_msgs/MapMetaData'
      })

      this.listener.map.subscribe((message) => {
        this.mapMetadata = message
        this.mapSize.width = this.mapMetadata.width
        this.mapSize.height = this.mapMetadata.height
        // console.log(message)
        this.init()
        this.loadScene()
        this.loadAmr()
        this.createControls()
        this.animate()
        console.log(this.mapMetadata)
      })
    },
    subcribeTfAmrToOdom () {
      this.ros.tfAmrToOdom = new ROSLIB.Ros({
        url: this.$store.state.navTab.url
      })
      this.ros.tfAmrToOdom.on('connection', () => {
        this.connected.tfAmrToOdom = true
        console.log(this.connected.tfAmrToOdom)
      })

      this.listener.tfAmrToOdom = new ROSLIB.TFClient({
        ros: this.ros.tfAmrToOdom,
        fixedFrame: 'odom_carto',
        angularThres: 0.01,
        transThres: 0.01
      })

      this.listener.tfAmrToOdom.subscribe('imu_link', (tf) => {
        // console.log(tf)
        this.tf.amrToOdom = tf
      })
    },
    subcribeTfOdomToMap () {
      this.ros.tfOdomToMap = new ROSLIB.Ros({
        url: this.$store.state.navTab.url
      })
      this.ros.tfOdomToMap.on('connection', () => {
        this.connected.tfOdomToMap = true
        console.log(this.connected.tfOdomToMap)
      })

      this.listener.tfOdomToMap = new ROSLIB.TFClient({
        ros: this.ros.tfOdomToMap,
        fixedFrame: 'map',
        angularThres: 0.01,
        transThres: 0.01
      })

      this.listener.tfOdomToMap.subscribe('odom_carto', (tf) => {
        // console.log(tf)
        this.tf.odomToMap = tf
      })
    },
    animate () {
      if (this.mesh.amr && this.tf.amrToOdom && this.tf.odomToMap && this.mapMetadata) {
        let x1 = this.tf.odomToMap.translation.x / this.mapMetadata.resolution
        let y1 = this.tf.odomToMap.translation.z / this.mapMetadata.resolution
        let z1 = -this.tf.odomToMap.translation.y / this.mapMetadata.resolution
        let x2 = this.tf.amrToOdom.translation.x / this.mapMetadata.resolution
        let y2 = this.tf.amrToOdom.translation.z / this.mapMetadata.resolution
        let z2 = -this.tf.amrToOdom.translation.y / this.mapMetadata.resolution
        let q1 = this.tf.amrToOdom.rotation
        let q2 = this.tf.odomToMap.rotation
        let theta1 = Math.atan2(2 * (q1.x * q1.y + q1.w * q1.z),
          q1.w * q1.w + q1.x * q1.x - q1.y * q1.y - q1.z * q1.z)
        let theta2 = Math.atan2(2 * (q2.x * q2.y + q2.w * q2.z),
          q2.w * q2.w + q2.x * q2.x - q2.y * q2.y - q2.z * q2.z)
        this.mesh.amr.rotation.y = theta1 + theta2
        this.mesh.amr.position.x = x2 * Math.cos(theta2) + z2 * Math.sin(theta2) + x1
        this.mesh.amr.position.y = y2 + y1 + 3
        // console.log(this.mesh.amr.position.y)
        this.mesh.amr.position.z = -x2 * Math.sin(theta2) + z2 * Math.cos(theta2) + z1
        this.carLight.position.x = this.mesh.amr.position.x + 8 * Math.cos(this.mesh.amr.rotation.y)
        this.carLight.position.y = this.mesh.amr.position.y
        this.carLight.position.z = this.mesh.amr.position.z - 8 * Math.sin(this.mesh.amr.rotation.y)
        this.target.position.x = this.mesh.amr.position.x + 20 * Math.cos(this.mesh.amr.rotation.y)
        this.target.position.y = this.mesh.amr.position.y
        this.target.position.z = this.mesh.amr.position.z - 20 * Math.sin(this.mesh.amr.rotation.y)
        // console.log(this.mesh.amr.position)
        if (this.isFollow) {
          this.camera.position.x = this.mesh.amr.position.x - 1 * Math.cos(this.mesh.amr.rotation.y) / this.mapMetadata.resolution
          this.camera.position.y = this.mesh.amr.position.y + 0.4 / this.mapMetadata.resolution
          this.camera.position.z = this.mesh.amr.position.z + 1 * Math.sin(this.mesh.amr.rotation.y) / this.mapMetadata.resolution
          this.camera.lookAt(this.mesh.amr.position)
        }
      }
      if (this.mesh.plane && this.mesh.floor && this.mapMetadata) {
        this.mesh.plane.position.x = this.mapMetadata.origin.position.x / this.mapMetadata.resolution
        this.mesh.plane.position.y = this.mapMetadata.origin.position.z / this.mapMetadata.resolution
        this.mesh.plane.position.z = -this.mapMetadata.height - this.mapMetadata.origin.position.y / this.mapMetadata.resolution
        // console.log(this.mesh.plane.position)
        this.mesh.floor.position.x = this.mapMetadata.origin.position.x / this.mapMetadata.resolution
        this.mesh.floor.position.y = this.mapMetadata.origin.position.z / this.mapMetadata.resolution
        this.mesh.floor.position.z = -this.mapMetadata.height - this.mapMetadata.origin.position.y / this.mapMetadata.resolution
      }
      // const delta = this.clock.getDelta() // 获取自上次调用的时间差
      // this.controls.update(delta) // 相机更新
      if (!this.stopRender) {
        this.stats.update()
        this.renderer.render(this.scene, this.camera)
        this.requestId = requestAnimationFrame(this.animate)
      } else {
        cancelAnimationFrame(this.requestId)
        this.requestId = null
        // 清除场景
        this.scene.traverse((child) => {
          if (child.material) {
            child.material.dispose()
          }
          if (child.geometry) {
            child.geometry.dispose()
          }
          child = null
        })

        document.getElementById('container').innerHTML = ''
        console.log('clear!')

        this.renderer.forceContextLoss()
        this.renderer.dispose()
        this.scene.clear()
        this.scene = null
        // this.camera = null
        // this.carLight = null
        // this.target = null
        // this.loader = null
        // this.stats = null
        // this.carLight = null
        this.renderer = null
        // this.clock = null
        // this.controls = null
      }
    }
  },
  mounted () {
    console.log('map')
    this.subcribeMap()
    // while (!this.mapSize.height && !this.mapSize.width) {}
    // this.init()
    // this.loadScene()
    // this.loadAmr()
    // this.createControls()
    this.subcribeTfAmrToOdom()
    this.subcribeTfOdomToMap()
    // this.animate()
  }
}
</script>

<style scoped>
#container{
  margin: 10px;
  width: 45%;
  height: 55%;
  position: absolute;
  top: 0px;
  left: 380px;
  border-width: 0;
}
</style>
