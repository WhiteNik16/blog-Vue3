<template>
  <div class="comments" v-if="comments">
    <div class="comments__quantity-comment">
      <span>Комментарии: {{ Object.keys(comments).length }}</span>
    </div>

    <div>
      <v-comment
          v-for="comment in comments"
          :key="comment._id"
          v-bind:comment="comment"
      >
        <template #children>
          <v-comment
              v-for="childrenComment in comment.children"
              :key="childrenComment._id"
              v-bind:comment="childrenComment"
          />
        </template>
      </v-comment>
    </div>
    <div class="comments__add">
      <div><span>Введите свой коментарий: </span></div>
      <div><textarea v-model="newComment" required /></div>
      <div>
        <v-button class="is-small" @click="createNewCommentForPost"
        >Отправить</v-button
        >
      </div>
    </div>
  </div>
  <div class="loader" v-else></div>
</template>


<script>
import {defineComponent, onBeforeMount, ref, toRef} from "vue";
import {useComments} from "@/composable/posts/useComments";
import vComment from "@/components/comments/comment";
import vButton from '@/common/v-button'
export default defineComponent({
  name: "v-comments",
  components:{
    vComment, vButton
  },
  props: {
    id: {
      type: String,
      required: true,
      },
    },
  setup(props){
    const id = toRef(props, 'id')
    const newComment=ref('')

  const {createNewComment, setLikeForComment, loadComment, authorComments,  comments, }=useComments(id.value)
    const  createNewCommentForPost= function () {
      let text = newComment.value
      let idPost = id.value
      createNewComment({ text, idPost })
      newComment.value = ''
    }

    onBeforeMount(async () => {
      console.log('watchcomments')
      await loadComment()
    })

    const setLikeComment =function (idComment, idPost) {
      setLikeForComment({ idComment, idPost })
    }

    return{
      newComment,
      comments,
      createNewCommentForPost,
      setLikeComment,
      authorComments
    }
  }
})
</script>

<style scoped>

</style>