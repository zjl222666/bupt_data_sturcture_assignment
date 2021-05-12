<template>
    <div id="myChart" :style="{width: '800px', height: '600px'}"></div>
</template>
<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
    }
  },
  mounted(){
    this.drawLine();
    console.log('suc!!')
  },
  methods: {
    drawLine(){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        // 绘制图表
        myChart.setOption({
            grid: {
              top: '8%',
              bottom: '12%',
            },
            xAxis: {
              min: -100,
              max: 70,
              type: 'value',
              axisLine: {onZero: true}
            },
            yAxis: {
              min: -30,
              max: 60,
              type: 'value',
              axisLine: {onZero: true}
            },
            dataZoom: [
              {
                type: 'slider',
                xAxisIndex: 0,
                filterMode: 'none'
              },
              {
                type: 'slider',
                yAxisIndex: 0,
                filterMode: 'none'
              },
              {
                type: 'inside',
                xAxisIndex: 0,
                filterMode: 'none'
              },
              {
                type: 'inside',
                yAxisIndex: 0,
                filterMode: 'none'
              }
            ],
        });
    }
  }
}
</script>
