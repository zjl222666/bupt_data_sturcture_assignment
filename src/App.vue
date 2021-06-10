<template>
  <div id="app">
    <a-drawer
      title="更多功能"
      placement="right"
      :visible="moreShow"
      :width="600"
      @close="()=>{this.moreShow = false}"
    >
      <a-card title="我的位置">
        <template slot="extra">
          <a-button type="link" @click="locateMypos">定位到我的位置</a-button>
        </template>
          <h3>所在位置: {{nowMapID_person > 2 ? IDtoCard[nowMapID_person.toString()].name : "校区"+nowMapID_person.toString()}}</h3>
          所在地图坐标: {{mypos}}
          <div>
            我的周边:
            <a-table :columns="FujinCom" :data-source="FujinData">
              <span slot="action" slot-scope="text,record">
                <a-button slot="action" @click="updataDist(record.name)"> 设为目的地</a-button> 
              </span>
            </a-table>
          </div>
      </a-card>
      <a-divider/>
      <a-card title="食堂负载均衡">
        <template slot="extra">
            <a-button type="link" @click="flashCrowd">刷新</a-button>
        </template>
            <a-table :columns="cantinCom" :data-source="CantinData">
              <span slot="action" slot-scope="text,record">
                <a-button slot="action" @click="updataDist(record.name+'门一')"> 设为目的地</a-button> 
              </span>
            </a-table>
      </a-card>
       <a-divider/>
      <a-card title="跨校区乘车表">
        <template slot="extra">
            当前时间: {{now_Timeh}}:{{now_Timem}} <a-button type="link" @click="flashTime">刷新</a-button>
        </template>
        <img
          slot="cover"
          src="@/assets/Bus.png"
        />
      </a-card>
    </a-drawer>
    <a-layout>
