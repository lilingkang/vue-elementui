<template>
  <div id="home">
    <!--<el-carousel :interval="3000" type="card" height="300px">-->
    <!--  <el-carousel-item v-for="item in 6" :key="item">-->
    <!--    <h3 class="medium">{{ item }}</h3>-->
    <!--  </el-carousel-item>-->
    <!--</el-carousel>-->
    <h1>欢迎使用 AGV作业监控系统</h1>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
#home{
  /*position: fixed;*/
  /*left: 210px;*/
  /*top: 100px;*/
  /*bottom: 10px;*/
  /*right: 10px;*/
  text-align: center;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
</style>
