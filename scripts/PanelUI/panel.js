
const notFoundString = `
<p>failed to load</p>
`;

const notResponseString = `
<p>failed to load</p>
`;


let API_KEY = '';
let MODEL_ID = 'llama-3';
let messages = [];
let conversationHistory = '[no existing conversation]';
var version = chrome.runtime.getManifest().version;
var ollama_host = 'http://localhost:11434'
let model = ''
var rebuildRules = undefined;
var status_failed = false
if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.id) {
  rebuildRules = async function (domain) {
    const domains = [domain];
    /** @type {chrome.declarativeNetRequest.Rule[]} */
    const rules = [{
      id: 1,
      condition: {
        requestDomains: domains
      },
      action: {
        type: 'modifyHeaders',
        requestHeaders: [{
          header: 'origin',
          operation: 'set',
          value: `http://${domain}`,
        }],
      },
    }];
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: rules.map(r => r.id),
      addRules: rules,
    });
  }
}


function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


//No warnings for markdown
marked.use({
  mangle: false,
  headerIds: false
});

//set domain ORIGIN to localhost
if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.id) {
  rebuildRules('localhost');
}

let controller = new AbortController();

// API Function to send a POST request to the Ollama
async function postRequest(data) {
  const URL = `${ollama_host}/api/generate`;

  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      signal: controller.signal
    });

    if (!response.ok) {
      const errorData = await response.json(); // Or response.text
      showAlert(`API returned an error: ${errorData.message}`)

    }

    return response; // Assuming the API returns JSON
  } catch (error) {
    status_failed = true
    if (error.name === 'AbortError') {
      showAlert("The request has been aborted.")
    } else {
      showAlert('Failed to post request ' + ollama_host + ' ')

    }
    throw error; // Rethrow or handle as needed
  }
}

// API Function to stream the response from the server
async function getResponse(response, callback) {
  const reader = response.body.getReader();
  let partialLine = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    // Decode the received value and split by lines
    const textChunk = new TextDecoder().decode(value);
    const lines = (partialLine + textChunk).split('\n');
    partialLine = lines.pop(); // The last line might be incomplete

    for (const line of lines) {
      if (line.trim() === '') continue;
      const parsedResponse = JSON.parse(line);
      callback(parsedResponse); // Process each response word
    }
  }

  // Handle any remaining line
  if (partialLine.trim() !== '') {
    const parsedResponse = JSON.parse(partialLine);
    callback(parsedResponse);
  }
}

// Ollama API request model
async function getModels() {
  const response = await fetch(`${ollama_host}/api/tags`);
  const data = await response.json();
  return data;
}

/*
takes in model as a string
updates the query parameters of page url to include model name
*/
 function updateModelInQueryString(model) {
  // make sure browser supports features

  if (window.history.replaceState && 'URLSearchParams' in window) {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("model", model);
    // replace current url without reload
    const newPathWithQuery = `${window.location.pathname}?${searchParams.toString()}`
    window.history.replaceState(null, '', newPathWithQuery);
  }

  chrome.storage.local.set({ 'model': model }, async () => {
    console.log('Model updated manually to ' + model);
    const selectedModel = document.getElementById('model-select')
    selectedModel.parentElement.classList.add("shine","overflow-hidden");
    await delay(800)
    selectedModel.parentElement.classList.remove("shine","overflow-hidden");
  });

  MODEL_ID = model;
  updateSettingString();

}




// Fetch available models and populate the dropdown
async function populateModels() {


  try {
    const data = await getModels();


    const selectElement = document.getElementById('model-select');
    


    // set up handler for selection
    selectElement.onchange = (() => {
      updateModelInQueryString(selectElement.value)
    });

    data.models.forEach((model) => {
      const option = document.createElement('option');
      option.value = model.name;
      option.innerText = model.name;
      selectElement.appendChild(option);
    });

   
    // chrome.storage.local.set({ 'model': selectElement.value }, async () => {
    //   console.log('Model updated manually to ' + selectElement.value);
    //   selectElement.parentElement.classList.add("shine","overflow-hidden");
    //   await delay(800)
    //   selectElement.parentElement.classList.remove("shine","overflow-hidden");
      
    // });
    



    chrome.storage.local.get('model', (result) => {

      if (result.model !== undefined && result.model !== '') {
        selectElement.value = result.model; // set to stored value if present
        MODEL_ID = result.model;
      } else {
        // otherwise set to the first element if exists and update URL accordingly
        selectElement.value = selectElement.options[0].value;; // otherwise set to the first element if exists
        MODEL_ID = selectElement.options[0].value;
      }
      const modelStatusElement = document.getElementById('status');
      const modelStatusElement1 = document.getElementById('status1');

      modelStatusElement.classList.remove('bg-red-500');
      modelStatusElement.classList.add('bg-green-500', "hidden");

      modelStatusElement1.classList.remove('bg-red-500');
      modelStatusElement1.classList.add('bg-green-500');

      document.getElementById('chatlog').classList.remove('spinner');
      updateSettingString();

    });


  }
  catch (error) {


    showAlert('Unable to communitcate with Ollama: ' + error.message)
    const settings = document.getElementById('settings');
    settings.innerHTML = "Models Not Found"
    
  }
}




