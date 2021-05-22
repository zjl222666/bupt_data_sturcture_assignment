<template>
  <div id="app">
    <a-layout>
<<<<<<< Updated upstream
      <a-layout-content>
        <router-view/>
      </a-layout-content>
      <a-layout-footer style="background: rgb(46, 46, 46)">     <vfooter/>    </a-layout-footer>
=======
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
          <mymap @handleChange1="handleChange"/>
        </a-layout-content>
        <a-layout-sider width=350 v-model="collapsed1"  theme="light">       <vguide/>     </a-layout-sider>
        </a-layout>
        <a-layout-footer style=" background: rgb(46, 46, 46);"> <vfooter/></a-layout-footer>
>>>>>>> Stashed changes
    </a-layout>
    <router-view/>
  </div>
</template>
<script>
import Vfooter from './components/Vfooter.vue'
export default{
  components: {
    Vfooter
  }
}
</script>

<style>

</style>
