<template>
  <div>
    <div v-if="dialogShow" class="loginRegister">
      <div class="mask" @click="hiddenDialog">
      </div>
      <div class="dialog">
        <i class="iconfont icon-guanbi" @click="hiddenDialog"></i>
        <div class="tabNav">
          <div class="nav loginNav" :class="{selectTab: tabShow}" @click="!tabShow && changeTab()">登录</div>
          <div class="nav signNav" :class="{selectTab: !tabShow}" @click="tabShow && changeTab()">注册</div>
        </div>
        <div class="tabContent">
          <div class="login" v-if="tabShow === true">
            <div class="restyle">
              <input type="text" v-model='loginName' placeholder="用户名">
              <i class="iconfont icon-yonghu"></i>
            </div>
            <div class="restyle">
              <input type="password" v-model="loginPassword" @keyup.enter="login" placeholder="密码">
              <i class="iconfont icon-mima"></i>
            </div>
            <div class="restyle">
              <button @click="login">登录</button>
            </div>
          </div>
          <div class="sign" v-if="!tabShow === true">
            <div class="restyle">
              <input type="text" v-model='registerName' placeholder="用户名">
              <i class="iconfont icon-yonghu"></i>
            </div>
            <div class="restyle">
              <input type="password" v-model="registerPassword" @keyup.enter="register" placeholder="密码">
              <i class="iconfont icon-mima"></i>
            </div>
            <div class="restyle">
              <button @click="register">注册</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Notification :message="message" :ntShow="ntShow" :flag="flag">
    </Notification>
  </div>

</template>

<script>
  import { mapState, mapMutations  } from 'vuex';
  import Notification from '../components/Notification'
    export default {
        name: "LoginRegister",
        data() {
          return {
            loginName: '',
            loginPassword: '',
            registerName: '',
            registerPassword: '',
            // dialogShow: true,
            tabShow: true,
            ntShow: false,
            flag: false,
            message: '',
            // closeIconShow: false
          }
        },
        props: ["dialogShow"],
        computed: {
          ...mapState(["islogin", "user", "socket", "ranUser"])
        },
        components: {
          Notification
        },
        methods: {
          ...mapMutations(
            ["setLoginState", "storeUserInfo"]
          ),
          changeTab() {
            this.tabShow = !this.tabShow;
          },
          login() {
            if(!this.loginName) {
              this.message = '用户名不能为空!'
              this.flag = false;
              this.ntShow = true;
              setTimeout(() => {this.ntShow = false;}, 1000);
              return false;
            }
            if(!this.loginPassword) {
              this.message = '密码不能为空!'
              this.flag = false;
              this.ntShow = true;
              setTimeout(() => {this.ntShow = false;}, 1000);
              return false;
            }
            let user = {
              username: this.loginName,
              password: this.loginPassword
            }
            this.$axios.post(process.env.API_HOST + "user/session", {user: user}).then((res) => {
              this.message = res.data.message;
              this.ntShow = true;
              if(res.data.status) {
                this.flag = true;
                this.setLoginState(true);
                this.storeUserInfo(res.data.result);
                if(this.ranUser.username) {
                  this.ranUserLeaveRoom();
                }
                this.$emit("closeDialog");
              }
              setTimeout(() => {this.ntShow = false;}, 1000);
            })
          },

          register() {
            if(!this.registerName) {
              this.message = '用户名不能为空!';
              this.flag = false;
              this.ntShow = true;
              setTimeout(() => {this.ntShow = false;}, 1000);
              return false;
            }
            if(this.registerName.length >= 10) {
              this.message = '用户名长度应小于10!';
              this.flag = false;
              this.ntShow = true;
              setTimeout(() => {this.ntShow = false;}, 1000);
              return false;
            }
            if(!this.registerPassword) {
              this.message = '密码不能为空!'
              this.flag = false;
              this.ntShow = true;
              setTimeout(() => {this.ntShow = false;}, 1000);
              return false;
            }
            if(this.registerPassword.length < 6 || this.registerPassword.length > 12) {
              this.message = '密码长度应为6-12之间!'
              this.flag = false;
              this.ntShow = true;
              setTimeout(() => {this.ntShow = false;}, 1000);
              return false;
            }
            let user = {
              username: this.registerName,
              password: this.registerPassword
            }
            this.$axios.post(process.env.API_HOST + "user", {user: user}).then((res) => {
              this.message = res.data.message;
              this.ntShow = true;
              if(res.data.status) {
                this.flag = true;
                this.setLoginState(true);
                this.storeUserInfo(res.data.result);
                if(this.ranUser.username) {
                  this.ranUserLeaveRoom();
                }
                this.$emit("closeDialog");
              }
              setTimeout(() => {this.ntShow = false;}, 1000);
            })
          },
          hiddenDialog() {
            this.$emit("closeDialog");
          },
          ranUserLeaveRoom() {
            let data;
            this.socket.emit("leaveRoom", this.ranUser);
            data = {
              username: this.user.username,
              avatar: this.user.avatar,
              roomId: this.$route.params.roomId
            }
            this.socket.emit("enterRoom", data);
          }
        }
    }
</script>

<style scoped>
  .loginRegister {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index:1000;
  }
  .mask {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(55,55,55,.6);
  }
  .dialog {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    width: 400px;
    padding: 10px;
    border-radius: 5px;
    background-color: #eee;
  }
  .icon-guanbi {
    position: absolute;
    right: 3px;
    top: 3px;
    font-size: 22px;
    padding: 2px;
  }
  .icon-guanbi:hover {
    cursor: pointer;
  }
  .tabNav {
    text-align: center;
    padding: 10px;
  }
  .nav {
    display: inline-block;
    height: 50px;
    line-height: 50px;
    font-size: 25px;
    padding: 0 20px;
    cursor: pointer;
  }
  .selectTab {
    border-bottom: 2px solid #108ee9;
    cursor: default;
  }
  .tabContent {
    padding: 10px;
  }
  .restyle {
    position: relative;
    margin-bottom: 20px;
  }
  .restyle input{
    width: 100%;
    padding: 10px 10px 10px 40px;
    border-radius: 3px;
    border: none;
    box-sizing: border-box;
  }
  .restyle button {
    width: 100%;
    padding: 10px 10px 10px 10px;
    border: none;
    border-radius: 3px;
    color: #fff;
    background-color: #81abff;
    box-shadow: 1px 1px 0 0 rgba(55,55,66,.7);
  }
  .restyle button:hover {
    cursor: pointer;
    background-color: #6888ff;
  }
  .restyle i {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
  }

  @media (max-width: 767px) {
    .dialog {
      width: 90%;
    }
  }
</style>