const chatlog = document.getElementById('chatlog');
const settings = document.getElementById('settings');
const promptInput = document.getElementById('prompt');
const context_prompt = document.getElementById('context-prompt')
const submitButton = document.getElementById('submit');
const closeButton = document.getElementById('close');
const addContextButton = document.querySelector('.input-context-button');
async function getModelFromStorage() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('model', function (result) {
      const selectedModel = result.model ? result.model.trim() : '';
      resolve(selectedModel);
    });
  });
}


let isDocument = false
// Function to handle user input and call the API functions
async function submitRequest() {
  const input = promptInput.value;
  if (ongoing || input.length <= 0) {
    return 
  }


  if (isEditing) {
    deleteFromIndex(parentElementID, toIndex, sibling)
  } else {
    console.log("not editing")
  }



  if (!context_prompt.classList.contains('hidden')) {
    context_prompt.classList.add('hidden')
    // closeButton.classList.add('hidden')
  }




  handleSuggestion();
  const contextInput = context_prompt.value.toString();
  const selectedModel = document.getElementById('model-select').value;
  const chatlog = document.getElementById('chatlog');
  const loading = document.getElementById('loading');
  const basicPrompt = buildPrompt(contextInput, input, docContent);

  conversationHistory += `\nUSER: ${basicPrompt}\n`;
  messages.push({ role: 'USER', content: basicPrompt });

  const convoText = messages.reduce((a, message) => {
    return `${a}### ${message.role.toUpperCase()}\n${message.content}\n\n`;
  }, '');

  const full_prompt = `
       # Conversation Continuation

        ## Conversation:
        \`\`\`
        ${convoText}
        \`\`\`

        ## Instructions:
        As USER in the conversation above, your task is to continue the conversation. Remember, your responses should be crafted as if you're a human conversing in a natural, realistic manner, keeping in mind the context and flow of the dialogue. Please generate a fitting response to the last message in the conversation, or if there is no existing conversation, initiate one as a normal person would.

        ## Response:
            `

  updateChatlog(chatlog, contextInput, input);
  const [chatResponse, chatResponse_div] = createChatResponseElement(chatlog);
docContent=""





  if (status_failed) {
    loading.classList.add('hidden');
    loading.classList.remove('flex');

  } else {
    loading.classList.remove('hidden');
    loading.classList.add('flex');
    ongoing = true

  }

  document.getElementById('stop-button').classList.remove('hidden');
  document.getElementById('submit').classList.add('hidden');

  promptInput.value = '';
  context_prompt.value = '';


  var Model = await getModelFromStorage()





  // if (!Model) {
  //   Model = selectedModel
    
  // }

  if (isDocument) {
    const removeDoc = document.querySelector('.document-container .remove-doc');
    removeDoc.click()
  }


   model = Model

  const data = { model: Model, prompt: full_prompt };
  console.log(full_prompt)

  try {
    const response = await postRequest(data);
    processResponse(response, chatlog, chatResponse, loading, chatResponse_div);
  } catch (error) {
    displayError(error, chatlog);
  }




}


function handleSuggestion() {

  const suggestion = document.querySelector('.suggestion');
  if (!suggestion.classList.contains('hidden')) {
    suggestion.classList.add('hidden');
  }
}

function buildPrompt(contextInput, input, docContent) {

  if (contextInput.length > 0) {
    return `
# Context-Based Question

## Context:
\`\`\`
${contextInput}
\`\`\`


## USER:
Based on the context provided above, please answer the following question : 
${input}




    `;
  } 
  else if (docContent.length > 0) {
    return ` 
# Document Analysis

## Document: ${ fileName }

### Document Content:
    \`\`\`
${docContent}
\`\`\`

### USER:
Using the content of the document provided above, please answer the following question :
${input}

    `; 
  }
  else {
    return `${ input } `;
  }

}



