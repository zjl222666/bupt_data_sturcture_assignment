<template>

  <div id="app">
    <a-layout>
<div >
  <a-layout id="components-layout-demo-custom-trigger">
    <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
      <div class="logo"></div>
      <a-menu theme="dark" mode="inline" :default-selected-keys="['1']">
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
            <vcard :nowID="nowID"  v-if="cardShow" @closeIt="()=>{cardShow = false}"/>
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
            <a-col span="5"> <sinput v-model=" searchValue" @handleChange1="handleChange"/> </a-col>
            <a-col span="2">  <a-button type="link" icon="search" @click="handleChange"/>  </a-col>
            <a-col span="1"> &nbsp; </a-col>
          </a-row>
        </a-layout-header>
        <a-layout>
        <a-layout-content
          :style="{  background: '#fff', minHeight: '280px' }"
          >
          <mymap @handleChange1="handleChange" :nodeValue="nodeValue"/>
        </a-layout-content>
        <a-layout-sider width=400 v-model="collapsed1"  theme="light">       <vguide/>     </a-layout-sider>
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
      collapsed1: false, //右侧边栏缩放
      cardShow: false, //卡片是否显示
      searchValue: "",
      posID: {}, //存储物理位置（逻辑位置）对应的建筑物ID
      nowID: "",
      nodeValue: []
    };
  },
  methods: {
    test(){
        console.log('test')
        this.$http.get('/guideRoute.json').then(res =>{
            this.nodeValue = res.data.node
        })
    },
    handleChange(val) {
      this.cardShow = true;
      this.nowID = this.posID[val].toString();
    },
    getID(){
      this.$http.get('/ItemsToid.json').then(res => {
        this.posID = res.data
      })
    }
  },
  mounted() {
    this.getID();
    this.test();
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


