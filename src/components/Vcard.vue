<template>

        <a-card hoverable style="width: 300px">
            <img
                slot="cover"
                alt="example"
                src="@/assets/logo_black.png"
            />
            <template slot="actions" class="ant-card-actions">
                <div> <a-icon key="setting" type="setting" /> 设为起点 </div>
                <div> <a-icon key="edit" type="edit" />设为终点 </div>
                <div> <a-icon key="ellipsis" type="ellipsis" /> 人流量 </div>
            </template>
            <template slot="extra">
                <a-button type="link" @click="closeIt">
                    关闭
                </a-button>
            </template>
            <template slot="title">
                <strong> {{nowCard.name}} </strong>
            </template>
            <a-card-meta title="选择位置：">
                <template slot="description">
                    <a-select 
                        v-model="selected_Place" 
                        style="width: 240px"
                        show-search
                        :showArrow="false">
                        <a-select-option v-for="items in nowCard.items" :key="items" :value="items">
                            {{items}}
                        </a-select-option>
                    </a-select>
                </template>

            </a-card-meta>
            
        </a-card>
</template>
    
<script>

export default{
    data() {
        return {
            selected_Place: "",
        }
    },
    methods: {
        closeIt (){
            this.$emit("closeIt");
        },

    },
    props: {
        nowCard: {
            type: Object
        },
        choosePlace: {
            type: String
        }
    },
    watch: {
        nowCard(newVal) {
            console.log(newVal)
        }
    },
    beforeMount() {
    }
}
</script>
