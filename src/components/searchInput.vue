<template>
  <a-select
    show-search
    placeholder="请输入地点"
    option-filter-prop="children"
    v-model="myPlace2"
    style="width: 100%"
    @change="handleChange"
    :filter-option="filterOption"
  >
    <a-select-option v-for="item in placeSet" :key="item" :value="item">
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
          myPlace2: null,
      }
  },
  props: {
      myPlace: {
          type: String,
          default: ''
      }
  },
  methods: {
    handleChange(value) {
      console.log(`selected ${value}`);  
      this.$emit("handleChange",value);
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
  },
  watch: {
      myPlace(newVal) {
        console.log('myPlace update and the value is ' + newVal);
        this.myPlace2 = newVal;
      },
      myPlace2(newVal){
        console.log('new myPlace2 is' + newVal)
        this.$emit("input",newVal);
      }
  }
};
</script>