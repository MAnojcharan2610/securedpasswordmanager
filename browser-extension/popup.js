document.getElementById('autofill').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: () => {
        chrome.runtime.sendMessage({ action: "autofill" });
      }
    });
  });
});
