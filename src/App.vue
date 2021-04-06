<template>
  <div id="app">
    <a-layout>
      <a-layout-content>
        <router-view/>
      </a-layout-content>
      <a-layout-footer style="background: rgb(46, 46, 46)">     <vfooter/>    </a-layout-footer>
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
