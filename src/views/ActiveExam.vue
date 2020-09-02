<template>
    <!-- 这是参加考试和准备考试的 main 界面 包括主 js 和 css 都要在这个里面进行控制 -->
    <el-row>
      <el-col class="bgm" :span="16" :offset="4">
          <router-view />
      </el-col>
    </el-row>
</template>

<style lang="stylus" scoped>
    .bgm
        background #e3e3e3
        margin-top 0.75rem
        border-radius 25px

        
</style>
<script>
export default {
  
}
</script>