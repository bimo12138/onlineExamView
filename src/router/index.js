import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue')
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('../views/About.vue')
    },
    {
        path: "/myExam",
        name: "myExam",
        component: () => import("../views/myExam"),
        children: [
            {path: ":id/examManager", name: "examManager", component: () => import("../components/examManager")},
            {path: ":id/questionManager", name: "questionManger", component: () => import("../components/questionManager")},
            {path: ":id/answerStatus", name: "answerStatus", component: () => import("../components/answerStatus")}
        ]
    },
    {
        path: "/register",
        name: "Register",
        component: () => import("../views/Register")
    },
    {
        path: "/takeExam",
        name: "ActiveExam",
        component: () => import("../views/ActiveExam"),
        children: [
            {path: "ready/:id", name: "readyBeforeExam", component: () => import("../components/readyBeforeExam")},
            {path: "attend/:id", name: "attendExam", component: () => import("../components/attendExam")}
        ]
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
