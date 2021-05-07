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
          <span>关于我们</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
        <a-layout-header style="background: #fff; padding: 10px; width=100%">
          <a-row type="flex" justify="space-around" align="middle">
            <a-col span="9">
              <a-icon
                class="trigger"
                :type="collapsed ? 'menu-unfold' : 'menu-fold'"
                @click="() => (collapsed = !collapsed)"
              />
            </a-col>
            <a-col span="7">  <vheader/></a-col>
            <a-col span="4">  <a-icon type="ellipsis" class="trigger" @click="() => (drawopened = !drawopened)"/> </a-col>
          </a-row>
        </a-layout-header>
        <a-layout>
        <a-layout-content
          :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }"
          >
          Content
        </a-layout-content>
        <a-layout-sider width=300 v-model="collapsed1" collapsible theme="light">       <vguide/>     </a-layout-sider>
        </a-layout>
        <a-layout-footer style=" background: rgb(46, 46, 46);"> <vfooter/></a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script>
import Vfooter from './components/Vfooter.vue'
import Vheader from './components/Vheader.vue'
import Vguide from './components/guide.vue'
export default{
  components: {
    Vfooter,
    Vheader,
    Vguide,
  },
  data() {
    return {
      collapsed: false, // 左侧边栏缩放
      collapsed1: false, //右侧边栏缩放
      drawopened: false,
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