async function readPDF(file) {
  const fileReader = new FileReader();
  let textContent = '';
  fileReader.onload = async function () {
    const typedArray = new Uint8Array(this.result);

    const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
    

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const text = await page.getTextContent();

      text.items.forEach(function (item) {
        textContent += item.str + ' ';
      });
    }

    handleDoc(textContent,file.name)

  

  };

  fileReader.readAsArrayBuffer(file);
}
function readFile(file) {
  const reader = new FileReader();

  reader.onload = (event) => {
    const fileContent = event.target.result;
    // Example: Displaying file content in an alert
    // Call your handling function here
    handleDoc(fileContent, file.name);
  };

  reader.readAsText(file);
}



let docContent =''
const docContainer = document.querySelector('.document-container');
function handleDoc(textContent,filename){

  isDocument = true
  fileName = filename
  docContainer.innerHTML = `

      <div  class="bg-gray-500  rounded-lg sm:w-[35%] md:w-[30%]  w-[50%]  flex relative group fade-in" >

      <div class="flex items-center justify-center p-2">
          <img src="https://img.icons8.com/ios-glyphs/30/ffffff/document--v1.png" alt="Document Icon" class="mr-4 bg-red-500 rounded p-3">
          <div>
              <p class="text-white font-bold">${fileName}</p>
              <p class="text-white opacity-75">Document</p>
          </div>
      </div>
      <div class="absolute -top-2 -right-2 bg-red-200 hover:bg-red-400 p-1 rounded-full hidden group-hover:flex items-center justify-center remove-doc">
          <img src="https://img.icons8.com/ios-glyphs/30/000000/delete-sign.png" alt="Close Icon" style="width: 10px;">
      </div>
    </div >
      `
    
    docContent=textContent
   //if(!docContent.length > 0){ addButton.click(); console.log("unwanted triggres")}
    const removeDoc = document.querySelector('.remove-doc');
    removeDoc.addEventListener('click',()=>{
      docContainer.innerHTML =""
      isDocument = false
      docContent=""
    })
}

let isRegenerate = false





document.querySelector('.webchat-li').addEventListener('click', () => {
  document.querySelector('.webchat-suggestion').click()
  addButton.click()

});



document.querySelector('.settings-li').addEventListener('click', () => {
  window.open(chrome.runtime.getURL('options.html'));
  addButton.click()

});





const addButton = document.querySelector('#toggleButton-list img');
const uploadList = document.getElementById('uploadList');
const listItems = uploadList.querySelectorAll('li'); // Assuming the list items are <li> elements

addButton.addEventListener('click', function (event) {
  event.stopPropagation(); // Prevent the click event from propagating to the document
  toggleUploadList();
});

document.addEventListener('click', function (event) {
  // Check if the click was outside the uploadList and addButton
  if (!uploadList.contains(event.target) && !addButton.contains(event.target)) {
    closeUploadList();
  }
});

listItems.forEach(item => {
  item.addEventListener('click', function (event) {
    event.stopPropagation(); // Prevent the click event from propagating to the document
    closeUploadList();
  });
});

function toggleUploadList() {
  if (uploadList.classList.contains('hidden')) {
    uploadList.classList.remove('hidden', 'fade-out');
    uploadList.classList.add('fade-in');
    addButton.src = "https://img.icons8.com/?size=100&id=46&format=png&color=FFFFFF";
  } else {
    uploadList.classList.remove('fade-in');
    uploadList.classList.add('fade-out');
    addButton.src = "https://img.icons8.com/?size=100&id=3220&format=png&color=FFFFFF";
    setTimeout(() => {
      uploadList.classList.add('hidden');
    }, 500); // Match the duration of your fade-out animation
  }
}


function closeUploadList() {
  if (!uploadList.classList.contains('hidden')) {
    uploadList.classList.add('hidden');
    uploadList.classList.remove('fade-in');
    addButton.src = "https://img.icons8.com/?size=100&id=3220&format=png&color=FFFFFF";
  }
}


let doc=""
const fileInput = document.getElementById('fileInput');
let fileName=""
fileInput.addEventListener('change',  ()=> {
  if (fileInput.files.length > 0) {
    doc = fileInput.files[0]
    if (doc.type === 'text/plain') {
      readFile(doc)  
    } else if (doc.type === 'application/pdf') {
      readPDF(doc); 
    } else{
      readFile(doc) 
    }
   
    fileInput.value = ''; 
    if(!document.getElementById('uploadList').classList.contains('hidden'))
     {addButton.click();}
  } else {
    alert('Please select a PDF file.');
  }
});




