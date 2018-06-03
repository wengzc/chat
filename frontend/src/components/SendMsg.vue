<template>
  <div class="sendContainer">
    <div class="send" ref="send">
      <div class="sendMsg">
        <div class="photoBtn">
          <input type="file" id="file" ref="img" @change="uploadImg">
          <label for="file">
            <i class="iconfont icon-tupian"></i>
          </label>
        </div>
        <div class="emojiBtn" @click="expressionShow">
          <i class="iconfont icon-xiaolian"></i>
        </div>
        <div class="text">
          <input type="text" ref="content" style="display:none" @click="hideexpress" @keyup.enter="sendMsg"  autocomplete="off" placeholder="我知道你有好多话要说...">
          <input type="text" ref="content" @click="hideexpress" @keyup.enter="sendMsg"  autocomplete="off" placeholder="我知道你有好多话要说...">
        </div>
        <div class="sendBtn" @click="sendMsg">
          <i class="iconfont icon-fasong"></i>
        </div>
      </div>
      <div class="expression" v-show="emojiShow">
        <div v-for="(item, index) in emoji" class="emojiItem" :data-name=item @click="chooseEmoji(item)">
          <div class="emoji" :style="{backgroundPosition: 'left ' + ((index+1)*(-30)+30) + 'px'}">
          </div>
        </div>
      </div>
    </div>
    <LoginRegister @closeDialog="closeDialog" :dialogShow="dialogShow"></LoginRegister>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import LoginRegister from '../components/LoginRegister';

  export default {
      name: "SendMsg",
      data() {
        return {
          emoji: [
            "呵呵", "哈哈", "吐舌", "啊", "酷", "怒", "开心", "汗", "泪", "黑线", "鄙视", "不高兴", "真棒", "钱",
            "疑问", "阴险", "吐", "咦", "委屈", "花心", "呼", "笑眼", "冷", "太开心", "滑稽", "勉强",
            "狂汗", "乖", "睡觉", "惊哭", "生气", "惊讶", "喷", "爱心", "心碎", "玫瑰", "礼物", "星星月亮",
            "太阳", "音乐", "灯泡", "蛋糕", "彩虹", "钱币", "咖啡", "弱", "棒", "胜利", "耶", "好"
          ],
          emojiShow: false,
          dialogShow: false
        }
      },
    props: ["roomId", "dialog", "container"],
    components: {
      LoginRegister
    },
    computed: mapState(["user","isLogin","socket"]),
    methods: {
        sendMsg() {
          if(!this.isLogin) {
            this.dialogShow = true;
            return;
          }
          let content = this.$refs.content.value, msg;
          if(!content) {
            this.$emit('showAlert', '不能发送空消息!')
            return false;
          }
          this.$refs.content.value = '';
          msg = {
            username: this.user.username,
            avatar: this.user.avatar,
            content: content,
            img: '',
            roomId: this.$route.params.roomId
          }
          this.socket.emit("sendMsg", msg)
        },
        uploadImg() {
          if(!this.isLogin) {
            this.dialogShow = true;
            this.$refs.img.value = '';
            return;
          }
          let file = this.$refs.img.files[0];
          this.$refs.img.value = '';
          let reader = new FileReader();
          if(!this.uploadCheck(file)) {
            return ;
          } else {
            let formData  = new FormData();
            formData .append("files", file);
            formData .append("username", this.user.username);
            formData .append("avatar", this.user.avatar);
            formData .append("roomId", this.$route.params.roomId);
            this.$axios.post(process.env.API_HOST + "image", formData ).then((res) => {

            });
            reader.readAsDataURL(file);
            reader.onload = () => {
              let msg;
              msg = {
                username: this.user.username,
                avatar: this.user.avatar,
                content: '',
                img: reader.result,
                roomId: this.$route.params.roomId
              }
              this.socket.emit("sendMsg", msg)
            }
          }
        },
        uploadCheck(file) {
          if(!file.type.startsWith('image')) {
            this.$emit('showAlert', '请上传图片类型文件!')
            return false;
          }
          if(file.size && file.size > 1024 * 1024 *2) {
            this.$emit('showAlert', '图片过大,需小于2MB!')
            return false;
          }
          return true;
        },
        expressionShow() {
          this.emojiShow = !this.emojiShow;
          // this.$refs.content.focus();
          this.$nextTick(() => {
            this.dialog.style.marginBottom = this.$refs.send.offsetHeight + 'px';
            this.container.scrollTop = this.container.scrollHeight;
          })
        },
        hideexpress() {
          this.emojiShow = false;
          this.$nextTick(() => {
            this.dialog.style.marginBottom = this.$refs.send.offsetHeight + 'px';
            this.container.scrollTop = this.container.scrollHeight;
          })
        },
        chooseEmoji(name) {
          let content = this.$refs.content.value;
          this.$refs.content.value =  content + '[#:' + name + ']'
          this.$refs.content.focus();
        },
        closeDialog() {
          this.dialogShow = false;
        }
     }
    }
</script>

<style scoped>
  .sendContainer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 500;
  }
  .send {
    position: relative;
    max-width: 1000px;
    margin: 0 auto;
    background-color: #eee;
    box-sizing: border-box;
  }
  .sendMsg {
    width: 100%;
    padding: 0 10px;
    height: 50px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    background-color: #eee;
    border-top: 1px solid #d6d6d6;
    box-sizing: border-box;
  }
  .photoBtn, .emojiBtn, .sendBtn {
    position: relative;
    height: 50px;
    line-height: 50px;
    width: 35px;
    text-align: center;
    cursor: pointer;
  }
  .emojiBtn i, .sendBtn i {
    font-size: 30px;
    color: #333;
  }
  input#file {
    position: absolute;
    left:-9999px;
    height: 50px;
    width: 35px;
    opacity: 0;
    filter: alpha(opacity=0);
  }
  .photoBtn label i {
    position: absolute;
    height: 50px;
    width: 35px;
    left: 0;
    top: 0;
    text-align: center;
    cursor: pointer;
    font-size: 30px;
    color: #333;
  }
  .text {
    flex: auto;
    height: 30px;
    margin: 0 8px 0 0;
  }
  .text input {
    width: 100%;
    height: 100%;
    font-size: 16px;
    padding: 0 3px;
    outline: none;
    border: none;
    background-color: #eee;
    border-bottom: 1px solid #d6d6d6;
  }

  .expression {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    width: 415px;
    background-color: #eee;
    border-top: 1px solid #d6d6d6;

  }
  .emojiItem {
    width: 40px;
    height: 40px;
    padding: 5px;
    box-sizing: border-box;
  }
  .emojiItem .emoji {
    width: 30px;
    height: 30px;
    background-image: url(//cdn.suisuijiang.com/fiora/img/baidu.bd067c14.png);
    background-repeat: no-repeat;
    background-size: 30px auto;
  }
  .emojiItem .emoji:hover {
    cursor: pointer;
  }

  @media (max-width: 767px) {
    .expression {
      width: 100%;
    }
  }

</style>
