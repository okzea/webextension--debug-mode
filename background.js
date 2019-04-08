const browser = window.browser || window.chrome;

var currentTab;
var parsedUrl;
var currentDebugStatus;

function updateIcon() {
  browser.browserAction.setIcon({
    path: currentDebugStatus ? "icons/icon-enabled.svg" : "icons/icon-disabled.svg",
    tabId: currentTab.id
  });
  browser.browserAction.setTitle({
    title: currentDebugStatus ? 'Disable Debug Mode' : 'Enable Debug Mode',
    tabId: currentTab.id
  });
}

function updateActiveTab(tabs) {
  browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs[0]) {
      currentTab = tabs[0];
      parsedUrl  = new URL(currentTab.url);
      debugParam = parsedUrl.searchParams.get("debug");
      currentDebugStatus = (debugParam == 1) ? true : false;
      updateIcon();
    }
  });
}

browser.tabs.onUpdated.addListener(updateActiveTab);
browser.tabs.onActivated.addListener(updateActiveTab);
browser.windows.onFocusChanged.addListener(updateActiveTab);
updateActiveTab();

function toggleDebug() {
  (currentDebugStatus) ? parsedUrl.searchParams.delete('debug') : parsedUrl.searchParams.set('debug', '1');
  browser.tabs.update({url: `${parsedUrl}`});
}

browser.browserAction.onClicked.addListener(toggleDebug);
