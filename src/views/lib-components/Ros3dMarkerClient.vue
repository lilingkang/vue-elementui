<template>
  <div/>
</template>

<script>
/**
 * @author Ludwig Waffenschmidt - ludwig.waffenschmidt@outlook.com
 */

import * as ROS3D from 'ros3d'

/**
 * A marker client that listens to a given marker topic.
 * It is a wrapper for [`ROS3D.MarkerClient`]{@link http://robotwebtools.org/jsdoc/ros3djs/current/ROS3D.MarkerClient.html}.
 *
 * @vue-prop {Boolean} [visible=true] - Visibility of this object
 * @vue-prop {String} [topic=] - The marker topic to listen to
 *
 * @vue-data {ROS3D.MarkerClient} object - Handle for the internal [ROS3D.MarkerClient]{@link http://robotwebtools.org/jsdoc/ros3djs/current/ROS3D.MarkerClient.html}
 */
export default {
  name: 'ros3d-marker-client',
  props: {
    visible: {
      type: Boolean,
      default: true,
      require: false
    },
    topic: {
      type: String,
      default: '',
      require: false
    }
  },
  watch: {
    topic (n) {
      this.object.unsubscribe()
      this.object.topicName = n
      this.object.subscribe()
    },
    visible (newState) {
      if (newState) this.show()
      else this.hide()
    }
  },
  methods: {
    show () {
      this.$parent.viewer.scene.add(this.object)
    },
    hide () {
      var obj = this.$parent.viewer.scene.getObjectByName(this._uid)
      if (obj != null) this.$parent.viewer.scene.remove(obj)
    }
  },
  mounted () {
    this.object = new ROS3D.MarkerClient({
      ros: this.$parent.ros,
      tfClient: this.$parent.tfClient,
      rootObject: this.$parent.viewer.scene,
      topic: this.topic
    })
    this.object.name = this._uid
    if (!this.visible) this.hide()
  },
  beforeDestroy () {
    this.object.unsubscribe()
    this.hide()
  }
}
</script>
