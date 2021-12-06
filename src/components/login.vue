<template>
    <div>
      <div>
        <form @submit.prevent="addUser">
          <input type="text" v-model="user.email" placeholder="Email">
          <br>
          <input type="password" v-model="user.password" placeholder="Password">
          <br>
          <button :class="[{'is-loading':loading}]" type="submit">login</button>
        </form>
      </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import { useAuth } from "@/composable/userAuth";
import  {  userData, loading, error } from '../composable/useUser'
export default {
  name: "vLogin",
  setup() {
    const { login } = useAuth()

    let user = ref({
      password: '',
      email: '',
    })



    function addUser() {
      console.log(user.value)
      login(user.value)
      user.value = {}
    }

    return {
      user, addUser, userData, loading, error
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