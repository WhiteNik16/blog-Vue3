import { api } from '@/api/config'


import {ref, computed} from "vue";
const posts = ref(null)
const loading = ref(false)
const error = ref(null)


export function usePost() {
    const searchPost =  async (search) => {
        loading.value=false
        error.value = null
        try {
            const res = await api.get(`/posts?search=${search}`)
            posts.value = res.data


        } catch (e) {
            error.value = e

        } finally {
            loading.value = false
        }

    }

    const loadPosts = async ({limit, skip}) => {
        loading.value = true
        error.value = null
        try {
            const res = await api.get(`/posts?limit=${limit}&skip=${skip}`)
            if (res.status === 200)
                posts.value = res.data

        } catch (e) {
            error.value = e
        } finally {
            loading.value = false
        }
    }

    const setLikeForPosts = async function ({id, limit, skip}) {
        try {
           await api.put(`/posts/like/${id}`)
            await loadPosts({limit, skip,})
        } catch (e) {
            error.value = e
        }
    }

    const loadMyPosts = async ({limit, skip, postedBy}) => {
        loading.value = false
        error.value = null
        try {
            const res = await api.get(`/posts?limit=${limit}&skip=${skip}&postedBy=${postedBy}`)
            posts.value = res.data
        } catch (e) {
            error.value = e
        } finally {
            loading.value = false
        }
    }
    return {
        posts: computed(() => posts.value),
        error: computed(() => error.value),
        loading: computed(() => loading.value),
        loadMyPosts,
        loadPosts,
        searchPost,
        setLikeForPosts,

    }
}



