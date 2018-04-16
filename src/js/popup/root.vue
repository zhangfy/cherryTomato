<template>
      <div id="pages" class="container">
        <router-view></router-view>
      </div>
</template>

<style>
body {
  margin: 0;
}

html {
  width: 400px;
  height: 300px;
}

body {
  width: 100%;
  height: 100%;
}

#pages {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>

<script>
export default {
  data () {
      return {}
  },

  mounted() {
      this.$router.push('/home')
  }
}
</script>
