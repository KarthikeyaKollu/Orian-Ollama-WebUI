document.addEventListener('DOMContentLoaded', () => {
    const emailCheckbox = document.getElementById('toggleEmail');
    const googleSearchCheckbox = document.getElementById('toggleGoogleSearch');
    const saveButton = document.querySelector('button');

    // Fetch and update saved settings
    chrome.storage.sync.get(['emailIntegration', 'googleSearchEnhancements'], (result) => {
        if (result.emailIntegration !== undefined) {
            emailCheckbox.checked = result.emailIntegration;
        }
        if (result.googleSearchEnhancements !== undefined) {
            googleSearchCheckbox.checked = result.googleSearchEnhancements;
        }
    });

    // Save settings
    saveButton.addEventListener('click', () => {
        const emailIntegration = emailCheckbox.checked;
        const googleSearchEnhancements = googleSearchCheckbox.checked;

        chrome.storage.sync.set({
            emailIntegration,
            googleSearchEnhancements
        }, () => {
            showAlert("Your settings have been saved successfully.")
        });
    });
});

async function showAlert(message){
    const content =`<div id="alert-1" class="hidden fixed top-16 left-1/2 transform -translate-x-1/2 -translate-y-full mt-4 items-center p-4 mb-4text-green-800 rounded-lg bg-green-400 dark:bg-green-400 dark:text-black transition-transform duration-500 ease-in-out w-[30%]" role="alert" style="z-index: 9999;">
  <!--- Icon for the alert -->
 <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 24 24">
    <path d="M 12 2 C 6.486 2 2 6.486 2 12 C 2 17.514 6.486 22 12 22 C 17.514 22 22 17.514 22 12 C 22 10.874 21.803984 9.7942031 21.458984 8.7832031 L 19.839844 10.402344 C 19.944844 10.918344 20 11.453 20 12 C 20 16.411 16.411 20 12 20 C 7.589 20 4 16.411 4 12 C 4 7.589 7.589 4 12 4 C 13.633 4 15.151922 4.4938906 16.419922 5.3378906 L 17.851562 3.90625 C 16.203562 2.71225 14.185 2 12 2 z M 21.292969 3.2929688 L 11 13.585938 L 7.7070312 10.292969 L 6.2929688 11.707031 L 11 16.414062 L 22.707031 4.7070312 L 21.292969 3.2929688 z"></path>
</svg>
  
  <!--- Main message content -->
  <div class="ml-3 text-sm font-medium alert-message">
    A simple info alert with an example message. Give it a click if you like.
  </div>
</div>`


const div = document.createElement('div')
div.className="alertdiv"
div.innerHTML=content
document.body.appendChild(div);
waitForElement('#alert-1',(alertDiv)=>{

    alertDiv.querySelector('.alert-message').textContent = message;
    alertDiv.classList.remove('hidden', '-translate-y-full');
    alertDiv.classList.add('flex');
    
    // Close the alert after 3 seconds
    setTimeout(() => {
      alertDiv.classList.add('hidden', '-translate-y-full');
      alertDiv.classList.remove('flex');
      document.body.removeChild(div)
    }, 3000);
    
    
})



}
function waitForElement(selector, callback) {
    const interval = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
            clearInterval(interval); // Stop checking once the element is found
            callback(element); // Execute the callback with the found element
        }
    }, 500); // Check every 500ms
}