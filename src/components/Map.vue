<template>
    <div> <a-button @click="startGuide"/> 
    <div id="myChart" :style="{width: '960px', height: '540px'}"></div>
    </div>
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
      searchNode: [],
      searchLinks: [],
      mypos:[],
      minx: 0,
      maxx: 30,
      miny: 0,
      maxy: 30,
      inGuide: false,
      count: 0
    }
  },
  mounted(){
    this.myChart = this.$echarts.init(document.getElementById('myChart'));
    this.getMap();
    this.drawGuide();
  },
  methods: {
    startGuide() {
        console.log(this.count++);
        if (this.inGuide) {
            setTimeout(()=>{this.startGuide()}, 1000);
        }
    },
    drawGuide() {
        this.inGuide = true;
        this.$http.get('/guideRoute.json').then(res =>{
            this.searchNode = res.data.node
            this.searchLinks = res.data.links
            console.log(this.searchNode)
            this.myChart.setOption({
            series: [{
                id: "guideContent",
                type: "graph",
                data: this.searchNode,
                links: this.searchLinks,
                coordinateSystem: 'cartesian2d',
                lineStyle: {
                    color: '#FFF',
                    width: 5
                }
            }]
        })
        })
    },
    max(x,y) {
        return x>y?x:y
    },
    min(x,y) {
        return x<y?x:y
    },
    changeCenter(newx,newy) {
        this.myChart.setOption({
             dataZoom: [
                {
                    id: "sliderX",
                    startValue: newx-1,
                    endValue: newx+1
                },
                {
                    id: "sliderY",
                    startValue: newy-1,
                    endValue: newy+1
                },
                {
                    id: "insideX",
                    startValue: newx-1,
                    endValue: newx+1
                },
                {
                    id: "insideY",
                    startValue: newy-1,
                    endValue: newy+1
                }
             ]
        })
    },
    getMap(){
        this.$http.get('/Map.json').then(res => {
                this.node = res.data.node
                this.node.forEach(node => { node.label = {show: node.x>0}})
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
                            id: "sliderX",
                            type: 'slider',
                            show: true,
                            xAxisIndex: [0],
                            startValue: this.minx,
                            endValue: this.maxx
                        },
                        {
                            id: "sliderY",
                            type: 'slider',
                            show: true,
                            yAxisIndex: [0],
                            left: '93%',
                            startValue: this.miny,
                            endValue: this.maxy
                        },
                        {
                            id: "insideX",
                            type: 'inside',
                            xAxisIndex: [0],
                            startValue: this.minx,
                            endValue: this.maxx
                        },
                        {
                            id: "insideY",
                            type: 'inside',
                            yAxisIndex: [0],
                            startValue: this.miny,
                            endValue: this.maxy
                        }
                    ],
                    series: [
                        {
                            id: 'myPos',
                            type: 'graph',
                            data: [{
                                name: "我的位置",
                                value: [5,5],
                                symbol: "pin",  
                                symbolSize: [20,20]
                            }],
                            coordinateSystem: 'cartesian2d',
                            label: {
                                show: true
                            }
                        },
                        {
                            id: 'MapContent',
                            type: 'graph',
                            data: this.node,
                            links: this.links,
                            coordinateSystem: 'cartesian2d',
                            label: {
                                show: true,
                                position: 'top',
                                formatter: '{b}: {@[0]}'
                            },
                            emphasis: {
                                focus: 'self',
                                lineStyle: {
                                    width: 10
                                }
                            }
                        },
                        {
                            id: "guideContent",
                            type: "graph",
                            data: this.searchNode,
                            links: this.searchLinks,
                            coordinateSystem: 'cartesian2d',
                            lineStyle: {
                                color: '#FFF',
                                width: 5
                            }
                        }
                    ]
                });
                this.myChart.on('click',{datatype: 'node'},parmas=> {
                  //  this.$emit("handleChange1",parmas.data.name);
                    this.changeCenter(parmas.data.value[0],parmas.data.value[1]);
                   // console.log("point test  ",parmas.data.value[0])
                })
            });
            
    }
}
}
</script>
