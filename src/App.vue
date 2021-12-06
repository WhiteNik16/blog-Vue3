<template>
  <div>
    <VHeader></VHeader>
  <router-view />
  </div>
</template>
<script>
import {userData, useUser} from './composable/useUser'
import {onBeforeMount} from "vue";

import VHeader from "@/components/header";



export default {
components:{
  VHeader,
},
  setup() {
    const { loadUserInfo } = useUser()

     onBeforeMount(async ()=>{
      console.log('mount')
      if (localStorage.jwt) {
        await loadUserInfo()
      }

    })
    return {
      userData,
    }
  }
}
</script>
<style src="../src/assets/styles/app.scss" lang="scss"></style>