function triggerFileInputChange(doc) {
  // Create a DataTransfer object to hold the file.
  const dataTransfer = new DataTransfer();
  
  // Add the file to the DataTransfer object.
  dataTransfer.items.add(doc);
  
  // Set the files of the file input element to the DataTransfer object files.
  fileInput.files = dataTransfer.files;
  
  // Manually trigger the 'change' event.
  const event = new Event('change');
  fileInput.dispatchEvent(event);
}







function updateChatlog(chatlog, contextInput, input) {
  const chatEntry = document.createElement('div');
  if (contextInput.length > 0) {
    chatEntry.innerHTML = `
      <div >
      <div class="countForEditing group mb-4 flex  justify-end w-[95%]" id="${countForEditing}">
        <div>
          <button class="edit-button">
            <img src="https://img.icons8.com/?size=100&id=sP6dvxdjJWj5&format=png&color=FFFFFF" class="w-8  mr-2 p-2 hover:bg-slate-600 hidden group-hover:flex text-white rounded-full" />

          </button>
          <button class="cancel-edit">
            <img src="https://img.icons8.com/?size=100&id=3062&format=png&color=FFFFFF" class="w-8  mr-2 p-2 hover:bg-slate-600 hidden  text-whiterounded-full" />

          </button>
        </div>
        <div class="max-w-[90%] m-2 p-3 pb-2 bg-gradient-to-r from-fuchsia-500 to-cyan-500 font-mediumtext-left text-white font-medium  rounded-bl-lg rounded-tr-lg rounded-tl-lg mb-4 fade-in">
          <div class="w-full mx-auto min-h-20 px-3 py-2 rounded-md bg-black text-white resize-none border overflow-auto max-h-40 glow mb-2"  >
            ${contextInput.toString().replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;")}
          </div>
          <div class="w-full flex-grow text-white  mr-3 pl-1  text-lg fade-in">
            ${input}
          </div>
        </div>
      </div>
     </div >
      `;
  } 
  else if (docContent.length > 0) {
    chatEntry.innerHTML = `

      <div  class="countForEditing doc flex flex-col justify-end items-end w-[95%] mb-4 relative" id = "${countForEditing}" >
    
      <div class="bg-gray-500 mr-1 rounded-lg sm:w-[30%] w-[50%] flex ">

        <div class="flex items-center justify-center p-2">
            <img src="https://img.icons8.com/ios-glyphs/30/ffffff/document--v1.png" alt="Document Icon" class="mr-4 bg-red-500 rounded-lg p-3">
            <div>
                <p class="text-white font-bold">${fileName}</p>
                <p class="text-white opacity-75">Document</p>
            </div>
        </div>
      </div>
  
    
      <div type="text" id="prompt" placeholder="Ask a follow-up" class="fade-in  bg-gradient-to-r from-fuchsia-500 to-cyan-500 font-mediumtext-left text-white font-medium text-left  p-2 px-4 test-white rounded-bl-lg rounded-tr-lg text-lg rounded-tl-lg max-w-[90%] m-1  relative group" >
          ${input}
  <div class="absolute top-0 -left-10">
    <button class="edit-button">
      <img src="https://img.icons8.com/?size=100&id=sP6dvxdjJWj5&format=png&color=FFFFFF" class="w-8  mr-2 p-2 hover:bg-slate-600 hidden group-hover:flex text-white rounded-full"/>
       
      </button>
         <button class="cancel-edit">
       <img src="https://img.icons8.com/?size=100&id=3062&format=png&color=FFFFFF" class="w-8  mr-2 p-2 hover:bg-slate-600 hidden  text-white rounded-lg"/>
       
      </button>
    </div>
      </div>
      </div>
      `
    chatEntry.classList.add('doc')
  }
  else {
    chatEntry.innerHTML = `
      <div >
      <div class="w-[95%]  flex justify-end items-start mb-4 fade-in group  countForEditing" id="${countForEditing}" >
        <button class="edit-button">
          <img src="https://img.icons8.com/?size=100&id=sP6dvxdjJWj5&format=png&color=FFFFFF" class="w-8  mr-2 p-2 hover:bg-slate-600 hidden group-hover:flex text-white rounded-full" />

        </button>
        <button class="cancel-edit">
          <img src="https://img.icons8.com/?size=100&id=3062&format=png&color=FFFFFF" class="w-8  mr-2 p-2 hover:bg-slate-600 hidden  text-white rounded-full" />

        </button>


        <p type="text" id="prompt" placeholder="Ask a follow-up" class="fade-in bg-gradient-to-r from-fuchsia-500 to-cyan-500 font-mediumtext-left text-white p-2 px-4 test-white rounded-bl-lg rounded-tr-lg text-lg rounded-tl-lg max-w-[90%] m-1 overflow-hidden" >
          ${input}
        </p>

      </div>
    </div >
      `;
  }
 
  countForEditing += 2;
  chatlog.appendChild(chatEntry);
  const cancelEdit = chatEntry.querySelector('.cancel-edit')
  const edit = chatEntry.querySelector('.edit-button')
  let name = fileName

  edit.addEventListener("click", (event) => {
    edit.querySelector('img').classList.remove('group-hover:flex')
    cancelEdit.querySelector('img').classList.remove('hidden')
    event.target.parentElement.parentElement.parentElement.classList.add('bg-blue-500', 'bg-opacity-30', "rounded-lg")
    isEditing = true
    promptInput.value = input
    if (contextInput.length > 0) {
      context_prompt.classList.remove('hidden');
      context_prompt.value = contextInput
      // closeButton.classList.remove('hidden')

    } else if(chatEntry.classList.contains('doc')){
      // doc = new File([doc], `${ fileName } `, { type: 'application/pdf' });
      triggerFileInputChange(doc);
      
    }


    parentElementID = event.target.parentElement.parentElement.id
    parentElementID = chatEntry.querySelector('.countForEditing').id
    sibling = chatEntry.nextElementSibling;
    // Clear chatlog visually after editing
    while (sibling) {
      let nextSibling = sibling.nextElementSibling;
      // chatlog.removeChild(sibling);
      sibling = nextSibling;
      toIndex++;

    }

    sibling = chatEntry.nextElementSibling;
  });

  cancelEdit.addEventListener("click", (event) => {
    edit.querySelector('img').classList.add('group-hover:flex')
    cancelEdit.querySelector('img').classList.add('hidden')
    event.target.parentElement.parentElement.parentElement.classList.remove('bg-blue-500', 'bg-opacity-50', "rounded-lg")

    promptInput.value = ""
    if (contextInput.length > 0) {
      context_prompt.classList.add('hidden');
      context_prompt.value = ""
      // closeButton.classList.add('hidden')

    }
     else if(chatEntry.classList.contains('doc')){
      // doc = new File([doc], `${ fileName } `, { type: 'application/pdf' });
      const removeDoc = document.querySelector('.document-container .remove-doc');
    removeDoc.click()
      
    }
    countForEditing = parseInt(parentElementID, 10)
    toIndex = 0
    parentElementID = 0
    isEditing = false

  });

}


