<template>
  <div class="homepage">
    <Header></Header>
    <div class="userInfo" v-if="isLogin">
      <img :src="server + 'avatar/' + user.avatar" class="img" @click="avatarDialogShow = true">
      <span>{{user.username}}</span>
    </div>
    <div class="logout" @click="logout" v-if="isLogin">
      注销
    </div>
    <Footer></Footer>
    <div class="avatarDialog" v-if="avatarDialogShow">
      <div class="mask" @click="avatarDialogShow = false"></div>
      <div class="main">
        <i class="iconfont icon-guanbi" @click="avatarDialogShow = false"></i>
        <div class="title">修改头像</div>
        <div class="content">
          <div class="nowAvatar">
            <img :src="server + 'avatar/' + user.avatar" class="img" ref="img">
            <span>当前头像</span>
          </div>
          <div class="changeAvatar">
            <div class="wrapper">
              <input type="file" id="file" ref="file" @change="showNewAvatar">
              <label for="file">
                选择新头像
              </label>
              <span @click="updateAvatar()">确认修改</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <LoginRegister @closeDialog="closeDialog" :dialogShow="dialogShow"></LoginRegister>
    <Notification :message="message" :ntShow="ntShow" :flag="flag"></Notification>
  </div>
</template>

<script>
  import Footer from '@/components/Footer'
  import LoginRegister from '../components/LoginRegister';
  import Notification from '../components/Notification'
  import Header from '@/components/Header'
  import { mapState, mapMutations  } from 'vuex';

  export default {
    name: "Homepage",
    data() {
      return {
        server: process.env.SRC_HOST,
        dialogShow: false,
        ntShow: false,
        flag: false,
        message: '',
        avatarDialogShow: false
      }
    },
    components: {
      Footer,
      LoginRegister,
      Notification,
      Header
    },
    computed: {
      ...mapState(["isLogin", "user"])
    },
    mounted() {
      this.$axios.get(process.env.API_HOST + "user",).then((res) => {
        this.setLoginState(res.data.isLogin);
        this.storeUserInfo(res.data.result);
        if(!this.isLogin) {
          this.dialogShow = true;
        }
      })
    },
    methods: {
      ...mapMutations(
        ["setLoginState", "storeUserInfo"]
      ),
      logout() {
        this.$axios.delete(process.env.API_HOST + 'user/session').then((res) => {
          if(res.data.status) {
            this.message = res.data.message;
            this.ntShow = true;
            this.flag = true;
            this.setLoginState(false);
            this.storeUserInfo({});
            setTimeout(this.hideNotification, 1000);
          }
        })
      },
      hideNotification() {
        this.ntShow = false;
        this.$router.push('/')
      },
      closeDialog() {
        this.dialogShow = false;
        if(!this.isLogin) {
          this.$router.push('/')
        }
      },
      showNewAvatar() {
        let file = this.$refs.file.files[0];
        // this.$refs.file.value = '';
        if(!this.fileCheck(file)) {
          return ;
        } else  {
          let reader = new FileReader();
          let img = this.$refs.img;
          reader.readAsDataURL(file);
          reader.onload = () => {
            img.src = reader.result;
          }
        }
      },
      updateAvatar() {
        let file = this.$refs.file.files[0];
        // this.$refs.file.value = '';
        if(!this.fileCheck(file)) {
          return ;
        } {
          let formData  = new FormData();
          formData .append("files", file);
          formData .append("username", this.user.username);
          formData .append("avatar", this.user.avatar);
          this.$axios.put(process.env.API_HOST + "user/avatar", formData).then((res) => {
            if(res.data.status) {
              this.message = res.data.message;
              this.ntShow = true;
              this.flag = true;
              this.storeUserInfo(res.data.result);
              this.avatarDialogShow = false;
              setTimeout(() => { this.ntShow = false; }, 1000);
            }
          });
        }
      },
      fileCheck(file) {
        if(!file) {
          this.message = '您还没有选择图片!';
          this.ntShow = true;
          this.flag = false;
          setTimeout(() => { this.ntShow = false; }, 1000);
          return false;
        }
        if(!file.type.startsWith('image')) {
          this.message = '请上传图片类型文件!';
          this.ntShow = true;
          this.flag = false;
          setTimeout(() => { this.ntShow = false; }, 1000);
          return false;
        }
        if(file.size && file.size > 1024 * 256) {
          this.message = '图片过大,需小于256kB!';
          this.ntShow = true;
          this.flag = false;
          setTimeout(() => { this.ntShow = false; }, 1000);
          return false;
        }
        return true;
      },
      hiddenAvatarDialog() {

      }
    }
  }
</script>

<style scoped>
  .homepage {
    position: relative;
    height: 100%;
    background-color: #eee;
    padding-bottom: 45px;
    box-sizing: border-box;
  }
  .userInfo {
    width: 100%;
    margin-top: 30px;
    text-align: center;
  }
  img.img {
    width: 100px;
    height: 100px;
    border-radius: 100px;
  }
  img.img:hover {
    cursor: pointer;
  }
  .userInfo span {
    display: block;
    color: #333;
  }
  .logout {
    position: absolute;
    bottom: 60px;
    width: 100%;
    text-align: center;
    padding: 10px;
    color: #333;
    background-color: #f7f7f7;
    box-sizing: border-box;
  }
  .logout:hover {
    cursor: pointer;
  }
  /*.logout input {*/
    /*width: 100%;*/
    /*padding: 10px 10px 10px 10px;*/
    /*border: none;*/
    /*outline:none;*/
    /*border-radius: 3px;*/
    /*color: #333;*/
    /*background-color: #fff;*/
    /*box-shadow: 1px 1px 0 0 rgba(55,55,66,.7);*/
  /*}*/
  .logout:hover {
    background-color: rgba(55,55,55,.1);;
  }

  .avatarDialog {
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
  .main {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    width: 400px;
    /*height: 200px;*/
    border-radius: 5px;
    background-color: #f2f2e2;
    /*box-sizing: border-box;*/
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
  .main .title {
    width: 100%;
    padding: 10px;
    text-align: center;
    border-bottom: 1px solid #ddd;
    color: #333;
    box-sizing: border-box;
  }
  .main .content {
    display: flex;
    justify-content: space-around;
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
  }
  .nowAvatar {
    text-align: center;
  }
  .nowAvatar span {
    display: block;
    font-size: 12px;
  }
  .changeAvatar {
    display: flex;
    align-items: center;
  }
  .wrapper {
    position: relative;
  }
  input#file {
    position: absolute;
    left:-9999px;
    height: 40px;
    width: 35px;
    opacity: 0;
    filter: alpha(opacity=0);
  }
  .changeAvatar span, .changeAvatar label {
    display: block;
    padding: 5px 20px;
    margin: 10px;
    text-align: center;
    font-size: 14px;
    border-radius: 3px;
    color: #fff;
    background-color: #81abff;
  }
  .changeAvatar span:hover, .changeAvatar label:hover {
    cursor: pointer;
    background-color: #6888ff;
  }

  @media (max-width: 767px) {
    .main {
      width: 90%;
    }
  }
</style>
