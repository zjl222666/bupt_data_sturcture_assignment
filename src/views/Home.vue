<template>
  <div>
    <echarts :option="polar"/>

  </div>
</template>

<script>
import echarts from 'vue-echarts'
export default {
  name: 'Home',
  components: {
    echarts
  },
  data () {
    return {
      polar:  {
        xAxis: {
          type: 'category',
          ata: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line'
        }]
      }
    }
  }
}
</script>