let countForEditing = 0
let toIndex = 0
let sibling = ""
let parentElementID = 0
let isEditing = false

async function deleteFromIndex(s, e, sibling) {

  //  chatlog.remove(sibling.previousElementSibling)

  removeElements(messages, s, e)

  let count = 0
  let tempSibling = sibling
  while (sibling && count < e) {
    let nextSibling = sibling.nextElementSibling;
    chatlog.removeChild(sibling);
    sibling = nextSibling;
    count++;  // Move to the next index
  }
 

  let elementToRemove = document.getElementById(`${s}`);//parent elemtn
  if (elementToRemove) {
    elementToRemove.parentNode.removeChild(elementToRemove);
  } else {
    console.error('Element not found!');
  }



  // resetting the values
  countForEditing = parseInt(parentElementID, 10)
  toIndex = 0
  parentElementID = 0
  isEditing = false
}




function removeElements(array, index, count) {
  // Check if index is within valid range
  if (index < 0 || index >= array.length) {
    return;
  }
  // Remove 'count' elements starting from 'index'
  array.splice(parentElementID, count + 1);
  messages = array

  return array;
}

function createChatResponseElement(chatlog) {
  const chatResponse_div = document.createElement('div');
  chatResponse_div.classList.add('flex', 'justify-center', 'items-center', 'mb-4', 'w-[80%]', 'glow', 'ml-[6%]', 'chatResponse');

  // Creating chatResponse element
  const chatResponse = document.createElement('div');
  chatResponse.classList.add('bg-[#333333]', 'p-4', 'rounded-tl-lg', 'rounded-tr-lg', 'rounded-br-lg', 'w-[100%]', 'fade-in', 'text-white', 'overflow-hidden');
  chatResponse.id = "response_llm";
  chatResponse_div.appendChild(chatResponse);
  
  // Adding menu with buttons
  const menu = document.createElement('span');
  menu.innerHTML = `
      <div  class="items-center justify-center hidden absolute -bottom-8 left-0 menu-group rounded-lg gap-1  border border-gray-600 fade-in p-1">
      <button class="regenerate-button">
        <img src="https://img.icons8.com/?size=100&id=59872&format=png&color=FFFFFF" class="w-6 p-1 hover:bg-slate-700 text-white rounded-lg"/>
      </button>
      <button class="copy-btn">
        <img src="https://img.icons8.com/?size=100&id=pNYOTp5DinZ3&format=png&color=FFFFFF" class="w-6 p-1 hover:bg-slate-600 text-white rounded-lg"/>
      </button>   
    </div >
      `;

  chatResponse_div.appendChild(menu);

  // Adding classes for initial state (hidden, group, relative)
  chatResponse_div.classList.add('hidden', 'group', 'relative');

  // Append chatResponse_div to chatlog
  chatlog.appendChild(chatResponse_div);

  // Event handler for copy button
  async function handleCopy(event) {


    // Change icon URL
    const copyButton = event.currentTarget.querySelector('img');
    copyButton.src = 'https://img.icons8.com/?size=100&id=KLD9V6A735yg&format=png&color=FFFFFF';

    // Revert icon after 3 seconds
    setTimeout(function () {
      copyButton.src = 'https://img.icons8.com/?size=100&id=pNYOTp5DinZ3&format=png&color=FFFFFF';
    }, 3000);

    const content = chatResponse.innerText || chatResponse.textContent;
    try {
      // Use the Clipboard API to write the content to the clipboard
      await navigator.clipboard.writeText(content);
      // Optional: Provide feedback to the user
      copyButton.textContent = 'Copied!';
    } catch (err) {
      console.error('Failed to copy: ', err);
    }


  }

 
  // Event handler for regenerate button
async function handleRegenerate(event) {
    // Handle cancel edit button click
    isRegenerate = true
    const actualElement = event.target.parentElement.parentElement.parentElement.parentElement;

    
    const prevElement = actualElement.previousElementSibling
    const btn = prevElement.querySelector('.edit-button')

    if(!ongoing){
      btn.click()
     await delay(200)
     submitRequest()
    }
  }


  // Attach event listeners
  chatResponse_div.querySelector('.copy-btn').addEventListener('click', handleCopy);
  chatResponse_div.querySelector('.regenerate-button').addEventListener('click', handleRegenerate);

  return [chatResponse, chatResponse_div];
}

