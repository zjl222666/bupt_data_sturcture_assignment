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
      searchNode: [{name: '1',x: 2, y: 2}, {name: '2',x: 5, y: 5}],
      searchLinks: [{source: "1",target: "2"}],
      minx: 0,
      maxx: 30,
      miny: 0,
      maxy: 30
    }
  },
  mounted(){
    this.myChart = this.$echarts.init(document.getElementById('myChart'));
    this.getMap();
    this.drawGuide(this.guideNode);
  },
  methods: {
    drawGuide() {
    },
    changeCenter(newx,newy) {
        this.myChart.setOption({
            series: [{
                id: "MapContent",
                center: [newx, newy]
            }]
        })
    },
    getMap(){
        this.$http.get('/Map.json').then(res => {
                this.node = res.data.node
                this.node.forEach(node => { node.label = {show: node.value>0}})
                this.links = res.data.links
                this.myChart.setOption({
                    title: {
                        text: this.mapName ,
                        left: '5%',
                        top: '3%'
                    },
                    backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [{
                            offset: 0,
                            color: '#f7f8fa'
                        }, {
                            offset: 1,
                            color: '#cdd0d5'
                    }]),
                    xAxis: [{
                        show: true,
                        min:this.minx,
                        max:this.maxx
                    }],
                    yAxis: [{
                        show: true,
                        min:this.miny,
                        max:this.maxy
                    }],
                    dataZoom: [
                        {
                            type: 'slider',
                            show: true,
                            xAxisIndex: [0],
                        },
                        {
                            type: 'slider',
                            show: true,
                            yAxisIndex: [0],
                            left: '93%',
                        },
                        {
                            type: 'inside',
                            xAxisIndex: [0],
                        },
                        {
                            type: 'inside',
                            yAxisIndex: [0],
                        }
                    ],
                    series: [
                        {
                            id: 'MapContent',
                            type: 'graph',
                            data: this.node,
                            links: this.links,
                            coordinateSystem: 'cartesian2d',
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
