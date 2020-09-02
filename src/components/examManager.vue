<template>
    <el-row>
        <el-col :offset="1" :loading="loadExamStatus">
            <el-form label-width="8rem" :model="exam" ref="exam" :rules="rules">
                <el-form-item label="ID">
                    <el-input disabled v-model="exam.id" class="min-length"></el-input>
                </el-form-item>
                <el-form-item label="考试名" prop="name">
                    <el-input v-model="exam.name" class="min-length"></el-input>
                </el-form-item>
                <el-form-item label="考试上传时间" >
                    <el-date-picker type="datetime" v-model="exam.uploadTime" class="min-length" disabled></el-date-picker>
                </el-form-item>
                <el-form-item label="考试开始时间" prop="startTime">
                    <el-date-picker type="datetime" v-model="exam.startTime" class="min-length" :value-format="simpleDateFormat"></el-date-picker>
                </el-form-item>
                <el-form-item label="考试结束时间" prop="endTime">
                    <el-date-picker type="datetime" v-model="exam.endTime" class="min-length" :value-format="simpleDateFormat"></el-date-picker>
                </el-form-item>
                <el-form-item label="及格分" prop="availableScore">
                    <el-slider v-model="exam.availableScore" show-input :step="5" show-stops class="min-length"></el-slider>
                </el-form-item>
                <el-form-item label="考试文件">
                    <el-tag type="success">{{exam.rawFile}}</el-tag>
                    <el-button type="primary" disabled>下载文件</el-button>
                </el-form-item>
                <el-form-item label="考试状态" prop="status">
                    <el-input v-model="exam.status" disabled class="min-length"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="saveExam">保存</el-button>
                    <el-button type="default" @click="backToForm">重置</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<style lang="stylus" scoped>
.el-form
    text-align left
    .min-length
        width 20rem
    .el-tag
        margin-right 1rem
</style>
<script>
// 获取某个考试的具体内容，以及设置一些信息
export default {
    data() {
        let timeCalculate = (rule, value, callback) => {
            if (value <= this.exam.startTime) {
                return callback(new Error("请输入合法的考试结束时间！"));
            }
            callback();
        }
        return {
            exam: {},
            back_exam: {},
            simpleDateFormat: "yyyy-MM-dd HH:mm:ss",
            changed: false,
            loadExamStatus: false,
            rules: {
                name: [
                    {required: true, message: "试卷名不能为空！", trigger: "blur"}
                ],
                startTime: [
                    {required: true, message: "开始时间不能为空！", trigger: "blur"}
                ],
                endTime: [
                    {required: true, message: "结束时间不能为空！", trigger: "blur"},
                    {validator: timeCalculate, trigger: "blur"}
                ],
                status: [
                    {required: true, message: "考试状态不能为空！", trigger: "blur"}
                ],
                availableScore: [
                    {required: true, message: "及格分不能为空！", trigger: "blur"}
                ]
            }
        }
    },
    created() {
        let id = this.$route.params.id;
        this.$http({
            method: "GET",
            url: "/api/exam",
            params: {
                id: id
            }
        })
        .then(res => {
            if (res.data.httpStatus === 200) {
                let temp = res.data.response;
                temp.startTime = temp.startTime.replace("T", " ");
                temp.endTime = temp.endTime.replace("T", " ");
                temp.uploadTime = temp.uploadTime.replace("T", " ");
                this.exam = temp;
                this.back_exam = temp;
            } else {
                this.foundError(res.data.response);
            }
            this.changed = false;
        })
    },
    watch: {
        exam: {
            handler() {
                this.changed = true;  
            },
            deep: true
        },
        '$route.params.id'(newId) {
            this.loadExamStatus = true;
            this.refreshId(newId);
        }
    },
    methods: {
        saveExam() {
            if (this.changed) {
                this.$http({
                    method: "PUT",
                    url: "/api/exam",
                    data: {
                        id: this.exam.id,
                        name: this.exam.name,
                        startTime: this.exam.startTime,
                        endTime: this.exam.endTime,
                        uploader: this.exam.uploader,
                        userId: this.$store.getters.getId,
                        availableScore: this.exam.availableScore
                    },
                })
                .then((res) => {
                    if (res.data.httpStatus === 200) {
                        this.foundSuccess(res.data.response);
                    } else {
                        this.foundError(res.data.response);
                    }
                })
            } else {
                this.foundError("对不起，未发现任何修改，无法保存！");
            }
        },
        backToForm() {
            this.exam = this.back_exam;
        },
        refreshId(id) {
            this.$http({
                method: "GET",
                url: "/api/exam",
                params: {
                    id: id
                }
            })
            .then(res => {
                if (res.data.httpStatus === 200) {
                    this.exam = res.data.response;
                    this.loadExamStatus = false;
                } else {
                    this.foundError(res.data.response);
                    this.loadExamStatus = false;
                }
            })
            .catch(e => {this.loadExamStatus = false; console.log(e);})
        },
        foundError(str) {
            this.$message({
                message: str,
                type: "warning"
            })
        },
        foundSuccess(str) {
            this.$message({
                message: str,
                type: "success"
            })
        }
    }
}
</script>