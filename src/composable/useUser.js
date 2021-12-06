import {api} from '../api/config'


import {ref, computed} from "vue";

const userData = ref(null)
const loading = ref(false)
const error = ref(null)

export {userData, loading, error}

export function useUser() {
    const logOut = () => {
        localStorage.removeItem('jwt')
        userData.value = null
    }
    const editUser = async ({id, data}) => {
        loading.value = true
        error.value = null
        try {
             await api.patch(`/users/${id}`, data)
            await loadUserInfo()
        } catch (e) {
            error.value = e
            console.log(e)
        } finally {
            loading.value = false
        }

    }
    const editAvatarUser = async ({id, data}) => {
        loading.value = true
        error.value = null
        try {
          await api.put(`/users/upload/${id}`, data)
            console.log('succes avatar')
            await loadUserInfo()
        } catch (e) {
            error.value = e
            console.log(e)

        } finally {
            loading.value = false
        }
    }
    const loadUserInfo = async () => {
        loading.value = true
        error.value = null

        try {
            const user = await api.get('/auth/user')
            userData.value = user.data
        } catch (err) {
            error.value = err
            userData.value = null
        } finally {
            loading.value = false
            console.log('succes lodaing user')
        }
    }

    return {
        loading: computed(() => loading.value),
        error: computed(() => error.value),
        userData: computed(() => userData.value),
        loadUserInfo,
        logOut,
        editUser,
        editAvatarUser
    }
}