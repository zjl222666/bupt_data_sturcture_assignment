<template>
  <div
    class="container" align="center"
  >
    <h3> 共<strong> {{data.length}} </strong>部分导航</h3>
    <span> <a-button type="primary" :disabled="inGuide" @click="startGuide"> 开始模拟导航 </a-button></span>
    &nbsp; &nbsp;&nbsp;
    <a-list :data-source="data">
      <a-list-item slot="renderItem" slot-scope="item">
        <a-list-item-meta>
          <template slot="description">
              <h4>预计使用时间：{{item.type==2?Math.round(item.time):Math.round(item.total_time)}} min</h4>
              <h4 v-if="item.type!=2">距离：{{Math.round(item.dist)}}</h4>
              <h4>交通方式：{{item.move_model}}</h4>
          </template>
          <template slot="title">{{ item.type==2?"跨校区":arhName[[item.id,item.z]] }}-部分</template>
        </a-list-item-meta>
        <div><a-button type="link" @click="changeMap(item.type,item.move_model,item.id,item.z,item)"> 查看路线 </a-button></div>
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
        arhName: {},
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
  beforeMount() {
      this.arhName[[1,0]] = "校区一"
      this.arhName[[2,0]] = "校区二"
      this.arhName[[29,1]] = "沙河燕南园S4-1层"
      this.arhName[[29,2]] = "沙河燕南园S4-2层"
      this.arhName[[29,3]] = "沙河燕南园S4-3层"
      this.arhName[[58,1]] = "沙河图书馆-1层"
      this.arhName[[58,2]] = "沙河图书馆-2层"
      this.arhName[[58,3]] = "沙河图书馆-3层"
      this.arhName[[58,4]] = "沙河图书馆-4层"
      this.arhName[[58,5]] = "沙河图书馆-5层"
      this.arhName[[62,1]] = "沙河教学综合楼N-1层"
      this.arhName[[62,2]] = "沙河教学综合楼N-2层"
      this.arhName[[62,3]] = "沙河教学综合楼N-3层"
      this.arhName[[62,4]] = "沙河教学综合楼N-4层"
      this.arhName[[62,5]] = "沙河教学综合楼N-5层"
      this.arhName[[71,1]] = "沙河实验楼-1层"
      this.arhName[[71,2]] = "沙河实验楼-2层"
      this.arhName[[71,3]] = "沙河实验楼-3层"
      this.arhName[[144,1]] = "西土城学一公寓-1层"
      this.arhName[[144,2]] = "西土城学一公寓-2层"
      this.arhName[[144,3]] = "西土城学一公寓-3层"
      this.arhName[[167,1]] = "西土城教二楼-1层"
      this.arhName[[167,2]] = "西土城教二楼-2层"
      this.arhName[[167,3]] = "西土城教二楼-3层"
      this.arhName[[179,1]] = "西土城图书馆-1层"
      this.arhName[[179,2]] = "西土城图书馆-2层"
      this.arhName[[179,3]] = "西土城图书馆-3层"
      this.arhName[[179,4]] = "西土城图书馆-4层"
      this.arhName[[179,5]] = "西土城图书馆-5层"
  },
  methods: {
      startGuide() {
            this.inGuide = true
            this.$emit("startGuide")
        },
      changeMap(Type,model,Map,Mapz,item){
     //   console.log(Map,Mapz)
        if(Type==2) {
          this.$info({
            title: "跨校区导航-将由司机师傅为您全程保驾护航",
            content: "交通工具：  "+model
          })
          return
        }
        console.log(Map,Mapz)
        this.$emit("changeMap",Map,Mapz,this.data.findIndex(items=>{return items==item}))
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
