<template>
    <div>
      <div class="container">
        <img :src= "server + 'avatar/' + msg.avatar" alt="头像" class="avatar">
        <div class="main">
          <div class="info">
            <span class="username">{{msg.username}}</span>
            <span class="time">{{msg.created_at}}</span>
          </div>
          <div class="content" v-if="msg.content && !msg.img">
            <div v-if="msg.content" v-html="msg.content" class="text"></div>
            <div class="triangle"></div>
          </div>
          <div v-if="!msg.content && msg.img" class="image">
            <img v-if="msg.img && !msg.img.startsWith('data:image')" :src="server + 'image/' + msg.img" class="img" alt="图片">
            <img v-if="msg.img.startsWith('data:image')" :src="msg.img" class="img" alt="图片">
            <div v-if="msg.img && !msg.img.startsWith('data:image')" class="after" :style="{backgroundImage: 'url(' + server + 'image/' + msg.img + ')', backgroundSize: '205px 150px'}"></div>
            <div v-if="msg.img.startsWith('data:image')" class="after" :style="{backgroundImage: 'url(' + msg.img + ')', backgroundSize: '205px 150px'}"></div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  export default {
        name: "OthersDialog",
        data() {
          return {
            server: process.env.SRC_HOST
          }
        },
      props: ["msg"]
    }
</script>

<style scoped>
  .container {
    display: flex;
    padding: 10px;
    box-sizing: border-box;
  }
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 40px;
  }
  .info {
    margin-bottom: 5px;
  }
  .username {
    font-size: 14px;
    color: #fff;
  }
  .time {
    font-size: 12px;
    color: #999;
  }
  .main {
    margin-left: 10px;
  }
  .content {
    display: flex;
    position: relative;
    background-color: #fff;
    padding: 8px;
    border-radius: 3px;
    color: #333;
  }
  .content .img {
    width: 250px;
    height: 250px;
  }
  .content .text {
    max-width: 200px;
    word-wrap: break-word;
  }
  .triangle {
    position: absolute;
    left: -9px;
    top: 5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent #fff transparent transparent;
  }
  .image {
    position: relative;
  }
  .image .img {
    width: 200px;
    height: 150px;
    border-radius: 3px;
    z-index: 1;
  }
  .after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 205px;
    height: 150px;
    clip-path: polygon(0 15px, 6px 10px, 6px 20px);
    z-index: 0;
  }
</style>
