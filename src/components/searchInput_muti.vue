<template>
  <div>
  <a-select
    :showArrow="false"
    mode="multiple"
    v-model="passby"
    style="width: 100%"
    @change="handlePassby"
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
          passby: [],
      }
  },
  methods: {
    handlePassby(value) {
    //  console.log(`selected ${value}`);  
      this.$emit("handlePassby",value);
    },
    getItems () {
      this.$http.get('/searchItem.json').then(res => {
        this.placeSet = res.data
      })
    }
  },
  mounted() {
    this.getItems()
  }
};
</script>