<template>
    <div class="container">
        <el-row>
            <el-col :span="3" :offset="1">
                <el-menu router unique-opened >

                    <el-submenu v-for="exam in examList" :key="exam.id" :index="'/myExam/' + exam.id">
                        <template slot="title">
                            <span>{{exam.name}}</span>
                        </template>

                        <el-menu-item-group>
                            <template slot="title">基本操作</template>
                            <el-menu-item :index="exam.examManager">试卷管理</el-menu-item>
                            <el-menu-item :index="exam.questionManager">试题管理</el-menu-item>
                        </el-menu-item-group>

                        <el-menu-item-group>
                          <el-menu-item :index="exam.answerStatus">回答状态管理</el-menu-item>
                          <el-menu-item @click="deleteExam(exam.id)">删除</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-submenu index="2">
                        <template slot="title">错误反馈</template>
                        <el-menu-item index="2-1">已提交错误</el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-col>
            <el-col :span="18">
                <router-view />
            </el-col>
        </el-row>
    </div>
</template>

<style lang="stylus" scoped>
    .container
        margin-top 2rem
</style>
<script>
export default {
    name: "myExam",
    data() {
        return {
            examList: []
        }
    },
    created() {
        this.$http({
            methods: "GET",
            url: "/api/exam/list",
            params: {
                userId: this.$store.getters.getId
            }
        })
        .then((res) => {
            let examList = res.data.response;
            examList.forEach(element => {
                element.examManager = "/myExam/" + element.id + "/examManager";
                element.questionManager = "/myExam/" + element.id + "/questionManager";
                element.answerStatus = "/myExam/" + element.id + "/answerStatus";
            });
            this.examList = examList;
        })
    },
    methods: {
        deleteExam(id) {
            this.$confirm("确定要删除 id 为 " + id + "这个考试吗？")
                .then(() => {
                    console.log("删除action");
                })
        }
    }
}
</script>