<template>
<section>
  <div class="row">
    <div class="col s1">
      <router-link to="/home" class="btn-flat waves-effect waves-light">
        <i class="material-icons left">arrow_back</i>
      </router-link>
    </div>
  </div>

  <ul>
    <li>
      <div class="switch">
        <label>
          <input type="checkbox" v-model="playTick" @change="changeTick">
          <span class="lever"></span>
          滴答声
        </label>
      </div>
    </li>

    <li>
      <div class="switch">
        <label>
          <input type="checkbox" v-model="muteBg">
          <span class="lever"></span>
          背景音乐
        </label>
      </div>
    </li>

    <li>
      div
    </li>

  </ul>

</section>
</template>

<style>
li {
  padding: 10px 0;
}
</style>

<script>
export default {
  data () {
    return {
      muteBg: false,
      playTick: false,
    }
  },

  methods: {
    changeTick () {
      chrome.runtime.sendMessage({query: 'play_tick', value: this.playTick})
      console.log('tic tock is switch to ', this.playTick)
    }
  },

  mounted() {
    let self = this
    chrome.storage.sync.get('play_tick', function(resp) {
      self.playTick = resp.play_tick
      console.log('play_tick is loaded from storage:', self.playTick)
    });
  }
}
</script>
