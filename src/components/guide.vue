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
                    <guidecontent :data="resultDist" @changeMap="changeMap" @startGuide="startGuide" @endGuide="endGuide"/>
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
                        <span> <sinputmuti @handlePassby="handlePassby" /> </span>
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
            initialPlace: '我的位置', //起点
            distPlace: '', //终点
            passBy: null, //途径点
            tmp: '',
            resultDist: [],
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
        startGuide() {
            this.$emit("startGuide")
        },
        endGuide() {
            this.$emit("endGuide")
        },
        changeMap(nowMap,nowMapz) {
            this.$emit("changeMap",nowMap,nowMapz)
        },
        handlePassby(val) {
            this.passBy = val
        //    console.log(val)
        },
        changeValue() {
            let tmp = this.initialPlace; 
            this.initialPlace = this.distPlace; 
            this.distPlace=tmp;
        },
        searchPath() {
            if(this.initialPlace == '' ||this.distPlace =='') {
                this.$message.warn("请正确选择出发地和目的地")
                return
            }
            if(this.initialPlace == this.distPlace) {
                this.$message.warn("目的地与起始地址相同，请重新选择")
                return
            }
            if(this.distPlace == '我的位置') {
                this.$message.warn("很抱歉，目的地不能是自己的位置哦，请重新选择")
                return
            }
            if(this.initialPlace != '我的位置') {
                this.$confirm({
                    title: '你的出发点不是当前我的位置',
                    content: '是否确认将我的位置更新至出发点？',
                    okText: '确认并导航',
                    okType: '取消导航',
                    cancelText: 'No',
                    onCancel: () =>{
                       return
                    },
                    onOk: ()=> {
                        this.updataMypos()
                        this.getGuide()
                    }
                });
            }
            else{
                this.getGuide()
            }
        },
        updataMypos() {
            this.$emit("updataMypos",this.initialPlace)
        },
        getGuide() {
                this.$http.get('/searchResult.json').then(res => {
                    this.resultDist = res.data
                  //  console.log(this.resultDist)
                    this.$emit("updataGuide",this.resultDist)
                })
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