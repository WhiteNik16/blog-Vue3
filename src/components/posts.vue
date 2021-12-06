<template>
  <div>
    <div class="posts box is-max-desktop" @click="transitionToPost(post_data)">
      <div class="posts__header">
        <div class="posts__header-title">
          <h2>{{ post_data.title }}</h2>
        </div>
      </div>
      <div class="posts__image" v-if="postImage">
        <img :src="postImage" />
      </div>
      <div class="posts__text">
        <span>{{ post_data.description }}</span>
      </div>
      <div class="posts__footer">
        <div class="posts__footer-date">
          <span>{{ post_data.dateCreated.slice(0, 10) }}</span>
        </div>
        <div class="posts__footer-likes">
          <span @click.stop>{{ post_data.likes.length }} </span>
          <i
              :class="['fa', 'fa-heart', { like_active: userLike }]"
              aria-hidden="true"
              @click.stop.self="setLikePost(post_data._id)"
          ></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {useRoute} from "vue-router"
import {usePost} from "@/composable/posts/usePost";
import {computed, onBeforeMount, ref, toRef} from "vue";
import {useUser} from "@/composable/useUser";
import {getImageUrl} from "@/utils/profileHelpers";

export default {
  name: "posts",
  props: {
    post_data: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  emits: ['transitionToPost'],

  setup(props,{emit}){
    const postImage = ref(null)
    const post_data = toRef(props, 'post_data')
    const { userData } = useUser()
    const { setLikeForPosts, } = usePost()
    const route = useRoute()
    // const router = useRouter()
    function transitionToPost(post_data) {
      emit('transitionToPost', post_data)
    }
    const setPostsImage=function () {
      postImage.value = post_data.value?.image
          ? getImageUrl(post_data.value.image)
          : null
    }
    const  setLikePost = function (id) {
      const limit = route.query.pagination
      const skip = (route.query.pageNumber - 1) * limit
      setLikeForPosts({id, skip, limit})
    }

    const userLike = computed(()=> {
      if (post_data.value.likes && userData) {
        return post_data.value.likes.includes(userData.value._id)
      }
      return false
    })
    onBeforeMount(()=>{
      setPostsImage()
    }
    )
    return {
      transitionToPost,
      setLikePost,
      userLike,
      userData,
      postImage
    }
  }

}
</script>

<style scoped>

.like_active{
  color:blue;
}
</style>