<template>
<div>
    <div class="searchPart"  align="center">
        <div>
            <a-row type="flex" justify="space-around">
                <a-col span="4"> <a-icon type="environment"/> 起点 </a-col>
                <a-col span="18"> <sinput :myPlace="initialPlace" @input="(val) => {initialPlace = val}"/> </a-col>
            </a-row>
        </div>
        <a-icon type="swap" class="trigger" @click="changeValue"/>
        <div>
            <a-row type="flex" justify="space-around">
                <a-col span="4"> <a-icon type="environment"/> 终点 </a-col>
                <a-col span="18"> <sinput :myPlace="distPlace" @input="(val) => {distPlace = val}"/> </a-col>
            </a-row>
        </div>
    </div>
    <div>
        <a-tabs  :tabBarGutter="1" size="small" tabPosition="top" default-active-key="1">
            <a-tab-pane key="1" tab="步行时间最短">
                <div align="center">
                    <a-button type="primary" icon="search"  @click="searchPath" > 规划路径 </a-button>
                    <guidecontent :data="resultDist"/>
                </div>
            </a-tab-pane>
            <a-tab-pane key="2" tab="步行距离最短">
                <div align="center">
                    <a-button type="primary" icon="search"  @click="searchPath" > 规划路径 </a-button>
                    <guidecontent :data="resultDist"/>
                </div>
            </a-tab-pane>
            <a-tab-pane key="3" tab="自行车最优策略">
                <div align="center">
                    <a-button type="primary" icon="search"  @click="searchPath" > 规划路径 </a-button> 
                    <guidecontent :data="resultDist"/>
                </div>
            </a-tab-pane>
            <a-tab-pane key="4" tab="有途径点策略">
                <div align="center">
                        <span> 选择途径点：</span>
                        <span> <sinputmuti v-model="passBy"/> </span>
                <a-button type="primary" icon="search"  @click="searchPath" > 规划路径 </a-button>
                <guidecontent :data="resultDist"/>
                </div>
            </a-tab-pane>
        </a-tabs>
    </div>
</div>
</template>
<script>
import sinput from "./searchInput.vue";
import sinputmuti from "./searchInput_muti.vue";
import guidecontent from "./guideContent.vue";
export default {
    name: "Vguide",
    data(){
        return{
            initialPlace: '我的位置',
            distPlace: '',
            passBy: null,
            tmp: '',
            resultDist: [],
            resultTime: []
        }
    },
    components: {
        sinput,
        sinputmuti,
        guidecontent
    },
    watch: {
    },
    methods: {
        changeValue() {
            let tmp = this.initialPlace; 
            this.initialPlace = this.distPlace; 
            this.distPlace=tmp;
        },
        searchPath() {
            this.$http.get('/searchResult.json').then(res => {
                this.resultDist = res.data["dist"]
            })
            console.log("test_search")
        }
    }

}
</script>
<style scoped>
.searchPart{
    padding-left: 50px;
    padding-right: 50px;
    padding-top: 20px;
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