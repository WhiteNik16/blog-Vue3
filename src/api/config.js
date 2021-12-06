
import axios from 'axios'
import { tokenInterceptor } from '@/api/interceptors'

const api = axios.create({
    baseURL: 'http://51.158.179.21/api/v1',
    withCredentials: false,
})

api.interceptors.request.use(tokenInterceptor)
// api.interceptors.response.use(errorInterceptor)
export { api }