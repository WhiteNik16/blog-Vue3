<template>
  <div class="create-post container is-small">
    <h1>Создай свой пост!</h1>
    <form
        class="create-post__form"
        id="create-newPost"
        @submit.prevent="createNewPost"
    >
      <div class="create-post__tittle">
        <input
            type="text"
            v-model="post.title"
        />
        <span>Заголовок</span>
      </div>
      <div class="create-post__text">
        <input
            type="text"
            v-model="post.fullText"
        />
        <span>Текст поста</span>

      </div>
      <div class="create-post__description">
        <input type="text" v-model="post.description"
        /><span >Описание</span>

      </div>
      <v-button class="create-post__btn" type="submit">Создать</v-button>
    </form>
    <div class="create-post__image" v-if="setPostImage">
      <h2>Добавьте изображение к посту</h2>
      <img v-if="previewImage" :src="previewImage" />
      <input
          type="file"
          name="file"
          ref="image"
          v-on:change="uploadFile()"
          hidden
          id="post-image"
      />
      <div>
        <label for="post-image"
        ><span v-if="!previewImage">Добавить</span
        ><span v-if="previewImage">Изменить</span
        ><i class="fa fa-file-image-o" aria-hidden="true"></i
        ></label>
      </div>
      <div class="create-post__image-buttons">
        <v-button class="is-small" v-if="previewImage" @click="setImage">
          Добавить изображение</v-button
        >
        <v-button class="is-small" v-if="previewImage" @click="unSetImage">
          Отменить</v-button
        >
      </div>
      <a v-if="!previewImage" @click="$router.push({ name: 'mainPage' })"
      >Нет, спасибо. Вернуться на главную</a
      >
    </div>
  </div>
</template>

<script>

import { minLength, required } from 'vuelidate/lib/validators'
import { api } from '@/api/config'
import VButton from '@/common/v-button'
import {defineComponent, ref} from "vue";
import {fireMessage} from "@/utils/fireMessage";
// import { createObjectURL } from '@/utils/profileHelpers'
export default defineComponent({
  name: 'creat-post',
  components: {
    VButton,
  },
  validations: {
    post: {
      title: {
        required,
        minLength: minLength(5),
      },
      fullText: {
        required,
        minLength: minLength(20),
      },
    },
  },
  setup() {
    const post = ref({
      title: '',
      fullText: '',
      description: '',
    })
    const previewImage = ref(null)
    const image = ref(null)
    const setPostImage = ref(false)
    const newPost = ref(null)

    const uploadFile = function () {
      previewImage.value = URL.createObjectURL(image.value.files[0])
    }
    const unSetImage = function () {
      image.value = null
      previewImage.value = null
    }

    const setImage = async function () {
      let data = new FormData()
      data.append('image', image.value.files[0])
      const response = await api.put(`/posts/upload/${newPost.value._id}`, data)
      if (response.status === 200) {
        console.log('succes kartinka')
        post.value = {
          title: '',
          fullText: '',
          description: '',
        }
        previewImage.value = null
        image.value = null
        setPostImage.value = false
      } else {
        console.log('errr nyyy bivaet')
        previewImage.value = null
        image.value = null
        setPostImage.value = false
      }
    }
    const createNewPost = async function () {
      try{
        const response = await api.post('/posts', this.post)
        if (response.status === 200) {
          newPost.value = response.data
          setPostImage.value = true
        } else {
          await fireMessage('error', 'err')
        }
      }
      catch (e){
        await fireMessage('error', e)
      }
      }

    return {
      post,
      previewImage,
      setPostImage,
      image,
      newPost,
      uploadFile,
      setImage,
      unSetImage,
      createNewPost,
    }
  }
}
)
</script>

<style scoped></style>