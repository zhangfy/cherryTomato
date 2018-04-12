let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')
let defaultColor = '#3aa757'
let count = 0
let defaultMinutes = 1
const PI = Math.PI

function drawBorder() {
    let middleX = canvas.width / 2
    let r = middleY = canvas.height / 2

    ctx.beginPath()
    ctx.arc(middleX, middleY, r-1, 0, 2 * PI)
    ctx.closePath()
    ctx.strokeStyle = '#999'
    ctx.lineWidth = 2
    ctx.stroke()

    chrome.browserAction.setIcon({
        imageData: ctx.getImageData(0, 0, canvas.width, canvas.height)
    });
}

function drawCircle(percent, color) {
    let middleX = canvas.width / 2
    let r = middleY = canvas.height / 2

    ctx.beginPath()
    ctx.moveTo(middleX, middleY)
    ctx.arc(middleX, middleY, r-4, 1.5 * PI, (1.5 + percent * 2) * PI);
    ctx.lineTo(middleX, middleY)
    ctx.fillStyle = color
    ctx.closePath()
    ctx.fill()

    chrome.browserAction.setIcon({
        imageData: ctx.getImageData(0, 0, canvas.width, canvas.height)
    });
}

let intervalId
let bgMusic = undefined

function playBgm() {
    bgMusic = new Audio('../sounds/rain_with_thunder.glue.ogg')
    bgMusic.loop = true
    bgMusic.play()
}

function stopBgm() {
    if (bgMusic) {
        bgMusic.pause()
        bgMusic.currentTime = 0
    }
}

function startTick(minutes) {
    drawBorder()

    intervalId = window.setInterval((total) => {
        count += 1

        chrome.runtime.sendMessage({query: 'tick_left', minutes: total-count})

        if (count >= total) {
            stopAlarm()
            playMusic('../sounds/alarm.ogg')
            return
        }

        if ((total - count) <= 10) {
            playMusic('../sounds/quick_ticking.ogg')
        }

        getColor((color) => {
            // chrome.runtime.sendMessage({query: 'tick_left', minutes: total-count})
            drawCircle(count / total, color)
        })
    }, 1000, minutes * 60)

    // playBgm()
}

function playMusic(src) {
    let audio = new Audio(src)
    audio.play()
}

function stopAlarm() {
    stopBgm()

    // reset clock
    chrome.runtime.sendMessage({query: 'tick_left', minutes: 0})

    window.clearInterval(intervalId);
    chrome.browserAction.setBadgeText({text:''})
    chrome.browserAction.setIcon({path:'../images/get_started32.png'})
    chrome.alarms.clearAll()
    count = 0
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

chrome.alarms.onAlarm.addListener(function (alarm) {
    console.log('Got an alarm: ' + alarm);
    stopAlarm()
    playMusic('../sounds/alarm.ogg')
    console.log('clear an interval');
});

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({color: defaultColor, minutes: defaultMinutes}, function () {
        console.log('Set default color %c' + defaultColor, 'color:'+defaultColor);
        console.log('set minutes to ' + defaultMinutes)
        // chrome.browserAction.setBadgeBackgroundColor({color: defaultColor});
        // chrome.browserAction.setBadgeText({text: 'D'});
    });
});

const getColor = (cb) => {
    chrome.storage.sync.get('color', (resp) => {
        cb(resp.color)
    })
}

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    console.log(sender.tab ?
      'from a content script:' + sender.tab.url :
      'from the extension');

    switch (req.query) {
        case 'tick':
            startTick(req.minutes)
            break

        case 'tick_stop':
            stopAlarm()
            break

        case 'color':
            getColor((color) => sendResponse({ color: color }))
            return true
    }
  }
);
