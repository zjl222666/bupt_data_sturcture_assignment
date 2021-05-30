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
            <vcard               
              :nowCard="nowCard"  
              v-if="cardShow" 
              @closeIt="()=>{nowID=''; cardShow = false;  }"
              @updataInit="updataInit"
              @updataDist="updataDist"
              @intoGuide="intoGuide"
              :itemsContent="posID"
              :choosePlace="choosePlace"
              />
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
            <a-col span="8"> <sinput v-model="choosePlace" @handleChange1="updataNowID"/> </a-col>
            <a-col span="2">  <a-button type="link" icon="search" @click="updataNowID(choosePlace)"/>  </a-col>
            <a-col span="1"> &nbsp; <a-button type="link" @click="readLog"> 查看日志</a-button>> </a-col>
          </a-row>
        </a-layout-header>
        <a-layout>
        <a-layout-content
          :style="{  background: '#fff', minHeight: '280px' }"
          >
          <div v-if="selected_key[0] == '3'" style="z: 20">
            <span> <strong> 当前选择建筑物 </strong> </span>
            <span> 
              <a-select v-model="selected_Map" style="width: 240px">
                <a-select-option v-for="items in supportPlace" :key="items" :value="items">
                  {{items}}
                </a-select-option>
              </a-select>
            </span>
            <span> <strong> 当前楼层 </strong> </span>
            <span>
              <a-select v-model="selected_Z" style="width: 240px">
                <a-select-option v-for="items in zNumber[selected_Map]" :key="items" :value="items">
                  {{items}}
                </a-select-option>
              </a-select>
            </span>
          </div>
          <div>
          <mymap 
            ref="map"
            @showCard="updataNowID2" 
            @updataMypos="updataMypos"
            @guideOver="()=>{this.guideOver=true}"
            :GuideNode="GuideNode[[nowMapID_show,nowMapID_Z]]" 
            :GuideTime="GuideTime[[nowMapID_show,nowMapID_Z]]"
            :mapNode="mapNode[[nowMapID_show,nowMapID_Z]]" 
            :mapLinks="mapLinks[[nowMapID_show,nowMapID_Z]]"
            :mypos_in="(nowMapID_show==nowMapID_person&&nowMapID_person_z==nowMapID_Z)?true:false"
            :myposd="mypos"
            :inGuide="inGuide"
            :mapID="nowMapID_show"
            />
          </div>
        </a-layout-content>
        <a-layout-sider width=30%  theme="light">       
            <vguide 
              ref="guide"
              @updataGuide="updataGuide"
              @updataMypos="updataMypos2"
              @changeMap="changeMap"
              @startGuide="()=>{this.inGuide=true; this.startGuide(); }"
              @endGuide="()=>{this.inGuide=false}"
              @forceStop="forceStop"
              :nowMapID_person="nowMapID_person"
              :nowMapID_person_z="nowMapID_person_z"
              :nowMypos="mypos"
            />     
        </a-layout-sider>
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
      posID: {}, //存储物理位置（逻辑位置）对应的信息
      nowID: "", //card显示的id
      IDtoCard: {}, //建筑物id对应的信息
      nowCard: {}, //当前卡片显示的内容
      mapNode:[], //地图点，所有地图的点均先缓存在这个数组里
      mapLinks:[], //地图边，所有地图的边均线缓存在这个数组里
      GuideNode: [], //要导航的点的数组，对于所有地图，按顺序缓存在这个数组里
      GuideTime:[], //每一段的路程的行进速度
      nowMapID_show: 1, //现在显示的地图的ID(校区1，2id为1，2建筑物即为建筑物id)
      nowMapID_Z: 0, //现在显示的楼层，若为校区地图则为0
      nowMapID_person: 1,  //现在人所在的地图ID
      nowMapID_person_z: 0, //现在人所在的楼层
      selected_Z: 1, //下拉框选择的楼层
      selected_Map:"沙河教学综合楼N", //下拉框选择的建筑物ID 
      mypos_in: false, //人是否在当前加载的地图中
      mypos: [], //当前人的坐标
      guideOrder: [], //模拟导航地图加载的顺序
      guideOver: true, //模拟导航当前地图是否导航完毕
      inGuide: true, //导航是否处于暂停状态
      choosePlace: '', //卡片上默认选中的位置
      zNumber: {
        "沙河教学综合楼N": 3,
       "沙河燕南园S4": 3,
       "沙河实验楼": 3,
       "西土城教二楼": 3,
        "西土城学一公寓": 3,
        "沙河图书馆": 5,
        "西土城图书馆": 5
      },
      supportPlace: ["沙河教学综合楼N","沙河燕南园S4","沙河实验楼","西土城教二楼","西土城学一公寓","沙河图书馆","西土城图书馆"],
      PlaceID:{"沙河教学综合楼N": 62,"沙河燕南园S4" :29,"沙河实验楼" :71,"西土城教二楼": 167,"西土城学一公寓": 144,"沙河图书馆":58,"西土城图书馆":179},
      IDplace:{62: "沙河教学综合楼N" ,29: "沙河燕南园S4" ,71: "沙河实验楼",167: "西土城教二楼",144: "西土城学一公寓",58: "沙河图书馆",179: "西土城图书馆"}
    };
  },
  watch: {
    inGuide(newVal) {
      if(newVal==true && this.guideOver==false &&this.guideOver!=null) {
          this.$refs.map.startGuide()
      }
    },
    nowID(newVal) {
      this.nowCard = this.IDtoCard[newVal]
      console.log(newVal,this.nowCard)
      this.$forceUpdate()
    },
    nowMapID_show(newVal) {
      this.$refs.map.mapID = newVal
      this.mypos_in = this.nowMapID_show==this.nowMapID_person&&this.nowMapID_person_z==this.nowMapID_Z
      if(newVal==2||newVal==1) {
        this.selected_key = [newVal.toString()]
      }
      else{
        this.selected_key = ['3']
      }
    },
    selected_Map(newVal) {
      this.nowMapID_show = this.PlaceID[newVal]
      if(this.selected_Z>this.zNumber[newVal]) this.selected_Z = 1
    //  console.log(newVal)
    },
    selected_Z(newVal) {
      this.nowMapID_Z = newVal
    },
    selected_key(newVal) {
    //  console.log(newVal)
      let now = Number(newVal[0])
      if(now<=2) {
        this.nowMapID_show = now
        this.nowMapID_Z = 0
      }
      else {
        if(this.selected_Map == null) {
          this.nowMapID_show = 0
          return
        }  
        this.nowMapID_show = this.PlaceID[this.selected_Map]
        this.nowMapID_Z = this.selected_Z
      }

    },
  },
  methods: {
    readLog() {

    },
    updataInit(val) {
      this.$refs.guide.initialPlace = val
    },
    updataDist(val) {
      this.$refs.guide.distPlace = val
    },
    intoGuide(val) {
      this.selected_key = ['3']
      this.selected_Map = val
      this.selected_Z = 1
      this.cardShow = false
    },
    forceStop() {
      this.inGuide = false
      this.guideOrder = null
    },
    startGuide() {
      if(this.guideOrder==null) return
      if(this.guideOrder.length<=1) {
        if(this.guideOver) {
            this.guideOrder= null
            this.GuideNode= []
            this.$refs.guide.distPlace = ''
            this.$refs.guide.resultDist = null
            this.$refs.guide.passby = null
            this.$success({
            title: '导航结束啦！',
            content: '已经将你的位置更新为目的地',
            okText: '确认',
          });
          return
        } else {
          setTimeout(() => {
            this.startGuide()
          }, 1000);
        }
        return
      }
      while(this.guideOrder.length>1){
        if(this.guideOver == true){
          this.guideOrder.shift()
          let node = this.guideOrder[0]
          this.guideOver = false
          this.nowMapID_person = node[0]
          this.nowMapID_person_z = node[1]
          this.nowMapID_show = node[0]
          this.nowMapID_Z = node[1]
          this.$refs.map.startGuide()
          if(this.guideOrder.length == 1) {
            setTimeout(() => {
            this.startGuide()
          }, 1000);
          }

        }
        else{
         // console.log('deng')
          setTimeout(() => {
            this.startGuide()
          }, 1000);
          return
        }
      }
    },
    changeMap(newMap,newMapz) {
      if(newMap<=2) {
        this.selected_key = [newMap.toString()]
      }
      else{
        this.selected_Map = this.IDplace[newMap]
        this.selected_Z = newMapz
        this.selected_key = ['3']
      }
    },
    updataMypos(val1,val2) {
   //   console.log("ceshi",val1,val2)
      this.$set(this.mypos,[0],val1)
      this.$set(this.mypos,[1],val2)
    //  console.log("ceshi2",this.mypos)
    },
    updataMypos2(val){
      let tmpID = this.posID[val].id
    //  console.log(this.IDtoCard[tmpID.toString()])
      this.nowMapID_person = this.IDtoCard[tmpID.toString()].campus
      this.nowMapID_Z = this.IDtoCard[tmpID.toString()].z
      this.nowMapID_show = this.nowMapID_person
      this.nowMapID_Z = this.nowMapID_person_z
      this.updataMypos(this.IDtoCard[tmpID.toString()].x,this.IDtoCard[tmpID.toString()].y)
    },
    updataGuide(val) {
    //  console.log(this.GuideNode)
      this.guideOrder = [[1,0]]
      this.guideOver = true
      this.inGuide = false
      this.stopIt = false
      if(val==null) {
          this.GuideNode = []
          this.GuideTime = []
          return
      }
      val.forEach(node=>{
        this.guideOrder.push([node.id,node.z])
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
      this.nowID = this.posID[val].id.toString();
      this.showCard()
    },
    showCard() {
     // console.log(this.IDtoCard[this.nowID])
      if(this.nowID!="") this.cardShow = true;
      else this.$message.warning("未找到相关建筑物，请检查输入")
    },
    getID(){
      this.$http.get('/ItemsContent.json').then(res => {
        this.posID = res.data
      })
    },
    getCard(){
      this.$http.get('/IDtoCard.json').then(res => {
        this.IDtoCard = res.data
      //  console.log(this.IDtoCard)
      });
    },
    getMapContent(path,id,z){
      this.$http.get(path).then(res =>{
        for(let i = 0;i < res.data.node.length; i++) {
          if(res.data.node[i].x>=2) res.data.node[i].label = {show: true}
        }
        this.$set(this.mapNode,[id,z],(res.data.node))
        this.$set(this.mapLinks,[id,z],(res.data.links))
      })
    },
  },
  beforeMount() {
  },
  mounted() {
      this.mypos = [0,130]
      this.getMapContent('/Map.json',1,0)
      this.getMapContent('/Map1.json',2,0)
      this.getMapContent('/Map[29,1].json',29,1)
      this.getMapContent('/Map[29,2].json',29,2)
      this.getMapContent('/Map[29,3].json',29,3)
      this.getMapContent('/Map[58,1].json',58,1)
      this.getMapContent('/Map[58,2].json',58,2)
      this.getMapContent('/Map[58,3].json',58,3)
      this.getMapContent('/Map[58,4].json',58,4)
      this.getMapContent('/Map[58,5].json',58,5)
      this.getMapContent('/Map[62,1].json',62,1)
      this.getMapContent('/Map[62,2].json',62,2)
      this.getMapContent('/Map[62,3].json',62,3)
      this.getMapContent('/Map[62,4].json',62,4)
      this.getMapContent('/Map[62,5].json',62,5)
      this.getMapContent('/Map[71,1].json',71,1)
      this.getMapContent('/Map[71,2].json',71,2)
      this.getMapContent('/Map[71,3].json',71,3)
      this.getMapContent('/Map[144,1].json',144,1)
      this.getMapContent('/Map[144,2].json',144,1)
      this.getMapContent('/Map[144,3].json',144,3)
      this.getMapContent('/Map[167,1].json',167,1)
      this.getMapContent('/Map[167,2].json',167,2)
      this.getMapContent('/Map[167,3].json',167,3)
      this.getMapContent('/Map[179,1].json',179,1)
      this.getMapContent('/Map[179,2].json',179,2)
      this.getMapContent('/Map[179,3].json',179,3)
      this.getMapContent('/Map[179,4].json',179,4)
      this.getMapContent('/Map[179,5].json',179,5)
      this.getID();
      this.getCard();
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


