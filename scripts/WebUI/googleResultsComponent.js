
chrome.storage.sync.get(['emailIntegration', 'googleSearchEnhancements'], (result) => {

  if (result.googleSearchEnhancements !== undefined && result.googleSearchEnhancements === true) {

    google()
  }
});

function google() {
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function getCurrentUrl() {
    return window.location.href;
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  // Get the body element
  const bodyElement = document.body;

  // Get the computed styles of the body element
  const computedStyles = window.getComputedStyle(bodyElement);

  // Log the current box-sizing property value

  // Set the box-sizing property value to content-box
  bodyElement.style.boxSizing = "content-box";

  // Verify the change


  async function googleSearchComponent() {
    const content = ` 
      <div class="my-extension w-96">
           <div class="mb-10 w-full container-search relative">
    <!--- error message div -->
  <div id="alert-1" class="hidden absolute top-14 left-1/2 transform -translate-x-1/2 -translate-y-full mt-4 items-center p-4 px-2 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 transition-transform duration-500 ease-in-out w-[90%]" role="alert" style="z-index: 9999;">
    <svg class="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
    </svg>
    <span class="sr-only">Info</span>
    <div class="ml-3 text-sm font-medium alert-message">
      A simple info alert with an  Give it a click if you like.
    </div>
    <button type="button" class="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700 " id="closeButton" aria-label="Close">
        <span class="sr-only">Close</span>
        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
        </svg>
      </button>
  </div>
  
  <!--- error message div -->
  
            <div class="bg-black relative border border-gray-700  p-4 rounded-tr-lg rounded-tl-lg shadow-lg  ">
                <div class="flex items-center bg-gray-700 justify-around mb-4 p-1 rounded-md">
                        <button class=" text-slate-300 py-1 px-3 rounded-lg text-sm cursor-not-allowed" disabled>Live Search</button>
                        <button class="bg-black text-white py-1 px-3 rounded-lg text-sm ">Basic Search</button>
                    </div>
                <div class="mb-4 h-96   overflow-auto">
               <div><span class="font-bold text-[15px] text-white mb-3 ml-2 model">Model</span></div>
                  <div class="text-white text-md rounded-lg p-2" id="container">
    
                  </div>
    
                  <div class="loading_search ">
                           <div class="animated-gradient h-3 rounded-md my-3 slow-animation"></div>
                          <div class="animated-gradient h-3 rounded-md my-3 medium-animation w-[90%]"></div> 
                          <div class="animated-gradient h-3 rounded-md my-3 fast-animation w-[50%]"></div>
                    </div>
    
                </div>
    
                <div class="flex justify-around relative">
                   
                    <button class="border border-blue-700 text-white py-2 px-4 rounded-lg hover:bg-blue-400 " id="startChat">Ask a followup</button>
                    <button class="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-900" id="startChat">Start New Chat</button>
  
                     <img src="https://img.icons8.com/color/48/stop.png" id="stop-button" class="  animate-spin cursor-pointer px-2 absolute -right-3 -top-16 " width="40px"/>
  
                    <img src="https://img.icons8.com/?size=100&id=13906&format=png&color=000000" id="reload-button" class="cursor-pointer px-2 absolute -right-3 -top-16 hover:bg-slate-700  rounded-lg hidden " width="30px" />
  
    
                </div>
                <div class="mt-4 text-center">
                    <button class="border border-purple-300 text-white py-1 px-3 rounded-lg  text-[12px]">🚀 Powered by Orian (Ollama WebUI)</button>
                </div>
    
        </div>
    
        <div class=" bg-yellow-600 w-full text-sm text-center  py-4  rounded-br-lg rounded-bl-lg">AI maybe inaccurate. Use 'Live Search' for best result</div>
        </div>
      `;

    showSummary(content);


  }
  /**
   * Adds the provided HTML content to the #rhs element or its container.
   * If #rhs element exists, inserts the content at the beginning.
   * If #rhs element does not exist, appends the content to the container with class '.GyAeWb'.
   * 
   * @param {string} content - The HTML content to be displayed.
   */
  function showSummary(content) {
    var currentUrl = getCurrentUrl();


    if (currentUrl.includes("search.ononoki.org/search")) {// Home page
      const doc = document.getElementById('sidebar');  // Get the #rhs element
      const newContentDiv = document.createElement('div');
      newContentDiv.innerHTML = content;
      doc.appendChild(newContentDiv)

      // get results
      sendDataToBackground_Search(document.getElementById('q').value);
    }
    else if (currentUrl.includes("google.com/search")) {// Home page

      const doc = document.getElementById('rhs');  // Get the #rhs element
      const newContentDiv = document.createElement('div');
      newContentDiv.innerHTML = content;
      const class_rhs = document.querySelector('.GyAeWb');
      newContentDiv.classList.add('ml-16');
      // If #rhs is empty, directly append the content to the container
      class_rhs.appendChild(newContentDiv);

      // Get results
      sendDataToBackground_Search(document.querySelector('#APjFqb').value);
    }
    else if (currentUrl.includes("duckduckgo.com")) {// Home page
      console.log("duckduckgo");

      const doc = document.querySelectorAll('[data-area="sidebar"]')[0];
      const ol = document.createElement('ol');
      const li = document.createElement('li');
      const newContentDiv = document.createElement('div');

      ol.appendChild(li);
      li.appendChild(newContentDiv);


      newContentDiv.innerHTML = content;

      doc.appendChild(ol);

      // get results
      sendDataToBackground_Search(document.getElementById('search_form_input').value);
    }

















    else if (currentUrl.includes("startpage.com")) {// Home page
      console.log("startpage");

      sleep(500).then(() => {

        const doc = document.getElementById("sidebar"); // ClassName('filters css-17xytvj')[0]; //'sidebar-sxpr')[0];  // Get the #rhs element
 
        const newContentDiv = document.createElement('div');

        newContentDiv.innerHTML = content;
        doc.prepend(newContentDiv);


        console.log(doc);


        sendDataToBackground_Search(document.getElementById('q').value);
      });
    }

    return;
    // Insert the content at the beginning of #rhs
    //doc.insertBefore(newContentDiv, doc.firstChild);
  }


  function sendDataToBackground_Search(query) {

    const live_search = false;
    let fullPrompt = ''
    if (!live_search) {
      fullPrompt = `
        you are a knowledgeable assistant. Your task is to provide concise and accurate answers to the following questions. Ensure your answers are clear and to the point. 200 words maximum
      
            ### Questions:
            ${query}
      
          
                  \`\`\`plainText
                    {your response should be within this}
                    \`\`\`
         
      
            
        
        `
    } else {
      var context = "searchGoogle(query)"
      fullPrompt = `
    
    You are a knowledgeable assistant. Your task is to provide detailed answers to the following questions based on the provided context. Ensure your responses are clear, accurate, and tailored to each question's requirements.
    
    ## Context: ${context}
    
    ### Questions:
    ${query}
    
    \`\`\`plaintext
    
    {your response should be within this}
    
    \`\`\`
    `
    }
    const alertDiv = document.getElementById('alert-1');
    const closeButton = alertDiv.querySelector('#closeButton');
    closeButton.addEventListener('click', function () {
      alertDiv.classList.remove('hidden')

      alertDiv.classList.add('-translate-y-full');
      setTimeout(() => {
        alertDiv.classList.add('hidden');
      }, 500); // Match the duration with transition duration
    });



    const container = document.getElementById('container');
    const loading_search = document.querySelector('.loading_search');

    // Establish connection with background script
    const port = chrome.runtime.connect({ name: 'ollama_port' });
    let data_p = ''
    let model = ''
    const model_span = document.querySelector('.model')
    // Listening for messages from background script
    port.onMessage.addListener(async function (response) {
      if (response.type === "ERROR") {
        showAlert(response.resp)
        loading_search.classList.add('hidden');
        document.getElementById('stop-button').classList.add('hidden'); // Hide the stop button
        document.getElementById('reload-button').classList.remove('hidden');
      } if (response.type === "MODEL") {
        model = response.model
        model_span.textContent = model
      }
      if (response.type === 'WORD') {

        data_p += response.resp;
        let htmlContent = marked.parse(data_p);
        container.innerHTML = htmlContent;
        Prism.highlightAllUnder(container);
        addCopyButtonsAndClasses(document.querySelectorAll('pre'))
        loading_search.classList.add('hidden');

        port.postMessage({ status: true, type: "STREAM" });
      } else if (response.type === 'FINISHED') {


        // const parsedContent = marked.parse(response.resp);

        // container.innerHTML = parsedContent;
        container.classList.add('shine', 'overflow-hidden', 'fade-in')


        document.getElementById('stop-button').classList.add('hidden');
        document.getElementById('reload-button').classList.remove('hidden');

        await delay(700)
        bodyElement.style.boxSizing = "content-box";
        console.log("box-sizing:", computedStyles.getPropertyValue("box-sizing"));
      }

    });


    document.getElementById('stop-button').addEventListener('click', () => {
      // Abort the ongoing request
      showAlert("The response was aborted by the user.")
      document.getElementById('stop-button').classList.add('hidden'); // Hide the stop button
      document.getElementById('reload-button').classList.remove('hidden');
      loading_search.classList.add('hidden')

      port.postMessage({ type: 'STOP' });
    });
    document.getElementById('reload-button').addEventListener('click', (event) => {
      window.location.reload();
    });


    // Start the search with the given query
    port.postMessage({ type: 'SEARCH', query: fullPrompt });
  }

  // Function to add copy buttons and language display to code blocks
  const addCopyButtonsAndClasses = (nodes) => {
    nodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Select <pre> elements, excluding those with the class 'content-div'
        const preElements = node.matches('pre') ? [node] : node.querySelectorAll('pre');
        preElements.forEach(pre => {
          // Check if the <pre> element is within a '.container-search' div
          if (pre.closest('.container-search')) {
            pre.classList.add('content-div', 'relative');
            const codeElement = pre.querySelector('code');
            if (codeElement) {
              // Highlight code syntax
              Prism.highlightAllUnder(pre);
              if (codeElement.classList.length <= 0) {
                codeElement.classList.add('language-javascript');// this is outputs that has no styling 
                Prism.highlightAllUnder(pre);
              } else {
                // Extract language from class name
                var lang = codeElement.classList[0].split("-")[1];
                lang = lang.charAt(0).toUpperCase() + lang.slice(1);
              }

              // Create toolbar for copy button and language display
              var toolbar = document.createElement("div");
              toolbar.classList.add('border', 'border-gray-700', 'text-white', 'p-1', 'rounded-tr-lg', 'rounded-tl-lg', 'toolbar', 'flex', 'justify-between', 'mt-3', 'overflow-hidden');
              pre.parentNode.insertBefore(toolbar, pre);

              // Create and inject copy button if not already present
              if (!pre.querySelector('.copy-button')) {
                const copyButton = document.createElement('button');
                const language = document.createElement('span');
                language.textContent = lang;
                language.classList.add('text-sm', 'p-1', 'px-1');
                copyButton.classList.add('text-sm', 'bg-black', 'text-white', 'rounded-md', 'p-1', 'px-1');
                copyButton.textContent = 'Copy';

                // Append language and copy button to the toolbar
                toolbar.appendChild(language);
                toolbar.appendChild(copyButton);

                // Add click event listener to the copy button
                copyButton.addEventListener('click', async () => {
                  // Get the content of the code element
                  const content = codeElement.innerText || codeElement.textContent;
                  try {
                    // Use the Clipboard API to write the content to the clipboard
                    await navigator.clipboard.writeText(content);
                    // Provide feedback to the user
                    copyButton.textContent = 'Copied!';
                    setTimeout(() => {
                      copyButton.textContent = 'Copy'; // Reset button text after 2 seconds
                    }, 2000);
                  } catch (err) {
                    console.error('Failed to copy: ', err);
                  }
                });
              }
            }
          }
        });
      }
    });
  };





  /**
   * Mounts the search component onto the web UI.
   * This function initializes and integrates a search component within the
   * existing Google Search interface, allowing users to interact with it
   * directly from the webpage.
   */
  googleSearchComponent()






  /**
   * Displays an alert message on the screen.
   * 
   * @param {string} message - The message to display in the alert.
   * 
   * This function shows an alert with the provided message, 
   * makes the alert visible by adding appropriate classes, 
   * and automatically hides it after 3 seconds.
   */
  function showAlert(message) {
    const alertDiv = document.querySelector('#alert-1');  // Select the alert container

    alertDiv.querySelector('.alert-message').textContent = message;  // Set the message content
    alertDiv.classList.remove('hidden', '-translate-y-full');  // Show the alert
    alertDiv.classList.add('flex');

    // Close the alert after 3 seconds
    setTimeout(() => {
      alertDiv.classList.add('hidden', '-translate-y-full');  // Hide the alert
      alertDiv.classList.remove('flex');
    }, 5000);
  }




  /**
   * Adds click event listeners to elements with the ID 'startChat'.
   * When clicked, sends a message to open the Chrome side panel 
   * and logs the action to the console.
   * 
   * If the button text does not include 'New', 
   * it retrieves text content from the element with ID 'container'
   * and sends it as a message of type 'FOLLOWUP'.
   */
  document.querySelectorAll("#startChat").forEach((btn) => {
    btn.addEventListener('click', async () => {
      // Send message to open the side panel
      chrome.runtime.sendMessage({ action: 'openSidePanel' });
      await delay(1000)

      // Check if button text does not include 'New'/ StartNewchat
      if (!btn.textContent.includes('New')) {
        // Retrieve trimmed text content from the 'container' element
        const data = document.getElementById('container').textContent.trim();

        // Send the content as a 'FOLLOWUP' message if it's not empty
        if (data) {
          chrome.runtime.sendMessage({ type: "FOLLOWUP", text: data });
        }
      }
    });
  });





}


