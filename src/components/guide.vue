<template>
<div>
    <div class="searchPart"  align="center">
        <div>
            <a-row type="flex" justify="space-around">
                <a-col span="4"> <a-icon type="environment"/> 起点 </a-col>
                <a-col span="18"> <sinput :disabled="resultDist!=null" :myPlace="initialPlace" @input="(val) => {initialPlace = val}"/> </a-col>
            </a-row>
        </div>
        <a-icon type="swap" class="trigger" @click="changeValue"/>
        <div>
            <a-row type="flex" justify="space-around">
                <a-col span="4"> <a-icon type="environment"/> 终点 </a-col>
                <a-col span="18"> <sinput :disabled="resultDist!=null" :myPlace="distPlace" @input="(val) => {distPlace = val}"/> </a-col>
            </a-row>
        </div>
    </div>
    <div>
        <a-tabs  :tabBarGutter="1" size="small" tabPosition="top" v-model="selected_Model">
            <a-tab-pane key="1" tab="距离最短" :disabled="selected_Model!='1'&&resultDist!=null" >
                <div align="center">
                    <a-button type="primary" :disabled="resultDist!=null" @click="searchPath" > 规划路径 </a-button>
                    <a-button type="danger" :disabled="resultDist==null" @click="clearPath">退出导航 </a-button>
                    <guidecontent v-if="showGuide" :data="resultDist" @changeMap="changeMap" @startGuide="startGuide" />
                </div>
            </a-tab-pane>
            <a-tab-pane key="2" tab="时间最短"  :disabled="selected_Model!='2'&&resultDist!=null" >
                <div align="center">
                   <a-button type="primary" :disabled="resultDist!=null" @click="searchPath" > 规划路径 </a-button>
                    <a-button type="danger" :disabled="resultDist==null" @click="clearPath">退出导航 </a-button>
                    <guidecontent v-if="showGuide" :data="resultDist" @changeMap="changeMap" @startGuide="startGuide"/>
                </div>
            </a-tab-pane>
            <a-tab-pane key="3" tab="自行车最优策略"  :disabled="selected_Model!='3'&&resultDist!=null" >
                <div align="center">
                    <a-button type="primary" :disabled="resultDist!=null" @click="searchPath" > 规划路径 </a-button>
                    <a-button type="danger" :disabled="resultDist==null" @click="clearPath">退出导航 </a-button>
                     <guidecontent v-if="showGuide" :data="resultDist" @changeMap="changeMap" @startGuide="startGuide" />
                </div>
            </a-tab-pane>
            <a-tab-pane key="4" tab="有途径点策略"  :disabled="selected_Model!='4'&&resultDist!=null" >
                <div align="center">
                        <span> 选择途径点：</span>
                        <span> <sinputmuti @handlePassby="handlePassby" /> </span>
               <a-button type="primary" :disabled="resultDist!=null" @click="searchPath" > 规划路径 </a-button>
                    <a-button type="danger" :disabled="resultDist==null" @click="clearPath">退出导航 </a-button>
                <guidecontent v-if="showGuide" :data="resultDist" @changeMap="changeMap" @startGuide="startGuide"/>
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
import Qs from 'qs'
export default {
    name: "Vguide",
    data(){
        return{
            initialPlace: '我的位置', //起点
            distPlace: '', //终点
            passBy: null, //途径点
            tmp: '',
            resultDist: null,
            showGuide: false,
            selected_Model : '1'
        }
    },
    props: {
        nowMapID_person: {
            type: Number
        },  //现在人所在的地图ID
        nowMapID_person_z: {
            type: Number
        }, //现在人所在的楼层
        nowMypos: {
            type: Array
        }
    },
    components: {
        sinput,
        sinputmuti,
        guidecontent
    },
    watch: {
        resultDist(newVal) {
            if(newVal == null) this.showGuide = false
            else this.showGuide = true
        },
    },
    methods: {
        clearPath() {
            this.resultDist = null
            this.$emit("updataGuide",this.resultDist)   
            this.initialPlace = '我的位置'
            this.distPlace = ''    
        },
        startGuide() {
            this.$emit("startGuide")
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
                    cancelText: '取消',
                    onCancel: () =>{
                       return
                    },
                    onOk: ()=> {
                        this.updataMypos()
                        this.initialPlace = '我的位置'
                        setTimeout(() => {
                            this.getGuide()
                        }, 1500); 
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
                    let tmpPassby = ""
                    if(this.passBy != null){
                        for(let i = 0; i < this.passBy.length; i++ ) {
                            tmpPassby = tmpPassby + this.passBy[i]
                            if(i != this.passBy.length-1) tmpPassby = tmpPassby + ","
                        }
                    } 
                    
                    console.log("dest:",this.distPlace,
                            "approach:",tmpPassby,
                            "x:", this.nowMypos[0],
                            "y:", this.nowMypos[1],
                            "id:", this.nowMapID_person,
                            "z:", this.nowMapID_person_z,
                            "model:", this.selected_Model-1)
                    this.$http.post(`${this.$BaseUrl}map/search-path/`,Qs.stringify({
                            dest: this.distPlace,
                            approach: tmpPassby,
                            x: this.nowMypos[0],
                            y: this.nowMypos[1],
                            id: this.nowMapID_person,
                            z: this.nowMapID_person_z,
                            model: this.selected_Model-1
                        }))
                    .then(res=>{
                        console.log(res)
                        if(res.data.solution.length == 0) {
                            this.$confirm({
                                title: "你已经在目的地附近啦",
                                content: "请自己找一找附近哦"
                            })
                            this.clearPath()
                        } else {
                            this.resultDist = res.data.solution
                            this.$emit("updataGuide", this.resultDist)
                        }        
                    })      
            },
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