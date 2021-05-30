<template>
    <div style="postion: absolute">
        <div v-if="mapID==2||mapID==1?true:false" class="showYJ"> <a-button :type="isLook==false?'primary':'danger'" @click="seeCrowd"> {{isLook==true?"关闭道路拥挤度":"查看道路拥挤度"}} </a-button> </div>
        <div id="myChart" :style="{width: '960px', height: '540px'}"></div>

    </div>
</template>
<script>
import echarts from 'echarts';
import Qs from 'qs'
let myChart = null
export default {
  data () {
    return {
      node: [], //地图点
      links: [], //地图边
      searchNode: [], //导航路径被加载的点
      searchLinks: [], //导航路径被加载的边
      nowPoint: 0, //模拟导航当前走到的点
      mypos:[], //我的位置
      rate: 1, //导航的速率
      flashTime: 100, //地图导航刷新时间间隔
      mapID: 1, //当前的地图编号
      isLook: false, //当前是否正在查看道路拥挤度
      crowdLinks: [],
      crowdNode: [],
    }
  },
  props: {
       inGuide: {
           type: Boolean
       }, //是否正在导航
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
  },
  mounted(){
    myChart = this.$echarts.init(document.getElementById('myChart'));
    this.drawMap();
    this.updataCrowd();
  },
  watch: {
      inGuide(newVal) {
          if(newVal == true) {
              this.startGuide()
          }
      },
      myposd(newVal) {
            this.mypos = newVal
            console.log("I updata!!",newVal[0],newVal[1])
            myChart.setOption({
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
              myChart.setOption({
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
              myChart.setOption({
                  series: [{
                      id: 'myPos',
                      data:[]
                  }]
              })
          }
      },
      mapNode(newVal) {
          this.node = newVal
          console.log(newVal)
         myChart.setOption({
              series:[{
                  id: 'MapContent',
                  data: this.node,
              }]
          })
      },
      mapLinks(newVal) {
         this.links = newVal
         myChart.setOption({
              series:[
                  {
                      id: 'MapContent',
                      links: this.links,
                  }
              ]
          })
      },
      GuideNode(newVal) {
        //  console.log("JIINLAI!!",newVal)
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
    updataCrowd() {
        if(this.mapID!=1&&this.mapID!=2){
            this.isLook = false
            return
        }
        this.$http.post(`${this.$BaseUrl}map/map/`,Qs.stringify({
            id: this.mapID
        }))
        .then(res=>{
            console.log('res=>',res);            
        })
        /*setTimeout(() => {
            this.updataCrowd()
        }, 10000);*/
    },
    seeCrowd() {
        this.isLook = !this.isLook
    },
    startGuide() { //模拟导航函数，开始后若条件允许则会不断回调，可通过inGuide来实现暂停
        if(this.nowPoint>=this.searchNode.length) {
            console.log("over!");
            this.$emit("updataMypos",this.mypos[0],this.mypos[1])
            this.nowPoint = 0
            this.$emit("guideOver");
            return;
        }
        if(this.nowPoint==0) {
        //    this.mypos = this.searchNode[0].value;
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
       // console.log(this.mypos,this.nowPoint)  
       myChart.setOption({
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
        if((this.mypos[0] - tmpX)*(tmpX - lastx)>=0||(this.mypos[1]-tmpY)*(tmpY-lastY)>=0) this.nowPoint++;
        if (this.inGuide) {
            setTimeout(()=>{this.startGuide()}, this.flashTime);
        }else {
            this.$emit("updataMypos",this.mypos[0],this.mypos[1])
        }
    },
    drawGuide() {
        
        myChart.setOption({
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
    drawMap(){
                myChart.setOption({
                    backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [{
                            offset: 0,
                            color: '#f7f8fa'
                        }, {
                            offset: 1,
                            color: '#cdd0d5'
                    }]),
                    xAxis: [{
                        show: true,
                        scale: true,
                        min: function (value) {
                            return value.min;
                        },
                        max: function (value) {
                            return value.max;
                        }
                    }],
                    yAxis: [{
                        show: true,
                        scale: true,
                        min: function (value) {
                            return value.min;
                        },
                        max: function (value) {
                            return value.max;
                        }
                    }],
                    dataZoom: [
                        
                        {
                            id: "insideX",
                            start: 0,
                            type: "inside",
                            end: 100,
                            xAxisIndex: [0],
                            filterMode :'none',
                        },
                        {
                            id: "insideY",
                            start: 0,
                            type: "inside",
                            end: 100,
                            yAxisIndex: [0],
                            filterMode :'none',
                        }
                    ],
                    series: [
                        {
                            id: 'myPos',
                            type: 'graph',
                            z:4,
                            coordinateSystem: 'cartesian2d',
                            label: {
                                show: true
                            }
                        },
                        {
                            id: 'MapContent',
                            type: 'graph',
                            z: 1,
                            nodeScaleRatio: 1,
                            coordinateSystem: 'cartesian2d',
                            label: {
                                color: "white",
                                position: 'inside',
                            },
                            lineStyle: {
                                width: 6
                            },
                            emphasis: {
                                focus: 'self',
                                label: {
                                    show:true
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
                        },
                        {
                            id: 'showCrowd',
                            type: 'graph',
                            z: 3,
                            coordinateSystem: 'cartesian2d',
                            edgeLabel: {
                                formatter: '拥挤度: {c}',
                                show: true
                            }
                        },
                    ]
                });
                myChart.on('click',{seriesIndex: 1,dataType: 'node'},parmas=> {
                    console.log(parmas)
                    if(parmas.data.x!=undefined&&(this.mapID==2||this.mapID==1))this.$emit("showCard",parmas.data.x);
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