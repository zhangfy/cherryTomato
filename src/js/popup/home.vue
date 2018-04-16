<template>
<section>
    <!-- Header -->
    <div class="row">
      <div class="col 14 s3 offset-s9" style="font-size: 13px; line-height: 1.1em;">
        <i class="material-icons">alarm</i> <span style="display: inline-block; padding: 5px 0;">{{ currentMinutes }}分钟</span>
      </div>
    </div>

    <!-- Body -->
    <div class="row">
      <div class="col s12">
        <p style="font-size: 52px; text-align: center; margin: 0;">{{ timeLeft }}</p>
      </div>

      <div class="col s12" style="text-align: center;">
        <a v-if="timeLeft === '--:--'" class="btn btn-floating btn-large waves-effect waves-light green" @click="onHandler">
          <i class="material-icons">play_arrow</i>
        </a>
        <a v-else class="btn btn-floating btn-large waves-effect waves-light red" @click="offHandler">
          <i class="material-icons">stop</i>
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div class="row" id="footer">
      <!-- options.html -->
      <div class="col s1">
        <a class="waves-effect waves-teal btn-flat" @click="openTab('/pages/options.html')">
          <i class="material-icons">settings</i>
        </a>
      </div>

      <!-- /setting -->
      <div class="col s4 offset-s7">
        <router-link to="/setting" class="btn btn-small waves-effect waves-light blue darken-2">
          <i class="material-icons left">edit</i>设置
        </router-link>
      </div>
    </div>
</section>
</template>

<style>
#body {
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
  position: absolute;
  bottom: 0;
  width: 100%;
}

.row:last-child {
  margin-bottom: 0;
}

</style>

<script>
export default {
  data() {
    return {
      currentMinutes: 1,
      timeLeft: '--:--',
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

    formatSeconds (t) {
      let sec = t % 60
      let minutes = (t - sec) / 60

      if (sec == 0 && minutes == 0) {
        return '--:--'
      } 

      if (minutes < 10) {
        minutes = '0' + minutes
      }

      if (sec < 10) {
        sec = '0' + sec
      }

      return minutes + ':' + sec
    },

    onMessage () {
      let self = this
      chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
          switch (req.query) {
              case 'tick_left':
                  self.timeLeft = self.formatSeconds(req.minutes)
                  console.log('timeLeft:', self.timeLeft)
                  break
          }
        }
      );
    },

    init () {
      // this.drawCircle()
      this.onMessage()
      chrome.storage.sync.get('minutes', data => this.currentMinutes = data.minutes)
    },

    openTab (url) {
      chrome.tabs.create({url: url})
    },

    onHandler () {
      let self = this

      chrome.storage.sync.get('minutes', (resp) => {
        chrome.alarms.create('myAlarm', {delayInMinutes: resp.minutes})
        chrome.runtime.sendMessage({query: 'tick', minutes: resp.minutes})
        self.timeLeft = self.formatSeconds(resp.minutes * 60)
      })
    },

    offHandler () {
      chrome.runtime.sendMessage({query: 'tick_stop'})
      this.timeLeft = this.formatSeconds(0)
    },

  },

  mounted() {
    this.init()
  }

}
</script>
