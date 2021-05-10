<template>
<div>
    <div class="searchPart"  align="center">
        <div>
            <a-row type="flex" justify="space-around">
                <a-col span="3"> <a-icon type="environment"/> 起点 </a-col>
                <a-col span="20"> <sinput :myPlace="initialPlace" @input="(val) => {initialPlace = val}"/> </a-col>
            </a-row>
        </div>
        <a-icon type="swap" class="trigger" @click="changeValue"/>
        <div>
            <a-row type="flex" justify="space-around">
                <a-col span="3"> <a-icon type="environment"/> 终点 </a-col>
                <a-col span="20"> <sinput :myPlace="distPlace" @input="(val) => {distPlace = val}"/> </a-col>
            </a-row>
        </div>
        <div class="searchButton"> <a-button type="primary" icon="search" > 规划路径 </a-button> </div>
    </div>
    <div>
        <a-tabs :tabBarGutter="1" size="small" tabPosition="top" default-active-key="1">
            <a-tab-pane key="1" tab="步行时间最短">
            </a-tab-pane>
            <a-tab-pane key="2" tab="步行距离最短">
            </a-tab-pane>
            <a-tab-pane key="3" tab="自行车最优策略">
            </a-tab-pane>
            <a-tab-pane key="4" tab="有途径点策略">
                <div style="padding:10px">
                    <sinputmuti v-model="passBy"/>
                </div>
            </a-tab-pane>
        </a-tabs>
    </div>
</div>
</template>
<script>
import sinput from "./searchInput.vue";
import sinputmuti from "./searchInput_muti.vue";
export default {
    name: "Vguide",
    data(){
        return{
            initialPlace: '我的位置',
            distPlace: '',
            passBy: null,
            tmp: ''
        }
    },
    components: {
        sinput,
        sinputmuti
    },
    watch: {
    },
    methods: {
        changeValue() {
            console.log(this.initialPlace + ' and ' + this.distPlace); 
            let tmp = this.initialPlace; 
            this.initialPlace = this.distPlace; 
            this.distPlace=tmp;
            console.log(this.initialPlace + ' and ' + this.distPlace); 
        }
    }

}
</script>
<style scoped>
.searchPart{
    padding-left: 50px;
    padding-right: 50px;
    padding-top: 20px;
    padding-bottom: 20px;
}
.trigger {
  font-size: 20px;
  cursor: pointer;
  transition: color 0.3s;
  padding-bottom: 10px;
  padding-top: 10px;
}
.searchButton{
  padding-top:10px;
  padding-bottom: 10px;
}
</style>