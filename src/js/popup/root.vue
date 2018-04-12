<template>
  <div>
      <h1>Root page</h1>
      <p>
          <router-link :to="{name: 'home'}">Home</router-link>
          <router-link :to="{name: 'setting'}">Setting</router-link>
      </p>

      <router-view></router-view>
  </div>
</template>

<script>
export default {
  data () {
      return {}
  }
}
</script>
