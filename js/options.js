const kButtonColors = ['#fff', '#3aa757', '#e8453c', '#f9bb2d', '#4688f1']
const page = document.getElementById('buttonDiv');
const saveBtn = document.getElementById('saveBtn');

function constructOptions(kButtonColors) {
    for (let item of kButtonColors) {
        let button = document.createElement('button');
        button.style.backgroundColor = item;
        button.addEventListener('click', function() {
            chrome.storage.sync.set({color: item}, function() {
                console.log('color is %c' + item, 'color:'+item);
                // chrome.browserAction.setBadgeBackgroundColor({color: item});
                // chrome.browserAction.setBadgeText({text: '#'});
                showNotification('color is set to ' + item)
            });
        });
        page.appendChild(button);
    }

    saveBtn.addEventListener('click', function() {
        let selectedVal = document.getElementById('selectTick').value
        chrome.storage.sync.set({minutes: parseInt(selectedVal)})
        console.log('new minutes is set:' + selectedVal)
    });
}

constructOptions(kButtonColors);

function showNotification(msg) {
    let opt = {
        type: 'basic',
        iconUrl: '../images/get_started128.png',
        title: 'notice',
        message: msg
    }
    chrome.notifications.create(opt);
}
