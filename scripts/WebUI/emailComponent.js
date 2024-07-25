chrome.storage.sync.get(['emailIntegration'], (result) => {
    if (result.emailIntegration !== undefined && result.emailIntegration === true) {
        email()
    }
});

function email() {
    // Function to wait for an element to appear in the DOM
    function waitForElement(selector, callback) {
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval); // Stop checking once the element is found
                callback(element); // Execute the callback with the found element
            }
        }, 500); // Check every 500ms
    }

    async function showAlert(message) {
        const content = `<div id="alert-1" class="hidden fixed top-20 left-1/2 transform -translate-x-1/2 -translate-y-full mt-4 items-center p-4 mb-4 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 transition-transform duration-500 ease-in-out w-[40%]" role="alert" style="z-index: 9999;">
  <!--- Icon for the alert -->
  <svg class="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
  </svg>
  
  <!--- Main message content -->
  <div class="ml-3 text-sm font-medium alert-message">
    A simple info alert with an example message. Give it a click if you like.
  </div>
  
  <!--- Close button -->
  <button type="button" class="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700 " data-dismiss-target="#alert-1" aria-label="Close">
    <span class="sr-only">Close</span>
    <!--- Close button icon -->
    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
    </svg>
  </button>
</div>`


        const div = document.createElement('div')
        div.className = "alertdiv"
        div.innerHTML = content
        document.body.appendChild(div);
        waitForElement('#alert-1', (alertDiv) => {

            alertDiv.querySelector('.alert-message').textContent = message;
            alertDiv.classList.remove('hidden', '-translate-y-full');
            alertDiv.classList.add('flex');

            // Close the alert after 3 seconds
            setTimeout(() => {
                alertDiv.classList.add('hidden', '-translate-y-full');
                alertDiv.classList.remove('flex');
                document.body.removeChild(div)
            }, 5000);


        })



    }
    // Function to add quick reply buttons to the email interface
    async function addReply(reply) {
        // HTML structure for the reply options
        const con = `
      <div class="p-4 ml-6 flex gap-4 generate-reply-container my-extension">

          <span class="text-blue-500 border border-blue-500 p-2 px-3 rounded-lg cursor-pointer reply-reply hover:bg-blue-500 hover:text-white" data-prompt="Write a simple and crisp reply in less than 50 words saying yes or replying affirmatively to the other person">Reply "Yes"</span>


          <span class="text-red-500 border border-red-500 p-2 px-3 rounded-lg cursor-pointer hover:bg-red-500 hover:text-white reply-reply" data-prompt="Write a simple and crisp reply in less than 50 words saying no or replying negatively (or declining) to the other person">Reply "No"</span>

          
      </div>`;

        const checkReplyComponent = reply.querySelector('.generate-reply-container');
        if (!checkReplyComponent) {
            reply.insertAdjacentHTML('afterbegin', con);

            const emailBodyElement = document.querySelector('.ii.gt .a3s.aiL');
            let contextEmail = "";
            if (emailBodyElement) {
                contextEmail = emailBodyElement.innerText.toString(); // Get email content
            }

            const replies = document.querySelectorAll(".reply-reply");
            const clickSimulate = document.querySelector('.ams.bkH');
            replies.forEach(btn => {
                btn.addEventListener('click', () => {
                    if (clickSimulate) {
                        clickSimulate.click(); // Simulate click to open the reply area
                    }
                    const prompt = btn.dataset.prompt;
                    const fullPrompt = `
                  You are a helpful assistant. Your task is to generate a professional email reply based on the provided context and the user's choice. Ensure the reply is clear, formal, and appropriate for professional communication. Don't give any explanation or notes.

                ## Context:
                ${contextEmail}

                 ## User's choice:{ ${btn.dataset.prompt}}

                \`\`\`Plaintext
                  {your response should be within this}
                  \`\`\`
              `;
                    sendDataToBackgroundCompose(fullPrompt, ""); // Send the prompt to the background script
                });
            });
        }
    }




    // Function to add email composition interface
    async function addEmailComposeComponent(d) {
        // HTML structure for the compose interface
        const content = `<div class="my-extension  flex items-center justify-center">
      <div class=" compose-container fade-in bg-white rounded-lg">
          <div class="p-2 flex gap-4 generate-compose">
              <span class="hover:bg-blue-500 hover:text-white text-blue-500 border border-blue-500 p-2 px-3 rounded-lg cursor-pointer reply-compose group" data-prompt="Write a simple and crisp reply in less than 50 words saying yes or replying affirmatively to the other person">Rewrite ✍🏼
               <span class="absolute -top-6 hidden group-hover:flex items-center justify-center bg-gray-800 text-white text-xs rounded px-2 py-1">
                    Rewrite the email in the email body.
                </span>
              
              </span>

              <span class="text-yellow-500 hover:bg-yellow-500 hover:text-white border border-yellow-500 p-2 px-3 rounded-lg cursor-pointer reply-compose group" data-prompt="Write a professional reply to follow up on the points mentioned in the previous messages ">Create ✨
              
                        <span class="absolute  -top-6 hidden group-hover:flex items-center justify-center bg-gray-800 text-white text-xs rounded px-2 py-1">
                            Compose an email or chat with  mail.
                        </span>
              </span>
          </div>
          <div class="p-2 gap-2 create-compose hidden items-center align-middle bg-white rounded-lg">
              <span class="p-2 cursor-pointer back hover:bg-slate-200 rounded-lg">←</span>
              <input type="text" placeholder="Write with Ai" class="border border-blue-500 p-2 rounded-lg w-64 input-prompt">
              <img src="https://img.icons8.com/?size=100&id=g8ltXTwIfJ1n&format=png&color=000000" class="border bg-black hover:bg-white px-3 p-2 rounded-lg cursor-pointer generate mr-6" width="22px" height="25px"/>
          </div>
      </div>
      <button id="toggleButton" class="p-2 m-2 rounded-full absolute bottom-0 right-0 hover:bg-gray-400">&#x25B6;</button>
  </div>`;

        const newDiv = document.createElement('div');
        newDiv.classList.add('absolute', 'bottom-0', 'left-0', 'w-full', 'rounded-lg', 'z-50');
        d.classList.add('relative');
        d.appendChild(newDiv);

        newDiv.innerHTML = content;

        const container = d.querySelector(".compose-container");
        let isExpanded = true;
        

        const toggleButton = newDiv.querySelector('#toggleButton');
        toggleButton.addEventListener('click', () => {
            if (isExpanded) {
                // Shrink to the right
                container.classList.add('hidden');
                container.classList.remove('fade-in');
                newDiv.classList.remove('w-full', 'left-0');
                newDiv.classList.add('w-1/4', 'right-0');
                toggleButton.innerHTML = '&#x25C0;'; // Change button arrow to point left
            } else {
                // Expand to the left
                container.classList.remove('hidden');
                container.classList.add('fade-in');
                newDiv.classList.remove('w-1/4', 'right-0');
                newDiv.classList.add('w-full', 'left-0');
                toggleButton.innerHTML = '&#x25B6;'; // Change button arrow to point right
            }
            isExpanded = !isExpanded;
        });

        suggestReplyForCompose(d); // Call function to handle reply generation
    }

    // Function to suggest replies based on user input
    async function suggestReplyForCompose(d) {
        const generateReply = d.querySelector(".generate-compose");
        const createReply = d.querySelector(".create-compose");
        const replies = d.querySelectorAll(".reply-compose");

        await delay(2000); // Delay for loading
        const context_email_div = d.querySelector('.Am.aiL.Al.editable.LW-avf.tS-tW');

        const toggleButton = d.querySelector('#toggleButton');

        let prompt = '';

        replies.forEach(btn => {
            btn.addEventListener('click', () => {
                const context_email = context_email_div.textContent.toString();
                prompt = btn.dataset.prompt;
                if (btn.textContent.includes("Create")) {
                    generateReply.classList.add('fade-out');
                    //   generateReply.classList.remove('fade-');


                    setTimeout(() => {
                        generateReply.classList.add('hidden');
                        generateReply.classList.remove('fade-out');
                        createReply.classList.remove('hidden');
                        createReply.classList.add('fade-in', 'flex');
                    }, 500);
                } else {
                    const fullPrompt = `You are a helpful assistant. Your task is to rewrite the provided email to improve its clarity, professionalism, and conciseness. Ensure the rewritten email is formal and appropriate for professional communication. Don't give any explanation or notes.

              ## Original Email:
                    ${context_email}

                 \`\`\`
                  {your response should be within this}
                  \`\`\`
              `;
                    if (context_email.length > 0) {


                        sendDataToBackgroundCompose(fullPrompt, d);
                    } else {
                        showAlert("The email body is blank and cannot be rewritten.")
                    }

                }
            });
        });

        const generate = d.querySelector(".generate");
        const back = d.querySelector(".back");
        if (generate) {
            await delay(1000);
            const message_div1 = d.querySelector('.Am.aiL.Al.editable.LW-avf.tS-tW');
            const input = d.querySelector(".input-prompt");
            if (input) {
                input.addEventListener('click', (event) => {
                    event.stopPropagation();
                    input.focus();
                });

                message_div1.addEventListener('click', (event) => {
                    if (event.target === input) {
                        event.stopPropagation();
                    }
                });

                input.addEventListener('keydown', (event) => {
                    input.focus();
                    if (event.key === 'Enter') {

                        event.preventDefault();

                    }

                });

                input.addEventListener('focus', (event) => {
                    event.stopPropagation();
                });
            }

            // Function to handle both click and Enter key events
            function handleGenerateEvent() {
                const data = input.value.trim();
                if (data) {
                    sub();
                }
            }

            // Event listener for click on the generate button
            generate.addEventListener('click', handleGenerateEvent);

            // Event listener for Enter key press in the input field
            input.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    handleGenerateEvent();
                }
            });

            function sub() {
                toggleButton.click();
                const context_email = context_email_div.textContent.toString();
                prompt = input.value;

                let fullPrompt = ""
                if (context_email.length > 0) {
                    fullPrompt =
                        `
You are a helpful assistant. Your task is to generate a professional email based on the given context and user instructions. Ensure the email is clear, formal, and appropriate for professional communication. Do not include any explanation or notes.

## Context:
${context_email}

## Instructions:
${prompt}

\`\`\`Plaintext
{your response should be within this}
\`\`\`
    `;
                    sendDataToBackgroundCompose(fullPrompt, d);
                }
                else {
                    fullPrompt = `
            You are a helpful assistant. Your task is to generate a professional email based on the user's prompt. Ensure the email is clear, formal, and appropriate for professional communication.
            
            Generate an email based on the following user prompt:
            
            ## User's prompt: ${prompt}
            
            \`\`\`plaintext
            {your response should be within this}
            \`\`\`
            `;
                    sendDataToBackgroundCompose(fullPrompt, d);

                }
            }



            back.addEventListener('click', () => {
                createReply.classList.add('fade-out');
                setTimeout(() => {
                    createReply.classList.add('hidden');
                    createReply.classList.remove('fade-out');
                    generateReply.classList.remove('hidden');
                    generateReply.classList.add('fade-in');
                }, 500);
            });
        }
    }

    // Function to send data to the background script for processing
    async function sendDataToBackgroundCompose(query, d) {
        

        const port = chrome.runtime.connect({ name: 'ollama_port' });
        
        waitForElement('.Am.aiL.Al.editable.LW-avf.tS-tW', (message) => {
            const stop_btn = document.querySelector('.og.T-I-J3');
            if (d === "") {
                const toggleButton = document.querySelector('#toggleButton');
                toggleButton.click();
            } else {
                message = d.querySelector('.Am.aiL.Al.editable.LW-avf.tS-tW');
                const toggleButton = d.querySelector('#toggleButton');
                toggleButton.click();
            }


            if (message) {
                message.innerHTML = "";
            }

            if (message) {
                // const temp = document.createElement('div')
                // temp.classList.add('z-9999')
                // d.appendChild(temp)
                // temp.innerHTML = `
                //  <img src="https://img.icons8.com/color/48/stop.png" id="stop-button" class="  animate-spin cursor-pointer px-2 absolute top-2 right-1 " width="40px"/>
                //  `
                message.innerHTML += `
              <div class="loading-compose fade-in">
                  <div class="animated-gradient h-3 rounded-md my-3 slow-animation w-[90%]"></div>
                  <div class="animated-gradient h-3 rounded-md my-3 fast-animation w-[80%]"></div>
              </div>    
              `;

              stop_btn.addEventListener('click',()=>{
               port.postMessage({ type: 'STOP' });
               })

                const loading = document.querySelector(".loading-compose");
                let data_p = ''

                port.onMessage.addListener(function (response) {
                    
                    if (response.type === 'WORD') {
                        // loading.classList.add('fade-out');
                        // loading.classList.remove('fade-in');


                        data_p += response.resp;
                        let htmlContent = marked.parse(data_p);
                        message.innerHTML = htmlContent;
                        //Prism.highlightAllUnder(message);
                    } else if (response.type === 'FINISHED') {
                        console.log(response);
                    }
                    if (response.type === "ERROR") {
                        showAlert(response.resp)
                        message.textContent = ""


                    }
                


                });
            } else {
                console.error("No message div is found");
            }

            port.postMessage({ type: 'SUGGESTREPLY', query: query });
        });
    }

    // Utility function to create a delay
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Function to add compose and reply interfaces to email elements.
     * Retrieves email elements with class '.aO7', adds reply functionality 
     * above existing reply and forward buttons, and adds email composition 
     * component if not already present.
     */
    function addDivs() {
        const data = document.querySelectorAll('.aO7');

        // Wait for element '.ip.iq' to appear and add reply functionality
        waitForElement('.ip.iq', (reply) => {
            addReply(reply); // Adds reply functionality above the reply and forward buttons of Gmail reply
        });


        // Loop through each email element
        data.forEach((d, i) => {
            if (!d.querySelector('.my-extension')) {
                // If compose component is not already present, add it
                addEmailComposeComponent(d);
            } 
        });
    }


    // Observer to detect changes in the DOM and add interfaces as needed
    const observer = new MutationObserver((mutations) => {
        let shouldAddDivs = false;

        mutations.forEach(mutation => {
            if (mutation.addedNodes.length || mutation.removedNodes.length) {
                shouldAddDivs = true;
            }
        });

        if (shouldAddDivs) {
            addDivs();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true }); // Observe changes in the document body

    addDivs(); // Initial call to add the interfaces

}