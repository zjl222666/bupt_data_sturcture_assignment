<template>
    <div style="postion: absolute">
        <div class="showYJ"> <a-button type="primary"> 查看道路拥挤情况 </a-button> </div>
        <div id="myChart" :style="{width: '960px', height: '540px'}"></div>

    </div>
</template>
<script>
import echarts from 'echarts';

export default {
  name: 'hello',
  data () {
    return {
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
      rate: 0.1, //导航的速率
      flashTime: 50, //地图导航刷新时间间隔
      Lx: 100,
      Ly: 100,
      focusSize: 5, //点击点后要缩放的大小
    }
  },
  props: {
       mapNode: {
           type: Array
       },
       mapLinks: {
           type: Array
       },
       GuideNode:{
           type: Array
       }, //导航路径点
       mypos_in :{
           type: Boolean,
           default: false
       }, //人是否在这张地图中
       myposd: {
           type: Array,
       },
       GuideTime:{
            type: Array
        },
        MapID: { //当前这张地图的ID
            type: Number
        }
  },
  mounted(){
    this.myChart = this.$echarts.init(document.getElementById('myChart'));
    this.drawMap();
  },
  watch: {
      myposd(newVal) {
          this.mypos = newVal
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
      },
      mypos_in(newVal) {
        //  console.log("test!")
          if(newVal == true) {
              this.myChart.setOption({
                  series:[{
                      id: 'myPos',
                      data: [{
                            name: "我的位置",
                            value: this.mypos,
                            symbol: "pin",  
                            symbolSize: [20,20]
                        }],
                  }]
              })
          } else {
              this.myChart.setOption({
                  series: [{
                      id: 'myPos',
                      data:[]
                  }]
              })
          }
      },
      mapNode(newVal) {
          this.node = newVal
       //   console.log(newVal)
          this.myChart.setOption({
              series:[{
                  id: 'MapContent',
                  data: this.node,
              }]
          })
      },
      mapLinks(newVal) {
          this.links = newVal
          this.myChart.setOption({
              series:[
                  {
                      id: 'MapContent',
                      links: this.links,
                  }
              ]
          })
      },
      Lx(newVal, oldVal){
          this.node.forEach(node => { 
              node.symbolSize[0] = node.symbolSize[0]*oldVal/newVal
            })
          this.myChart.setOption({
              series: [
                  {
                       id: 'MapContent',
                       data: this.node
                  }
              ]
          })
      },
      Ly(newVal, oldVal){
          this.node.forEach(node => { 
              node.symbolSize[1] = node.symbolSize[1]*oldVal/newVal
            })
            this.myChart.setOption({
              series: [
                  {
                       id: 'MapContent',
                       data: this.node
                  }
              ]
          })
      },
      GuideNode(newVal) {
          console.log("JIINLAI!!",newVal)
          if(newVal == undefined){
              this.searchNode = []
              this.searchLinks = []
              this.drawGuide()
              return
          }
          if(newVal.length<=1) {
              this.searchNode = []
              this.searchLinks = []
              this.drawGuide()
              return
          }
          this.searchNode=[]
          this.searchLinks=[]
          this.inGuide = 1
          let count = -1
          newVal.forEach(nodeVal => {
            //  console.log(nodeVal)
              this.searchNode.push({
                  name: (++count).toString(),
                  symbol: "none",
                  value: nodeVal
              })
          })
        //  console.log(this.searchNode)
          for(let i = 0; i< count; i++) {
              this.searchLinks.push({
                  source: i.toString(),
                  target: (i+1).toString()
              })
          }
          this.drawGuide()
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
        let lastY = this.mypos[1];
        let slope = (tmpY - this.mypos[1]) / (tmpX - this.mypos[0]); 
        if(Math.abs(tmpX-this.mypos[0])>this.rate){
            this.mypos[0] += this.rate * (tmpX>this.mypos[0]?1:-1);
            this.mypos[1] += this.rate * (tmpX>this.mypos[0]?1:-1) * slope;
        } else {
            this.mypos[1] += this.rate * (tmpY>this.mypos[1]?1:-1)
        }
        //console.log(this.mypos,this.nowPoint)  
        if((this.mypos[0] - tmpX)*(tmpX - lastx)>=0||(this.mypos[1]-tmpY)*(tmpY-lastY)>=0) this.nowPoint++;
        this.$emit("updataMypos",this.mypos)
        if (this.inGuide) {
            setTimeout(()=>{this.startGuide()}, this.flashTime);
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
        this.myChart.dispatchAction({
            type: 'dataZoom',
            batch: [
                {
                    dataZoomId: "insideX",
                    start: 100*this.max((newx-this.focusSize-this.minx),0)/(this.maxx-this.minx),
                    end: 100*this.min((newx+this.focusSize-this.minx)/(this.maxx-this.minx),100)
                },
                {
                    dataZoomId: "insideY",
                    start: 100*this.max((newy-this.focusSize-this.miny),0)/(this.maxy-this.miny),
                    end: 100*this.min((newy+this.focusSize-this.miny)/(this.maxy-this.miny),100)
                }
            ]
        })
    },
    drawMap(){
                this.myChart.setOption({
                    backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [{
                            offset: 0,
                            color: '#f7f8fa'
                        }, {
                            offset: 1,
                            color: '#cdd0d5'
                    }]),
                    xAxis: [{
                        show: false,
                        min:this.minx,
                        max:this.maxx
                    }],
                    yAxis: [{
                        show: false,
                        min:this.miny,
                        max:this.maxy
                    }],
                    dataZoom: [
                        
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
                            coordinateSystem: 'cartesian2d',
                            label: {
                                show: true
                            }
                        },
                        {
                            id: 'MapContent',
                            type: 'graph',
                            z: 1,
                            data: this.node,
                            links: this.links,
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
                this.myChart.on('click',{seriesIndex: 1,dataType: 'node'},parmas=> {
                    this.$emit("showCard",parmas.data.x);
                    this.changeCenter(parmas.data.value[0],parmas.data.value[1]);
                   // console.log("point test  ",parmas.data.value[0])
                })
                this.myChart.on('datazoom',parmas=>{
                    if(parmas.batch != undefined){
                        //console.log(parmas)
                        let xB = parmas.batch
                        xB.forEach(node=> {
                            if(node.dataZoomId == "insideX")  this.Lx = node.end - node.start
                            else  this.Ly = node.end - node.start
                        })

                    }

                })
            
    }
}
}
</script>
<style scoped>
.showYJ{
    position: absolute;
    left: 60%;
    top: 10%;
    z-index: 100;
}
</style>