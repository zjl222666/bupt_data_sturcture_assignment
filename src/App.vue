<template>
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
        <a-layout-header style="background: #fff; padding: 10px; width=100%">
          <a-row type="flex" justify="start"> 
            <a-col span="2">
            <a-icon
                class="trigger"
                :type="collapsed ? 'menu-unfold' : 'menu-fold'"
                @click="() => (collapsed = !collapsed)"
            />
            </a-col>
            <a-col span="2">     物理位置搜索 </a-col>
            <a-col span="5"> <sinput /> </a-col>
            <a-col span="1"> &nbsp; </a-col>
            <a-col span="2">     逻辑位置搜索 </a-col>
            <a-col span="5"> <sinput/> </a-col>
          </a-row>
        </a-layout-header>
        <a-layout>
        <a-layout-content
          :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }"
          >
          <vcard v-if="cardShow"/>
        </a-layout-content>
        <a-layout-sider width=350 v-model="collapsed1" collapsible theme="light">       <vguide/>     </a-layout-sider>
        </a-layout>
        <a-layout-footer style=" background: rgb(46, 46, 46);"> <vfooter/></a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script>
import Vfooter from './components/Vfooter.vue'
import Vguide from './components/guide.vue'
import Vcard from './components/Vcard.vue'
import sinput from './components/searchInput.vue'
export default{
  components: {
    Vfooter,
    sinput,
    Vguide,
    Vcard,
  },
  data() {
    return {
      collapsed: false, // 左侧边栏缩放
      collapsed1: false, //右侧边栏缩放
      cardShow: true, //卡片是否显示
    };
  },
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
</style>


