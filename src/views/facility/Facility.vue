<template>
  <div>
    <div class="box" id="车床">
      <el-descriptions title="车床" direction="vertical" :column="3" size="medium" border>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            机床位置
          </template>
          {{ JSON.stringify(craftType[0].position) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-time"></i>
            工艺加工时间
          </template>
          {{ craftType[0].time }}s
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-timer"></i>
            剩余加工时间
          </template>
          {{ craftType[0].remainTime }}s
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-tickets"></i>
            正加工/待加工产品
          </template>
          <p v-if="!craftType[0].state.length"
             style="margin: 0;height: 50px;text-align: center;line-height: 50px;color: rgba(100,100,100,0.5)">暂无产品</p>
          <img v-for="(item, index) in craftType[0].state"
               :key="index"
               :src="'static/img/' +
               materialType.find(el => el.typeId === productType.find(ele => ele.typeId === item.typeId).reqMaterialTypeId).name +
               '.png'"
               :title="tempList[$cookies.get('strategy_index')].order.find(el => el.productTypeId === item.typeId).process.find(el => el.productObjectId === item.objectId).name"
               style="height: 50px" />
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="box" id="铣床">
      <el-descriptions title="铣床" direction="vertical" :column="3" size="medium" border>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            机床位置
          </template>
          {{ JSON.stringify(craftType[1].position) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-time"></i>
            工艺加工时间
          </template>
          {{ craftType[1].time }}s
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-timer"></i>
            剩余加工时间
          </template>
          {{ craftType[1].remainTime }}s
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-tickets"></i>
            正加工/待加工产品
          </template>
          <p v-if="!craftType[1].state.length"
             style="margin: 0;height: 50px;text-align: center;line-height: 50px;color: rgba(100,100,100,0.5)">暂无产品</p>
          <img v-for="(item, index) in craftType[1].state"
               :key="index"
               :src="'static/img/' +
               materialType.find(el => el.typeId === productType.find(ele => ele.typeId === item.typeId).reqMaterialTypeId).name +
               '.png'"
               :title="tempList[$cookies.get('strategy_index')].order.find(el => el.productTypeId === item.typeId).process.find(el => el.productObjectId === item.objectId).name"
               style="height: 50px" />
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="box" id="钻床">
      <el-descriptions title="钻床" direction="vertical" :column="3" size="medium" border>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            机床位置
          </template>
          {{ JSON.stringify(craftType[2].position) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-time"></i>
            工艺加工时间
          </template>
          {{ craftType[2].time }}s
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-timer"></i>
            剩余加工时间
          </template>
          {{ craftType[2].remainTime }}s
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-tickets"></i>
            正加工/待加工产品
          </template>
          <p v-if="!craftType[2].state.length"
             style="margin: 0;height: 50px;text-align: center;line-height: 50px;color: rgba(100,100,100,0.5)">暂无产品</p>
          <img v-for="(item, index) in craftType[2].state"
               :key="index"
               :src="'static/img/' +
               materialType.find(el => el.typeId === productType.find(ele => ele.typeId === item.typeId).reqMaterialTypeId).name +
               '.png'"
               :title="tempList[$cookies.get('strategy_index')].order.find(el => el.productTypeId === item.typeId).process.find(el => el.productObjectId === item.objectId).name"
               style="height: 50px" />
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="box" id="磨床">
      <el-descriptions title="磨床" direction="vertical" :column="3" size="medium" border>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            机床位置
          </template>
          {{ JSON.stringify(craftType[3].position) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-time"></i>
            工艺加工时间
          </template>
          {{ craftType[3].time }}s
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-timer"></i>
            剩余加工时间
          </template>
          {{ craftType[3].remainTime }}s
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-tickets"></i>
            正加工/待加工产品
          </template>
          <p v-if="!craftType[3].state.length"
             style="margin: 0;height: 50px;text-align: center;line-height: 50px;color: rgba(100,100,100,0.5)">暂无产品</p>
          <img v-for="(item, index) in craftType[3].state"
               :key="index"
               :src="'static/img/' +
               materialType.find(el => el.typeId === productType.find(ele => ele.typeId === item.typeId).reqMaterialTypeId).name +
               '.png'"
               :title="tempList[$cookies.get('strategy_index')].order.find(el => el.productTypeId === item.typeId).process.find(el => el.productObjectId === item.objectId).name"
               style="height: 50px" />
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'Facility',
  data () {
    return {

    }
  },
  computed: {
    ...mapState('craft', ['craftType']),
    ...mapState('product', ['productType']),
    ...mapState('material', ['materialType']),
    ...mapState('temp', ['tempList'])
  },
  methods: {},
  mounted () {
  }
}
</script>

<style scoped>
#车床{
  /*position: fixed;*/
  /*top: 100px;*/
  /*left: 210px;*/
  display: inline-block;
  width: 45%;
  height: 280px;
  border-radius: 10px;
  padding: 10px;
  margin: 10px;
}
#铣床{
  /*position: fixed;*/
  /*top: 100px;*/
  /*right: 10px;*/
  display: inline-block;
  width: 45%;
  height: 280px;
  border-radius: 10px;
  padding: 10px;
  margin: 10px;
}
#钻床{
  /*position: fixed;*/
  /*top: 410px;*/
  /*left: 210px;*/
  display: inline-block;
  width: 45%;
  height: 280px;
  border-radius: 10px;
  padding: 10px;
  margin: 10px;
}
#磨床{
  /*position: fixed;*/
  /*top: 410px;*/
  /*right: 10px;*/
  display: inline-block;
  width: 45%;
  height: 280px;
  border-radius: 10px;
  padding: 10px;
  margin: 10px;
}
</style>
