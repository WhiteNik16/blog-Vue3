import {computed, ref} from "vue";
import {api} from "@/api/config";
import {userData} from "@/composable/useUser";


export function useSinglePost(id) {

    const post = ref(null)
    const author = ref(null)
    const loading = ref(false)
    const error = ref(null)

    const setLikeForPost = function () {
        error.value=null
        api.put(`/posts/like/${id}`)
        try {
            if (post.value.likes.includes(userData.value._id)) {
                console.log('123')
                post.value.likes = post.value.likes.filter(item => item !== userData.value._id)
                console.log(post.value.likes)
                return post.value
            }
            post.value.likes.push(userData.value._id)
        } catch (e) {
            error.value = e
        }
    }
    const loadPost = () =>{
        loading.value=false
        error.value=null
        try{
            api.get(`/posts/${id}`).then((res) => {
                if (res.status === 200) {
                    post.value = res.data
                }
            })
        }
        catch (e){
            error.value=e
        }
        finally {
            loading.value=false
        }
    }

    const getAuthor = async (authorId) => {
        if (!authorId) {
            author.value = null
            return
        }
        const res = await api.get(`/users/${authorId}`)
        if (res.status !== 200) {
            author.value = null
            return
        }
        author.value = res.data
    }
    return{
        post: computed(() => post.value),
        author: computed(() => author.value),
        error: computed(() => error.value),
        loading: computed(() => loading.value),
        getAuthor,
        setLikeForPost,
        loadPost
}

}