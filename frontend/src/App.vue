<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import io from 'socket.io-client';
  import { mapState, mapMutations  } from 'vuex';  export default {
    name: 'App',
    created() {
      this.checkSession();
      if(!this.socket) {
        if(process.env.NODE_ENV === 'development') {
          this.$store.commit('setSocket', io.connect('http://localhost:8000/'));
        } else {
          this.$store.commit('setSocket', io.connect('http://chat.insaying.com:3000/'));
        }
      }
    },
    mounted() {

    },
    computed: {
      ...mapState(["socket"]),
    },
    methods: {
      ...mapMutations(
        ['setSocket','setLoginState','storeUserInfo']
      ),
      checkSession() {
        this.$axios.get(process.env.API_HOST + "user").then((res) => {
          this.setLoginState(res.data.isLogin);
          this.storeUserInfo(res.data.result);
        })
      },
    }
  }
</script>

<style>

  #app {
    height: 100%;
    max-width: 1000px;
    margin: 0 auto;
  }
  @media (max-width: 767px) {
    #app {
      max-width: 100%;
    }
  }
</style>
