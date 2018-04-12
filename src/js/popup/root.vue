<template>
  <section>
    <div>
      <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple-dark">
              <!-- <div> -->
                <!-- <span class="dashboard-clock">24:59</span> -->
              <!-- </div> -->
            

              <el-row>
                <el-button type="success" icon="el-icon-play" @click="onHandler">开始</el-button>
                <el-button type="danger" icon="el-icon-stop" @click="offHandler">终止</el-button>
              </el-row>
            </div>
          </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple-dark">
            <a href="/pages/options.html" target="_blank" role="button">选项</a>
          </div>
        </el-col>
      </el-row>
    </div>

    <div>



    </div>
  </section>
</template>

<style>
section {
  width: 400px;
}

.dashboard-clock {
  font-size: 20px
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
