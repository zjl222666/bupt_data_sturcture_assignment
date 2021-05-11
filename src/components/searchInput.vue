<template>
  <div>
  <a-select
    show-search
    :showArrow="false"
    placeholder="Select a person"
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
  </div>
</template>

<script>
export default {
  data() {
      return{
          placeSet:[],
          myPlace2: this.myPlace,
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
    //  console.log(`selected ${value}`);  
      this.$emit("handleChange1",value);
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    getItems () {
      this.$http.get('/test.json').then(res => {
        this.placeSet = res.data
      })
    }
  },
  watch: {
      myPlace(newVal) {
      //  console.log('myPlace update and the value is ' + newVal);
        this.myPlace2 = newVal;
      },
      myPlace2(newVal){
      //  console.log('new myPlace2 is' + newVal)
        this.$emit("input",newVal);
      }
  },
  mounted() {
    this.getItems()
  }
};
</script>