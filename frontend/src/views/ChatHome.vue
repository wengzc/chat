<template>
  <div class="chatList">
    <Header></Header>
    <div class="list">
      <router-link to="/room/1" tag="div" class="chatItem">
        <img src="../assets/1.jpg" alt="头像">
        <span>聊天室1</span>
      </router-link>
      <router-link to="/room/2" tag="div" class="chatItem">
        <img src="../assets/2.jpg" alt="头像">
        <span>聊天室2</span>
      </router-link>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
  import { mapState, mapMutations  } from 'vuex';
  import Footer from '@/components/Footer'
  import Header from '@/components/Header'
  export default {
    name: "ChatHome",
    components: {
      Footer,
      Header
    },
  }
</script>

<style scoped>
  .chatList {
    height: 100%;
    background-color: #eee;
  }
  .chatItem {
    height: 80px;
    line-height: 80px;
    border-bottom: 1px solid #ddd;
    display: flex;
    align-items: center;
    padding: 10px;
    box-sizing: border-box;
  }
  .chatItem:hover {
    cursor: pointer;
    background-color: rgba(55,55,55,.1);
  }
  .chatItem img {
    width: 50px;
    height: 50px;
    border-radius: 50px;
  }
  .chatItem span {
    color: #333;
    margin-left: 15px;
  }
</style>
