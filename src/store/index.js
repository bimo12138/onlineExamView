import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        is_login: localStorage.getItem("is_login"),
        is_uploader: localStorage.getItem("is_uploader"),
        is_superuser: localStorage.getItem("is_superuser"),
        token: localStorage.getItem("token"),
        username: localStorage.getItem("username"),
        getTokenTime: localStorage.getItem("getTokenTime"),
        need_refresh_token: false,
        userId: localStorage.getItem("userId"),
        readyExamId: 0
    },
    mutations: {
        loginSuccess(state, user) {
            if (user === null) {
                return ;
            }
            state.is_login = true;
            state.is_superuser = user['isSuperuser'];
            state.is_uploader = user['isUploader'];
            state.username = user['username'];
            state.getTokenTime = new Date();
            state.userId = user["id"];

            localStorage.setItem("userId", state.userId);
            localStorage.setItem("is_login", state.is_login);
            localStorage.setItem("is_uploader", state.is_uploader);
            localStorage.setItem("is_superuser", state.is_superuser);
            localStorage.setItem("token", state.token);
            localStorage.setItem("username", state.username);
            localStorage.setItem("getTokenTime", state.getTokenTime);
        },
        saveToken(state, token) {
            state.token = token;
            localStorage.setItem("token", token);
        },
        logout(state) {
            state.is_login = false;
            state.token = "";
            state.need_refresh_token = false;
            localStorage.clear();
        },
        readyExam(state, examId) {
            state.readyExamId = examId;
        },
        change_token_status(state, status) {
            if (typeof state === "boolean") {
                state.need_refresh_token = status;
            }
        },
        exitReadyExam(state) {
            state.readyExamId = 0;
        }
    },
    getters: {
        is_login: state => {
            return state.is_login;
        },
        is_uploader: state => {
            return state.is_uploader;
        },
        is_superuser: state => {
            return state.is_superuser;
        },
        get_token: state => {
            return state.token;
        },
        getUser: state => {
            return {
                username: state.username,
                is_uploader: state.is_uploader,
                is_superuser: state.is_superuser
            }
        },
        getId: state => {
            return state.userId;
        },
        getTokenTime: state => {
            return state.getTokenTime;
        },
        getReadyStatus: state => {
            return state.readyExamId;
        },
        getTokenAction: state => {
            return state.need_refresh_token;
        }
    },
    actions: { 
        loginSuccess(context, user) {
            context.commit("loginSuccess", user);
        },
        saveToken(context, token) {
            context.commit("saveToken", token)
        },
        logout(context) {
            context.commit("logout");
        },
        change_token_status(context, status) {
            context.commit("change_token_status", status);
        },
        readyExam(context, id) {
            context.commit("readyExam", id);
        },
        exitExamReady(context) {
            context.commit("exitReadyExam");
        }
    },
    modules: {
    }
})
