<template>
    <div class="footer">
        <a-row type="flex" justify="space-around" align="middle">
            <a-col span="6">
                <img src="@/assets/logo_white.png" width="300"/>
            </a-col>
            <a-col span="12">
                <h3> 团队介绍：郑金亮&nbsp;|邓翔玮&nbsp;| 陈明硕  </h3>
                <h3>
                更多：
                <a href="https://github.com/zjl222666/data_sturcture"> 关于我们</a>&nbsp;|
                <a href="https://github.com/zjl222666/data_sturcture"> Github</a>
                </h3>
                <h4>Copyrights © 2021 E-dialect. All Rights Reserved.</h4>
            </a-col>
        </a-row>

    </div>
</template>

<script>
export default{
    name: "myFooter",
}
</script>
<style scoped>
.footer{
    background: rgb(46, 46, 46);
    width: 100%;
    color: white;
}
h4{
      color: rgb(199, 199, 199);
  }
h3{
    color: white;
}
h5{
    color: white;
}
a{
    color: white;
}
</style>