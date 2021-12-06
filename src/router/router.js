import { createRouter, createWebHistory } from 'vue-router'
import login from "@/components/login";
import register from "@/components/registration";
import mainPage from "@/pages/mainpage/mainpage";
import blog from "@/pages/blog/blog";
import userprofile from "@/pages/profile/userprofile";
import myPosts from "@/pages/blog/my-posts";
import createPost from "@/pages/blog/create-post";
import post from "@/pages/blog/postPage";
import {api} from "@/api/config";

const routes = [
    {
        path: '/',
        name: 'mainPage',
        component: mainPage,
    },
    {
        path: '/blog',
        name: 'blog',
        component: blog,
        meta: { requiresAuth: true },
    },
    {
        path: '/profile',
        name: 'userprofile',
        component: userprofile,
        meta: { requiresAuth: true },
    },
    {
        path: '/createPost',
        name: 'createPost',
        component: createPost,
        meta: { requiresAuth: true },
    },
    {
        path: '/myPosts',
        name: 'myPosts',
        component: myPosts,
        meta: { requiresAuth: true },
    },
    {
        path: `/post/:id`,
        name: 'post',
        component: post,
        meta: { requiresAuth: true },
        props: true,

    },
    {
        path: '/login',
        name: 'login',
        component: login,
    },
    {
        path: '/register',
        name: 'register',
        component: register,
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})
router.beforeEach(async (to, from, next) => {
    if (!to.matched.some((record) => record.meta?.requiresAuth)) {
        return next()
    }

    if (!localStorage.jwt) {
        return next('/login')
    }

    const res = await api.get('/auth/user')
    if (res.status === 200) {
        return next()
    }

    return next('/login')
})

export default router
