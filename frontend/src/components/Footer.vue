<template>
  <div>
    <div class="footerContainer">
      <div class="footer">
        <router-link to="/" class="item" tag="div" exact>
          <i class="iconfont icon-liaotianweixuanzhong"></i>
          <span>聊天</span>
        </router-link>
        <router-link to="/friends" class="item" tag="div">
          <i class="iconfont icon-linkman-contacts_ico"></i>
          <span>好友</span>
        </router-link>
        <router-link to="/homepage" class="item" tag="div">
          <i class="iconfont icon-wode"></i>
          <span>我的</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "Footer",
        data() {
          return {
            // selected: 0,
            items: [
              { link: '/chat', icon: 'iconfont icon-liaotianweixuanzhong', name: '聊天'},
              { link: '/friends', icon: 'iconfont icon-linkman-contacts_ico', name: '好友'},
              { link: '/homepage', icon: 'iconfont icon-wode', name: '我的'}
            ]
          }
        },
      methods: {
          changeSelected(index) {
            this.selected = index
          }
      }
    }
</script>

<style scoped>
  .footerContainer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 200;
  }
  .footer {
    position: relative;
    max-width: 1000px;
    margin: 0 auto;
    background-color: #eee;
    display: flex;
    justify-content: space-around;
    border-top: 1px solid #ddd;
    box-sizing: border-box;
  }
  .item {
    padding: 9px 0;
    text-align: center;
    cursor: pointer;
    flex: auto;
    color: #333;
  }
  i {
    display: block;
    font-size: 18px;
  }
  span {
    display: block;
    font-size: 10px;
  }
  .router-link-active {
    background-color: rgba(55,55,55,.1);
  }
</style>
