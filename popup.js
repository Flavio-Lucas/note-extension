document.getElementById('open-window').addEventListener('click', () => {
  chrome.windows.create({
    url: chrome.runtime.getURL('floating.html'),
    type: 'popup',
    width: 400,
    height: 300,
    top: 100,
    left: 100
  });
});
