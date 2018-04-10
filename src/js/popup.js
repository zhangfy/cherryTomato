'use strict';

chrome.storage.sync.get('minutes', function(data) {
  let settingArea = document.getElementById('setting')
  settingArea.innerHTML = `当前成熟周期: <b>${data.minutes}</b> 分钟`
});

let alarmClock = {
  onHandler: function () {
    chrome.storage.sync.get('minutes', (resp) => {
      chrome.alarms.create('myAlarm', {delayInMinutes: resp.minutes})
      chrome.runtime.sendMessage({query: 'tick', minutes: resp.minutes})
      chrome.browserAction.setBadgeText({text: resp.minutes + 'm'})
      window.close();
    })
  },

  offHandler: function () {
    chrome.runtime.sendMessage({query: 'tick_stop'})
    window.close();
  },

  setup: function () {
    let alarm_on = document.getElementById('on');
    let alarm_off = document.getElementById('off');

    alarm_on.onclick = this.onHandler
    alarm_off.onclick = this.offHandler
  }
};

document.addEventListener('DOMContentLoaded', function () {
  alarmClock.setup();
});