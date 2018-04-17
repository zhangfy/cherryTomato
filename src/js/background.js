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
let bgMusic = false
let playTick = false
let playBGM = false
let isTicking = false

function playBgm() {
    if (playBGM !== true || isTicking == false) {
        console.log('playBGM :', playBGM)
        return
    }

    if (!bgMusic) {
        bgMusic = new Audio('../sounds/sounds_of_frogs.glue.ogg')
        bgMusic.loop = true
    }
    bgMusic.play()
}

function stopBgm() {
    console.log('stop bgm:', bgMusic != false)
    if (bgMusic) {
        bgMusic.pause()
        bgMusic.currentTime = 0
    }
}

function playMusic(src) {
    let audio = new Audio(src)
    audio.play()
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

        if (playTick == true && (total - count) <= 10) {
            playMusic('../sounds/quick_ticking.ogg')
        }

        getColor((color) => {
            drawCircle(count / total, color)
        })
    }, 1000, minutes * 60)

    playBgm()
}

function stopAlarm() {
    isTicking = false
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
    });

    chrome.storage.sync.get(['play_tick', 'play_bgm'], function(resp) {
        if (resp.play_tick !== undefined) {
            playTick = resp.play_tick
            console.log('load play_tick from storage finished:', resp.play_tick)
        }

        if (resp.play_bgm !== undefined) {
            playBGM = resp.play_bgm
            console.log('load play_bgm from storage finished:', resp.play_bgm)
        }
    });
});

const getColor = (cb) => {
    chrome.storage.sync.get('color', (resp) => {
        cb(resp.color)
    })
}

const setTickMinutes = (minutes) => {
    chrome.storage.sync.set({'minutes': minutes})
}

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    console.log(sender.tab ?
      'from a content script:' + sender.tab.url :
      'from the extension');

    switch (req.query) {
        case 'tick':
            startTick(req.minutes)
            isTicking = true
            break

        case 'tick_stop':
            stopAlarm()
            isTicking = false
            break

        case 'color':
            getColor((color) => sendResponse({ color: color }))
            return true

        case 'play_tick':
            playTick = req.value
            chrome.storage.sync.set({'play_tick': req.value})
            console.log('play_tick is saved to:', playTick)
            break

        case 'play_bgm':
            playBGM = req.value
            chrome.storage.sync.set({'play_bgm': req.value})
            console.log('play_bgm is saved to:', playBGM)
            if (req.value == false) {
                stopBgm()
            } else {
                playBgm()
            }
            break

        case 'set_minutes':
            setTickMinutes(req.value)
            break
    }
  }
);
