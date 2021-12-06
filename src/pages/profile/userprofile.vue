<template>
  <div class="container is-max-desktop">
    <div class="user_profile container" v-if="userData">
      <h1>Профиль</h1>
      <div class="profile">
        <div class="profile__aside">
          <div class="profile_image">
            <img :src="setAvatarImage" @error="displayDefaultImage" alt="" />
            <a
                v-if="!editableAvatar"
                @click="toggleEditingAvatar"
                :class="[
                'fa',
                'fa-pencil-square',
                { 'is-size-3': !isOpenAllFiltersWith },
                { 'is-size-4': isOpenAllFiltersWith },
                'profile_image__edit-icon',
              ]"
                aria-hidden="true"
            ></a>
          </div>

          <div class="image_actions" v-if="editableAvatar">
            <div>
              <label class="image_actions__choose" for="file-upload">Select photo</label>
              <input
                  name="file"
                  ref="avatarFile"
                  id="file-upload"
                  v-on:change="uploadFile()"
                  type="file"
                  accept="image/*"
                  hidden
              />
            </div>
            <v-button
                class="image_actions__button"
                @click="cancelUpdateAvatar"
                size="is-small"
            >Cancel</v-button
            >
            <v-button
                class="image_actions__button"
                @click="updateAvatar"
                size="is-small"
                :disabled="!avatarFile"
            >Confirm</v-button
            >
          </div>
          <div>
            <span>{{ userData.email }}</span>
          </div>
          <div class="is-size-7">
            <span>дата регистрации</span>
            <div>
              <span> {{ userData.dateCreated.slice(0, 10) }}</span>
            </div>
          </div>
        </div>
        <div class="profile_info">
          <div class='is-size-4'
          >
            <strong>Имя</strong>
            <span v-if="!editable">{{ userData.name }}</span>
            <input
                v-model="userEdit.name"
                class="input"
                v-if="editable"
                type="text"
            >
          </div>
          <div class="profile_info__box size-5"><strong>О себе</strong>
            <div>
              <span class="size-5" v-if="!editable">{{
                  userData.extra_details
                }}</span>
            </div>
            <input
                v-model="userEdit.extra_details"
                class="input"
                v-if="editable"
                type="text"
            >
          </div>
          <div class="profile_info__box">
            <div>
              <strong>Умения</strong>
            </div>
            <span class="size-5" v-if="!editable">{{ userData.skills }}</span>
            <input
                v-model="userEdit.skills"
                class="input"
                v-if="editable"
                type="text"
            >
          </div>
          <div class="profile_info__box">
            <div>
              <strong>Професия</strong>
            </div>
            <span class="size-5" v-if="!editable">{{ userData.profession }}</span>
            <input
                v-model="userEdit.profession"
                class="input"
                v-if="editable"
                type="text"
            >
          </div>
          <div class="profile_info__box">
            <div>
              <strong>Детали</strong>
            </div>
            <span class="size-5" v-if="!editable">{{ userData.details }}</span>
            <input
                v-model="userEdit.details"
                class="input"
                v-if="editable"
                type="text"
            >
          </div>
          <div class="profile_info__actions">
            <template v-if="editable">
              <v-button
                  @click="toggleEditingInfo"
                  color="is-danger"
                  :disabled="loading"
              >Отменить</v-button
              >
              <v-button
                  @click="saveInfo"
                  :class="[{ 'is-loading': loading }]"
                  :disabled="loading"
              >Подтвердить</v-button
              >
            </template>
            <div v-else class="profile_info__btn">
              <v-button
                  class="profile_info__edit"
                  size='is-normal'
                  @click="toggleEditingInfo"
              >edit profile</v-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="loader"></div>
  </div>
</template>

<script>
import vButton from '../../common/v-button'
import {useUser} from "@/composable/useUser";
import {computed, ref} from "vue";
import DefaultImage from '../../assets/images/1.png'
import { getImageUrl } from "@/utils/profileHelpers";

export default {
  name: "userprofile",
  components:{
    vButton
  },

  setup(){
    const defaultImage=DefaultImage
    const {userData, editUser, loading, editAvatarUser,}=useUser()
    const editable=ref(false)
    const editableAvatar=ref(false)
    let avatarPreview=ref(null)
    let avatarFile=ref(null)
      const userEdit =ref({
        name: '',
        details: '',
        extra_details: '',
        skills:'',
        profession: '',
      })
    const isOpenAllFiltersWith =computed(()=> {
      return document.documentElement.clientWidth <= 768;
    })
    const toggleEditingAvatar = function () {
      editableAvatar.value = !editableAvatar.value
    }
    const avatar = computed(()=>{
      return userData.value
          ? getImageUrl(userData.value?.avatar)
          : defaultImage
    })
    const setAvatarImage = computed( ()=> {
      return  avatarPreview.value
          ? avatarPreview.value :
          avatar.value

    })
    const cancelUpdateAvatar= function () {
      avatarPreview.value = null
      toggleEditingAvatar()
    }
    const displayDefaultImage= function () {
      avatarPreview.value = defaultImage
    }
    const uploadFile= function () {
      avatarPreview.value = URL.createObjectURL(avatarFile.value.files[0])
    }
    const updateAvatar = async function () {
      try {
        let data = new FormData()
        data.append('avatar', avatarFile.value.files[0])
        await editAvatarUser({ id: userData.value._id, data })
      } catch (e) {
        console.log(e)
      } finally {
        toggleEditingAvatar()
      }
    }
    const saveInfo = async function (){
          try {
            const data = userEdit.value
            await editUser({ id: userData.value._id, data })
          } catch (e) {
            console.log('err',e)
          } finally {
            toggleEditingInfo()
          }

    }
    // watch(userData,()=>{
    //   console.log(userData.value)
    // })
    const toggleEditingInfo=function (){
      editable.value=!editable.value
      userEdit.value.name= userData.value.name,
          userEdit.value.details=  userData.value.details,
          userEdit.value.extra_details= userData.value.extra_details,
          userEdit.value.skills=  userData.value.skills,
          userEdit.value.profession= userData.value.profession
    }

    return {
      userData,
      editable,
      toggleEditingInfo,
      userEdit,
      saveInfo,
      loading,
      isOpenAllFiltersWith,
      setAvatarImage,
      toggleEditingAvatar,
      editableAvatar,
      uploadFile,
      avatarFile,
      cancelUpdateAvatar,
      displayDefaultImage,
      updateAvatar,
    }
  }
}
</script>

<style scoped>

</style>