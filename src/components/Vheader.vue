<template>
    <sinput v-model="searchPlace"/>
</template>
<script>
import sinput from "./searchInput.vue";
export default{
    name: "myheader",
    components: {
        sinput
    },
    data() {
        return {
            searchPlace: "我的位置",
        }
    },
    watch: {
        searchPlace (newVal, oldVal){
            console.log(newVal + '+' +oldVal);
        }
    }
}
</script>
<style scoped>

</style>
