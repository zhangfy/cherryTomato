<template>
  <section>
      <el-row id="header" class="bar">
        <el-col :span="3" :offset="21">
          <p id="setting">{{ currentMinutes }} 分钟</p>
        </el-col>
      </el-row>

      <el-row id="body">
        <el-col :span="8" :offset="8">
          <!-- <div id="clock"></div> -->
          <canvas id="clock" width="100%" height="100%"></canvas>

          <el-button type="success" icon="el-icon-caret-right" size="small" @click="onHandler" circle></el-button>
          <el-button type="danger" icon="el-icon-circle-close" size="small" @click="offHandler" circle></el-button>
        </el-col>
      </el-row>

      <el-row id="footer">
        <el-col :span="2" :offset="19">
          <!-- <el-button icon="el-icon-setting" size="small" @click="openTab('/pages/options.html')" circle>
          </el-button> -->
          <!-- <i class="el-icon-setting" id="settingBtn" @click="openTab('/pages/options.html')"></i> -->
          <div>
            <el-button plain icon="el-icon-setting" size="small">设置</el-button>
            <!-- <router-link :to="'/setting'">设置</router-link> -->
          </div>
        </el-col>
      </el-row>
  </section>
</template>

<style>
body {
  margin: 0;
}

html {
  width: 400px;
}

section {
  width: 100%;
  height: 100%;
}

.bar {
  color: #333;
  background-color: #f5f5f5;
}

#header {
  /* padding: 8px 8px 7px;; */
  border-bottom: 1px solid #ddd;
}

#footer {
  border-top: 1px solid #ddd;
  padding: 8px 0;
  /* position: fixed;
  left: 0;
  right: 0;
  bottom: 0; */
}

#settingBtn {
  font-size: 18px;
  color: #777;
}

#settingBtn:hover {
  color: red;
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
    drawCircle() {
      let canvas = document.getElementById('clock')
      let ctx = canvas.getContext('2d')
      let r = canvas.height / 2
      let middleX = canvas.width / 2
      let middleY = r

      ctx.beginPath()
      ctx.arc(middleX, middleY, r, 0, 2 * Math.PI)
      ctx.closePath()
      ctx.strokeStyle = '#bfbfbf'
      ctx.lineWidth = 1
      ctx.stroke()

      // chrome.browserAction.setIcon({
      //     imageData: ctx.getImageData(0, 0, canvas.width, canvas.height)
      // });
    },

    init () {
      this.drawCircle()
      chrome.storage.sync.get('minutes', data => this.currentMinutes = data.minutes)
    },

    openTab (url) {
      chrome.tabs.create({url: url})
    },

    onHandler () {
      chrome.storage.sync.get('minutes', (resp) => {
        chrome.alarms.create('myAlarm', {delayInMinutes: resp.minutes})
        chrome.runtime.sendMessage({query: 'tick', minutes: resp.minutes})
        // chrome.browserAction.setBadgeText({text: resp.minutes + 'm'})
        window.close();
      })
    },

    offHandler () {
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
