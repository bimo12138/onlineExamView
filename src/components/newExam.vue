<template>
    <el-row :gutter="40">
        <el-col :lg="8" :md="12" :xs="24" class="card" v-for="exam in exams" :key="exam.id">
            <h3>{{exam.name}}<small class="right"> 上传者: {{exam.uploader}}</small></h3>
            <div class="introduction">
                <div class="item">
                    <span class="desc">
                        考试开始时间: 
                    </span>
                    {{exam.startTime}}
                </div>
                <div class="item">
                    <span class="desc">
                        考试结束时间: 
                    </span>
                    {{exam.endTime}}
                </div>
                <div class="item">
                    <span class="desc">
                        及格分数为: 
                    </span>
                    {{exam.availableScore}}
                </div>
                <div class="button-gorup">
                    <el-button type="primary" size="small" @click="activeExam(exam.id, exam.name)">立刻参加考试</el-button>
                </div>
            </div>
        </el-col>
    </el-row>
</template>

<style lang="stylus" scoped>
    .card
        margin-top 1rem
        padding-bottom 0.5rem
        &:hover
            box-shadow $base-box
        .right
            float right 
        h3
            padding-bottom 2px
            border-bottom 1px solid #409EFF
        .introduction
            .item
                padding-bottom 0.75rem
                .desc
                    display inline-block
                    width 8em
            .button-gorup
                border-top 1px solid $color-primary
                padding-top 2px
                text-align right

        
</style>

<script>
export default {
    data() {
        return {
            exams: []
        }
    },
    created() {
        this.$http({
            method: "GET",
            url: "/api/exam/new"
        })
        .then(res => {
            let exams = res.data.response;
            exams.forEach(element => {
                element.startTime = element.startTime.replace("T", " ");
                element.endTime = element.endTime.replace("T", " ");
            });
            this.exams = exams;
        })
    },
    methods: {
        activeExam(id, name) {
            if (!this.$store.getters.is_login) {
                this.$message({
                    message: "抱歉, 请先登录，再参加考试！",
                    type: "warning"
                })
                return ;
            }
            this.$confirm("是否参加<strong>" + name + "</strong>的考试！", "注意", {
                dangerouslyUseHTMLString: true,
                confirmButtonText: "确认参加！",
                cancelButtonText: "取消",
                type: "info"
            })
                .then(() => {
                    // 参加考试
                    this.$router.push("/takeExam/ready/" + id);
                })
                .catch(() => {
                    // 取消参加
                })
        }
    }
}
</script>