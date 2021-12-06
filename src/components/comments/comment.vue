<template>
    <div class="wrapper_comments" v-if="userData && authorComments">
      <div class="box">
        <div class="comment">
          <div class="comment__author">
            <img :src="avatarForAuthor" />
            <strong
            >{{ authorComment ? authorComment.name : 'Удаленый пользователь' }}
            </strong>
            <div class="comment__author-update">
              <a
                  v-if="authorComment?._id === userData._id"
                  @click="toggleUpdaterComment"
              >Редактировать</a
              >
              <a
                  v-if="authorComment?._id === userData._id"
                  @click="deleteMyComment(comment._id, comment.postID)"
              >Удалить</a
              >
              <div v-if="UpdaterComment" class="comments__update">
                <div><textarea v-model="newUpdateComment" /></div>
                <div>
                  <button
                      class="button is-primary"
                      @click="updateCommentForPost(comment._id)"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="comment__text">
            <span> {{ comment.text ? comment.text : 'Удаленый коментарий' }}</span>
          </div>
          <div class="comment__likes">
            <span>{{ comment.likes ? comment.likes.length : 0 }} </span>
            <i
                :class="[
              'fa',
              'fa-heart',
              {
                like_active:(
                  comment.likes ? comment.likes.includes(userData._id) : false
                ),
              },
            ]"
                aria-hidden="true"
                @click="setLikeComment(comment._id, comment.postID)"
            ></i>
            <a @click="toggleAddComment" v-if="comment.children">Ответить</a>
          </div>
        </div>
        <div class="comments__add" v-if="isVisiableInput">
          <div><span>Введите свой коментарий: </span></div>
          <div><textarea v-model="newComment" /></div>
          <div>
            <v-button class="is-small" @click="createNewCommentForPost"
            >Отправить</v-button
            >
          </div>
        </div>
        <div></div>
      </div>
      <div v-if="$slots.children" class="comment__children">
        <slot name="children"></slot>
      </div>
    </div>

</template>

<script>
import {computed, defineComponent, ref, toRef} from "vue";
import {useComments} from "@/composable/posts/useComments";
import vButton from '../../common/v-button'
import {useUser} from "@/composable/useUser";
import {getImageUrl} from "@/utils/profileHelpers";
import DefaultImage from '@/assets/images/1.png'
export default defineComponent({
  name: "v-comment",
  components: {
    vButton,
  },
  props: {
    comment: {
      type: Object,
      default() {
        return {}
      }
    }
  },
    setup(props) {
    const defaultImage=DefaultImage
    const {userData}=useUser()
      const comment = toRef(props, 'comment')
      const {setLikeForComment, updateComment, createNewComment, authorComments, deleteComment } = useComments(comment.value.postID)
      const isVisiableInput = ref(false)
      const newComment = ref('')
      const newUpdateComment = ref('')
      const UpdaterComment = ref(false)
      const setLikeComment = (idComment, idPost) => {
        setLikeForComment({idComment, idPost})
      }
      const toggleUpdaterComment = () => {
        UpdaterComment.value = !UpdaterComment.value
      }
      const deleteMyComment = (id, postID) => {
        console.log(postID, 'postID')
        deleteComment({id, postID})
      }
      const toggleAddComment = () => {
        isVisiableInput.value = !isVisiableInput.value
      }

      // console.log(comment.value.commentedBy)
     const authorComment = computed(()=> {
        if (comment.value?.commentedBy) {
          return authorComments.value.find((item) => item._id === `${comment.value.commentedBy}`,)
        }
        return 0
      })
      const  avatarForAuthor = computed(()=> {
        if (authorComment.value) {
          if (authorComment.value.avatar) {
            return getImageUrl(authorComment.value.avatar)
          }
        }
        return defaultImage
      })
      const createNewCommentForPost = () => {
        toggleAddComment()
        let text = newComment.value
        let idPost = comment.value.postID
        let followedCommentID = comment.value._id
        createNewComment({text, idPost, followedCommentID})
        newComment.value = ''
      }
      const updateCommentForPost = (id) => {
        toggleUpdaterComment()
        let text = newUpdateComment.value
        console.log(text)
        let postID = comment.value.postID
        updateComment({id, postID, text})
        newUpdateComment.value = ''
      }
      return {
        toggleUpdaterComment,
        toggleAddComment,
        setLikeComment,
        updateCommentForPost,
        createNewCommentForPost,
        deleteMyComment,
        newComment,
        isVisiableInput,
        newUpdateComment,
        UpdaterComment,
        userData,
        authorComments,
        avatarForAuthor,
        authorComment


      }
    }
  }
)
</script>

<style scoped>

</style>