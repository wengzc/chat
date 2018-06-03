<template>
  <div class="friendList">
    <Header></Header>
    <Footer></Footer>
    <LoginRegister @closeDialog="closeDialog" :dialogShow="dialogShow"></LoginRegister>
  </div>
</template>

<script>
  import Footer from '@/components/Footer'
  import Header from '@/components/Header'
  import LoginRegister from '../components/LoginRegister';
  import { mapState, mapMutations  } from 'vuex';

  export default {
    name: "Friends",
    data() {
      return {
        dialogShow: false
      }
    },
    components: {
      Footer,
      Header,
      LoginRegister
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
        ['setLoginState', 'storeUserInfo']
      ),
      closeDialog() {
        this.dialogShow = false;
        if(!this.isLogin) {
          this.$router.push('/')
        }
      }
    }

  }
</script>

<style scoped>
  .friendList {
    height: 100%;
    background-color: #eee;
  }
</style>
