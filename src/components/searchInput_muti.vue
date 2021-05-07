<template>
  <a-select
    mode="multiple"
    v-model="myPlace2"
    style="width: 100%"
    placeholder="请输入地点"
    @change="handleChange"
  >
    <a-select-option v-for="item in placeSet" :key="item">
      {{ item }}
    </a-select-option>
  </a-select>
</template>
<script>
export default {
  data() {
      return{
          placeSet:[
              '我的位置',
              '食堂一',
              '食堂二',
              '宿舍一',
              '宿舍二',
              '教学楼'
          ],
          myPlace2: this.myPlace
      }
  },
  props: {
      myPlace: {
          type: []
      }
  },
  methods: {
    handleChange(value) {
      console.log(`selected ${value}`);  
    },
  },
  watch: {
      myPlace(newVal){
          this.myPlace2 = newVal;
      },
      myPlace2(newVal){
          this.$emit("input",newVal);
      }
  }
};
</script>