var ongoing = false;
async function processResponse(response, chatlog, chatResponse, loading, chatResponse_div) {
  let data_p = '';
   chatResponse.innerHTML+=`<div><span class="font-bold text-[15px] text-white mb-3 ">${model}</span></div>`
  await getResponse(response, parsedResponse => {
    let word = parsedResponse.response;

    if (parsedResponse.done) {
      chatlog.context = parsedResponse.context;
    }

    if (word !== undefined) {
     
    //chatResponse.innerHTML += word.replace(/[*`#]/g, '');
   
    data_p += word;
    let htmlContent = marked.parse(data_p);
    chatResponse.innerHTML = htmlContent;
    Prism.highlightAllUnder(chatResponse);
    ongoing = true
  }

  loading.classList.add('hidden');
  loading.classList.remove('flex');
  chatResponse_div.classList.remove('hidden'); // Show response after processing
});

conversationHistory += `\nSYSTEM: ${data_p}\n`;
messages.push({ role: 'SYSYTEM', content: data_p });
document.getElementById('stop-button').classList.add('hidden'); // Hide the stop button after the request completes
document.getElementById('submit').classList.remove('hidden');
chatResponse_div.querySelector('.menu-group').classList.add('group-hover:flex')
chatResponse.classList.add('shine')
chatResponse.innerHTML =`<div><span class="font-bold text-[15px] text-white mb-3 ">${model}</span></div>`
chatResponse.innerHTML += marked.parse(data_p);
Prism.highlightAllUnder(chatResponse);
chatResponse_div.classList.remove('glow');
ongoing = false
}


addContextButton.addEventListener('click', () => {
  if (context_prompt.classList.contains('hidden')) {
    context_prompt.classList.remove('hidden')
    // closeButton.classList.remove('hidden')
  }
})
submitButton.addEventListener('click', async () => {
  submitRequest();
});
// Scroll to bottom of chat log when Enter key is pressed
promptInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter' && event.shiftKey) {
    // Allow default behavior for Shift+Enter (new line)
    return;
  }
  
  if (event.key === 'Enter') {
    event.preventDefault(); // Prevent the default newline behavior

    // Your existing logic for submitting the chat message goes here
    submitRequest();
    
    // Scroll to the bottom of the chat log
    var chatLog = document.getElementById('chatlog');
    chatLog.scrollTop = chatLog.scrollHeight;
  }
});


closeButton.addEventListener('click', async () => {
  context_prompt.classList.add('hidden')
  context_prompt.value = ''
  // closeButton.classList.add('hidden')
});

