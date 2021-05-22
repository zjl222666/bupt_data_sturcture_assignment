<template>
  <div
    class="container" align="center"
  >
    <h3> 共<strong> {{data.length}} </strong>部分导航</h3>
    <span> <a-button :disabled="inGuide" @click="startGuide"> 开始模拟导航 </a-button></span>
    &nbsp; &nbsp;&nbsp;
    <span> <a-button :disabled="!inGuide" type="danger" @click="endGuide"> 终止模拟导航 </a-button></span>
    <a-list :data-source="data">
      <a-list-item slot="renderItem" slot-scope="item">
        <a-list-item-meta>
          <template slot="description">
              <h4>预计使用时间：{{item.total_time}}</h4>
              <h4>距离：{{item.dist}}</h4>
              <h4>交通方式：{{item.move_model}}</h4>
          </template>
          <template slot="title">{{ arhName[item.id] }}-部分</template>
        </a-list-item-meta>
        <div><a-button type="link"> 查看路线 </a-button></div>
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
        arhName: ["校区0","校区1","校区2","教学楼1"],
        inGuide: false,
    };
  },
  props: {
    data: {
        type: Array
    },
  },
  methods: {
      startGuide() {
          this.inGuide = true;
      },
      endGuide() {
          this.inGuide = false;
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
