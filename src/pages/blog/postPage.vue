<template>
  <div>
    <div class="post__back">
      <i @click="router.go(-1)" class="fa fa-chevron-left" aria-hidden="true"></i>
      <a @click="router.go(-1)">Back</a>
    </div>
    <div v-if="post" class="post box">
      <div class="post__footer">
        <div class="post__footer-author">
          <img :src="authorAvatar" />
          <span>{{ authorName }}</span>
        </div>
        <div class="post__footer-date">
          <span>{{ post.dateCreated.slice(0, 10) }}</span>
        </div>
        <div class="post__footer-likes">
          <span>{{ post.likes.length }} </span>
          <i
              :class="['fa', 'fa-heart', { like_active: userLike }]"
              aria-hidden="true"
              @click="setLikePost(post._id)"
          ></i>
        </div>
      </div>
      <div>
        <div class="post__title">
          <h2>{{ post.title }}</h2>
        </div>
        <div class="post__body">
          <div class="post__body_image" v-if="postImage">
            <img :src="postImage" />
          </div>
          <div class="post__body-text content">
            <span>
              {{ post.fullText }}
            </span>
          </div>
        </div>
      </div>
      <div class="post__body-comment">
        <v-comments :id="this.$route.params.id" />
      </div>
    </div>
    <div v-else class="loader"></div>
  </div>
</template>

<script>
import {computed, defineComponent, watch, onBeforeMount} from "vue";

import { useRoute, useRouter } from "vue-router"
import { useUser } from "@/composable/useUser";
import { getImageUrl } from "@/utils/profileHelpers";
import {useSinglePost} from "@/composable/posts/useSinglePost";
import vComments from '../../components/comments/comments'
export default defineComponent({
  name: "post",
  components:{
    vComments
  },
  setup() {
    // const authorName = ref(null)
    // const authorAvatar = ref(null)
    const route = useRoute()
    const router = useRouter()
    const { post, author, loadPost, setLikeForPost, getAuthor } = useSinglePost(route.params.id)
    const {userData} = useUser()
    const setLikePost = (id) => {
      setLikeForPost(id)
    }
    const userLike = computed(() => {
      if (post.value.likes && userData) {
        return post.value.likes.includes(userData.value._id)
      }
      return false
    })

    const postImage = computed(() => {
      return post.value?.image ? getImageUrl(post.value.image) : null
    })
    const authorAvatar = computed(() => {
      return author.value?.avatar ? getImageUrl(author.value.avatar) : null
    })
    const authorName = computed(() => {
      return author.value
        ? author.value.name
        : 'Автор неизвестен'
    })
    watch(() => route.params.id, async () => {
      if (route.params.id) {
        await loadPost()
        // await getAuthor(post.value.postedBy)
        console.log('watch')
      }
    })

    watch(post, async () => {
      console.log('author')
      await getAuthor(post.value.postedBy)
    })

    onBeforeMount(async () => {
      await loadPost()
    })

    return {
      post,
      router,
      setLikePost,
      userLike,
      postImage,
      authorName,
      authorAvatar
    }
  }
})
</script>

<style scoped>
.like_active{
  color:blue;
}
</style>