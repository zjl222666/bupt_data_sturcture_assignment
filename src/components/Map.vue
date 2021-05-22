<template>
    <div id="myChart" :style="{width: '960px', height: '540px'}"></div>
</template>
<script>
import echarts from 'echarts';

export default {
  name: 'hello',
  data () {
    return {
      mapName: "校区一",
      node: [],
      links: [],
    }
  },
  mounted(){
    this.myChart = this.$echarts.init(document.getElementById('myChart'));
    this.getMap();
  },
  methods: {
    drawGuide(pointSet) {
        this.myChart.setOption({

        })
        console.log(pointSet)
    },
    changeCenter(newx,newy) {
        this.myChart.setOption({
            series: [
                {id: 'MapContent',
                center:[newx, newy]}
            ]
        })
    },
    getMap(){
        this.myChart.showLoading();
        this.$http.get('/Map.json').then(res => {
                this.myChart.hideLoading();
                this.node = res.data.node
                this.node.forEach(node => { node.label = {show: node.value>0}})
                this.links = res.data.links
                this.myChart.setOption({
                    backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [{
                        offset: 0,
                        color: '#f7f8fa'
                    }, {
                        offset: 1,
                        color: '#cdd0d5'
                    }]),
                    title: {
                        text: this.mapName ,
                        left: '5%',
                        top: '3%'
                    },
                    series: [
                        {
                            id: 'MapContent',
                            type: 'graph',
                            layout: 'none',
                            data: this.node,
                            links: this.links,
                            roam: true,
                            label: {
                                position: 'top'
                            },
                            lineStyle: {
                                curveness: 0
                            },
                            emphasis: {
                                focus: 'self',
                                lineStyle: {
                                    width: 10
                                }
                            }
                        }
                    ]
                });
                this.myChart.on('click',{datatype: 'node'},parmas=> {
                  //  this.$emit("handleChange1",parmas.data.name);
                    this.changeCenter(parmas.data.x,parmas.data.y);
                })
            });
            
    }
}
}
</script>
