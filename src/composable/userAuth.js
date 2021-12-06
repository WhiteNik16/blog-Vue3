import {api} from "@/api/config";
import { useUser } from "@/composable/useUser";
import router from "@/router/router";

export function useAuth() {
    const { loadUserInfo } = useUser()

    const registerUser = async ({ name, email, password }) => {
        const response = await api.post('/users', { name, email, password })
        if (response.status === 200) {
            console.log('succes')
            await login({ email, password })
        }
    }

    const login = async ({ email, password }) => {
        const response = await api.post('/auth', { email, password })
        if (response.status === 200) {
            localStorage.jwt = response.data.token
            console.log('succeslogin')
            await loadUserInfo()
            router.push({name:'mainPage'})
        } else {
            console.log(response)
        }
    }

    return {
        login,
        registerUser
    }
}