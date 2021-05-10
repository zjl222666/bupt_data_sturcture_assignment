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
                <strong> 食堂一 </strong>
            </template>
            <a-card-meta title="选择位置：">
                <template slot="description">
                    <sinput/>
                    对应的逻辑位置：
                </template>

            </a-card-meta>
            
        </a-card>
</template>
    
<script>
import sinput from "./searchInput.vue"
export default{
    data() {
        return {
            myPlace: ''
        }
    },
    components: {
        sinput
    },
    methods: {
        closeIt (){
            this.$emit("closeIt");
        }
    }
}
</script>
