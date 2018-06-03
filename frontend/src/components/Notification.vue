<template>
   <div>
     <div class="container" v-if="ntShow">
       <div class="notification">
         <i class="iconfont icon-cuowu" v-if="!flag"></i>
         <i class="iconfont icon-zhengque" v-if="flag"></i>
         <span class="message">{{message}}</span>
       </div>
     </div>
   </div>
</template>

<script>
    export default {
        name: "Notification",
        props: ['message', 'ntShow', 'flag']
    }
</script>

<style scoped>
  .container {
    position: fixed;
    left: 0;
    top: 100px;
    width: 100%;
    z-index: 2000;
    display: flex;
    justify-content: center;
    /*background-color: #f2f2e2;*/
  }
  .notification {
    height: 25px;
    line-height: 25px;
    text-align: center;
    font-size: 16px;
    padding: 10px;
    background: #fff;
    border-radius: 5px;
  }
  .icon-cuowu {
    color: red;
    font-size: 25px;
    vertical-align:middle
  }
  .icon-zhengque {
    color: rgb(0, 240, 212);
    font-size: 25px;
    vertical-align:middle;
  }
</style>
