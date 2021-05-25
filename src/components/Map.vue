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
      node: [], //地图点
      links: [], //地图边
      searchNode: [], //导航路径被加载的点
      searchLinks: [], //导航路径被加载的边
      nowPoint: 0, //模拟导航当前走到的点
      mypos:[], //我的位置
      minx: 0, //视图范围
      maxx: 30,
      miny: 0,
      maxy: 30,
      inGuide: false, //是否正在导航
      rate: 0.2 //导航的速率
    }
  },
  props: {
       nodeValue:{
           type: Array
       } //导航路径点
  },
  mounted(){
    this.myChart = this.$echarts.init(document.getElementById('myChart'));
    this.getMap();
  },
  watch: {
      nodeValue(newVal) {
          this.searchNode=[]
          this.searchLinks=[]
          this.inGuide = 1
          let count = -1
          newVal.forEach(nodeVal => {
              console.log(nodeVal)
              this.searchNode.push({
                  name: (++count).toString(),
                  symbol: "none",
                  value: nodeVal
              })
          })
          console.log(this.searchNode)
          for(let i = 0; i< count; i++) {
              this.searchLinks.push({
                  source: i.toString(),
                  target: (i+1).toString()
              })
          }
          if(newVal.length>1) this.drawGuide()
      }
  },
  methods: {
    startGuide() { //模拟导航函数，开始后若条件允许则会不断回调，可通过inGuide来实现暂停
        if(this.nowPoint>=this.searchNode.length) {
            console.log("over!");
            return;
        }
        if(this.nowPoint==0) {
            this.mypos = this.searchNode[0].value;
            this.nowPoint++;
        }
        let tmpX = this.searchNode[this.nowPoint].value[0];
        let tmpY = this.searchNode[this.nowPoint].value[1];
        let lastx = this.mypos[0];
        let slope = (tmpY - this.mypos[1]) / (tmpX - this.mypos[0]); 
        this.mypos[0] += this.rate * (tmpX>this.mypos[0]);
        this.mypos[1] += (this.rate) * slope;
        if((this.mypos[0] - tmpX)*(tmpX - lastx)>0) this.nowPoint++;
        this.myChart.setOption({
            series:[
                {
                    id: 'myPos',

                    data:[
                        {
                            name: "我的位置",
                            value: this.mypos,
                            symbol: "pin",  
                            symbolSize: [20,20]
                        }
                    ]
                }
            ]
        })
        if (this.inGuide) {
            setTimeout(()=>{this.startGuide()}, 100);
        }
    },
    drawGuide() {
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
                            filterMode :'none',
                            startValue: this.minx,
                            endValue: this.maxx
                        },
                        {
                            id: "sliderY",
                            type: 'slider',
                            show: true,
                            yAxisIndex: [0],
                            filterMode :'none',
                            left: '93%',
                            startValue: this.miny,
                            endValue: this.maxy
                        },
                        {
                            id: "insideX",
                            type: 'inside',
                            xAxisIndex: [0],
                            filterMode :'none',
                            startValue: this.minx,
                            endValue: this.maxx
                        },
                        {
                            id: "insideY",
                            type: 'inside',
                            yAxisIndex: [0],
                            filterMode :'none',
                            startValue: this.miny,
                            endValue: this.maxy
                        }
                    ],
                    series: [
                        {
                            id: 'myPos',
                            type: 'graph',
                            z:3,
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
                            z: 1,
                            nodeScaleRatio: 1,
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
                            z: 2,
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
