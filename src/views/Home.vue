<template>
    <div class="home">
        <h2>最新考试</h2>
        <hr>
        <newExam />
    </div>
</template>

<style lang="stylus" scoped>
.home
    width 80%
    text-align left 
    margin 0 auto
    hr
        background-color blue

</style>
<script>
import newExam from "../components/newExam";

export default {
    name: "Home",
    components: {
        newExam        
    },
        created() {
        
    },
};
</script>
