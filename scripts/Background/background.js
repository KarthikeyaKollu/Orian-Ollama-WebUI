import "./models.mjs"; // Importing the models module for LLM interactions

// Log to indicate the extension has started
chrome.runtime.onInstalled.addListener(() => {
  console.log("installed");
  

  // Adding the extension to the browser's context menu
  chrome.contextMenus.create({
    id: 'openSidePanel', // Unique ID for the context menu item
    title: 'Open side panel', // Text shown in the context menu
    contexts: ['all'] // Available in all contexts (pages)
  });
});

// Listener for clicks on the context menu items
chrome.contextMenus.onClicked.addListener((info, tab) => {
  // Check if the clicked menu item is 'openSidePanel'
  if (info.menuItemId === 'openSidePanel') {
    // Opens the side panel in the current window
    chrome.sidePanel.open({ windowId: tab.windowId });
  }

});

// Listener for messages from the web UI (e.g., button clicks)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Check if the message action is 'openSidePanel'
  if (message.action === 'openSidePanel') {
    // Get the current window
    chrome.windows.getCurrent((window) => {
      // Open the side panel for the current window
      chrome.sidePanel.open({ windowId: window.id });
    });
  }
});

// Listener for keyboard shortcuts (e.g., cmd+shift+Left / ctrl+shift+Left)
chrome.commands.onCommand.addListener((command) => {
  // Check if the command is 'open_side_panel'
  if (command === 'open_side_panel') {
    // Get the current window
    chrome.windows.getCurrent((window) => {
      // Open the side panel for the current window
      chrome.sidePanel.open({ windowId: window.id });
    });
  }
});

// Setting side panel behavior to open when the extension action is clicked
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
  .then(() => console.log('Side panel behavior set successfully.')) // Success message
  .catch(error => console.error('Error setting side panel behavior:', error)); // Error handling


