<template>
  <div id="app">
    <myHeader />
    <router-view/>
    <myFooter />
  </div>
</template>

<style lang="stylus">
#app
    font-family Avenir, Helvetica, Arial, sans-serif
    -webkit-font-smoothing antialiased
    -moz-osx-font-smoothing grayscale
    text-align center
    color #2c3e50
</style>

<script>
import myHeader from "@/components/myHeader";
import myFooter from "@/components/myFooter";

export default {
    name: "app",
    components: {
        myHeader,
        myFooter
    }
}
</script>