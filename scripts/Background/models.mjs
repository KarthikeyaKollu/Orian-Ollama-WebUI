let controller = new AbortController(); // Controller to manage fetch requests

// Listener for connections from webUI folder
chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
    // Check the type of message received
    if (msg.type === 'SEARCH') {
      getResponseFromLLM(msg.query, port); // Call function to get response from LLM
    }

    // If the message type is 'STOP', abort the ongoing request
    if (msg.type === "STOP") {
      controller.abort(); // Abort the current fetch
      controller = new AbortController(); // Reset the controller
    }

    // If the message type is 'SUGGESTREPLY', process the query
    if (msg.type === "SUGGESTREPLY") {
      getResponseFromLLM(msg.query, port);
    }
 
  });
});


async function getModelFromStorage() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('model', function(result) {
      const selectedModel = result.model ? result.model.trim() : '';
      resolve(selectedModel);
    });
  });
}

const ollama_host = 'http://localhost:11434';
// Function to get response from Language Learning Model (LLM)
async function getResponseFromLLM(query, port) {

const selectedModel = await getModelFromStorage();
  const data = { model: selectedModel, prompt: query }; // Data to send to the LLM
  let d = ''; // Variable to store the accumulated response
  port.postMessage({type: 'MODEL',model:selectedModel})
  try {
    const response = await postRequest(data); // Send request to LLM
    await getResponse(response, parsedResponse => {
      const word = parsedResponse.response;
      if (word !== undefined) {

        d += word; // Accumulate the response
        port.postMessage({ type: 'WORD', resp: word })

   
      }
    });

    port.postMessage({ type: 'FINISHED', resp: d }); // Indicate that processing is finished
  } catch (error) {
    if (error.name === 'AbortError') {
     
      port.postMessage({ type: 'ERROR', resp: "The request has been aborted." });
    } else {

      port.postMessage({ type: 'ERROR', resp: 'Failed to post request ' + ollama_host + ' '});

    }
    // Send error message to the content script
  }
}

// Function to send a POST request to the LLM API
async function postRequest(data) {
   // Local server URL
  const URL = `${ollama_host}/api/generate`; // API endpoint

  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      signal: controller.signal // Use the AbortController to manage the request
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error: ${errorData.message}`); // Throw an error if the response is not ok
    }

    return response; // Return the response if successful
  } catch (error) {
    throw new Error(`Network error: ${error.message}`); // Handle network errors
  }
}

// Function to read and process the response from the LLM
async function getResponse(response, callback) {
  const reader = response.body.getReader(); // Get a reader to read the response stream
  let partialLine = ''; // Store incomplete lines

  while (true) {
    const { done, value } = await reader.read(); // Read the next chunk
    if (done) break; // Exit the loop when reading is done

    // Decode the received value and split by lines
    const textChunk = new TextDecoder().decode(value);
    const lines = (partialLine + textChunk).split('\n');
    partialLine = lines.pop(); // The last line might be incomplete

    for (const line of lines) {
      if (line.trim() === '') continue; // Skip empty lines
      const parsedResponse = JSON.parse(line); // Parse each line as JSON
      callback(parsedResponse); // Process each response word
    }
  }

  // Handle any remaining line
  if (partialLine.trim() !== '') {
    const parsedResponse = JSON.parse(partialLine);
    callback(parsedResponse);
  }
}
