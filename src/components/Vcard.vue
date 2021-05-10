<template>
    <a-affix :offset-top="100">
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
                <a-button type="link">
                    关闭
                </a-button>
            </template>
            <template slot="title">
                <strong> 食堂一 </strong>
            </template>
            <a-card-meta title="楼内设施：">
                <a-select
                    v-model="myPlace"
                    style="width: 100%"
                    @change="handleChange"
                >

                </a-select>
            </a-card-meta>
        </a-card>
    </a-affix>
</template>
    
<script>
export default{
    data() {
        return {
            myPlace: ''
        }
    }
}
</script>
