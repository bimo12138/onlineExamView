<template>
    <el-row>
        <el-col :offset="1">
            <el-tabs v-model="activeIndex">
                <el-tab-pane label="选择题" name="choose">
                    <el-table :data="questionLists['choose']" border height="750">
                        <el-table-column prop="title" label="题目"></el-table-column>
                        <el-table-column prop="level" label="难度" width="80" align="center"></el-table-column>
                        <el-table-column prop="chooseA" label="A"></el-table-column>
                        <el-table-column prop="chooseB" label="B"></el-table-column>
                        <el-table-column prop="chooseC" label="C"></el-table-column>
                        <el-table-column prop="chooseD" label="D"></el-table-column>
                        <el-table-column prop="answer" label="正确答案" width="80" align="center"></el-table-column>
                        <el-table-column prop="analyse" label="解析"></el-table-column>
                        <el-table-column align="right" label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" @click="editHandler(scope.row)">编辑</el-button>
                                <el-button type="warning" size="mini" @click="deleteHandler(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="判断题" name="judgment">
                    <el-table :data="questionLists['judgment']" border height="750">
                        <el-table-column prop="title" label="题目"></el-table-column>
                        <el-table-column prop="level" label="难度" width="80" align="center"></el-table-column>
                        <el-table-column prop="answer" label="正确答案" width="80" align="center"></el-table-column>
                        <el-table-column prop="analyse" label="解析"></el-table-column>
                        <el-table-column align="right" label="操作">
                            <template>
                                <el-button type="primary" size="mini">编辑</el-button>
                                <el-button type="warning" size="mini">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="填空题" name="input">
                    <el-table :data="questionLists['input']" border height="750">
                        <el-table-column prop="title" label="题目"></el-table-column>
                        <el-table-column prop="level" label="难度" width="80" align="center"></el-table-column>
                        <el-table-column prop="answer" label="正确答案"></el-table-column>
                        <el-table-column prop="analyse" label="解析"></el-table-column>
                        <el-table-column align="right" label="操作">
                            <template>
                                <el-button type="primary" size="mini">编辑</el-button>
                                <el-button type="warning" size="mini">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="主观题" name="subjective">
                    <el-table :data="questionLists['subjective']" border height="750">
                        <el-table-column prop="title" label="题目"></el-table-column>
                        <el-table-column prop="level" label="难度" width="80" align="center"></el-table-column>
                        <el-table-column prop="answer" label="正确答案" width="200"></el-table-column>
                        <el-table-column align="right" label="操作">
                            <template>
                                <el-button type="primary" size="mini">编辑</el-button>
                                <el-button type="warning" size="mini">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-col>
    </el-row>
</template>

<script>
export default {
    data() {
        return {
            activeIndex: "choose",
            loadStatus: {
                "choose": false,
                "judgment": false,
                "input": false,
                "subjective": false
            },
            questionLists: {
                "choose": [],
                "judgment": [],
                "input": [],
                "subjective": []
            },
            examId: this.$route.params.id
        }
    },
    created() {
        this.loadNoCache("choose");
    },
    watch: {
        '$route.params.id'(newId) {
            // 重置阅读状态
            this.freshCache();
            this.examId = newId;
            this.loadNoCache("choose");
        },
        activeIndex(newId) {
            if (!this.loadStatus[newId]) {
                this.loadNoCache(newId);
            }
        }
    },
    methods: {
        deleteHandler(row) {
            let title = row.title;
            let id = row.id;
            this.$confirm("确定要删除" + title + "吗？")
                .then(() => {
                    this.deleteById(id);
                })
        },
        editHandler(row) {
            console.log(row);
        },
        deleteById(id) {
            let url = "/api/" + this.activeIndex + "Question";
            this.$http({
                method: "DELETE",
                url: url,
                data: {
                    examId: id,
                    userId: this.$store.getters.getId
                }
            })
            .then(res => {
                if (res.data.httpStatus === 200) {
                    this.foundSuccess(res.data.response);
                }
            })
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
        },
        loadNoCache(newId) {
            let url = "/api/" + newId + "Question";
            if (!this.loadStatus[newId]) {
                this.$http({
                    method: "GET",
                    url: url,
                    params: {
                        examId: this.examId
                    }
                })
                .then(res => {
                    if (res.data.httpStatus === 204) {
                        return ;
                    }
                    let mainData = res.data.response;
                    if (newId === "choose") {
                        mainData.forEach(element => {
                            element.analyse = element.analyse === null? "当前题目无解析": element.analyse;
                            element.level = element.level === "1"? "简单": element.level === "2"? "中等": "复杂";
                        });
                    } else if (newId === "judgment" || newId === "input") {
                        mainData.forEach(element => {
                            element.answer = element.answer === true? "正确": "错误";
                            element.level = element.level === null? "无难度": element.level;
                        });
                    } else if (newId === "subjective") {
                        mainData.forEach(element => {
                            element.level = element.level === null? "无难度": element.level;
                        })
                    }
                    this.questionLists[newId] = mainData;
                    this.loadStatus[newId] = true;
                })
            }
        },
        freshCache() {
            // 刷新缓存
            this.loadStatus = {
                "choose": false,
                "judgment": false,
                "input": false,
                "subjective": false
            }
            this.questionLists = {
                "choose": [],
                "judgment": [],
                "input": [],
                "subjective": []
            }
        }
    }
}
</script>