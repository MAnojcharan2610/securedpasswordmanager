chrome.action.onClicked.addListener((tab) => {
  // Fetch credentials from your password manager backend
  const credentials = {
    username: "exampleUser",
    password: "examplePass"
  };

  // Send credentials to the content script
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (creds) => {
      chrome.runtime.sendMessage({ action: "autofill", ...creds });
    },
    args: [credentials]
  });
});
