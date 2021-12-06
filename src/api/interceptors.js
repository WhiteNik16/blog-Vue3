export const tokenInterceptor = (config) => {
    if (
        (config.method !== 'GET' && config.url !== `/auth`) ||
        config.url === '/auth/user'
    ) {
        config.headers.Authorization = `Bearer ${localStorage.jwt}`
    }
    return config
}