<div >
  <a-layout id="components-layout-demo-custom-trigger">
    <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
      <div class="logo"></div>
      <a-menu theme="dark" mode="inline" v-model="selected_key">
        <a-menu-item key="1" :disabled="inGuide">
          <a-icon type="layout" theme="filled" />
          <span>校区一</span>
        </a-menu-item>
        <a-menu-item key="2" :disabled="inGuide">
          <a-icon type="layout" />
          <span>校区二</span>
        </a-menu-item>
        <a-menu-item key="3" :disabled="inGuide">
          <a-icon type="environment" />
          <span>楼内导航</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
        <div  class="card">
          <a-affix  :offset-top="100">
            <vcard      
              ref="card"         
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
            <a-col span="7"> <sinput v-model="choosePlace" @handleChange1="updataNowID"/> </a-col>
            <a-col span="1">  <a-button type="link" icon="search" @click="updataNowID(choosePlace)"/>  </a-col>
            <a-col span="3"> <a-button @click="()=>{this.moreShow = true}"> 更多功能 </a-button> </a-col>
            <a-col span="2"> <a-button  @click="readLog"> 下载日志</a-button> </a-col>
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
            @guideOver="guideOver"
            :GuideNode="GuideNode[[nowMapID_show,nowMapID_Z]]" 
            :mapNode="mapNode[[nowMapID_show,nowMapID_Z]]" 
            :mapLinks="mapLinks[[nowMapID_show,nowMapID_Z]]"
            :mypos_in="(nowMapID_show==nowMapID_person&&nowMapID_person_z==nowMapID_Z)?true:false"
            :myposd="mypos"
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
              @startGuide="()=>{this.startGuide(); }"
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
import Qs from 'qs'

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
      itemsPos: {},//存储物理位置（逻辑位置）对应的位置
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
      Person_cloes:[], //我的附近
      selected_Z: 1, //下拉框选择的楼层
      selected_Map:"沙河教学综合楼N", //下拉框选择的建筑物ID 
      mypos_in: false, //人是否在当前加载的地图中
      mypos: [], //当前人的坐标
      guideOrder: [], //模拟导航地图加载的顺序
      nowOrder: 0,
      choosePlace: '', //卡片上默认选中的位置
      inGuide: false, //记录是否正在导航（用于一些控件的阻止访问）
      moreShow: false, //更多功能抽屉展示
      now_Timeh: 6, //当前的系统时间
      now_Timem: 30,
      FujinData: [],
      FujinCom: [
        {
          dataIndex: 'name',
          key: 'name',
          title: '名称',
        },
        {
          dataIndex: 'dist',
          key: 'dist',
          title: '与我的距离',
        },
        {
          dataIndex: 'action',
          key: 'action',
          title: '操作',
          scopedSlots: { customRender: 'action' },
        },
      ],
      cantinCom:[
        {
          dataIndex: 'name',
          key: 'name',
          title: '食堂名称',
        },
        {
          dataIndex: 'crowd',
          key: 'crowd',
          title: '当前流量(人次)',
        },
        {
          dataIndex: 'dist',
          key: 'dist',
          title: '与我的距离',
        },
        {
          dataIndex: 'action',
          key: 'action',
          title: '操作',
          scopedSlots: { customRender: 'action' },
        },
      ],
      CantinData: [ 
        {
          key: '1',
          name: '西土城教工食堂',
          crowd: 100,
          dist: 1
        },{
          key: '2',
          name: '西土城学生食堂',
          crowd: 100,
          dist: 1
        },{
          key: '3',
          name: '沙河学生食堂',
          crowd: 100,
          dist: 1
        },{
          key: '4',
          name: '沙河教工食堂',
          crowd: 100,
          dist: 1
        }
      ],
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
      IDplace:{62: "沙河教学综合楼N",29: "沙河燕南园S4" ,71: "沙河实验楼",167: "西土城教二楼",144: "西土城学一公寓",58: "沙河图书馆",179: "西土城图书馆"}
    };
  },
  watch: {
    mypos(newVal) {
      this.$http.post(`${this.$BaseUrl}map/write-log/`,Qs.stringify({
                log: "我的位置更新至" + (this.nowMapID_person <= 2?"校区"+this.nowMapID_person:this.IDplace[this.nowMapID_person]+this.nowMapID_person_z+ "层") + "坐标为" + newVal
      }))
    },
    moreShow(newVal) {
      if(newVal) {
        this.flashCrowd()
        this.getFujin()
        this.flashTime()
        this.flashDist()
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
        this.selected_Map = this.IDplace[newVal]
        this.selected_Z = this.nowMapID_Z
      }
    },
    selected_Map(newVal) {
      this.nowMapID_show = this.PlaceID[newVal]
      if(this.selected_Z>this.zNumber[newVal]||this.selected_Z<1) this.selected_Z = 1
      this.selected_key = ['3']
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
        if(this.selected_Z>this.zNumber[newVal]||this.selected_Z<1) this.selected_Z = 1
        this.nowMapID_show = this.PlaceID[this.selected_Map]
      }

    },
  },
  methods: {
    readLog() {
       this.$http.post(`${this.$BaseUrl}map/read-log/`,null)
          .then(res=>{
            console.log(res);   
            this.download('log.txt',res.data.log)            
          })  
    },
    flashDist() {
      this.$http.post(`${this.$BaseUrl}map/canteen/`,Qs.stringify({
            x: this.mypos[0],
            y: this.mypos[1],
            z: this.nowMapID_person_z,
            id: this.nowMapID_person 
      }))
        .then(res=>{
          for(let i = 0; i < 4; i++) {
            if(res.data.points[i].dist > 0) {
              this.CantinData[i].dist = res.data.points[i].dist
            } else {
              this.CantinData[i].dist = "不在同一校区"
            }
          }
        })
    },
    flashTime() {
        this.$http.post(`${this.$BaseUrl}map/gettime/`,null)
          .then(res=> {
            this.now_Timeh = res.data.h
            this.now_Timem = res.data.m
          })
    },
    getFujin() {
        this.$http.post(`${this.$BaseUrl}map/around/`,Qs.stringify({
            x: this.mypos[0],
            y: this.mypos[1],
            z: this.nowMapID_person_z,
            id: this.nowMapID_person 
      }))
        .then(res=>{
          this.FujinData = []
          let count = 0
          if(res.data.points != null) {
            res.data.points.forEach(node=> {
              this.FujinData.push({key: ++count, name: node.name, dist: node.dist})
            })
          }
        })
    },
    download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);
    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
      } else {
        pom.click();
      }
    },
    flashCrowd() {
      for(let i=0;i<4;i++) {
        this.CantinData[i].crowd += Math.ceil(Math.random()>0.5?10:-10*Math.random())
      }
    },
    locateMypos() {
      this.nowMapID_show = this.nowMapID_person
      this.nowMapID_Z = this.nowMapID_person_z
      this.moreShow = false
    },
    updataInit(val) {
      this.$refs.guide.initialPlace = val
    },
    updataDist(val) {
      this.moreShow = false
      this.$refs.guide.distPlace = val
    },
    intoGuide(val) {
      this.selected_key = ['3']
      this.selected_Map = val
      this.selected_Z = 1
      this.cardShow = false
    },
    goBus() {
      this.$info({
        title: "正在前往另一个校区~" ,
        content: () => <div><a-spin /> </div>,
        okText: "跳过",
        onOk: ()=> {
            this.guideOver()
        }
      })
    },
    guideOver() {      
      this.inGuide = false
      this.nowOrder++
      if(this.nowOrder >= this.guideOrder.length) {
        this.$success({
          title: "您的导航已结束",
          content: "已经将您的位置更新到目的地"
        })
        this.$refs.guide.clearPath()
        this.updataGuide(null)
        return
      }
      if(this.guideOrder[this.nowOrder].type == 2) {
        this.goBus()
        return
      }
      this.nowMapID_show = this.guideOrder[this.nowOrder].id
      if(this.guideOrder[this.nowOrder].id>2) this.selected_Map = this.IDplace[this.guideOrder[this.nowOrder].id]
      this.selected_Z = this.guideOrder[this.nowOrder].z

      this.nowMapID_person = this.nowMapID_show
      this.nowMapID_person_z = this.nowMapID_Z
     // console.log("??",this.GuideNode[this.guideOrder[0]][0])
      this.inGuide = true
      this.$refs.map.nowPoint = 0
      this.updataGuideShow()
      setTimeout( ()=>{this.$refs.map.startGuide()}, 500)
    },
    startGuide() {
      this.inGuide = true
      this.nowMapID_show = this.nowMapID_person
      this.nowMapID_Z = this.nowMapID_person_z
      this.nowOrder = -1
      this.guideOver()
    },
    changeMap(newMap,newMapz,num) {
      if(this.inGuide) {
        if(this.newMap!=this.nowMapID_show||this.newMapz!=this.nowMapID_Z) this.$confirm({
          title: "正在导航中，不支持切换地图哦"
        })
        return
      }
      if(newMap<=2) {
        this.selected_key = [newMap.toString()]
      }
      else{
        this.selected_Map = this.IDplace[newMap]
        this.selected_Z = newMapz
        this.selected_key = ['3']
      }
      this.nowOrder = num
      this.updataGuideShow()
    },
    updataMypos(val1,val2) {
   //   console.log("ceshi",val1,val2)
      this.$set(this.mypos,[0],val1)
      this.$set(this.mypos,[1],val2)
    //  console.log("ceshi2",this.mypos)
    },
    updataMypos2(val){
      this.$http.post(`${this.$BaseUrl}map/write-log/`,Qs.stringify({
            log: "将我的位置更新至"+val
      }))
      console.log("ooo",this.itemsPos[val])
      this.nowMapID_person = this.itemsPos[val].id
      this.nowMapID_person_z = this.itemsPos[val].pos[2]
      console.log(this.nowMapID_person, this.nowMapID_person_z)
      this.nowMapID_show = this.nowMapID_person
      this.nowMapID_Z = this.nowMapID_person_z
      this.updataMypos(this.itemsPos[val].pos[0],this.itemsPos[val].pos[1])
    },
    updataGuideShow() {
      this.$refs.map.model = this.guideOrder[this.nowOrder].move_model
      this.$set(this.GuideNode, [this.guideOrder[this.nowOrder].id, this.guideOrder[this.nowOrder].z], this.guideOrder[this.nowOrder].path)
    },
    updataGuide(val) {
    //  console.log(this.GuideNode)
      this.guideOrder = []
      this.inGuide = false
      if(val==null) {
          this.GuideNode = []
          return
      }
      this.guideOrder = val
      console.log(this.guideOrder)
      this.nowOrder = 0
      this.updataGuideShow()
      this.nowMapID_show = this.guideOrder[0].id
      this.nowMapID_Z = this.guideOrder[0].z
      /*val.forEach(node=>{
        if(node.type!=2) this.guideOrder.push([node.id,node.z])
        else {
          this.guideOrder.push([-1,0])
        }
        this.$set(this.GuideNode,[node.id,node.z],node.path)
        this.$set(this.GuideTime,[node.id,node.z], node.time)
      }) */
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
    getpos(){
       this.$http.get('/itemsPos.json').then(res => {
        this.itemsPos = res.data
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
          if(res.data.node[i].y>0) res.data.node[i].label = {show: true}
        }
        for(let i = 0;i < res.data.links.length; i++) {
          if(res.data.links[i].value>0) res.data.links[i].lineStyle = {width: 7, color: "green"}
          else res.data.links[i].lineStyle = {width: 5}
        }
        this.$set(this.mapNode,[id,z],(res.data.node))
        this.$set(this.mapLinks,[id,z],(res.data.links))
      })
    },
  },
  mounted() {
      this.mypos = [130,0]
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
      this.getMapContent('/Map[144,2].json',144,2)
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
      this.getpos();
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


