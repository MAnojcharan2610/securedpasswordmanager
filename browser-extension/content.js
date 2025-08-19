// Extract credentials from the login form
const usernameField = document.querySelector('input[type="text"], input[name*="user"]');
const passwordField = document.querySelector('input[type="password"]');

if (usernameField && passwordField) {
  const credentials = {
    username: usernameField.value,
    password: passwordField.value,
    url: window.location.href
  };

  // Send credentials to your app's API
  fetch('http://localhost:3000/api/save-credentials', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  }).then(response => {
    if (response.ok) {
      console.log('Credentials sent successfully');
    } else {
      console.error('Failed to send credentials');
    }
  }).catch(error => {
    console.error('Error:', error);
  });
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "autofill") {
    if (usernameField) usernameField.value = message.username;
    if (passwordField) passwordField.value = message.password;
    sendResponse({ success: true });
  }
});
