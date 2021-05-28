<template>
  <div
    class="container" align="center"
  >
    <h3> 共<strong> {{data.length}} </strong>部分导航</h3>
    <span> <a-button :disabled="inGuide" @click="startGuide"> 开始模拟导航 </a-button></span>
    &nbsp; &nbsp;&nbsp;
    <span> <a-button :disabled="!inGuide" type="danger" @click="endGuide"> 暂停模拟导航 </a-button></span>
    <a-list :data-source="data">
      <a-list-item slot="renderItem" slot-scope="item">
        <a-list-item-meta>
          <template slot="description">
              <h4>预计使用时间：{{item.total_time}}</h4>
              <h4>距离：{{item.dist}}</h4>
              <h4>交通方式：{{item.move_model}}</h4>
          </template>
          <template slot="title">{{ arhName[[item.id,item.z]] }}-部分</template>
        </a-list-item-meta>
        <div><a-button type="link" @click="changeMap(item.id,item.z)"> 查看路线 </a-button></div>
      </a-list-item>
    </a-list>
  </div>
</template>
<script>
import infiniteScroll from 'vue-infinite-scroll';

export default {
  directives: { infiniteScroll },
  data() {
    return {  
        arhName: [],
        inGuide: false,
    };
  },
  props: {
    data: {
        type: Array
    },
  },
  watch: {
  },
  mounted() {
    this.arhName[[1,0]] = "校区一"
    this.arhName[[2,0]] = "校区二"
  },
  methods: {
      startGuide() {
            this.inGuide = true
            this.$emit("startGuide")
        },
      endGuide() {
            this.inGuide = false
            this.$emit("endGuide")
      },
      changeMap(Map,Mapz){
     //   console.log(Map,Mapz)
        this.$emit("changeMap",Map,Mapz)
      }

    },
};
</script>
<style>
.container {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: auto;
  padding: 8px 24px;
  height: 300px;
}
.demo-loading-container {
  position: absolute;
  bottom: 40px;
  width: 100%;
  text-align: center;
}
</style>
