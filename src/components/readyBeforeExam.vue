<template>
    <el-row >
      <el-col>
          <h2>这是考试准备界面</h2>
      </el-col>
      <el-col>
          <h5>以下为本次考试的注意事项以及需要注意的</h5>
          <ol>
              <li>不能作弊</li>
              <li>全程不要切换</li>
              <li>这是个提示</li>
          </ol>
      </el-col>
      <el-col>
            <el-button type="primary" @click="takeExam" :disabled="!ready">
                <span v-if="ready">
                    我已阅读上述条款，并接受考试要求，参加考试
                </span>
                <span v-else v-html="wait"></span>
            </el-button>    
          <el-button type="warning" @click="exitExam">退出当前考试</el-button>
      </el-col>
    </el-row>
</template>

<style lang="stylus" scoped>
    .el-col
        margin-top 0.5rem
        margin-bottom 0.5rem
        ol
            text-align left
</style>
<script>
export default {
    data() {
        return {
            wait: 10,
            ready: false,
            examId: this.$route.params.id
        }
    },
    created() {
        let status = this.$store.getters.getReadyStatus;
        if (status !== 0 && status !== this.examId) {
            this.$message({
                message: "信息和预备状态不一致！即将重新返回准备界面！",
                type: "warning"
            })
            return ;
        }
        // 保存准备状态
        this.$store.dispatch("readyExam", this.examId);
        // 进行倒计时
        let restart = setInterval(() => {
            this.wait--;
            if (this.wait === 0) {
                this.ready = true;
                clearInterval(restart);
            }
        }, 1000);
    },
    methods: {
        // 退出准备
        exitExam() {
            this.$confirm("你确定要退出本次考试嘛？")
                .then(() => {
                    this.$store.dispatch("exitExamReady");
                    this.$router.back();
                })
        },
        takeExam() {
            this.$confirm("你确定要参加本次考试吗？")
                .then(() => {
                    this.$router.push("/takeExam/attend/" + this.examId);
                })
        }
    }
}
</script>