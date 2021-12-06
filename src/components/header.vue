<template>
  <div id="nav">
    <div  v-if="!userData">
      <router-link :to="{name:'login'}">login</router-link> |
      <router-link :to="{name:'register'}">register</router-link>
    </div>
    <div v-else>
      <router-link :to="{name:'mainPage'}">Home</router-link> |
      <router-link :to="{name:'blog'}">Blog</router-link>|
      <router-link :to="{name:'userprofile'}">Мой профиль</router-link>|
      <router-link :to="{name:'createPost'}">Создать пост</router-link>|
      <router-link :to="{name:'myPosts'}">Мои посты</router-link>
      <span>Hello,{{ userData.name}}</span>
      <div><button @click="logOutUser">Log out</button></div>
    </div>

  </div>
</template>
<script>
import {userData, useUser} from "@/composable/useUser";

export default {
  name: "v-header",
  setup() {
    const {  logOut } = useUser()
    function logOutUser(){

      logOut()
    }
    return {
      userData,logOutUser,
    }
  }
}
</script>

<style scoped>

</style>