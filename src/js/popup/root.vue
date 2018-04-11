<template>
  <div>
    <h1>This is powered by vue & vue-loader! Bravo~~ </h1>
    <div>
        <p id="setting">{{ currentMinutes }} 分钟</p>
    </div>

    <button id="on" @click="onHandler">开始</button>
    <button id="off" @click="offHandler">停止</button>
  </div>
</template>

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
