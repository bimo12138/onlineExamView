<template>
    <el-row>
        <el-col :lg="{span: 6, offset: 9}" :md="{span: 12, offset: 6}" :xs="{span: 20, offset: 2}" :sm="{span: 12, offset: 6}">
            <el-steps align-center :active="active_step">
                <el-step title="步骤一" description="填写基本信息"></el-step>
                <el-step title="步骤二" description="验证邮箱"></el-step>
                <el-step title="步骤三" description="完成"></el-step>
            </el-steps>
        </el-col>
        <el-col :lg="{span: 6, offset: 9}" :md="{span: 12, offset: 6}" :xs="{span: 20, offset: 2}" :sm="{span: 12, offset: 6}" v-if="active_step === 0">
            <el-form :model="registerForm" :rules="rules" ref="registerForm" v-loading="registerLoading">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="registerForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="registerForm.password" type="password" show-password></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPassword">
                    <el-input v-model="registerForm.checkPassword" type="password"></el-input>
                </el-form-item>
                <el-form-item label="注册身份" prop="role">
                    <el-switch v-model="registerForm.role" active-text="老师" inactive-text="学生"></el-switch>
                </el-form-item>
                <el-form-item size="large">
                    <el-button type="primary" @click="submitRegister">下一步</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col :lg="{span: 6, offset: 9}" :md="{span: 12, offset: 6}" :xs="{span: 20, offset: 2}" :sm="{span: 12, offset: 6}" v-if="active_step === 1">
            <el-form :model="checkForm" :rules="checkRules" ref="checkForm" v-loading="emailLoading">
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="checkForm.email"></el-input>
                </el-form-item>
                <el-form-item prop="code">
                    <el-input v-model="checkForm.code" class="left-part"></el-input>
                    <el-button disabled v-if="countDown !== 0" class="right-part">{{countDown}}</el-button>
                    <el-button type="primary" @click="sendCode" v-else class="right-part">获取验证码</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitCode">下一步</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col :lg="{span: 6, offset: 9}" :md="{span: 12, offset: 6}" :xs="{span: 20, offset: 2}" :sm="{span: 12, offset: 6}" v-if="active_step === 2">
            <div>信息上传成功！</div>
        </el-col>
    </el-row>
</template>

<style lang="stylus" scoped>
    .left-part
        width 60%
        text-align left 
    .right-part
        margin-left 2rem
</style>

<script>
export default {
    data() {
        let validatePassword = (rule, value, callback) => {
            if (value === "") {
                return callback(new Error("确认密码不能为空！"));
            }
            if (value !== this.registerForm.password) {
                return callback(new Error("两次密码必须一致！"));
            }
            callback();
        }
        return {
            registerForm: {
                username: "",
                password: "",
                checkPassword: "",
                role: 0
            },
            checkForm: {
                email: "",
                code: "",
            },
            registerLoading: false,
            emailLoading: false,
            active_step: 0,
            rules: {
                username: [
                    {required: true, message: "请输入用户名", trigger: "blur"},
                    {min: 2, max: 10, message: "用户名长度范围为 2 ~ 10", trigger: "blue"}
                ],
                password: [
                    {required: true, message: "请输入密码", trigger: "blur"}
                ],
                checkPassword: [
                    {required: true, message: "请输入核实密码", trigger: "blur"},
                    {validator: validatePassword, trigger: "blur"}
                ]
            },
            checkRules: {
                email: [
                    {required: true, message: "请输入邮箱", trigger: "blur"},
                    {type: "email", message: "请输入正确的邮箱地址", trigger: "blur"}
                ],
                code: [
                    {required: true, message: "请输入验证码", trigger: "blur"}
                ]
            },
            countDown: 0
        }
    },
    methods: {
        startCountDown(time) {
            this.countDown = time;
            let timer = setInterval(() => {
                this.countDown -= 1;
                if (this.countDown === 0) {
                    clearInterval(timer);
                }
                if (this.active_step === 2) {
                    clearInterval(timer);
                }
            }, 1000)
        },
        successMessage(str) {
            this.$message({
                message: str,
                type: "success"
            })
        },
        failMessage(str) {
            this.$message({
                message: str,
                type: "warning"
            })
        },
        submitRegister() {
            this.$refs["registerForm"].validate((valid) => {
                if (valid) {
                    this.registerLoading = true;
                    this.$http({
                        method: "POST",
                        url: "/api/user",
                        data: {
                            username: this.registerForm.username,
                            password: this.registerForm.password,
                            isUploader: this.registerForm.role
                        }
                    })
                        .then(res => {
                            if (res.data.httpStatus === 200) {
                                this.successMessage(res.data.response.message);
                                this.active_step ++;
                                this.registerLoading = false;
                            } else {
                                this.failMessage(res.data.response);
                                this.registerLoading = false;
                            }
                        })
                        .catch((e) => {
                            this.failMessage(e);
                            this.registerLoading = false;
                        })
                } else {
                    return false;
                }
            });
        },
        submitCode() {
            this.$refs["checkForm"].validate((valid) => {
                if (valid) {
                    this.emailLoading = true;

                    this.$http({
                        method: "POST",
                        url: "/api/emailCheck",
                        data: {
                            username: this.registerForm.username,
                            email: this.checkForm.email,
                            code: this.checkForm.code
                        }
                    })
                    .then(res => {
                        if(res.data.httpStatus === 200) {
                            this.emailLoading = false;
                            this.successMessage(res.data.response);
                            this.active_step ++;
                        } else {
                            this.failMessage(res.data.response);
                            this.emailLoading = false;
                        }
                    })
                    .catch(e => {
                        this.failMessage(e);
                        this.emailLoading = false;
                    })
                }
            })
        },
        sendCode() {
            this.$http({
                method: "GET",
                url: "/api/emailCheck",      
                params: {
                    username: this.registerForm.username,
                    email: this.checkForm.email
                }        
            })
            .then((res) => {
                this.startCountDown(60);
                if (res.data.httpStatus === 200) {
                    this.successMessage(res.data.response);
                } else {
                    this.failMessage("验证码发送失败，原因未知！");
                }
            })
            .catch(e => {
                this.failMessage(e);
            })
        },
        resetForm() {
            this.$refs["registerForm"].resetFields();
        }
    },
    created() {
    }
}
</script>