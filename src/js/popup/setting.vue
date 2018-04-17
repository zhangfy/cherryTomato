<template>
<section>
  <div class="row">
    <div class="col s1">
      <router-link to="/home" class="btn-flat waves-effect waves-light">
        <i class="material-icons">arrow_back</i>
      </router-link>
    </div>
  </div>

  <ul class="row">
    <li class="col offset-s1">
      <label>
        <input type="checkbox" class="filled-in" v-model="playTick" @change="changeTick" />
        <span>倒计10秒</span>
      </label>
    </li>

    <li class="col offset-s1">
      <label>
        <input type="checkbox" class="filled-in" v-model="playBGM" @change="changeBGM" />
        <span>播放背景音乐</span>
      </label>
    </li>

    <li class="col s6">
      <label>周期</label>
      <select class="browser-default" v-model="selectedClock" @change="changeClock">
        <option value=1>1分钟</option>
        <option value=5>5分钟</option>
        <option value=15>15分钟</option>
      </select>
    </li>
  </ul>

</section>
</template>

<script>
export default {
  data () {
    return {
      playBGM: false,
      playTick: false,
      selectedClock: null,
    }
  },

  methods: {
    changeTick () {
      chrome.runtime.sendMessage({query: 'play_tick', value: this.playTick})
      console.log('tic tock is switch to ', this.playTick)
    },

    changeBGM () {
      chrome.runtime.sendMessage({query: 'play_bgm', value: this.playBGM})
      console.log('bgm is switch to ', this.playBGM)
    },

    changeClock () {
      chrome.runtime.sendMessage({query: 'set_minutes', value: this.selectedClock})
      console.log('clock is switch to ', this.selectedClock)
    }
  },

  mounted() {
    let self = this
    chrome.storage.sync.get(['play_tick', 'play_bgm', 'minutes'], function(resp) {
      self.playTick = resp.play_tick
      self.playBGM = resp.play_bgm
      self.selectedClock = resp.minutes
      console.log('loaded from storage, play_tick: ', self.playTick, ', play_bgm:', self.playBGM)
    });
  }
}
</script>
