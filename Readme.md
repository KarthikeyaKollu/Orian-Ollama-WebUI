<div align="center"> <h1>🌐 Orian (Ollama WebUI)</h1> </div>

## Overview 🔍📊🗂️📋
**Orian** (Ollama WebUI) is a Chrome extension that provides quick access to your favorite local Language Model (LLM) directly from your browser. With features like open-source chat integration, mail reply suggestions, and more, it's designed to enhance your browsing experience with AI capabilities.

[Chat Interface Overview](https://github.com/KarthikeyaKollu/browserAI.01/assets/108949445/d62073b4-cdde-46dd-8b14-8ba0c46206db)

## 🚀 Features
- **Open Side Panel:** Access your LLM with a side panel using `Ctrl+Shift+Left` (or `Command+Shift+Left` on macOS).
- **Contextual Interaction:** Select and interact with parts of websites for enhanced browsing.
- **Email Integration:** Compose and reply to emails with AI-generated suggestions in Gmail.
- **Google Search Enhancements:** Improved interaction with search results using marked.js and Prism.js.
- **Local LLM Integration:** Communicates with a local instance of Ollama for AI responses.

## 💬 Chat Interface
The Chat Interface is a key feature of Orian, enabling seamless interaction with Ollama LLMs directly from your browser.

### Features
- **Chat with Ollama LLMs:** Interact with local language models for insightful responses and suggestions.
- **Contextual Website Chat:** Engage in conversations about the content of the current webpage.
- **Customizable Prompts:** Generate replies and posts based on selected text or specific prompts.
- **Integration with Multiple Platforms:** Use within Gmail, Google Search, and more.

### Usage
- **Chat Window:** Easily accessible through the side panel.
- **Interactive Suggestions:** Get real-time responses and suggestions based on the context of the webpage.

## 🔍 Search Component
- **Summarized Search Results:**  🔍📋🔎📈✨  Provides concise summaries of search results, aiding quick information retrieval and enhancing browsing efficiency.

  [Search Component Overview](https://github.com/KarthikeyaKollu/browserAI.01/assets/108949445/f9389e15-bcbf-4d7e-82bf-75915551b0f4)

## 📧 Email Component
- **Reading and Replying to Emails:** 📧👀✉️💬 The extension reads email content and generates replies using AI suggestions, enhancing response efficiency in Gmail.
  
    [Composing and Rewriting Emails](https://github.com/KarthikeyaKollu/browserAI.01/assets/108949445/717713bc-7169-48d5-b63b-4c8f8a2395bc)

- **Composing and Rewriting Emails:** 📧📝🔄  Users can compose new emails with AI prompts or rewrite existing messages, ensuring clarity and saving drafting time.
 
    [Email Component Overview](https://github.com/KarthikeyaKollu/browserAI.01/assets/108949445/0eaf06b6-a2ae-4b18-9f7c-27d7a95309c5)

- **Personalized Chat Interaction:** 🤖✨👤  Engage in personalized conversations within mail, tailoring responses to specific needs and improving communication effectiveness.

  [Personalized Chat Interaction](https://github.com/KarthikeyaKollu/browserAI.01/assets/108949445/bd01d55a-75fc-412b-8e71-54c1fff71e03)

## 🛠 Installation
1. Clone or download the repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click on "Load unpacked" and select the extension directory.

## 🛡 Permissions
- **Storage:** For saving settings and preferences.
- **Side Panel:** To display the AI interface.
- **Context Menus:** For additional options in the right-click menu.
- **Declarative Net Request:** For handling API requests.
- **Scripting and Active Tab:** To modify content on web pages.
- **System Information:** To optimize AI performance based on CPU and memory usage.

## 🔗 API Integration
The extension communicates with a local Ollama instance via the following endpoints:
- `http://localhost:11434/api/tags`
- `http://localhost:11434/api/generate`

## 📋 How to Use
1. Open the side panel using `Ctrl+Shift+Left` (or `Command+Shift+Left` on macOS).
2. Start chatting with Ollama LLMs or engage with the current website content.
3. Use the provided suggestions or prompts for quick interactions.

# 🖥 Installing Ollama

[Ollama Error Example](https://github.com/KarthikeyaKollu/browserAI.01/assets/108949445/0dd336a7-b0d0-4565-9d8b-f3d430cbcee0)

If you encounter any errors like the one above, ensure that Ollama is installed. Follow these steps to install Ollama and pull the necessary models:

### Installation Steps

1. **Download Ollama**
   - Visit the [official Ollama website](https://ollama.com/download) to download the latest version for your operating system.

2. **Install Ollama**
   - Follow the installation instructions specific to your OS (Windows, macOS, or Linux).

3. **Verify Installation**
   - Open your terminal and run the following command to verify that Ollama is installed:
     ```bash
     ollama --version
     ```

4. **Pull Models**
   - Once Ollama is installed, you can pull the required models by running:
     ```bash
     ollama pull <model-name>
     ```
   - Replace `<model-name>` with the specific model you need (e.g., `ollama/llm`).

### Example Commands
- Pulling a language model:
  
  ```bash
  ollama pull gemma:7b

# Contributing to Orian (Ollama WebUI) 🚀

Thank you for considering contributing to Orian (Ollama WebUI)! Your help is greatly appreciated. Here are some guidelines to get you started.

## Table of Contents
1. [Code of Conduct](#code-of-conduct)
2. [How to Contribute](#how-to-contribute)
3. [Setting Up the Repository](#setting-up-the-repository)
4. [Folder Structure](#folder-structure)
5. [Pull Request Process](#pull-request-process)
6. [License](#license)

## Code of Conduct
Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) to ensure a welcoming environment for all contributors.

## How to Contribute
You can contribute in several ways:
- Reporting bugs
- Suggesting new features
- Writing or improving documentation
- Writing code (new features, bug fixes, etc.)

## Setting Up the Repository

1. **Fork the Repository**
   - Navigate to the [Orian (Ollama WebUI) GitHub page](https://github.com/KarthikeyaKollu/Orian-Ollama-WebUI).
   - Click on the "Fork" button at the top right of the page to create a copy of the repository on your GitHub account.

2. **Clone Your Fork**
   - Open your terminal and run the following command to clone the forked repository:
     ```bash
     git clone https://github.com/<your-username>/orian.git
     cd orian
     ```

3. **Create a Branch**
   - Create a new branch for your contribution:
     ```bash
     git checkout -b your-branch-name
     ```

4. **Install Dependencies**
   - Ensure you have Node.js and npm installed. Run the following command to install the necessary dependencies:
     ```bash
     npm install
     ```

5. **Start Developing**
   - Make your changes in the new branch. Be sure to write clear, concise commit messages.

## Folder Structure
Here is an overview of the project folder structure:

![Folder Structure](https://github.com/KarthikeyaKollu/browserAI.01/assets/108949445/aaba2bb9-a7cd-4f58-9e7e-9bf8bb13f6dd)

- **Orian/**: Contains the source code of the extension.
  - **Scripts/**:
    - **Background/**:
      - `background.js`
      - `models.js`
    - **WebUI/**:
      - `emailComponent.js`
      - `googleComponent.js`
      - `selection.js`
    - **PanelUI/**:
      - `panel.js`
      - `options.js`
  - **css/**: 
    - `output.css`
  - `panel.html`
  - `manifest.json`
  - `package.json`

## Pull Request Process
1. **Commit Your Changes**
   - Ensure your changes are committed with clear and concise commit messages:
     ```bash
     git add .
     git commit -m "Description of the changes"
     ```

2. **Push to GitHub**
   - Push your changes to your forked repository:
     ```bash
     git push origin your-branch-name
     ```

3. **Create a Pull Request**
   - Navigate to the original repository on GitHub.
   - Click the "Compare & pull request" button.
   - Provide a detailed description of your changes and submit the pull request.

4. **Review and Merge**
   - Your pull request will be reviewed by the maintainers. Please make any necessary changes as requested.
   - Once approved, your pull request will be merged into the main branch.

## License
By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Orian (Ollama WebUI)! Your help is greatly appreciated. 😊

