<template>
  <section>
    <h1>This is powered by vue & vue-loader! Bravo~~ </h1>
    <div>
        <p id="setting">{{ currentMinutes }} 分钟</p>
    </div>

    <el-row>
      <el-button type="success" icon="el-icon-play" @click="onHandler">开始</el-button>
      <el-button type="danger" icon="el-icon-stop" @click="offHandler">终止</el-button>
    </el-row>

    <a href="/pages/options.html" target="_blank" role="button">选项</a>
  </section>
</template>

<style>
section {
  width: 400px;
}
</style>

<script>
export default {
  data() {
    return {
      currentMinutes: 1,
    }
  },

  methods: {
    init () {
      return chrome.storage.sync.get('minutes', data => this.currentMinutes = data.minutes)
    },

    onHandler: function () {
      chrome.storage.sync.get('minutes', (resp) => {
        chrome.alarms.create('myAlarm', {delayInMinutes: resp.minutes})
        chrome.runtime.sendMessage({query: 'tick', minutes: resp.minutes})
        // chrome.browserAction.setBadgeText({text: resp.minutes + 'm'})
        window.close();
      })
    },

    offHandler: function () {
      chrome.runtime.sendMessage({query: 'tick_stop'})
      window.close();
    },

  },

  mounted() {
    this.init()
    console.log('vue is mounted!')
  }

}
</script>
