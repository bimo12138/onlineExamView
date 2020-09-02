<template>
  <div>
    <el-menu :default-active="this.$route.path" unique-opened router mode="horizontal">
      <el-menu-item index="/">主页</el-menu-item>
      <template v-if="this.$store.getters.is_login">
        <el-submenu index="user" class="right">
          <template slot="title">{{user.username}}</template>
          <template v-if="user.is_uploader === 'true'">
            <el-menu-item index="/myExam">我的试卷</el-menu-item>
            <template v-if="user.is_superuser === 'true'">
              <el-menu-item index="/admin">控制台</el-menu-item>
            </template>
          </template>
          <el-menu-item @click="logout">注销</el-menu-item>
        </el-submenu>
      </template>
      <template v-else>
        <el-menu-item index="/register" class="right">注册</el-menu-item>
        <el-menu-item @click="login" class="right">登录</el-menu-item>
      </template>
    </el-menu>
    <el-dialog title="登录" :visible.sync="show_login_dialog" :before-close="beforeClose">

        <el-form :model="loginForm" :rules="rules" ref="loginForm">
            <el-form-item label="用户名" label-width="6rem" prop="username">
                <el-input v-model="loginForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" label-width="6rem" prop="password">
                <el-input type="password" v-model="loginForm.password"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button @click="cancel">取消</el-button>
            <el-button type="primary" @click="loginSubmit">登录</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<style lang="stylus" scoped>
    .right
        float right 
</style>
<script>
export default {
    name: "myHeader",
    data() {
        return {
            show_login_dialog: false,
            loginForm: {
              username: "",
              password: ""
            },
            user: this.$store.getters.getUser,
            rules: {
                username: [
                    {required: true, message: "用户名不能为空!", trigger: "blur"}
                ],
                password: [
                    {required: true, message: "密码不能为空!", trigger: "blur"}
                ]
            }
        };
    },
    created() {
        let getTokenTime = this.$store.getters.getTokenTime;
        let now = new Date();
        let passTime = parseInt((Date.parse(now) - Date.parse(getTokenTime)) / 1000 / 60 / 60);
        if (passTime >= 24) {
            console.log("身份认证已经过期，请重新登录！");
            this.$message({
                message: "身份验证过期,请重新登录！",
                type: "error"
            })
            this.$store.dispatch("logout");
            window.location.reload();
        } else if (passTime >= 16) {
            this.$message({
                message: "身份认证将在" + (24 - Number(passTime)) + "小时后过期，推荐重新登录，也可以继续留下!",
                type: "warning"
            })
        }
    },
    methods: {
        logout() {
            // TODO 注销 清除localstorage 清除 vuex 的数据
            this.$confirm("确定要注销本次登录吗？")
                .then(() => {
                    this.$store.dispatch("logout");
                    if (this.$router.currentRoute.name === "Home") {
                        window.location.reload();
                    } else {
                        this.$router.push("/");
                    }
                })
        },
        login() {
            this.show_login_dialog = true;
        },
        cancel() {
            this.beforeClose();
        },
        submitWarning(message){
            this.$message({
                message: message,
                type: "warning"
            })
        },
        submitSuccess(message) {
            this.$message({
                message: message,
                type: "success"
            });
        },
        loginSubmit() {
            this.$refs["loginForm"].validate((vaild) => {
                if (vaild) {
                    let username = this.loginForm.username;
                    let password = this.loginForm.password;
                    this.$http({
                        method: "POST",
                        url: "/api/login",
                        data: {
                            username,
                            password
                        }
                    })
                        .then(res => {
                            if (res.data.httpStatus === 204) {
                                this.submitWarning(res.data.response);
                            } else if (res.data.httpStatus === 200) {
                                // LOGIN SUCCESS
                                this.submitSuccess(res.data.response.message);
                                this.$store.dispatch("loginSuccess", res.data.response.user);
                                this.$store.dispatch("saveToken", res.data.response.token);
                                this.show_login_dialog = false;
                                window.location.reload();
                            }
                        })
                        .catch(e => {
                            console.log(e);
                        })
                } else {
                    console.log("信息不完整！");
                    return false;
                }
            })
        },
        beforeClose() {
            this.$confirm("确定退出登录吗？")
                // confirm
                .then(() => {
                    this.show_login_dialog = false;
                })
                // cancel
        }
    },
};
</script>