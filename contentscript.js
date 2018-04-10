chrome.runtime.sendMessage({query: 'color'}, (resp) => {
  if (!resp) {
    console.error('response is null')
    return
  }
  document.body.style.backgroundColor = resp.color
});
