let breakInterval = 20 * 60; // 20 minutes in seconds
let breakDuration = 20;      // 20 seconds
let timer = breakInterval;
let onBreak = false;
function updateBadge() {
  if (onBreak) {
    chrome.action.setBadgeText({ text: "BREAK" });
    chrome.action.setBadgeBackgroundColor({ color: "#FF6F00" });
  } else {
    let min = Math.floor(timer / 60).toString().padStart(2, "0");
    let sec = (timer % 60).toString().padStart(2, "0");
    chrome.action.setBadgeText({ text: ${min}:${sec} });
    chrome.action.setBadgeBackgroundColor({ color: "#333" });
  }
}
function startTimer() {
  setInterval(() => {
    if (!onBreak) {
      timer--;
      updateBadge();
      if (timer <= 0) {
        onBreak = true;
        timer = breakDuration;
        updateBadge();
        chrome.action.openPopup(); // Will open the popup if user clicks, but not programmatically; see below for workaround
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icon128.png",
          title: "Break Time!",
          message: "Take a break for 20 seconds!"
        });
      }
    } else {
      timer--;
      updateBadge();
      if (timer <= 0) {
        onBreak = false;
        timer = breakInterval;
        updateBadge();
      }
    }
  }, 1000);
}
chrome.runtime.onInstalled.addListener(() => {
  updateBadge();
  startTimer();
});