document.getElementById('stop-button').addEventListener('click', () => {
  // showAlert("The response was aborted by the user.")
  status_failed = true
  ongoing = false
  // Abort the ongoing request
  controller.abort();
  controller = new AbortController();
  const response_llm = document.querySelectorAll("#response_llm");
  const chatResponse_div = document.querySelectorAll('.chatResponse')
  const chatResponse = document.querySelector('.chatResponse')
  chatResponse.querySelector('.menu-group').classList.add('group-hover:flex')
  let currResp = chatResponse_div[chatResponse_div.length - 1]

  currResp.classList.remove('glow')
  currResp.classList.add('remove-glow')
  document.getElementById('stop-button').classList.add('hidden'); // Hide the stop button
  document.getElementById('submit').classList.remove('hidden');

  const loading = document.getElementById('loading');
  loading.classList.add('hidden');
  loading.classList.remove('flex');


});



document.addEventListener('DOMContentLoaded', function () {
  const alertDiv = document.getElementById('alert-1');

  const closeButton = alertDiv.querySelector('button[data-dismiss-target]');

  closeButton.addEventListener('click', function () {
    alertDiv.classList.remove('hidden')

    alertDiv.classList.add('-translate-y-full');
    setTimeout(() => {
      alertDiv.classList.add('hidden');
    }, 500); // Match the duration with transition duration
  });

  // showAlert("Response it aborted")
});







function showAlert(message) {
  const alertDiv = document.querySelector('#alert-1');

  alertDiv.querySelector('.alert-message').textContent = message;
  alertDiv.classList.remove('hidden', '-translate-y-full');
  alertDiv.classList.add('flex');

  // Close the alert after 3 seconds
  setTimeout(() => {
    alertDiv.classList.add('hidden', '-translate-y-full');
    alertDiv.classList.remove('flex');
  }, 5000);
}




// MutationObserver to detect changes in the chat log and scroll to the bottom
var chatLog = document.getElementById('chatlog');
var observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    chatLog.scrollTop = chatLog.scrollHeight;
  });
});

// Configuration of the observer
var config = { childList: true, subtree: true };

// Function to check if bottom is visible
function isBottomVisible(elem) {
  return elem.scrollHeight - elem.scrollTop <= elem.clientHeight;
}

// Check visibility initially and start/stop observer
function checkVisibilityAndStartObserver() {
  if (isBottomVisible(chatLog)) {
    observer.observe(chatLog, config);
  } else {
    observer.disconnect();
  }
}

// Event listener for user scrolling
chatLog.addEventListener('scroll', function () {
  checkVisibilityAndStartObserver();
});

// Check visibility on page load
checkVisibilityAndStartObserver();



const suggestions = document.querySelectorAll('.suggestions');
// const promptInput = document.getElementById('prompt');

// home buttons suggestion prompts/ example prompts
suggestions.forEach(suggestion => {
  suggestion.addEventListener('click', () => {
    if (suggestion.textContent.includes("webpage")) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        // Send a message to the content script
        chrome.tabs.sendMessage(tabs[0].id, { action: "getText" }, function (response) {
          if (chrome.runtime.lastError) {
            showAlert("This Feature is not supported or Reload the webpage ")
          } else {
            // //promptInput.value = response.textContent;
            // context_prompt.classList.remove('hidden');
            // context_prompt.value = response.textContent;
            // closeButton.classList.remove('hidden')
            const blob = new File([response.textContent.toString().trim()],"Webpage.txt" ,{ type: 'text/plain' });
            triggerFileInputChange(blob)
          }
        });
      });
    } else {
      promptInput.value = suggestion.textContent.trim();
      submitRequest();
    }

    


  })
})



function updateSettingString() {
  settings.innerHTML = 'Running on ' + ollama_host.split("//")[1];
}

// Theme updates from options page
chrome.storage.sync.get('theme', function (data) {
  applyTheme(data.theme);
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
  if (changes.theme) {
    applyTheme(changes.theme.newValue);
  }
});


function applyTheme(theme) {
  var themeStyle = document.getElementById('theme');
  if (theme == 'dark') {
    themeStyle.href = 'css/dark.css';
  } else {
    themeStyle.href = 'css/light.css';
  }
}

function initScript() {
  MODEL_ID = '';
  populateModels();
 updateSettingString();

}

initScript();



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'TEXT_SELECTED') {

    context_prompt.classList.remove('hidden');
    context_prompt.value = message.text.toString();
    // closeButton.classList.remove('hidden')
  }
  if (message.type === "FOLLOWUP") {


    context_prompt.classList.remove('hidden');
    context_prompt.value = message.text;
    // closeButton.classList.remove('hidden')



  }




});

