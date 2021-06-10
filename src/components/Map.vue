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
      mypos:[], //我的位置
      ratex: 1, //导航的速率
      ratey: 1,
      flashTime: 40, //地图导航刷新时间间隔
      mapID: 1, //当前的地图编号
      isLook: false, //当前是否正在查看道路拥挤度
      nowPoint: 0,
      crowdLinks: [],
      crowdNode: [],
      model: "步行"
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
       }
  },
  mounted(){
    myChart = this.$echarts.init(document.getElementById('myChart'));
    this.drawMap();
    this.updataCrowd();
  },
  watch: {
      crowdLinks(newVal) {
          myChart.setOption({
              series:[{
                  id: 'showCrowd',
                  links: newVal,
              }]
          })
      },
      crowdNode(newVal) {
          myChart.setOption({
              series:[{
                  id:'showCrowd',
                  data: newVal,
              }]
          })
      },
      isLook(newVal) {
          if (newVal==false) {
              this.crowdLinks=[]
              this.crowdNode=[]
          } else {
              this.updataCrowd();
          }
      },
      mapID(newVal) {
          if(newVal>2)  this.isLook = false
          if(this.isLook)this.updataCrowd();
      },
      myposd(newVal) {
            this.mypos = newVal
        //    console.log("I updata!!",newVal[0],newVal[1])
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
        let minx = 1e9,maxx = -1e9
        let miny = 1e9,maxy = -1e9
        this.node.forEach(node=>{
            minx = Math.min(node.value[0], minx)
            maxx = Math.max(node.value[0], maxx)
            miny = Math.min(node.value[1], miny)
            maxy = Math.max(node.value[1], maxy)
        })
        this.ratex = (maxx-minx)/900
        this.ratey = (maxy-miny)/900
     //   console.log(this.ratex,this.ratey)
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
        if(this.isLook==false) return
        console.log("tryget!!")
        this.$http.post(`${this.$BaseUrl}map/map/`,Qs.stringify({
            id: this.mapID
        }))
        .then(res=>{
            console.log(res.data)
            this.crowdLinks = res.data.links
            this.crowdNode = res.data.node  
            for (let i = 0; i < this.crowdLinks.length; i++) {
                this.crowdLinks[i].value = Math.round(this.crowdLinks[i].value * 100) / 100
            }         
        })
    },
    seeCrowd() {
        this.isLook = !this.isLook
    },
    endGuide() {        
        clearTimeout(this.guideClock)
        this.$emit("updataMypos",this.mypos[0],this.mypos[1])
    },
    startGuide() { //模拟导航函数，开始后若条件允许则会不断回调
       // console.log("intoGuide")
        if(this.nowPoint>=this.searchNode.length) {
            console.log("over!");
            this.endGuide()
            this.$emit("guideOver");
            return;
        }
        let tmpX = this.searchNode[this.nowPoint].value[0];
        let tmpY = this.searchNode[this.nowPoint].value[1];
        if(this.nowPoint == 0) {
            this.mypos = [tmpX, tmpY]
            this.nowPoint ++
            this.guideClock = setTimeout(()=>{this.startGuide()}, this.flashTime);
            return 
        }
     //   console.log(this.mypos,tmpX,tmpY)
        let slope = (tmpY - this.mypos[1]) / (tmpX - this.mypos[0]); 
        if(Math.abs(tmpX-this.mypos[0])>this.ratex){
            this.mypos[0] += this.ratex * (tmpX>this.mypos[0]?1:-1);
            this.mypos[1] += Math.min(this.ratey,this.ratex * slope) * (tmpX>this.mypos[0]?1:-1);
        } else {
            this.mypos[1] += this.ratey * (tmpY>this.mypos[1]?1:-1)
        }
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
        if((this.mypos[0]-tmpX)*(this.mypos[0]-tmpX)+(this.mypos[1]-tmpY)*(this.mypos[1]-tmpY)<=2*Math.sqrt(this.ratex*this.ratex+this.ratey*this.ratey)) this.nowPoint++
        if(this.model == "自行车") this.flashTime = 20
        else this.flashTime = 80
        console.log(this.flashTime)
        this.guideClock = setTimeout(()=>{this.startGuide()}, this.flashTime);
    },
    drawGuide() {      
     //   console.log('hua',this.searchNode)
        myChart.setOption({
        series: [{
            id: "guideContent",
            data: this.searchNode,
            links: this.searchLinks,
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
                        show: false,
                        scale: true,
                        min: function (value) {
                            return value.min;
                        },
                        max: function (value) {
                            return value.max;
                        }
                    }],
                    yAxis: [{
                        show: false,
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
                                color: "red",
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
.showMypos{
    position: absolute;
    left: 50%;
    top: 10%;
    z-index: 100;
}
</style>