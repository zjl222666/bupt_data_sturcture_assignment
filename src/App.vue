<template>

  <div id="app">
    <a-layout>
<div >
  <a-layout id="components-layout-demo-custom-trigger">
    <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
      <div class="logo"></div>
      <a-menu theme="dark" mode="inline" v-model="selected_key">
        <a-menu-item key="1">
          <a-icon type="layout" theme="filled" />
          <span>校区一</span>
        </a-menu-item>
        <a-menu-item key="2">
          <a-icon type="layout" />
          <span>校区二</span>
        </a-menu-item>
        <a-menu-item key="3">
          <a-icon type="environment" />
          <span>楼内导航</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
        <div  class="card">
          <a-affix  :offset-top="100">
            <vcard :nowID="nowID"  v-if="cardShow" @closeIt="()=>{nowID=''; cardShow = false;  }"/>
          </a-affix>
        </div>
        <a-layout-header style="background: #fff; padding: 10px; width=100%">
          <a-row type="flex" justify="start"> 
            <a-col span="2">
            <a-icon
                class="trigger"
                :type="collapsed ? 'menu-unfold' : 'menu-fold'"
                @click="() => (collapsed = !collapsed)"
            />
            </a-col>
            <a-col span="5"> <sinput  @handleChange1="updataNowID"/> </a-col>
            <a-col span="2">  <a-button type="link" icon="search" @click="showCard"/>  </a-col>
            <a-col span="1"> &nbsp; </a-col>
          </a-row>
        </a-layout-header>
        <a-layout>
        <a-layout-content
          :style="{  background: '#fff', minHeight: '280px' }"
          >
          <div v-if="selected_key[0] == '3'">
            <span> <strong> 当前选择建筑物 </strong> </span>
            <span> 
              <a-select v-model="selected_Map" style="width: 120px">
                <a-select-option value=1>
                  test
                </a-select-option>
              </a-select>
            </span>
            <span> <strong> 当前楼层 </strong> </span>
            <span>
              <a-select v-model="selected_Z" style="width: 120px">
                <a-select-option value=1>
                  1
                </a-select-option>
              </a-select>
            </span>
          </div>
          <mymap 
            @showCard="updataNowID2" 
            @updataMypos="updataMypos"
            :GuideNode="GuideNode[[nowMapID_show,nowMapID_Z]]" 
            :GuideTime="GuideTime[[nowMapID_show,nowMapID_Z]]"
            :mapNode="mapNode[[nowMapID_show,nowMapID_Z]]" 
            :mapLinks="mapLinks[[nowMapID_show,nowMapID_Z]]"
            :mypos_in="mypos_in"
            :myposd="mypos"
            />
        </a-layout-content>
        <a-layout-sider width=400  theme="light">       <vguide @updataGuide="updataGuide"/>     </a-layout-sider>
        </a-layout>
        <a-layout-footer style=" background: rgb(46, 46, 46);"> <vfooter/></a-layout-footer>
    </a-layout>
    <router-view/>
  </a-layout>
  </div>
  </a-layout>
</div>
</template>
<script>
import Vfooter from './components/Vfooter.vue'
import Vguide from './components/guide.vue'
import Vcard from './components/Vcard.vue'
import sinput from './components/searchInput.vue'
import mymap from './components/Map.vue'
export default{
  components: {
    Vfooter,
    sinput,
    Vguide,
    Vcard,
    mymap
  },
  data() {
    return {
      collapsed: false, // 左侧边栏缩放
      selected_key: ['1'], //现在选择的左边侧边栏的key数组
      cardShow: false, //卡片是否显示
      posID: {}, //存储物理位置（逻辑位置）对应的建筑物ID
      nowID: "", //card显示的id
      mapNode:[], //地图点，所有地图的点均先缓存在这个数组里
      mapLinks:[], //地图边，所有地图的边均线缓存在这个数组里
      GuideNode: [], //要导航的点的数组，对于所有地图，按顺序缓存在这个数组里
      GuideTime:[], //每一段的路程的行进速度
      nowMapID_show: 1, //现在显示的地图的ID(校区1，2id为1，2建筑物即为建筑物id)
      nowMapID_Z: 0, //现在显示的楼层，若为校区地图则为0
      nowMapID_person: 1,  //现在人所在的地图ID
      nowMapID_person_z: 0, //现在人所在的楼层
      selected_Z: 1, //下拉框选择的楼层
      selected_Map: 4, //下拉框选择的建筑物ID 
      mypos_in: false, //人是否在当前加载的地图中
      mypos: [4,4], //当前人的坐标
    };
  },
  watch: {
    nowMapID_show() {
      this.mypos_in = this.nowMapID_show==this.nowMapID_person&&this.nowMapID_person_z==this.nowMapID_Z
    },
    nowMapID_Z() {
      this.mypos_in = this.nowMapID_show==this.nowMapID_person&&this.nowMapID_person_z==this.nowMapID_Z
    },
    nowMapID_person() {
      this.mypos_in = this.nowMapID_show==this.nowMapID_person&&this.nowMapID_person_z==this.nowMapID_Z
    },
    nowMapID_person_z() {
      this.mypos_in = this.nowMapID_show==this.nowMapID_person&&this.nowMapID_person_z==this.nowMapID_Z
    },
    selected_Map(newVal) {
      this.nowMapID_show = newVal
    },
    selected_Z(newVal) {
      this.nowMapID_Z = newVal
    },
    selected_key(newVal) {
     // console.log(newVal[0])
      let now = Number(newVal[0])
      if(now<=2) {
        this.nowMapID_show = now
        this.nowMapID_Z = 0
      }
      else {
        this.nowMapID_show = this.selected_Map
        this.nowMapID_Z = this.selected_Z
      }

    },
    GuideNode(newVal) {
      console.log(newVal)
    }
  },
  methods: {
    updataMypos(val) {
      this.mypos = val
    },
    updataGuide(val) {
    //  console.log(this.GuideNode)
      val.forEach(node=>{
        this.$set(this.GuideNode,[node.id,node.z],node.path)
        this.$set(this.GuideTime,[node.id,node.z], node.time)
      })
    //  console.log(this.GuideNode)
    },
    updataNowID2(val) {
      this.nowID = val.toString();
      this.showCard()
    },
    updataNowID(val) {
      if(this.posID[val] == undefined) {
        this.$message.warning("未找到相关建筑物，请检查输入")
        return 
      }
      this.nowID = this.posID[val].toString();
      this.showCard()
    },
    showCard() {
      if(this.nowID!="") this.cardShow = true;
      else this.$message.warning("未找到相关建筑物，请检查输入")
    },
    getID(){
      this.$http.get('/ItemsToid.json').then(res => {
        this.posID = res.data
      })
    },
    getMapContent(path,id,z){
      this.$http.get(path).then(res =>{
        this.$set(this.mapNode,[id,z],(res.data.node))
        this.$set(this.mapLinks,[id,z],(res.data.links))
      })
    }
  },
  beforeMount() {
  },
  mounted() {
      this.mypos = [4,4]
      this.getMapContent('/Map.json',1,0)
      this.getMapContent('/Map1.json',2,0)
      this.getID();
  }
}
</script>
<style>
.trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #1890ff;
}

.logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
.card {
  z-index: 16; 
  position: 'absolute'; 
  top: 100;
  left: 100
}
</style>


