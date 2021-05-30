<template>

        <a-card hoverable style="width: 350px">
            <img
                slot="cover"
                alt="example"
                src="@/assets/logo_black.png"
            />
            <template slot="actions" class="ant-card-actions">
                <div @click="updataInit"> <a-icon key="edit" type="edit" /> 设为起点 </div>
                <div  @click="updataDist"> <a-icon key="edit" type="edit"/>设为终点 </div>
                <div @click="intoGuide" > <a-icon key="ellipsis" type="ellipsis"/> 进入楼内导航 </div>
            </template>
            <template slot="extra">
                <a-button type="link" @click="closeIt">
                    关闭
                </a-button>
            </template>
            <template slot="title">
                <strong> {{nowCard.name}} </strong>
            </template>
            <a-card-meta >
                <template slot="description">
                    <div> <strong> 所在校区: </strong> 
                    {{nowCard.campus}} </div>
                    <strong> 当前物理位置</strong>
                    <a-select 
                        v-model="selected_Place" 
                        style="width: 240px"
                        show-search
                        :showArrow="false">
                        <a-select-option v-for="items in nowCard.items" :key="items" :value="items">
                            {{items}}
                        </a-select-option>
                    </a-select>
                    <div> <strong> 对应的逻辑位置有：</strong> </div>
                    <div v-if="logic_place.length==0"> 无 </div>
                    <div v-for="items in logic_place" :key="items">
                        {{items}}
                    </div>
                </template>
            </a-card-meta>
            
        </a-card>
</template>
    
<script>

export default{
    data() {
        return {
            selected_Place: "", //当前选择的物理位置
            logic_place: [], //对应的逻辑位置
            supportPlace: ["沙河教学综合楼N","沙河燕南园S4","沙河实验楼","西土城教二楼","西土城学一公寓","沙河图书馆","西土城图书馆"]
        }
    },
    methods: {
        closeIt (){
            this.$emit("closeIt");
        },
        updataInit() {
            if(this.selected_Place!="")this.$emit("updataInit",this.selected_Place)
            else this.$error({
                title: "请选择好位置再设置哦！"
            })
        },
        updataDist() {
            if(this.selected_Place!="")this.$emit("updataDist",this.selected_Place)
            else  this.$error({
                title: "请选择好位置再设置哦！"
            })
        },
        intoGuide() {
            if(this.supportPlace.indexOf(this.nowCard.name)!=-1) this.$emit("intoGuide",this.nowCard.name)
            else this.$confirm({
                        title: "本栋建筑还不支持楼内导航哦",
                        content: "支持楼内导航的建筑有：沙河教学综合楼N,沙河燕南园S4,沙河实验楼,西土城教二楼,西土城学一公寓,沙河图书馆,西土城图书馆",
                        okText: "确认",
                    })
        }
    },
    props: {
        nowCard: {
            type: Object
        },
        choosePlace: {
            type: String
        },
        itemsContent: {
            type: Object
        }
    },
    watch: {
        nowCard(newVal) {
            console.log(newVal)
            this.selected_Place = newVal.items[0]
        },
        choosePlace(newVal) {
            if(this.itemsContent[newVal].islogic==true){
                this.selected_Place = this.itemsContent[newVal].inverse[0]
                return
            }
            if(this.nowCard.items.indexOf(newVal)!=-1) {
                this.selected_Place = newVal
            }
            else {
                this.selected_Place = this.nowCard.items[0]
            }
        },
        selected_Place(newVal) {
            if(this.itemsContent[newVal].inverse!=null) this.logic_place = this.itemsContent[newVal].inverse
            else this.logic_place = []
        }
    },
    beforeMount() {
    }
}
</script>
