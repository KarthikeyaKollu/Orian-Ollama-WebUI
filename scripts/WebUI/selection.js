/**
 * Event listener for mouseup events to capture selected text and send it to the Chrome extension.
 * Detects selected text from input fields, textareas, and regular elements, trims whitespace,
 * and sends the selected text via Chrome runtime message if available.
 * 
 * @param {MouseEvent} event - The mouseup event object.
 */
document.addEventListener('mouseup', (event) => {
  let selectedText = '';

  // Handle selection for inputs and textareas
  if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
    selectedText = event.target.value.substring(event.target.selectionStart, event.target.selectionEnd).trim();
  } else {
    // Handle selection for regular elements
    selectedText = window.getSelection().toString().trim();
  }

  // If selected text is not empty, send it to the Chrome extension
  if (selectedText) {
    chrome.runtime.sendMessage({ type: 'TEXT_SELECTED', text: selectedText });
  }
});


/**
 * Listener for messages from the panelUI  requesting the entire text content of the current web page.(chat with webpage feature)
 * Retrieves the inner text content of the document body and sends it back to the PanelUI as a response.
 * 
 * @param {object} request - The message request object containing the action type.
 * @param {object} sender - The message sender object.
 * @param {function} sendResponse - The function to send a response back to the background script.
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // Check if the action type is to get text content
  if (request.action === "getText") {
    // Retrieve the inner text content of the document body
    var textContent = document.body.innerText.trim();
    // Send the text content back to the PanelUI as a response
    sendResponse({ textContent: textContent }); 
  }
});
