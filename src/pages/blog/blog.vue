<template>
  <div>
    <div class="blog" v-if="posts && !loading">
            <div class="blog__header">
              <input
                  v-model.lazy="searchValue"
                  type="text"
                  class="blog__header-search is-small"
              /><i class="fa fa-search" aria-hidden="true"></i>
            </div>
      <div class="blog__header-title container">
        <h1>Посты</h1>
        <div class="blog__select select is-primary is-normal is-rounded">
          <select @change="changeAmountOnPage" :value="amountPost">
            <option hidden selected>
               кол-во постов
            </option>
            <option
                v-for="{ label, value } in pageVariants"
                :value="value"
                :key="value"
            >
              {{ label }}
            </option>
          </select>
        </div>
      </div>
      <div class="blog__posts container is-max-desktop" v-if="posts">
        <div>

          <posts
              v-for="post in posts.data"
              :key="post._id"
              v-bind:post_data="post"
              @transitionToPost="transitionToPost"
          ></posts>
        </div>
        <div class="blog__page-number-switch">
          <nav
              v-if="pageCount > 1"
              class="pagination is-centered"
              role="navigation"
              aria-label="pagination"
          >
            <a class="pagination-previous" @click="selectPage(pageNumber - 1)">back</a>
            <a class="pagination-next" @click="selectPage(pageNumber + 1)">next
              </a>
            <ul class="pagination-list">
              <li>
                <a
                    class="pagination-link"
                    aria-label="Goto page 1"
                    v-if="pageNumber >= 2"
                    @click="selectPage(1)"
                >1</a
                >
              </li>
              <li>
                <span v-if="pageNumber > 3" class="pagination-ellipsis"
                >&hellip;</span
                >
              </li>
              <li>
                <a
                    class="pagination-link"
                    v-if="pageNumber > 2"
                    @click="selectPage(pageNumber - 1)"
                >{{ pageNumber - 1 }}</a
                >
              </li>
              <li>
                <a class="pagination-link is-current" aria-current="page">{{
                    pageNumber
                  }}</a>
              </li>
              <li>
                <a
                    class="pagination-link"
                    v-if="pageNumber < pageCount - 1"
                    @click="selectPage(pageNumber + 1)"
                >{{ +pageNumber + 1 }}</a
                >
              </li>
              <li>
                <span class="pagination-ellipsis" v-if="pageNumber < pageCount - 1"
                >&hellip;</span
                >
              </li>
              <li>
                <a
                    class="pagination-link"
                    v-if="pageNumber < pageCount"
                    @click="selectPage(pageCount)"
                >{{ pageCount }}</a
                >
              </li>
            </ul>
          </nav>
        </div>
        <div v-if="!posts.data.length">
          <h2>Посты не найдены((</h2>
        </div>
      </div>
    </div>
    <div  v-if="loading"> Loading...</div>
  </div>
</template>

<script>
import {ref, computed, onMounted, watchEffect} from "vue";
import {usePost} from "@/composable/posts/usePost";
import {useRoute, useRouter} from "vue-router"
import posts from "@/components/posts";
export default {
  name: "blog",
components:{
    posts
},
  setup(){
    const route = useRoute()
    const router = useRouter()
    const { loadPosts, post, posts, searchPost, loading } = usePost()
    const pageVariants = [
          {
            label: '5',
            value: 5,
          },
          {
            label: '10',
            value: 10,
          },
          {
            label: '15',
            value: 15,
          },
          {
            label: '25',
            value: 25,
          },
          {
            label: '50',
            value: 50,
          },
        ]
    let searchValue=ref(null)
    function transitionToPost(post_data) {
      let data = post_data._id
      router.push({name: 'post', params: {id: data }})
    }
    function selectPage(number){
      router.push({
        query: {
          ...route.query,
          pageNumber: `${number}`,
        },
      })
    }
    function changeAmountOnPage(event) {
      router.push({
        query: {
          ...route.query,
          pagination: `${event.target.value}`,
        },
      })
    }
    watchEffect(()=>{
      searchPost(searchValue.value)
        },
    )
    watchEffect(()=>{
        let limit = 10
        let skip = 0
        limit = route.query.pagination ?? limit
        skip = ((route.query.pageNumber ?? 1) - 1) * limit
        loadPosts({limit, skip})
      }
    )
    const amountPost =computed(() =>{
      return Number(route.query.pagination ?? 10)
    })
    const pageNumber =computed(() =>{
      return Number(route.query.pageNumber ?? 1)
    })
    const pageCount = computed(() => {
      if (posts.value.pagination) {
        let l = posts.value.pagination.total,
            s = route.query.pagination
                ? Number(route.query.pagination)
                : amountPost.value
        return Math.ceil(l / s)
      }
      return 0
    })
    onMounted(async ()=>{
      let limit = 10
      let skip = 0
      limit = route.query.pagination ?? limit
      skip = ((route.query.pageNumber ?? 1) - 1) * limit
      await loadPosts({limit,skip})
      // console.log(posts.value.data)
    })

    return{
      amountPost,
      post,
      posts ,
      pageNumber,
      pageCount,
      selectPage,
      changeAmountOnPage,
      pageVariants,
      searchValue,
      transitionToPost,
      loading
    }
  }
}
</script>

<style scoped>
@import "~bulma/css/bulma.css";
</style>