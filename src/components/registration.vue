<template>
<div>
  <div>
    <form @submit.prevent="addUser">
      <input type="text" v-model="user.email" placeholder="Email">
      <br>
      <input type="text" v-model="user.name" placeholder="Name">
      <br>
       <input type="password" v-model="user.password" placeholder="Password">
      <br>
      <button type="submit">Add</button>
    </form>
  </div>
</div>
</template>

<script>
import { ref } from 'vue'
import {useAuth} from "@/composable/userAuth";

const {registerUser} = useAuth()

export default {
  name: "vRegister",
  setup(){
    let user = ref({
       name: '',
       password: '',
        email:'',
        })
    function addUser(){
      console.log(user.value)
      registerUser(user.value)
      user.value = {}
    }
    return{
      user, addUser
    }
  }
}
</script>

<style scoped>
input{
margin: 3px;
  font-size: 20px;
  border: 2px solid #1d8efc;
  border-radius: 10px ;
}
</style>