document.addEventListener('DOMContentLoaded', () => {


  const addCopyButtonsAndClasses = (nodes) => {
    nodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const preElements = node.matches('pre:not(.content-div)') ? [node] : node.querySelectorAll('pre:not(.content-div)');


        preElements.forEach(pre => {
          pre.classList.add('content-div', 'relative');
          const codeElement = pre.querySelector('code');

          if (codeElement && codeElement.classList.length > 0) {

            var lang = codeElement.classList[0].split("-")[1];
            lang = lang.charAt(0).toUpperCase() + lang.slice(1);

            // adding that copy and language name div above the <pre></pre> tag
            var toolbar = document.createElement("div");
            toolbar.classList.add('bg-black', 'text-white', 'p-2', 'rounded-tr-lg', 'rounded-tl-lg', 'toolbar', 'flex', 'justify-between', 'mt-3')
            pre.parentNode.insertBefore(toolbar, pre);





            // Create and inject copy button if not already present
            if (!pre.querySelector('.copy-button')) {
              const copyButton = document.createElement('button');
              const language = document.createElement('span');
              language.textContent = lang;
              language.classList.add('p-1', 'text-md')
              copyButton.classList.add('copy-button');
              copyButton.textContent = 'Copy';

              toolbar.appendChild(language)
              toolbar.appendChild(copyButton); // Append to body to keep it fixed

              // Add click event listener to the copy button
              copyButton.addEventListener('click', async () => {
                // Get the content of the code element
                const content = codeElement.innerText || codeElement.textContent;
                try {
                  // Use the Clipboard API to write the content to the clipboard
                  await navigator.clipboard.writeText(content);
                  // Optional: Provide feedback to the user
                  copyButton.textContent = 'Copied!';
                } catch (err) {
                  console.error('Failed to copy: ', err);
                }
              });
            }
          } else {
            let pElement = document.createElement('p');
            pElement.textContent = pre.textContent;
            pre.parentNode.replaceChild(pElement, pre);

          }

        });
      }
    });
  };

  // Initialize MutationObserver to watch for new elements being added to the DOM
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      addCopyButtonsAndClasses(Array.from(mutation.addedNodes));
    });
  });

  // Configure the observer to watch for childList changes
  observer.observe(document.body, { childList: true, subtree: true });

  // Initial call to handle any existing content
  addCopyButtonsAndClasses(document.querySelectorAll('pre:not(.content-div)'));
});





function startMonitoring() {
  function updateUsage() {
    chrome.system.cpu.getInfo((cpuInfo) => {
      if (previousCpuInfo) {
        // Calculate the total usage difference since the last measurement
        let totalCpuTime = 0;
        let totalActiveTime = 0;
        let previousTotalCpuTime = 0;
        let previousTotalActiveTime = 0;

        cpuInfo.processors.forEach((processor, index) => {
          const { user, kernel, idle, total } = processor.usage;
          const { user: prevUser, kernel: prevKernel, idle: prevIdle, total: prevTotal } = previousCpuInfo.processors[index].usage;

          totalCpuTime += (total - prevTotal);
          totalActiveTime += ((user - prevUser) + (kernel - prevKernel));
          previousTotalCpuTime += (prevTotal - prevIdle);
          previousTotalActiveTime += ((prevUser - prevIdle) + (prevKernel - prevIdle));
        });

        // Calculate the percentage of CPU usage
        const usagePercent = ((totalActiveTime / totalCpuTime) * 100).toFixed(1);

        document.querySelector('#cpuUsage').textContent = `${usagePercent}`

        // // Store or use the CPU usage percentage as needed
        // chrome.storage.local.set({ cpuUsage: usagePercent });
      }

      // Store current CPU info for the next measurement
      previousCpuInfo = cpuInfo;
    });


    chrome.system.memory.getInfo((memoryInfo) => {


      const usedMemoryGB = (memoryInfo.capacity - memoryInfo.availableCapacity) / (1024 * 1024 * 1024);
      const totalMemoryGB = memoryInfo.capacity / (1024 * 1024 * 1024);
      const usedPercent = ((usedMemoryGB / totalMemoryGB) * 100).toFixed(1);


      document.querySelector('#ramUsage').textContent = usedPercent
    });

    // Schedule the next update after a certain interval (e.g., 3 seconds)
    setTimeout(updateUsage, 2000); // 3 seconds
  }

  // Start initial monitoring
  updateUsage();
}

startMonitoring();


let previousCpuInfo = null;












/////////
