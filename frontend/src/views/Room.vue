<template>
  <div class="container" ref="container">
    <div class="header">
      <div class="headerContent">
        <i class="iconfont icon-fanhui" @click="returnHome"></i>
        <span class="roomName">聊天室{{roomId}}</span>
        <span class="onlineNum">在线 {{onlineNum}}</span>
      </div>
    </div>
    <div class="dialog" ref="dialog">
      <div v-for="item of messages">
        <OthersDialog v-if="item.username != user.username" :msg="item"></OthersDialog>
        <MyDialog v-if="item.username === user.username" :msg="item"></MyDialog>
      </div>
    </div>
    <SendMsg @showAlert="showNt" :container="this.$refs.container" :dialog="this.$refs.dialog"></SendMsg>
    <Notification :message="alertMsg" :ntShow="ntShow" :flag="false"></Notification>
  </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex';
  import SendMsg from '../components/SendMsg';
  import Notification from '../components/Notification';
  import OthersDialog from '../components/OthersDialog';
  import MyDialog from '../components/MyDialog';
  export default {
    name: "Room",
    data() {
      return {
        roomId: this.$route.params.roomId,
        users: {},
        messages: [],
        ntShow: false,
        alertMsg: '',
        emoji: [
          "呵呵", "哈哈", "吐舌", "啊", "酷", "怒", "开心", "汗", "泪", "黑线", "鄙视", "不高兴", "真棒", "钱",
          "疑问", "阴险", "吐", "咦", "委屈", "花心", "呼", "笑眼", "冷", "太开心", "滑稽", "勉强",
          "狂汗", "乖", "睡觉", "惊哭", "生气", "惊讶", "喷", "爱心", "心碎", "玫瑰", "礼物", "星星月亮",
          "太阳", "音乐", "灯泡", "蛋糕", "彩虹", "钱币", "咖啡", "弱", "棒", "胜利", "耶", "好"
        ],
        ranUsername: '',
      }
    },
    computed: {
      ...mapState(["user", "isLogin", "rooms", "socket", "ranUser"]),
      onlineNum() {
        return Object.keys(this.users).length;
      }
    },
    components: {
      SendMsg,
      Notification,
      OthersDialog,
      MyDialog,
    },
    created() {
      let roomId = this.roomId;
      this.$axios.get(process.env.API_HOST + "user",).then((res) => {
        this.setLoginState(res.data.isLogin);
        this.storeUserInfo(res.data.result);
        this.enterRoom();
      })
      this.getRoomMessages(roomId);
      this.socket.on("enterRoom", (data) => {
        this.setRoomUsers({roomId, data});
        this.users = this.rooms[roomId]["users"];
      })
      this.socket.on("sendMsg", (data) => {
        let array = [];
        array.push(data)
        this.showEmoji(array);
        data = array[0];
        this.addRoomMsg({roomId, data});
        this.messages = this.rooms[this.roomId]["messages"];
        this.$nextTick(() => {
          this.$refs.container.scrollTop = this.$refs.container.scrollHeight;
        })
      })
      this.socket.on("leaveRoom", (data) => {
        this.setRoomUsers({roomId, data});
        this.users = this.rooms[roomId]["users"];
      })
      window.onbeforeunload = () => {
        this.leaveRoom();
      }
    },
    destroyed() {
      this.leaveRoom();
    },
    watch: {
      "$route": function () {
        this.leaveRoom();
        this.roomId = this.$route.params.roomId;
        this.enterRoom();
        this.getRoomMessages(this.roomId);
      }
    },
    methods: {
      ...mapMutations(
        ['setRoomUsers', 'setLoginState', 'storeUserInfo','setRoomMsg','addRoomMsg','setRanUser']
      ),
      returnHome() {
        this.$router.push('/')
      },
      enterRoom() {
        let data;
        if(!this.isLogin) {
          data = {
            username: this.getRanUsername(),
            avatar: '',
            roomId: this.roomId
          }
          this.setRanUser(data);
        } else {
          data = {
            username: this.user.username,
            avatar: this.user.avatar,
            roomId: this.roomId
          }
        }
        this.socket.emit("enterRoom", data);
      },
      leaveRoom() {
        let data;
        if(!this.isLogin) {
          data = this.ranUser;
          this.setRanUser({});
        } else {
          data = {
            username: this.user.username,
            avatar: this.user.avatar,
            roomId: this.roomId
          }
        }
        this.socket.emit("leaveRoom", data);
      },
      getRanUsername() {
        let username = '';
        for(let i = 0; i < 10; i++) {
          let ranNum = Math.floor(Math.random() * 10);
          username += ranNum;
        }
        return username;
      },
      getRoomMessages(roomId) {
        this.$axios.get(process.env.API_HOST + 'messages', {params: {roomId: this.roomId}}).then((res) => {
          if(res.data.status) {
            let data = res.data.result;
            this.showEmoji(data)
            this.setRoomMsg({roomId, data});
            this.messages = this.rooms[this.roomId]["messages"];
            this.$nextTick(() => {
              this.$refs.container.scrollTop = this.$refs.container.scrollHeight;
            })
          }
        })
      },
      showEmoji(data) {
        let reg = /\[#:[\u4e00-\u9fa5]+\]/g, match, result, index, element;
        data.forEach((item) => {
          result = item.content;
          while(match = reg.exec(item.content)) {
            index = this.emoji.indexOf(match[0].slice(3, -1));
            element = "<div class='emoji'  style='display: inline-block; width: 30px; height: 30px; margin: 0 5px; background: url(//cdn.suisuijiang.com/fiora/img/baidu.bd067c14.png) no-repeat left " + ((index+1)*(-30)+30) + "px / 30px auto;'></div>";
            result = result.replace(match[0], element);
          }
          item.content = result;
        })
      },
      showNt(data) {
        this.alertMsg = data;
        this.ntShow = true;
        setTimeout(() => {this.ntShow = false;}, 1000);
      },
    }
  }
</script>

<style scoped>
  .container {
    position: relative;
    height: 100%;
    overflow: auto;
    background-color: #252222;
    box-sizing: border-box;
  }
  .container::-webkit-scrollbar {
    display:none
  }
  .header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 500;
  }
  .headerContent {
    position: relative;
    max-width: 1000px;
    margin: 0 auto;
    background-color: #2e3238;
    color: #fff;
    height: 50px;
    line-height: 50px;
    padding: 0 10px;
    box-sizing: border-box;
  }
  .headerContent i {
    padding: 6px 6px 6px 0;
  }
  .headerContent i:hover {
    cursor: pointer;
  }
  span.roomName {
    margin-left: 5px;
  }
  span.onlineNum {
    display: inline-block;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .dialog {
    width: 100%;
    margin-top: 50px;
    margin-bottom: 40px;
    padding-bottom: 20px;
  }
  .otherUser {
    display: flex;
    align-items: center;  }
  .user {
    display: flex;
    align-items: center;
  }
</style>
