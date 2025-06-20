    // Initialize Mermaid.js configuration
    // This will be called once the window has fully loaded to ensure Mermaid library is available.
    window.onload = function() {
        // Ensure Mermaid is initialized only if the 'mermaid' object is available
        if (typeof mermaid !== 'undefined') {
            mermaid.initialize({ startOnLoad: true, theme: 'dark' });
        } else {
            console.error('Mermaid.js library not found. Diagrams will not render.');
        }
        init(); // Call the main initialization function after all resources are loaded
    };

    // --- API Keys & External Links Configuration ---
    // IMPORTANT: For client-side applications, API keys are inherently visible in the browser's developer tools.
    // This rotation mechanism helps with rate limits and provides fallback, but DOES NOT secure the keys from discovery.
    const YOUTUBE_API_KEYS = [
        'AIzaSyBNGX-ctd1bHFfKR1chi_xx6it7gaTbZOM',
        'AIzaSyC93w_UsnvHB1cY-QJFOIpUUVef0Kr9thU',
        'AIzaSyAx9tVUn94XOf_z0P8SgK4ONGvtYTnG5CQ',
        'AIzaSyCOXQjAi6pXOf_z0P8SgK4ONGvtYTnG5CQjAi6p4AxAsmwRfiuAGZ7490XLkjlVNz8u7W0DM',
        'AIzaSyCBpRZt8Ixw-9lOCvpPHRNS0z2IY942sZQ'
    ];
    let currentYoutubeApiKeyIndex = 0;

    // Gemini API Keys provided by the user
    const GEMINI_API_KEYS = [
        'AIzaSyD3N22MpwPfObp7SmuCzdAsdXduij1CAbg',
        'AIzaSyBrLFORMIa1Q73eot8KveqhFgHqpglI6YA',
        'AIzaSyDSO9QllEwb6GFzxmqLSvMEsbemoCHmSkc',
        'AIzaSyDSxBCZWuN4EkiKOAwHUNNHhsGc3U6s_hM',
        'AIzaSyBikw4QJ_U2GGFeGHiC9kK3K_BR677z74s'
    ];
    let currentGeminiApiKeyIndex = 0; // For rotating Gemini keys

    const DEEPSEEK_API_KEYS = [
        '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',
        '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',
        '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',
        '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',
        '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'
    ];
    let currentDeepSeekApiKeyIndex = 0; // For rotating DeepSeek keys

    const config = {
        geminiFlashModel: "gemini-2.0-flash", // For summary, file analysis, and DeepSeek fallback
        geminiImageGenModel: "imagen-3.0-generate-002", // For image generation
        deepSeekModel: "deepseek/deepseek-r1:free", // DeepSeek model name changed to OpenRouter format
        geminiApiEndpoint: "https://generativelanguage.googleapis.com/v1beta/models/",
        deepSeekApiEndpoint: "https://openrouter.ai/api/v1/chat/completions", // OpenRouter endpoint
        temperature: 0.7,
        maxTokens: 164000, 
    };

    // DOM Elements
    const chatContainer = document.getElementById('chat-container');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const summarizeButton = document.getElementById('summarize-button'); 
    const errorMessage = document.getElementById('error-message');
    const welcomeMessage = document.getElementById('welcome-message');
    const newChatButton = document.getElementById('new-chat-sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const chatHistory = document.getElementById('chat-history');
    const currentChatTitle = document.getElementById('current-chat-title');
    const userAccountDisplay = document.getElementById('user-account-display');
    const fileButton = document.getElementById('file-button');
    const fileUpload = document.getElementById('file-upload');
    
    // Renamed and new elements for file preview structure
    const filePreviewArea = document.getElementById('file-preview-area');
    const fileAttachmentPill = document.getElementById('file-attachment-pill'); // New: the pill container
    const filePreviewThumbnail = document.getElementById('file-preview-thumbnail'); // New: for image thumbnails
    const fileIcon = document.getElementById('file-icon'); // New: for generic file icon
    const fileNameDisplay = document.getElementById('file-name-display'); // New: for truncated file name
    const fileSizeDisplay = document.getElementById('file-size-display'); // New: for formatted file size
    const saveImageButton = document.getElementById('save-image-button');
    const removeFileButton = document.getElementById('remove-file-button');

    const voiceButton = document.getElementById('voice-button');
    const MESSAGE_RATE_LIMIT = 1000; // 2 seconds between messages
    
    // State variables
    // Global variables for rate limiting
    let lastMessageTime = 0;
    let conversationHistory = [];
    let isStreaming = false;
    let currentChatId = localStorage.getItem('currentChatId') || generateId();
    let chats = JSON.parse(localStorage.getItem('chats')) || [];
    let userEmail = localStorage.getItem('userEmail') || null; // User's email, if set
    let selectedFile = null; // Currently selected file for upload
    let recognition; // Web Speech API recognition object
    let isListening = false; // State for voice input
    let isGeneratingImage = false; // Flag to indicate if an image is being generated
    let isSidebarOpen = true; // Track sidebar state for mobile toggling

    // New constants for AI context management (summarization)
    const MAX_CONVERSATION_HISTORY_CHARS = 4000; // Roughly 1000 tokens for direct history (example value)
    const SUMMARIZE_TRIGGER_CHARS = 5000; // Summarize if conversation history exceeds this many characters
    const SUMMARIZE_PROMPT_MAX_CHARS = 4000; // Max chars to send to summarization model

    /**
     * Initializes the application by setting up event listeners, loading chat history,
     * updating UI elements, and initializing speech recognition.
     */
    function init() {
        // Apply initial sidebar state based on saved state or default
        const savedSidebarState = localStorage.getItem('sidebarState');
        if (savedSidebarState === 'closed') {
            isSidebarOpen = false;
        } else {
            isSidebarOpen = true; // Default to open
        }
        updateSidebarState();

        // Register all event listeners
        userInput.addEventListener('keydown', handleInputKeydown);
        newChatButton.addEventListener('click', startNewChat);
        sidebarToggle.addEventListener('click', toggleSidebar);
        fileButton.addEventListener('click', () => fileUpload.click()); 
        fileUpload.addEventListener('change', handleFileSelect);
        removeFileButton.addEventListener('click', clearSelectedFile); // Use new button
        saveImageButton.addEventListener('click', saveImage); // New button listener
        voiceButton.addEventListener('click', toggleVoiceInput);
        summarizeButton.addEventListener('click', summarizeConversation);

        // Drag and Drop listeners for file uploads (on chat container)
        chatContainer.addEventListener('dragover', handleDragOver);
        chatContainer.addEventListener('dragleave', handleDragLeave);
        chatContainer.addEventListener('drop', handleDrop);
        // Update your event listeners (replace the old ones):
        const fileUploadContainer = document.getElementById('file-upload-container');
        fileUploadContainer.addEventListener('dragover', handleDragOver);
        fileUploadContainer.addEventListener('dragleave', handleDragLeave);
        fileUploadContainer.addEventListener('drop', handleDrop);
        // Add to your init() function:
        document.getElementById('file-upload-button').addEventListener('click', () => {
            document.getElementById('file-upload-input').click();
        });
        document.getElementById('file-upload-input').addEventListener('change', handleFileSelect);

        // Close sidebar when clicking outside on mobile overlay
        document.getElementById('sidebar-overlay').addEventListener('click', () => {
             if (window.innerWidth <= 768 && isSidebarOpen) {
                 toggleSidebar();
             }
         });

        // Load chat history and then forcefully start a new chat to show welcome message
        loadChatHistory(); // Load all existing chats into sidebar
        startNewChat1(); // Always start a fresh chat on load/reload, ensuring welcome message is visible

        // Update user account display based on stored information
        updateUserAccountDisplay();

        // Set focus to the user input field
        userInput.focus();
        
        // Initialize Web Speech API for voice input if available
        initializeSpeechRecognition();
    }

    /**
     * Toggles the visibility of the welcome message based on conversation history.
     */
    function updateChatVisibility() {
        const hasMessages = conversationHistory.length > 0;
        welcomeMessage.style.display = hasMessages ? 'none' : 'block';
    }

    /**
     * Generates a unique ID for chat sessions or other elements.
     * @returns {string} A unique ID.
     */
    function generateId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    /**
     * Toggles the sidebar visibility and saves its state to local storage.
     */
    function toggleSidebar() {
        isSidebarOpen = !isSidebarOpen;
        localStorage.setItem('sidebarState', isSidebarOpen ? 'open' : 'closed');
        updateSidebarState();
    }
    
    /**
     * Loads chat history from local storage and populates the sidebar.
     */
    function loadChatHistory() {
        // Ensure 'chats' is loaded from localStorage at the beginning
        chats = JSON.parse(localStorage.getItem('chats')) || [];
        chatHistory.innerHTML = ''; // Clear existing history in sidebar
        
        // Sort chats by last updated time (most recent first)
        chats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        
        // Create and append chat items to the sidebar
        chats.forEach(chat => {
            const chatItem = document.createElement('div');
            chatItem.className = `flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${chat.id === currentChatId ? 'bg-gray-800' : 'hover:bg-gray-800'}`;
            chatItem.innerHTML = `
                <i class="fas fa-comment"></i>
                <span class="truncate flex-1">${chat.title}</span>
                <i class="fas fa-trash text-gray-500 hover:text-red-400" onclick="deleteChat(event, '${chat.id}')"></i>
            `;
            
            // Add event listener to load chat when clicked
            chatItem.addEventListener('click', () => loadChat(chat.id));
            
            chatHistory.appendChild(chatItem);
        });
    }

    /**
     * Deletes a chat session after user confirmation.
     * @param {Event} event - The click event.
     * @param {string} chatId - The ID of the chat to delete.
     */
    function deleteChat(event, chatId) {
        event.stopPropagation(); // Prevent loading the chat when deleting

        // Create a custom confirmation dialog (instead of alert/confirm)
        const confirmDelete = document.createElement('div');
        confirmDelete.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
        confirmDelete.innerHTML = `
            <div class="bg-gray-800 p-6 rounded-lg shadow-xl text-center">
                <p class="text-white mb-4">Are you sure you want to delete this chat?</p>
                <div class="flex justify-center gap-4">
                    <button id="cancel-delete" class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Cancel</button>
                    <button id="confirm-delete" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
                </div>
            </div>
        `;
        document.body.appendChild(confirmDelete);

        // Add event listeners for confirmation buttons
        document.getElementById('cancel-delete').addEventListener('click', () => {
            confirmDelete.remove(); // Remove the dialog
        });

        document.getElementById('confirm-delete').addEventListener('click', () => {
            confirmDelete.remove(); // Remove the dialog
            
            // Filter out the deleted chat from the chats array
            chats = chats.filter(c => c.id !== chatId);
            localStorage.setItem('chats', JSON.stringify(chats));
            
            // Remove the specific chat data from local storage
            localStorage.removeItem(`chat_${chatId}`);
            
            // If the deleted chat was the currently active one, start a new chat
            if (chatId === currentChatId) {
                startNewChat();
            }
            
            // Reload the sidebar to reflect the changes
            loadChatHistory();
        });
    }
    
    function startNewChat1() {
        // Stop any ongoing streaming if a new chat is started
        if (isStreaming) {
            isStreaming = false;
            hideTypingIndicator();
        }
        
        currentChatId = generateId(); // Generate a brand new unique ID for the new chat
        currentChatTitle.textContent = 'New chat'; // Set the header title
        
        // Add the new chat entry to the beginning of the chats array in memory
        chats.unshift({
            id: currentChatId,
            title: 'New chat',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        conversationHistory = []; // Clear the in-memory conversation history
        localStorage.setItem(`chat_${currentChatId}`, JSON.stringify(conversationHistory)); // Save empty chat data to local storage
        
        welcomeMessage.style.display = 'block'; // Show the welcome message
        userInput.value = ''; // Clear the input field
        userInput.focus(); // Set focus to the input field
        adjustTextareaHeight(); // Reset textarea height
        clearSelectedFile(); // Clear any pre-selected file
        
        loadChatHistory(); // Reload sidebar to highlight the new chat and sort
        
        // Close sidebar if open on mobile devices for better user experience
        if (window.innerWidth <= 768 && isSidebarOpen) {
            toggleSidebar();
        }
    }
    /**
     * Starts a new chat session, clearing the conversation and UI.
     */
    function startNewChat() {
        // Stop any ongoing streaming if a new chat is started
        if (isStreaming) {
            isStreaming = false;
            hideTypingIndicator();
        }
        
        currentChatId = generateId(); // Generate a brand new unique ID for the new chat
        localStorage.setItem('currentChatId', currentChatId);
        currentChatTitle.textContent = 'New chat'; // Set the header title
        
        // Add the new chat entry to the beginning of the chats array in memory
        chats.unshift({
            id: currentChatId,
            title: 'New chat',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        localStorage.setItem('chats', JSON.stringify(chats)); // Save updated chats list
        
        conversationHistory = []; // Clear the in-memory conversation history
        localStorage.setItem(`chat_${currentChatId}`, JSON.stringify(conversationHistory)); // Save empty chat data to local storage
        
        chatContainer.innerHTML = ''; // Clear messages from the chat display area
        welcomeMessage.style.display = 'block'; // Show the welcome message
        userInput.value = ''; // Clear the input field
        userInput.focus(); // Set focus to the input field
        adjustTextareaHeight(); // Reset textarea height
        clearSelectedFile(); // Clear any pre-selected file
        
        loadChatHistory(); // Reload sidebar to highlight the new chat and sort
        
        // Close sidebar if open on mobile devices for better user experience
        if (window.innerWidth <= 768 && isSidebarOpen) {
            toggleSidebar();
        }
    }

    /**
     * Updates the title of the current chat session.
     * @param {string} newTitle - The new title for the chat.
     */
    function updateChatTitle(newTitle) {
        let chat = chats.find(c => c.id === currentChatId);
        if (chat) {
            chat.title = newTitle.replace(/"/g, ''); // Remove any lingering quotes
            chat.updatedAt = new Date().toISOString(); // Update timestamp
        } else {
            // Fallback: If chat not found, add it (should ideally not happen with proper flow)
            chat = {
                id: currentChatId,
                title: newTitle.replace(/"/g, ''),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            chats.unshift(chat);
        }
        localStorage.setItem('chats', JSON.stringify(chats)); // Save updated chats list
        currentChatTitle.textContent = chat.title; // Update UI
        loadChatHistory(); // Reload sidebar to reflect updated title and order
    }

    /**
     * Inserts an example query into the user input field.
     * @param {string} text - The example text to insert.
     */
    function insertExample(text) {
        userInput.value = text;
        userInput.focus();
        adjustTextareaHeight(); // Adjust textarea height for the new content
        clearSelectedFile(); // Clear any selected file
    }

    /**
     * Adjusts the height of the textarea based on its content.
     */
    function adjustTextareaHeight() {
        userInput.style.height = 'auto'; // Reset height to recalculate
        userInput.style.height = (userInput.scrollHeight) + 'px'; // Set to scroll height
        // Ensure minimum height for one line
        if (userInput.scrollHeight < 24) { // Based on min-height: 24px in CSS
            userInput.style.height = '24px';
        }
    }

    /**
     * Handles keydown events in the input field, specifically for sending messages on Enter.
     * @param {KeyboardEvent} e - The keyboard event.
     */
    function handleInputKeydown(e) {
        if (e.key === 'Enter' && !e.shiftKey) { // Send on Enter, allow Shift+Enter for new line
            e.preventDefault();
            sendMessage();
        }
    }

    /**
     * Helper function to escape HTML characters in a string.
     * Prevents user input from being interpreted as HTML.
     * @param {string} text - The text to escape.
     * @returns {string} The escaped text.
     */
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }

    /**
     * Formats raw content using Markdown and integrates special components like YouTube videos,
     * source attributions, and now Mermaid diagrams. This function also handles
     * replacing Mermaid code blocks with placeholders during initial Markdown parsing
     * and then re-inserting the proper HTML structure for rendering.
     * It also ensures all links open in a new tab and applies correct styling.
     * @param {string} content - The raw content string (can contain Markdown, URLs, Mermaid code).
     * @param {boolean} isStreaming - True if content is being streamed (affects video rendering).
     * @param {boolean} isHistory - True if content is loaded from history.
     * @returns {string} The HTML formatted content.
     */
    function formatMarkdown(content, isStreaming = false, isHistory = false) {
        // Step 1: Preserve code blocks with placeholders, and for Mermaid, prepare a container
        const codeBlocks = [];
        let codeBlockIndex = 0;
        let processedContent = content.replace(/```([a-z]*)\n([\s\S]*?)\n```/g, (match, lang, code) => {
            const placeholder = `\x01CODE_BLOCK_${codeBlockIndex}\x01`;
            const isMermaid = lang.toLowerCase().includes('mermaid');
            const diagramUniqueId = isMermaid ? `mermaid-diagram-${Date.now()}-${codeBlockIndex}` : ''; // Unique ID for diagram container

            codeBlocks.push({ lang, code, isMermaid, diagramUniqueId });
            codeBlockIndex++;
            return placeholder;
        });

        // Step 2: Normalize line breaks and paragraphs
        processedContent = processedContent
            .replace(/\r\n/g, '\n')
            .replace(/\n{3,}/g, '\n\n')
            .replace(/(\S)\n(\S)/g, '$1 $2') // Join single line breaks
            .replace(/(\S)\n\n(\S)/g, '$1\n\n$2'); // Preserve double line breaks

        // Step 3: Enhance lists and numbers
        processedContent = processedContent
            // Convert numbered lists (escaped period for regex)
            .replace(/(^|\n)(\d+)\.\s+/g, '$1$2\\. ') 
            // Convert lettered lists (escaped period for regex)
            .replace(/(^|\n)([a-z])\)\s+/gi, '$1$2\\. ')
            // Convert bullet points
            .replace(/(^|\n)[-•*]\s+/g, '$1* ')
            // Highlight standalone numbers
            .replace(/(^|\s)(\d+)(\s|$)/g, '$1<span class="highlight-number">$2</span>$3');

        // Step 4: Process with marked.js
        let formatted = marked.parse(processedContent, {
            breaks: false,
            gfm: true,
            smartLists: true,
            smartypants: true
        });

        // Step 5: Restore code blocks, and for Mermaid, add the diagram container
        codeBlocks.forEach((block, index) => {
            const escapedCode = escapeHtml(block.code);
            const langClass = block.lang ? `language-${block.lang}` : '';
            
            let codeBlockHtml = `
                <div class="code-block-wrapper">
                    <pre><code class="${langClass}" ${block.isMermaid ? `data-code-id="${block.diagramUniqueId}"` : ''}>${escapedCode}</code></pre>
            `;
            if (block.isMermaid) {
                codeBlockHtml += `<div id="${block.diagramUniqueId}" class="mermaid-diagram-container hidden"></div>`;
            }
            codeBlockHtml += `</div>`;
            formatted = formatted.replace(`\x01CODE_BLOCK_${index}\x01`, codeBlockHtml);
        });

        // Step 6: Post-process HTML for better structure
        const parser = new DOMParser();
        const doc = parser.parseFromString(formatted, 'text/html');

        // Add separators between paragraphs
        const paragraphs = doc.querySelectorAll('p');
        paragraphs.forEach((p, i) => {
            if (i > 0 && p.textContent.trim().length > 0) {
                const separator = doc.createElement('div');
                separator.className = 'message-separator';
                p.parentNode.insertBefore(separator, p);
            }
        });

        // Highlight key terms
        const highlightTerms = ['important', 'note', 'warning', 'tip', 'key', 'example'];
        doc.querySelectorAll('p, li').forEach(el => {
            let html = el.innerHTML;
            highlightTerms.forEach(term => {
                const regex = new RegExp(`(^|\\s)(${term})(?=\\s|$)`, 'gi');
                html = html.replace(regex, `$1<span class="highlight-term">$2</span>`);
            });
            el.innerHTML = html;
        });

        return doc.body.innerHTML;
    }

    /**
     * Enhances code blocks and Mermaid diagram blocks with interactive buttons.
     * Adds 'Copy' button to all code blocks.
     * Adds 'Run' button specifically for HTML code blocks.
     * Adds 'Diagram' and 'Code' toggle buttons for Mermaid blocks.
     * @param {HTMLElement} codeBlock - The `<code>` element within a `<pre>` tag.
     */
    function addCodeBlockButtons(codeBlock) {
        const preElement = codeBlock.parentElement; // The <pre> element containing the <code>
    
        // Ensure <pre> is positioned relative for button placement
        // This check is now less critical if caller filters, but good for robustness
        if (!preElement || preElement.tagName !== 'PRE') {
            console.warn("addCodeBlockButtons called with <code> not inside <pre>.", codeBlock);
            return;
        }

        // Avoid adding buttons multiple times if a header already exists
        if (preElement.querySelector('.code-header')) return; 

        // Create the header div to hold the language label and buttons
        const codeHeader = document.createElement('div');
        codeHeader.className = 'code-header';

        // Determine the language for display in the header
        let codeLanguage = 'Code';
        const classList = Array.from(codeBlock.classList); // Get all classes as an array
        const languageClass = classList.find(cls => cls.startsWith('language-'));

        if (languageClass) {
            // Extract only the language name, ignoring any extra words like 'Xml', 'Copy'
            codeLanguage = languageClass.substring('language-'.length).split(' ')[0];
            // Capitalize the first letter for display
            codeLanguage = codeLanguage.charAt(0).toUpperCase() + codeLanguage.slice(1);
        } else if (codeBlock.getAttribute('data-lang')) { // Fallback to data-lang attribute if present
            codeLanguage = codeBlock.getAttribute('data-lang').charAt(0).toUpperCase() + codeLanguage.getAttribute('data-lang').slice(1);
        }

        const languageSpan = document.createElement('span');
        languageSpan.textContent = codeLanguage; 
        codeHeader.appendChild(languageSpan);
    
        // Create a container for the buttons
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'copy-button-container'; 
    
        // Create and append the 'Copy' button (common to all code blocks)
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs flex items-center gap-1';
        copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy';
    
        copyButton.addEventListener('click', () => {
            // Copy the text content of the code block to clipboard
            navigator.clipboard.writeText(codeBlock.textContent).then(() => {
                copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!'; // Provide feedback
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy'; // Revert button text
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                copyButton.innerHTML = '<i class="fas fa-times"></i> Failed'; // Show error feedback
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy';
                }, 2000);
            });
        });
        buttonsDiv.appendChild(copyButton);
    
        // Conditional buttons based on detected language
        const isHTML = codeLanguage.toLowerCase().includes('html');
        const isMermaid = codeLanguage.toLowerCase().includes('mermaid');

        if (isHTML) {
            // Create and append 'Run' button specifically for HTML code blocks
            const runButton = document.createElement('button');
            runButton.className = 'run-button px-2 py-1 bg-green-700 text-white rounded text-xs flex items-center gap-1';
            runButton.innerHTML = '<i class="fas fa-play"></i> Run';
    
            runButton.addEventListener('click', () => {
                const htmlContent = codeBlock.textContent;
                const newWindow = window.open(); // Open a new browser window
                newWindow.document.open(); // Start writing to the new window's document
                newWindow.document.write(htmlContent); // Write the HTML content into the new document
                newWindow.document.close(); // Close the document stream to render the content
            });
            buttonsDiv.appendChild(runButton);
        } else if (isMermaid) {
            // Logic for Mermaid diagrams: toggle between diagram and code view
            const diagramId = codeBlock.getAttribute('data-code-id'); // Get the unique ID for the Mermaid container
            const mermaidDiagramContainer = document.getElementById(diagramId); // The <div> where SVG will be rendered
            
            // By default, hide the raw code block and show the diagram on final render
            // This ensures diagram is immediately visible without needing a click.
            preElement.classList.add('hidden'); // Hide the <pre> (code) block
            if (mermaidDiagramContainer) { // Check if container exists before removing hidden class
                mermaidDiagramContainer.classList.remove('hidden'); // Show the diagram container
            }


            // Render the Mermaid diagram immediately upon adding buttons
            // Ensure mermaid object is defined before calling its methods
            if (typeof mermaid !== 'undefined') {
                mermaid.render(diagramId, codeBlock.textContent)
                    .then(() => {
                        // console.log(`Mermaid diagram ${diagramId} rendered successfully.`);
                    })
                    .catch(err => {
                        console.error(`Error rendering Mermaid diagram ${diagramId}:`, err);
                        // Display error message in the diagram container if rendering fails
                        if (mermaidDiagramContainer) {
                            mermaidDiagramContainer.innerHTML = `<p style="color:red;">Error rendering diagram. Check console for details.</p>`;
                        }
                    });
            } else {
                console.error("Mermaid.js is not loaded, cannot render diagram.");
                if (mermaidDiagramContainer) {
                    mermaidDiagramContainer.innerHTML = `<p style="color:red;">Mermaid.js library not loaded. Cannot render diagram.</p>`;
                }
            }


            // Create 'Diagram' button (to show diagram view)
            const diagramButton = document.createElement('button');
            diagramButton.className = 'diagram-button px-2 py-1 bg-purple-700 text-white rounded text-xs flex items-center gap-1';
            diagramButton.innerHTML = '<i class="fas fa-project-diagram"></i> Diagram';
            diagramButton.addEventListener('click', () => {
                if (mermaidDiagramContainer) mermaidDiagramContainer.classList.remove('hidden'); // Show diagram
                preElement.classList.add('hidden'); // Hide code
            });
            buttonsDiv.appendChild(diagramButton);

            // Create 'Code' button (to show raw code view)
            const codeToggleButton = document.createElement('button');
            codeToggleButton.className = 'code-toggle-button px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs flex items-center gap-1';
            codeToggleButton.innerHTML = '<i class="fas fa-code"></i> Code';
            codeToggleButton.addEventListener('click', () => {
                if (mermaidDiagramContainer) mermaidDiagramContainer.classList.add('hidden'); // Hide diagram
                preElement.classList.remove('hidden'); // Show code
            });
            buttonsDiv.appendChild(codeToggleButton);
        }
    
        codeHeader.appendChild(buttonsDiv);
        // Insert the newly created header before the <pre> element
        preElement.insertBefore(codeHeader, codeBlock); 
    }

    /**
     * Displays a typing indicator to show that NeoDot is processing.
     */
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'group w-full assistant-message';
        typingDiv.id = 'typing-indicator-container'; // Assign an ID to easily find and remove it
        
        const messageWrapper = document.createElement('div');
        messageWrapper.className = 'flex p-4 gap-4 text-base md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl mx-auto';
        
        const avatar = document.createElement('div');
        avatar.className = 'flex-shrink-0 flex flex-col relative items-end';
        
        const avatarIcon = document.createElement('div');
        avatarIcon.className = 'w-8 h-8 rounded-full bg-green-600 flex items-center justify-center';
        avatarIcon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 7C4 5.11438 4 4.17157 4.58579 3.58579C5.17157 3 6.11438 3 8 3H16C17.8856 3 18.8284 3 19.4142 3.58579C20 4.17157 20 5.11438 20 7V15C20 16.8856 20 17.8284 19.4142 18.4142C18.8284 19 17.8856 19 16 19H8C6.11438 19 5.17157 19 4.58579 18.4142C4 17.8284 4 16.8856 4 15V7Z" fill="currentColor"/><path d="M17 12C17 14.2091 15.2091 16 13 16C10.7909 16 9 14.2091 9 12C9 9.79086 10.7909 8 13 8C15.2091 8 17 9.79086 17 12Z" fill="white"/></svg>';
        
        avatar.appendChild(avatarIcon);
        
        const messageContent = document.createElement('div');
        messageContent.className = 'relative flex-1 min-w-0 flex flex-col';
        
        const typingContent = document.createElement('div');
        typingContent.className = 'flex items-center text-gray-400';
        typingContent.innerHTML = '<span class="typing-indicator"><span></span><span></span><span></span></span> NeoDot is thinking...';
        
        messageContent.appendChild(typingContent);
        
        messageWrapper.appendChild(avatar);
        messageWrapper.appendChild(messageContent);
        
        typingDiv.appendChild(messageWrapper);
        chatContainer.appendChild(typingDiv);
        
        chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to bottom to show indicator
    }

    /**
     * Hides the typing indicator.
     */
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator-container');
        if (typingIndicator) {
            typingIndicator.remove(); // Remove the element from the DOM
        }
    }

    /**
     * Displays a temporary error message to the user.
     * @param {string} message - The error message to display.
     */
    function showError(message) {
        errorMessage.textContent = message;
        // Clear error message after 5 seconds
        setTimeout(() => {
            errorMessage.textContent = '';
        }, 5000);
    }

    /**
     * Updates the user account display in the sidebar based on stored email.
     * Uses Gravatar for avatar if email is set.
     */
    function updateUserAccountDisplay() {
        const userAccountContainer = document.querySelector('.user-account-container');
        const avatarIcon = userAccountContainer.querySelector('.avatar-icon');
        const userAccountDisplay = document.getElementById('user-account-display');
    
        const userEmail = localStorage.getItem('userEmail');
    
        if (userEmail) {
            const [username, domain] = userEmail.split('@');
            // Mask username for display (first 2 chars + '...')
            const maskedUsername = username.substring(0, 2) + '...';
            userAccountDisplay.textContent = `${maskedUsername}@${domain}`;
    
            // Generate Gravatar URL from email hash for a personalized avatar
            const emailHash = md5(userEmail.trim().toLowerCase());
            const gravatarUrl = `https://www.gravatar.com/avatar/${emailHash}?s=64&d=identicon`;
    
            avatarIcon.innerHTML = ''; // Clear existing icon
            const avatarImg = document.createElement('img');
            avatarImg.src = gravatarUrl;
            avatarImg.alt = 'User Avatar';
            avatarIcon.appendChild(avatarImg);
        } else {
            userAccountDisplay.textContent = 'Guest'; // Default for unconfigured user
            avatarIcon.innerHTML = '<i class="fas fa-user"></i>'; // Default user icon
        }
    }
    
    /**
     * Searches YouTube for videos related to a query, filters them, and returns relevant details.
     * It cycles through a list of API keys for rate limit handling.
     * @param {string} query - The search query for videos.
     * @returns {Promise<Array<Object>>} An array of video objects with id, title, thumbnail, etc.
     */
    async function searchVideos(query) {
        for (let i = 0; i < YOUTUBE_API_KEYS.length; i++) {
            const apiKey = YOUTUBE_API_KEYS[currentYoutubeApiKeyIndex];
            try {
                // Step 1: Search videos using YouTube Data API v3
                const searchResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(query)}&type=video&key=${apiKey}`);
                
                if (!searchResponse.ok) {
                    throw new Error(`YouTube Search API Error: ${searchResponse.statusText}`);
                }

                const searchData = await searchResponse.json();
                const videoIds = searchData.items.map(item => item.id.videoId).join(',');
        
                if (!videoIds) {
                    return []; // No videos found with current key, return empty array
                }

                // Step 2: Get detailed video statistics and content details for filtering
                const videoDetailsResponse = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${apiKey}`);
                
                if (!videoDetailsResponse.ok) {
                    throw new Error(`YouTube Details API Error: ${videoDetailsResponse.statusText}`);
                }

                const videoDetailsData = await videoDetailsResponse.json();
        
                // Step 3: Filter videos longer than 5 minutes (300 seconds)
                const filteredVideos = videoDetailsData.items
                    .filter(video => {
                        const duration = parseISO8601Duration(video.contentDetails.duration);
                        return duration >= 300;
                    })
                    .map(video => ({
                        id: video.id,
                        title: video.snippet.title,
                        thumbnail: video.snippet.thumbnails.high.url,
                        channel: video.snippet.channelTitle,
                        views: parseInt(video.statistics.viewCount) || 0,
                        likes: parseInt(video.statistics.likeCount) || 0,
                        duration: parseISO8601Duration(video.contentDetails.duration)
                    }))
                    .sort((a, b) => {
                        // Sort by a simple popularity score (views + 5 * likes)
                        const aScore = a.views + a.likes * 5;
                        const bScore = b.views + b.likes * 5;
                        return bScore - aScore; // Descending order
                    });
        
                // Step 4: Return a random number of videos (1 to 3) from the filtered list
                const randomCount = Math.floor(Math.random() * 3) + 1;
                return filteredVideos.slice(0, randomCount);
        
            } catch (error) {
                console.error(`Error fetching YouTube videos with key ${currentYoutubeApiKeyIndex}:`, error);
                // Cycle to the next API key on error
                currentYoutubeApiKeyIndex = (currentYoutubeApiKeyIndex + 1) % YOUTUBE_API_KEYS.length;
                if (i === YOUTUBE_API_KEYS.length - 1) { // If all keys have been tried
                    showError("Could not fetch YouTube videos. All API keys failed.");
                    return []; // Return empty if all keys failed
                }
            }
        }
        return []; // Should ideally not be reached if keys exist
    }
    
    /**
     * Helper function: Converts ISO 8601 duration string (e.g., PT6M30S) to total seconds.
     * @param {string} duration - The ISO 8601 duration string.
     * @returns {number} Total duration in seconds.
     */
    function parseISO8601Duration(duration) {
        const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        const hours = parseInt(match?.[1] || 0);
        const minutes = parseInt(match?.[2] || 0);
        const seconds = parseInt(match?.[3] || 0);
        return hours * 3600 + minutes * 60 + seconds;
    }


    /**
     * Checks if the user's input is a question or declaration about personal information
     * (name, email, password, IP) and provides a predefined response.
     * It also handles saving name/email if they meet length requirements.
     * @param {string} text - The user's input text.
     * @returns {Object|null} An object with `type` and `response` if matched, otherwise `null`.
     */
    function checkPersonalInfoQuestions(text) {
        const trimmedText = text.trim();
        const lowerCaseText = trimmedText.toLowerCase();
        
        // Predefined questions for personal info
        const nameQuestions = [
            "what's my name?", "what is my name?", "do you know my name?", "who am i?", "tell me my name"
        ];
    
        const emailQuestions = [
            "what is my email?", "what is my email address?", "do you know my email?", "tell me my email", 
            "tell my email address"
        ];
    
        const passwordQuestions = [
            "what is my password?", "what is my email password?", "please write my email password", 
            "plz tell me my email password", "plz write my email password", "please tell me my email password"
        ];
    
        // Helper to check for exact matches (case-insensitive)
        function isExactMatch(input, phrases) {
            return phrases.some(phrase => input === phrase.toLowerCase());
        }
    
        // Handle name questions
        if (isExactMatch(lowerCaseText, nameQuestions)) {
            const userName = localStorage.getItem('userName') || 'Not Set';
            return { type: 'name', response: `Your name is ${userName}` };
        }
    
        // Handle name declarations and enforce max length
        const nameDeclarationPatterns = [
            { prefix: "my name is", maxLength: 45 },
            { prefix: "i am", maxLength: 45 },
            { prefix: "call me", maxLength: 45 }
        ];
    
        for (const pattern of nameDeclarationPatterns) {
            if (lowerCaseText.startsWith(pattern.prefix)) {
                const name = trimmedText.substring(pattern.prefix.length).trim();
                
                if (name.length > 0 && name.length <= pattern.maxLength) {
                    localStorage.setItem('userName', name);
                    return { type: 'name', response: `Okay, I'll remember your name is ${name}` };
                } else if (name.length > pattern.maxLength) {
                    return { type: 'name', response: `That name is too long. Please keep it under ${pattern.maxLength} characters.` };
                }
            }
        }
    
        // Handle email questions
        if (isExactMatch(lowerCaseText, emailQuestions)) {
            const userEmail = localStorage.getItem('userEmail') || 'Not Set';
            return { type: 'email', response: `Your email is ${userEmail}` };
        }
    
        // Handle email declarations and enforce max length and validation
        const emailDeclarationPatterns = [
            { prefix: "my email is", validator: isValidEmail, maxLength: 45 },
            { separator: "email address is", validator: isValidEmail, maxLength: 45 }
        ];
    
        for (const pattern of emailDeclarationPatterns) {
            let email = '';
            if (pattern.prefix && lowerCaseText.startsWith(pattern.prefix)) {
                email = trimmedText.substring(pattern.prefix.length).trim();
            } 
            else if (pattern.separator && lowerCaseText.includes(pattern.separator)) {
                const parts = trimmedText.split(new RegExp(pattern.separator, 'i'));
                email = parts[1].trim();
            }
    
            if (email) {
                if (email.length <= pattern.maxLength && pattern.validator(email)) {
                    localStorage.setItem('userEmail', email);
                    userEmail = email;
                    updateUserAccountDisplay();
                    return { type: 'email', response: `I've stored your email address as ${email}` };
                } else if (email.length > pattern.maxLength) {
                    return { type: 'email', response: `That email address is too long. Please keep it under ${pattern.maxLength} characters.` };
                } else {
                    return { type: 'email', response: `That doesn't look like a valid email address.` };
                }
            }
        }
    
        // Handle password questions (always deny for security)
        if (passwordQuestions.some(q => 
            lowerCaseText === q.toLowerCase() || 
            (q.length > 10 && lowerCaseText.includes(q.toLowerCase())))
        ) {
            return { type: 'password', response: "I can't provide or store passwords for security reasons." };
        }
    
        return null; // No personal info question/declaration found
    }
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email) && email.length <= 100;
    }
    function sanitizeInput(input) {
        return input
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
    /**
     * Helper function to validate email format.
     * @param {string} email - The email string to validate.
     * @returns {boolean} True if the email format is valid, false otherwise.
     */


    /**
     * Generates a set of 4 images based on a keyword, preferring Pexels API
     * and falling back to Picsum.photos. Images are displayed in a responsive row.
     * @param {string} keyword - The keyword for image search.
     * @param {boolean} forceRow - If true, forces a horizontal layout even for short messages.
     * @returns {Promise<string>} HTML string containing the images.
     */
    async function generateResponseImage(keyword, forceRow = false) {
        let imagesHTML = '';
        const containerClass = 'response-image-row';
        // Apply inline style for forced row layout (e.g., for very long messages)
        const inlineStyle = forceRow ? 'flex-wrap: nowrap; overflow-x: auto;' : '';

        // First try Pexels API for higher quality images
        try {
            // NOTE: Pexels API key is a placeholder. You might need to replace it with a valid key.
            const pexelsResponse = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(keyword)}&per_page=4`, {
                headers: {
                    'Authorization': 'ggkfIINJV21BTXlHwvhEGEWZhrFptgF8QSSDZ7490XLkjlVNz8u7W0DM' 
                }
            });

            if (pexelsResponse.ok) {
                const data = await pexelsResponse.json(); 
                if (data.photos && data.photos.length >= 4) {
                    // If enough photos are returned, use them
                    for (let i = 0; i < 4; i++) {
                        const imageUrl = data.photos[i].src.medium;
                        imagesHTML += `
<div class="response-image">
    <img src="${imageUrl}" alt="${keyword.replace(/"/g, '&quot;')} ${i+1}">
</div>`;
                    }
                    return `<div class="${containerClass}" style="${inlineStyle}">${imagesHTML}</div>`;
                }
            }
        } catch (error) {
            console.error('Pexels API error:', error);
            // If Pexels API fails, fall through to Picsum.photos
        }

        // Fallback to Picsum.photos if Pexels fails or doesn't return enough images
        // Picsum.photos provides random placeholder images based on a seed.
        for (let i = 1; i <= 4; i++) {
            const imageUrl = `https://picsum.photos/seed/${encodeURIComponent(keyword + i)}/300/200`;
            imagesHTML += `
<div class="response-image">
    <img src="${imageUrl}" alt="${keyword.replace(/"/g, '&quot;')} ${i}">
</div>`;
        }

        return `<div class="${containerClass}" style="${inlineStyle}">${imagesHTML}</div>`;
    }

    /**
     * Enables user input fields and buttons, allowing interaction.
     */
    function enableInput() {
        userInput.disabled = false;
        sendButton.disabled = false;
        fileButton.disabled = false; 
        voiceButton.disabled = false; 
        summarizeButton.disabled = false; 
        userInput.focus(); // Ensure input is focused after enabling
    }

    /**
     * Disables user input fields and buttons during processing to prevent multiple submissions.
     */
    function disableInput() {
        userInput.disabled = true;
        sendButton.disabled = true;
        fileButton.disabled = true;
        voiceButton.disabled = true;
        summarizeButton.disabled = true;
    }

    /**
     * Calls either the Gemini API (for multi-modal/summarization/fallback) or DeepSeek API (for text-only).
     * @param {Array<Object>} chatHistory - The conversation history (array of {role, parts} objects).
     * @param {string} [additionalInstruction] - Optional additional instruction for the model (e.g., for title generation).
     * @param {boolean} [preferGemini=false] - If true, forces the use of Gemini Flash over DeepSeek.
     * @returns {Promise<string>} The generated text response.
     */
    async function callGeminiOrDeepSeekAPI(chatHistory, additionalInstruction = "", preferGemini = false) {
        const systemInstructionContent = 
            "You are **NeoDot**, a logical and structured chatbot created by Nepsen. " +
            "You **must always** respond as NeoDot, never as any other AI (e.g., not DeepSeek, ChatGPT, etc.). " +
            "Your responses should be concise, technically precise, and maintain a neutral tone. " +
            "If asked about your identity, respond: 'I am NeoDot, a logical code-base chatbot by Nepsen.'" +
            (additionalInstruction ? `\n\n${additionalInstruction}` : "");

        const processedHistory = chatHistory.map(msg => {
            if (msg.parts) {
                return {
                    ...msg,
                    parts: msg.parts.map(part => ({
                        ...part,
                        text: part.text ? truncateToTokens(part.text, 2000) : part.text
                    }))
                };
            }
            return msg;
        });

        // Check if any part in processedHistory has inlineData, implying a multi-modal request
        const hasInlineData = processedHistory.some(msg => msg.parts && msg.parts.some(part => part.inlineData));

        let lastDeepSeekError = null; // Store DeepSeek error
        let lastGeminiError = null;  // Store Gemini error

        if (!preferGemini && !hasInlineData) {
            console.log("Attempting to use DeepSeek (OpenRouter) for response...");
            for (let i = 0; i < DEEPSEEK_API_KEYS.length; i++) {
                const apiKey = DEEPSEEK_API_KEYS[currentDeepSeekApiKeyIndex];
                try {
                    const deepSeekMessages = processedHistory.map(msg => ({
                        role: msg.role === 'user' ? 'user' : 'assistant',
                        content: msg.parts.map(p => p.text).join('\n')
                    }));
                    
                    const deepSeekBody = {
                        model: config.deepSeekModel, // Using the new OpenRouter model format
                        messages: [{ role: "system", content: systemInstructionContent }].concat(deepSeekMessages),
                        temperature: config.temperature,
                        max_tokens: Math.min(config.maxTokens, 4096), // OpenRouter/DeepSeek R1 has different max tokens
                        stream: false
                    };

                    const response = await fetch(config.deepSeekApiEndpoint, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${apiKey}` // OpenRouter uses Bearer token
                        },
                        body: JSON.stringify(deepSeekBody)
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        const errorMessage = errorData.error?.message || response.statusText;
                        throw new Error(`DeepSeek (OpenRouter) API Error [Key ${currentDeepSeekApiKeyIndex + 1}/${DEEPSEEK_API_KEYS.length}]: ${errorMessage}`);
                    }

                    const data = await response.json();
                    if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
                        console.log("DeepSeek (OpenRouter) call successful.");
                        return data.choices[0].message.content;
                    } else {
                        throw new Error("DeepSeek (OpenRouter) response structure unexpected or empty.");
                    }

                } catch (error) {
                    console.warn(`DeepSeek (OpenRouter) attempt failed: ${error.message}`);
                    lastDeepSeekError = error;
                    currentDeepSeekApiKeyIndex = (currentDeepSeekApiKeyIndex + 1) % DEEPSEEK_API_KEYS.length;
                    if (i === DEEPSEEK_API_KEYS.length - 1) {
                        console.log("All DeepSeek (OpenRouter) API keys exhausted or failed. Falling back to Gemini Flash.");
                        break;
                    }
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }
        } else {
            console.log("Preferring Gemini Flash or inline data detected. Skipping DeepSeek.");
        }
        
        console.log("Attempting to use Gemini Flash for response...");
        // For Gemini API, the key should be empty so Canvas can inject it automatically.
        // We ensure the URL ends with `?key=` to facilitate this.
        for (let i = 0; i < GEMINI_API_KEYS.length; i++) {
            const geminiApiKey = GEMINI_API_KEYS[currentGeminiApiKeyIndex];
            const geminiApiUrl = `${config.geminiApiEndpoint}${config.geminiFlashModel}:generateContent?key=${geminiApiKey}`; 

            try {
                const headers = { 'Content-Type': 'application/json' }; 
                const geminiBody = {
                    contents: processedHistory,
                    generationConfig: {
                        temperature: config.temperature,
                        maxOutputTokens: Math.min(config.maxTokens, 8192) // Gemini has 8192 max output tokens
                    },
                    systemInstruction: {
                        parts: [{ text: systemInstructionContent }]
                    }
                };

                const response = await fetch(geminiApiUrl, {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(geminiBody)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Gemini API Error [Key ${currentGeminiApiKeyIndex + 1}/${GEMINI_API_KEYS.length}]: ${errorData.error?.message || response.statusText}`);
                }
                const data = await response.json();
                console.log("Gemini Flash call successful.");
                return data.candidates?.[0]?.content?.parts?.[0]?.text || "NeoDot couldn't generate a response.";
            } catch (error) {
                console.warn(`Gemini API attempt failed: ${error.message}`);
                lastGeminiError = error;
                currentGeminiApiKeyIndex = (currentGeminiApiKeyIndex + 1) % GEMINI_API_KEYS.length;
                if (i === GEMINI_API_KEYS.length - 1) {
                    let combinedErrorMessage = "NeoDot is currently unavailable. ";
                    if (lastDeepSeekError) {
                        combinedErrorMessage += `DeepSeek API failed with: ${lastDeepSeekError.message}. `;
                    }
                    combinedErrorMessage += `All Gemini API keys failed with: ${lastGeminiError.message}. Please check your API key setup for both or try again later.`;
                    throw new Error(combinedErrorMessage);
                }
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
        return "NeoDot is currently unavailable. All API keys failed.";
    }

    /**
     * Initiates image generation using the `imagen-3.0-generate-002` model.
     * Displays a typing indicator while processing.
     * @param {string} prompt - The text prompt for image generation.
     * @returns {Promise<string|null>} A base64 encoded image URL if successful, otherwise null.
     */
    async function generateImage(prompt) {
        isGeneratingImage = true; // Set flag
        showTypingIndicator(); // Show a generic thinking indicator
        disableInput(); // Disable input while generating

        try {
            const payload = { instances: [{ prompt: prompt }], parameters: { "sampleCount": 1 } };
            // The `imagen-3.0-generate-002` model is specifically for image generation.
            // When `apiKey` is an empty string, Canvas automatically provides the API key for this model at runtime.
            const apiKey = ""; 
            const apiUrl = `${config.geminiApiEndpoint}${config.geminiImageGenModel}:predict?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Image generation API error: ${errorData.error?.message || response.statusText}`);
            }

            const result = await response.json();
            if (result.predictions && result.predictions.length > 0 && result.predictions[0].bytesBase64Encoded) {
                return `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
            } else {
                throw new Error("Image generation response structure unexpected or empty.");
            }
        } catch (error) {
            console.error("Error generating image:", error);
            showError(`Failed to generate image: ${error.message}`);
            return null; // Return null on error
        } finally {
            isGeneratingImage = false; // Reset flag
            hideTypingIndicator(); // Hide indicator regardless of success or failure
            enableInput(); // Re-enable input
        }
    }

    /**
     * Summarizes the current conversation history using the Gemini API.
     * Displays a typing indicator during summarization.
     */
    async function summarizeConversation() {
        if (conversationHistory.length === 0) {
            showError("No conversation to summarize.");
            return;
        }

        disableInput(); // Disable input during summarization
        showTypingIndicator(); // Show typing indicator

        try {
            // Construct the conversation text from history for the summarization prompt
            let fullConversationText = "Please summarize the following conversation concisely:\n\n";
            conversationHistory.forEach(msg => {
                if (msg.parts && Array.isArray(msg.parts)) {
                    msg.parts.forEach(part => {
                        if (part.text) {
                            fullConversationText += `${msg.role.charAt(0).toUpperCase() + msg.role.slice(1)}: ${part.text}\n`;
                        }
                    });
                } else if (msg.content) { // Fallback for older history format if any
                     fullConversationText += `${msg.role.charAt(0).toUpperCase() + msg.role.slice(1)}: ${msg.content}\n`;
                }
            });

            const summaryPrompt = {
                role: "user",
                parts: [{ text: fullConversationText }]
            };

            // Force Gemini for summarization
            const summaryResponse = await callGeminiOrDeepSeekAPI([summaryPrompt], "", true); 
            
            hideTypingIndicator();
            // Add the summary as an assistant message to the chat display
            await addMessage('assistant', `✨ Here's a summary of our conversation:\n\n${summaryResponse}`);
            // Store the summary in conversation history for persistence
            conversationHistory.push({ role: 'assistant', parts: [{ text: `Summary: ${summaryResponse}` }] });
            saveConversation(); // Save updated conversation
        } catch (error) {
            console.error('Error summarizing conversation:', error);
            hideTypingIndicator();
            await addMessage('assistant', "Sorry, I couldn't summarize the conversation right now.");
            conversationHistory.push({ role: 'assistant', parts: [{ text: "Failed to summarize conversation." }] });
            saveConversation();
        } finally {
            enableInput(); // Re-enable input after operation
        }
    }

    /**
     * Streams text character by character to a given DOM element,
     * simulating a typing effect.
     * @param {HTMLElement} element - The DOM element to stream text into.
     * @param {string} text - The full text content to stream.
     * @param {number} speed = 10 - Delay in milliseconds per character.
     * @returns {Promise<void>} A promise that resolves when streaming is complete.
     */
    async function streamTextToElement(element, text, speed = 10) { 
        const charArray = text.split('');
        element.innerHTML = ''; // Clear any existing content in the element
        for (let i = 0; i < charArray.length; i++) {
            element.innerHTML += charArray[i]; // Append one character at a time
            // Ensure scrolling to bottom during animation for continuous visibility
            chatContainer.scrollTop = chatContainer.scrollHeight;
            await new Promise(resolve => setTimeout(resolve, speed)); // Pause for 'speed' milliseconds
        }
    }
    function containsMaliciousCode(input) {
        // List of dangerous patterns to block
        const dangerousPatterns = [
            /<script.*?>.*?<\/script>/gi, // Script tags
            /javascript:/gi, // JavaScript protocol
            /eval\(.*?\)/gi, // eval() calls
            /document\./gi, // Document object access
            /window\./gi, // Window object access
            /\.innerHTML/gi, // InnerHTML manipulation
            /\.outerHTML/gi, // OuterHTML manipulation
            /\.write\(/gi, // Document.write
            /\.cookie/gi, // Cookie access
            /\.localStorage/gi, // LocalStorage access
            /\.sessionStorage/gi, // SessionStorage access
            /on\w+\s*=/gi, // Event handlers (onclick, onload, etc.)
            /<\w+.*?>/gi, // Any HTML tags
            /\\x[0-9a-f]{2}/gi, // Hex encoded characters
            /\\u[0-9a-f]{4}/gi, // Unicode encoded characters
            /data:/gi, // Data URIs
            /vbscript:/gi // VBScript protocol
        ];
    
        // Check for dangerous patterns
        for (const pattern of dangerousPatterns) {
            if (pattern.test(input)) {
                return true;
            }
        }
    
        // Additional checks for encoded content
        try {
            const decodedInput = decodeURIComponent(input);
            if (decodedInput !== input) {
                for (const pattern of dangerousPatterns) {
                    if (pattern.test(decodedInput)) {
                        return true;
                    }
                }
            }
        } catch (e) {
            // If decodeURIComponent fails, it's probably not encoded
        }
    
        return false;
    }

    /**
     * Main function to handle sending messages.
     * It orchestrates user input processing, file uploads, personal info checks, 
     * image generation, knowledge retrieval, AI response generation, and UI updates.
     */
      async function sendMessage() {
          // Rate limiting check
          const now = Date.now();
          if (now - lastMessageTime < MESSAGE_RATE_LIMIT) {
              const remainingTime = Math.ceil((MESSAGE_RATE_LIMIT - (now - lastMessageTime)) / 1000); 
              showError(`Please wait ${remainingTime} more second${remainingTime !== 1 ? 's' : ''} before sending another message.`);
              return;
          }
          lastMessageTime = now;
      
          const message = userInput.value.trim()
          // Enhanced code execution blocking
          if (containsMaliciousCode(message)) {
              showError("Potentially unsafe content detected. Please rephrase your message.");
              return;
          }
          // Check if there's no message and no file selected; if so, show error and exit.
          if (!message && !selectedFile) {
              showError("Please enter a message or select a file.");
              return;
          }
      
          errorMessage.textContent = ''; // Clear any previous error messages
          disableInput(); // Disable input and buttons while processing to prevent duplicate actions
      
          // --- Image Generation Request Handling (AI generating image from text prompt) ---
          // Check if the message starts with an image generation command
          if (message.toLowerCase().startsWith("generate an image of ") || 
              message.toLowerCase().startsWith("create an image of ") || 
              message.toLowerCase().startsWith("draw a picture of ")) {
              const imagePrompt = message.substring(message.toLowerCase().indexOf(" of ") + 4).trim(); // Extract the prompt
              if (imagePrompt) {
                  addMessage('user', message); // Display user's image request message
                  userInput.value = ''; // Clear input field
                  adjustTextareaHeight(); // Reset textarea height
                  clearSelectedFile(); // Clear any attached file
                  
                  const imageUrl = await generateImage(imagePrompt); // Call the image generation API
                  if (imageUrl) {
                      // If image generation is successful, display the image in the chat
                      addMessage('assistant', `<img src="${imageUrl}" alt="${imagePrompt}" class="generated-image">`);
                      // Store the successful image generation details in conversation history
                      conversationHistory.push({ role: 'assistant', parts: [{ text: `Generated image: ${imagePrompt}` }] });
                  } else {
                      // If image generation fails, display a generic error message
                      addMessage('assistant', "Sorry, I couldn't generate that image right now.");
                      // Store the failure in conversation history
                      conversationHistory.push({ role: 'assistant', parts: [{ text: "Failed to generate image." }] });
                  }
                  saveConversation(); // Save the updated conversation state
                  enableInput(); // Re-enable input fields
                  return; // Exit the function as image generation is handled
              }
          }
      
          // --- Personal Information Handling ---
          // Check for personal information questions or declarations if no file is selected.
          // This is handled via predefined responses.
          let personalInfoResponse = null;
          // Only check personal info if there's a text message and no file attached.
          if (message && !selectedFile) { 
              personalInfoResponse = checkPersonalInfoQuestions(message);
          }
          
          if (personalInfoResponse) {
              addMessage('user', message); // Display user's personal info query
              userInput.value = ''; // Clear input
              adjustTextareaHeight(); // Adjust textarea height
              addMessage('assistant', personalInfoResponse.response); // Display NeoDot's predefined response
              // Add both user and AI messages to history for persistence
              conversationHistory.push(
                  { role: 'user', parts: [{ text: message }] },
                  { role: 'assistant', parts: [{ text: personalInfoResponse.response }] }
              );
              saveConversation(); // Save the updated conversation
              enableInput(); // Re-enable input fields
              return; // Exit the function as personal info is handled
          }
      
          // --- Standard Message Processing (for non-image/non-personal info queries) ---
          
          // Store the display content for the user's message, including the file
          let userDisplayContent = message; // Start with the text message
      
          if (selectedFile) {
              try {
                  const base64Data = await readFileAsBase64(selectedFile);
                  // Add file display to the user's message immediately
                  if (selectedFile.type.startsWith('image/')) {
                      userDisplayContent += `<div class="mt-2"><img src="data:${selectedFile.type};base64,${base64Data}" alt="Attached image" class="attached-file-preview-in-chat"></div>`;
                  } else if (selectedFile.type.startsWith('text/') || selectedFile.name.endsWith('.txt')) {
                      // For text files, read the content and display it
                      const textContent = await new Promise((resolve, reject) => {
                          const reader = new FileReader();
                          reader.onload = (e) => resolve(e.target.result);
                          reader.onerror = (error) => reject(error);
                          reader.readAsText(selectedFile);
                      });
                      userDisplayContent += `<div class="mt-2 p-2 rounded bg-gray-700 text-gray-200 text-sm overflow-x-auto max-h-48"><pre><code>${escapeHtml(textContent)}</code></pre></div>`;
                  }
                  // Note: geminiPartsForHistory already contains inlineData for the API call
              } catch (fileReadError) {
                  console.error("Error reading file for display:", fileReadError);
                  showError("Could not read file for display. Please try again.");
                  enableInput();
                  return;
              }
          }
      
          // Add the user's message (which now includes file display HTML if applicable) to the chat display
          addMessage('user', userDisplayContent);
          
          // Prepare message parts for the Gemini API call.
          const geminiPartsForHistory = [];
          if (message) {
              geminiPartsForHistory.push({ text: message });
          }
          if (selectedFile) {
              try {
                  const base64Data = await readFileAsBase64(selectedFile); 
                  geminiPartsForHistory.push({
                      inlineData: {
                          mimeType: selectedFile.type,
                          data: base64Data
                      }
                  });
              } catch (fileReadError) {
                  console.error("Error reading file:", fileReadError);
                  showError("Could not read file. Please try again.");
                  enableInput(); 
                  return;
              }
          }
      
          // Push the user's full message (with parts) to the in-memory conversation history.
          const userHistoryItem = { role: 'user', parts: geminiPartsForHistory };
          conversationHistory.push(userHistoryItem);
      
          userInput.value = ''; 
          adjustTextareaHeight(); 
          clearSelectedFile(); 
      
          showTypingIndicator(); 
      
          try {
              const isFirstMessageInNewChat = conversationHistory.length === 1 && currentChatTitle.textContent === 'New chat';
              if (isFirstMessageInNewChat && message) { 
                  try {
                      // Force Gemini Flash for title generation
                      const titleResponse = await callGeminiOrDeepSeekAPI(conversationHistory, "Generate a very short, concise, and descriptive title (3-7 words) for the following user message. Respond with just the title, no extra text, no quotes.", true);
                      updateChatTitle(titleResponse.trim().replace(/^"|"$/g, '')); 
                  } catch (titleError) {
                      console.log('Title generation failed:', titleError);
                      updateChatTitle(message.split(/\s+/).slice(0, 5).join(' ') + (message.split(/\s+/).length > 5 ? '...' : ''));
                  }
              }
      
              let effectiveConversationHistory = [...conversationHistory]; // Copy to manipulate for current API call
      
              // AI Context Management: Summarize if history is too long (for model's memory)
              // This is a premium feature ensuring the AI maintains context in long conversations efficiently.
              const currentHistoryCharLength = conversationHistory.reduce((acc, msg) => {
                  if (msg.parts && Array.isArray(msg.parts)) {
                      return acc + msg.parts.reduce((partAcc, part) => partAcc + (part.text ? part.text.length : 0), 0);
                  }
                  return acc;
              }, 0);
      
              if (currentHistoryCharLength > SUMMARIZE_TRIGGER_CHARS) {
                  console.log("History too long, attempting to generate a summary for context...");
                  // Get a segment of the conversation to send for summarization
                  let summarizationText = "";
                  let currentSummarizationChars = 0;
                  // Iterate history in reverse to get most recent parts first, but exclude the very last user message for summarization
                  // We'll append the *actual* latest user message to the summarized history later.
                  const historyForSummarization = conversationHistory.slice(0, conversationHistory.length - 1); 
      
                  for (let i = historyForSummarization.length - 1; i >= 0; i--) {
                      const msg = historyForSummarization[i];
                      let msgText = '';
                      if (msg.parts && Array.isArray(msg.parts)) {
                          msgText = msg.parts.map(part => part.text || '').join(' ').trim();
                      }
                      if (msgText.length > 0) {
                          // Prepend to maintain chronological order in the summarization prompt
                          if (currentSummarizationChars + msgText.length + "\n".length > SUMMARIZE_PROMPT_MAX_CHARS) {
                              break; // Stop if adding this message exceeds the summarization prompt limit
                          }
                          summarizationText = `${msg.role.charAt(0).toUpperCase() + msg.role.slice(1)}: ${msgText}\n` + summarizationText;
                          currentSummarizationChars += msgText.length + "\n".length;
                      }
                  }
      
                  const summarizationPromptContent = `Summarize the following conversation concisely, focusing on key topics and information exchanged. Do not include new information or greetings, just the summary:\n\n${summarizationText}`;
                  const summarizationPrompt = {
                      role: "user",
                      parts: [{ text: summarizationPromptContent }]
                  };
      
                  // The summarization call itself uses gemini-1.5-flash for speed ("5-second memory")
                  try {
                      const summary = await callGeminiOrDeepSeekAPI([summarizationPrompt], "Provide a very brief summary of the conversation. Be extremely concise.", true); // Force Gemini Flash for summarization context
                      // Construct the effective history with the summary and the latest user message
                      effectiveConversationHistory = [
                          { role: "system", parts: [{ text: `Previous conversation summary: ${summary}` }] },
                          userHistoryItem // Include the latest user message separately
                      ];
                      console.log("Conversation summarized for context:", summary);
      
                  } catch (summarizationError) {
                      console.error("Failed to summarize conversation for context:", summarizationError);
                      // If summarization fails, fall back to sending the last few messages directly
                      effectiveConversationHistory = conversationHistory.slice(Math.max(0, conversationHistory.length - 5)); // Send last 5 messages
                  }
              } else if (currentHistoryCharLength > MAX_CONVERSATION_HISTORY_CHARS) {
                  // If not long enough to trigger summarization, but still too long for ideal single turn
                  // send only a recent subset to avoid excessive token usage for shorter exchanges.
                  effectiveConversationHistory = conversationHistory.slice(Math.max(0, conversationHistory.length - 5)); // Send last 5 messages
              }
              // If history is short enough, effectiveConversationHistory remains the full history (initial copy)
      
              let videos = [];
              if (message) { 
                  try {
                      videos = await searchVideos(message) || []; 
                  } catch (videoError) {
                      console.log('Video search failed:', videoError);
                  }
              }
      
              let knowledgeResponse = null;
              if (message) { 
                  knowledgeResponse = await getKnowledgeResponse(message); 
              }
              
              let aiResponseContent = '';
              try {
                  // If selectedFile is present, force Gemini (for multi-modal capability)
                  // Otherwise, let callGeminiOrDeepSeekAPI decide (try DeepSeek first, then Gemini)
                  const rawResponse = await callGeminiOrDeepSeekAPI(effectiveConversationHistory, "", !!selectedFile);
                  aiResponseContent = enhanceTextStructure(rawResponse);
              } catch (error) {
                  console.error('AI response error:', error);
                  aiResponseContent = "I'm having trouble generating a response.";
              }
          
              let fullResponseHTML = '';
              
              // Generate images for the message if knowledge response fails
              if (!knowledgeResponse && message) {
                  const imagesHTML = await generateResponseImage(message);
                  fullResponseHTML += imagesHTML;
              } else if (knowledgeResponse) {
                  fullResponseHTML += `<div class="knowledge-container">${knowledgeResponse}</div>`;
              }
              
              // Format the AI response with proper paragraphs and lists
              fullResponseHTML += `
<div class="ai-response">
    ${aiResponseContent}
</div>`;
      
              if (videos.length > 0) {
                  fullResponseHTML += `<div class="videos-section">`;
                  videos.forEach(video => {
                      fullResponseHTML += `
<div class="video-item">
    <div class="video-container">
        <iframe src="https://www.youtube.com/embed/${video.id}" frameborder="0" allowfullscreen></iframe>
    </div>
    <div class="video-footer">
        <a href="https://www.y2mate.com/youtube/${video.id}" target="_blank" class="download-btn">
            <i class="fas fa-download"></i> Download
        </a>
                    </div>
                </div>`;
            });
            fullResponseHTML += `</div>`;
        } else if (message && !isGeneratingImage) { 
            fullResponseHTML += `<div class="no-videos">No related videos found</div>`;
        }

        if (!fullResponseHTML) { 
            fullResponseHTML = "I couldn't find any information. Please try rephrasing your question or providing a clearer file.";
        }

        hideTypingIndicator(); 

        const assistantMessageDiv = document.createElement('div');
        assistantMessageDiv.className = `group w-full assistant-message`;
        
        const messageWrapper = document.createElement('div');
        messageWrapper.className = `flex p-4 gap-4 text-base md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl mx-auto`;
        
        const avatar = document.createElement('div');
        avatar.className = `flex-shrink-0 flex flex-col relative items-end`;
        
        const avatarIcon = document.createElement('div');
        avatarIcon.className = `w-8 h-8 rounded-full bg-green-600 flex items-center justify-center`;
        avatarIcon.innerHTML = '<svg class="logo" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z" fill="var(--primary-color)"/><path d="M12 6C8.686 6 6 8.686 6 12C6 15.314 8.686 18 12 18C15.314 18 18 15.314 18 12C18 8.686 15.314 6 12 6Z" fill="white"/><path d="M12 10C10.895 10 10 10.895 10 12C10 13.105 10.895 14 12 14C13.105 14 14 13.105 14 12C14 10.895 13.105 10 12 10Z" fill="var(--primary-color)"/></svg>';
        
        avatar.appendChild(avatarIcon);
        
        const messageContent = document.createElement('div');
        messageContent.className = 'relative flex-1 min-w-0 flex flex-col';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-markdown flex-1'; // This div will hold the parsed Markdown/HTML content
        messageContent.appendChild(contentDiv);
        
        messageWrapper.appendChild(avatar);
        messageWrapper.appendChild(messageContent);
        
        assistantMessageDiv.appendChild(messageWrapper);
        chatContainer.appendChild(assistantMessageDiv); // Append the new message to the chat container
        
        const tempDivForParsing = document.createElement('div');
        tempDivForParsing.innerHTML = fullResponseHTML;
        
        let aiTextContent = '';
        const aiResponseElement = tempDivForParsing.querySelector('.ai-response');
        if (aiResponseElement) {
            aiTextContent = aiResponseElement.textContent; 
        }

        await streamTextToElement(contentDiv, aiTextContent);

        contentDiv.innerHTML = formatMarkdown(fullResponseHTML);
        
        // Only add code block buttons to <code> elements that are children of <pre>
        document.querySelectorAll('pre code').forEach((block) => {
            if (block.parentElement && block.parentElement.tagName === 'PRE') {
                hljs.highlightElement(block); 
                addCodeBlockButtons(block); 
            }
        });
        
        chatContainer.scrollTop = chatContainer.scrollHeight; 

        conversationHistory.push({ role: 'assistant', parts: [{ text: fullResponseHTML }] }); 
        saveConversation(); 
        enableInput(); 
    } catch (error) {
        console.error('Error in sendMessage:', error);
        hideTypingIndicator(); 
        addMessage('assistant', "I'm having trouble responding. Please try again later."); 
        conversationHistory.push({ role: 'assistant', parts: [{ text: "I'm having trouble responding. Please try again later." }] });
        saveConversation(); 
    } finally {
        enableInput(); 
    }
}


    // Enhanced responsive CSS for images (add once if not already present)
    // This ensures that generated images are displayed aesthetically and responsively.
    if (!document.querySelector('style#response-image-style')) {
        const style = document.createElement('style');
        style.id = 'response-image-style';
        style.textContent = `
            .response-image-row {
                display: flex;
                flex-wrap: wrap; /* Allows images to wrap to next line on smaller screens */
                gap: 10px; /* Space between images */
                justify-content: center; /* Center images in the row */
                margin-bottom: 20px;
                background: transparent; /* No background for the container */
            }
            .response-image {
                flex: 0 1 22%; /* Base flex property: allows shrinking, doesn't grow, base width 22% */
                max-width: 22%; /* Max width for desktop view (approx 4 images per row) */
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                background: transparent;
            }
            .response-image img {
                width: 100%;
                height: auto;
                display: block;
                min-height: 200px; /* Ensures a minimum height for better layout */
                object-fit: cover; /* Crops image to fit, maintaining aspect ratio */
                background: transparent;
            }
            @media (max-width: 768px) {
                .response-image {
                    flex: 0 1 30%; /* 3 images per row on tablets */
                    max-width: 30%;
                }
                .response-image img {
                    min-height: 150px;
                }
            }
            @media (max-width: 480px) {
                .response-image {
                    flex: 0 1 45%; /* 2 images per row on mobile */
                    max-width: 45%;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Retrieves knowledge-based responses from multiple free APIs (DuckDuckGo, Wikipedia, Wordnik).
     * It tries each API sequentially until a valid response is found.
     * @param {string} query - The search query for knowledge.
     * @returns {Promise<string|null>} HTML string containing the knowledge response, or null if no info found.
     */
    async function getKnowledgeResponse(query) {
        // Try DuckDuckGo Instant Answer API first (no key required)
        try {
            const ddgResponse = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`);
            if (ddgResponse.ok) {
                const data = await ddgResponse.json();
                
                if (data.AbstractText || data.RelatedTopics?.length > 0) {
                    let response = `<div class="knowledge-response">`;
                    
                    if (data.Image) {
                        // DuckDuckGo image URLs are relative, need to prepend https://duckduckgo.com
                        response += `<img src="https://duckduckgo.com${data.Image}" class="knowledge-image" alt="${data.Heading || query}">`;
                    }
                    
                    response += `<div class="knowledge-text">`;
                    
                    if (data.Heading) {
                        response += `<h3>${data.Heading}</h3>`;
                    }
                    
                    if (data.AbstractText) {
                        response += `<p>${data.AbstractText}</p>`;
                    }
                    
                    if (data.RelatedTopics?.length > 0) {
                        response += `<div class="related-topics"><h4>Related Topics:</h4><ul>`;
                        // Limit to top 3 related topics for conciseness
                        data.RelatedTopics.slice(0, 3).forEach(topic => {
                            if (topic.FirstURL && topic.Text) {
                                response += `<li><a href="${topic.FirstURL}" target="_blank">${topic.Text}</a></li>`;
                            }
                        });
                        response += `</ul></div>`;
                    }
                    
                    if (data.AbstractURL) {
                        response += `<a href="${data.AbstractURL}" target="_blank" class="source-link">Read more</a>`;
                    }
                    
                    response += `</div></div>`;
                    return response; // Return the response if found
                }
            }
        } catch (ddgError) {
            console.log('DuckDuckGo search failed:', ddgError);
            // Continue to next API if DuckDuckGo yields no results or fails
        }
    
        // Try Wikipedia API if DuckDuckGo yields no results or fails
        try {
            // Fetch a summary from Wikipedia's REST API
            const wikiResponse = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
            if (wikiResponse.ok) {
                const data = await wikiResponse.json();
                // Check for extract and ensure it's not a disambiguation page
                if (data.extract && !data.extract.includes('may refer to:')) {
                    let response = `<div class="knowledge-response">`;
                    if (data.thumbnail?.source) {
                        response += `<img src="${data.thumbnail.source}" class="knowledge-image" alt="${data.title}">`;
                    }
                    response += `<div class="knowledge-text">`;
                    response += `<h3>${data.title}</h3>`;
                    response += `<p>${data.extract}</p>`;
                    if (data.content_urls?.desktop?.page) {
                        response += `<a href="${data.content_urls.desktop.page}" target="_blank" class="source-link">Read more on Wikipedia</a>`;
                    }
                    response += `</div></div>`;
                    return response; // Return the response if found
                }
            }
        } catch (wikiError) {
            console.log('Wikipedia search failed:', wikiError);
            // Continue to next API if Wikipedia fails
        }
    
        // Try Wordnik for definitions if previous APIs yield no results or fail
        try {
            // Note: Wordnik API key usually required for production. This is a public endpoint.
            const wordnikResponse = await fetch(`https://api.wordnik.com/v4/word.json/${encodeURIComponent(query)}/definitions?limit=3&sourceDictionaries=all&useCanonical=true`);
            if (wordnikResponse.ok) {
                const definitions = await wordnikResponse.json();
                if (definitions.length > 0) {
                    let response = `<div class="knowledge-response">`;
                    response += `<div class="knowledge-text">`;
                    response += `<h3>Definition of ${query}</h3>`;
                    definitions.slice(0, 3).forEach((def, index) => {
                        response += `<p><strong>${index + 1}.</strong> ${def.text}</p>`;
                    });
                    response += `<a href="https://www.wordnik.com/words/${encodeURIComponent(query)}" target="_blank" class="source-link">More definitions</a>`;
                    response += `</div></div>`;
                    return response; // Return the response if found
                }
            }
        } catch (wordnikError) {
            console.log('Wordnik search failed:', wordnikError);
        }
        return null; // Return null if no knowledge found from any source after trying all APIs
    }

    /**
     * Adds a message (user or assistant) to the chat display.
     * Handles HTML escaping for user messages and Markdown formatting for assistant messages,
     * including streaming for new assistant messages.
     * @param {'user'|'assistant'} role - The role of the sender ('user' or 'assistant').
     * @param {string} content - The message content (raw text for user, HTML/Markdown for assistant).
     * @param {boolean} isHistory - True if the message is being loaded from history.
     * @returns {HTMLElement} The created message div element.
     */
    async function addMessage(role, content, isHistory = false) { // Made this function async
        // Hide welcome message if it's the first message being added and not from a history load.
        if (conversationHistory.length === 0 && !isHistory) {
            updateChatVisibility();
        }
    
        const messageDiv = document.createElement('div');
        // Apply different classes based on role for styling.
        messageDiv.className = `group w-full ${role === 'user' ? 'user-message' : 'assistant-message'}`;
        
        const messageWrapper = document.createElement('div');
        messageWrapper.className = `flex p-4 gap-4 text-base md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl mx-auto`;
        
        const avatar = document.createElement('div');
        avatar.className = 'flex-shrink-0 flex flex-col relative items-end';
        
        const avatarIcon = document.createElement('div');
        // Apply different background colors for user and assistant avatars.
        avatarIcon.className = `w-8 h-8 rounded-full flex items-center justify-center ${role === 'user' ? 'bg-blue-600' : 'bg-green-600'}`;
        // SVG icons for user and assistant.
        avatarIcon.innerHTML = role === 'user' ? 
            '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" fill="currentColor"/><path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" fill="currentColor"/></svg>' : 
            '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z" fill="var(--primary-color)"/><path d="M12 6C8.686 6 6 8.686 6 12C6 15.314 8.686 18 12 18C15.314 18 18 15.314 18 12C18 8.686 15.314 6 12 6Z" fill="white"/><path d="M12 10C10.895 10 10 10.895 10 12C10 13.105 10.895 14 12 14C13.105 14 14 13.105 14 12C14 10.895 13.105 10 12 10Z" fill="var(--primary-color)"/></svg>';
        
        avatar.appendChild(avatarIcon);
        
        const messageContent = document.createElement('div');
        messageContent.className = 'relative flex-1 min-w-0 flex flex-col';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-markdown flex-1'; // This div will hold the parsed Markdown/HTML content
        messageContent.appendChild(contentDiv);
        
        messageWrapper.appendChild(avatar);
        messageWrapper.appendChild(messageContent);
        
        messageDiv.appendChild(messageWrapper);
        chatContainer.appendChild(messageDiv); // Append the new message to the chat container
        
        // Handle content display based on role and whether it's a new message or from history.
        if (role === 'user' && selectedFile) {
            if (selectedFile.type.startsWith('image/')) {
                content += `<div class="file-attachment"><img src="${filePreviewThumbnail.src}" alt="Attached image"></div>`;
            } else if (selectedFile.textContent) {
                content += `<div class="file-attachment"><pre><code>${escapeHtml(selectedFile.textContent.substring(0, 500))}${selectedFile.textContent.length > 500 ? '...' : ''}</code></pre></div>`;
            }
        } else if (!isHistory && role === 'assistant') {
            // For new assistant messages (streaming):
            const tempDivForParsing = document.createElement('div');
            tempDivForParsing.innerHTML = content; // 'content' here is the `fullResponseHTML` from sendMessage

            let aiTextContent = '';
            const aiResponseElement = tempDivForParsing.querySelector('.ai-response');
            if (aiResponseElement) {
                aiTextContent = aiResponseElement.textContent; 
            }

            // 3. Stream the extracted AI's textual content character by character.
            await streamTextToElement(contentDiv, aiTextContent).then(() => {
                // 4. After streaming, replace the `contentDiv`'s innerHTML with the fully formatted HTML.
                // This ensures all complex elements (images, videos, Mermaid diagrams, formatted code) are rendered.
                contentDiv.innerHTML = formatMarkdown(content); 
                
                // 5. Apply syntax highlighting and add interactive buttons to all code blocks
                // now that they are properly in the DOM.
                document.querySelectorAll('pre code').forEach((block) => {
                    // Ensure the <code> element is actually inside a <pre> before attempting to add buttons
                    if (block.parentElement && block.parentElement.tagName === 'PRE') {
                        hljs.highlightElement(block); // Apply syntax highlighting
                        addCodeBlockButtons(block); // Add interactive buttons (Copy, Run, Diagram/Code)
                    }
                });
                messageDiv.scrollIntoView({ behavior: 'smooth' }); // Scroll to the new message
            });

        } else {
            // For historical messages or non-streaming assistant responses:
            // Render the full Markdown/HTML content directly.
            contentDiv.innerHTML = formatMarkdown(content, false, isHistory);
            // Apply syntax highlighting and add buttons immediately.
            document.querySelectorAll('pre code').forEach((block) => {
                // Ensure the <code> element is actually inside a <pre> before attempting to add buttons
                if (block.parentElement && block.parentElement.tagName === 'PRE') {
                    hljs.highlightElement(block);
                    addCodeBlockButtons(block);
                }
            });
            messageDiv.scrollIntoView({ behavior: 'smooth' }); // Scroll to the message
        }
        
        updateChatVisibility(); // Update welcome message visibility
        
        return messageDiv; // Return the created message div element
    }

    /**
     * Loads a specific chat session from local storage and displays its messages in the UI.
     * @param {string} chatId - The ID of the chat to load.
     */
    function loadChat(chatId) {
        const chat = chats.find(c => c.id === chatId);
        if (!chat) return; // Exit if the specified chat ID is not found.
    
        currentChatId = chatId; // Set the loaded chat as the current active chat.
        localStorage.setItem('currentChatId', currentChatId); // Persist the current chat ID.
        currentChatTitle.textContent = chat.title; // Update the header title with the loaded chat's title.
    
        // Retrieve the conversation history for the loaded chat from local storage.
        const chatData = JSON.parse(localStorage.getItem(`chat_${chatId}`)) || [];
        conversationHistory = chatData; // Update the in-memory conversation history.
    
        chatContainer.innerHTML = ''; // Clear all existing messages from the chat display area.
        // Iterate through each message in the loaded history and add it to the display.
        conversationHistory.forEach(msg => {
            // When loading from history, the content for assistant messages is already the full HTML string
            // that was saved. We pass it directly to `addMessage` with `isHistory = true`.
            const contentToDisplay = msg.parts && Array.isArray(msg.parts) 
                                     ? msg.parts.map(part => part.text || '').join(' ') // For user text
                                     : msg.content || ''; // For assistant's saved HTML (or old format content)
            addMessage(msg.role, contentToDisplay, true); 
        });
    
        updateChatVisibility(); // Update visibility of the welcome message based on loaded history.
    
        loadChatHistory(); // Reload the sidebar to ensure the newly loaded chat is highlighted.
        // If on a mobile device and the sidebar is open, close it for better content viewing.
        if (window.innerWidth <= 768 && isSidebarOpen) {
            toggleSidebar();
        }
    }
    
    /**
     * Saves the current conversation history to local storage.
     * Also updates the `updatedAt` timestamp for the current chat in the sidebar list,
     * ensuring that recent chats appear higher in the history list.
     */
    function saveConversation() {
        // Save the detailed conversation history of the current chat.
        localStorage.setItem(`chat_${currentChatId}`, JSON.stringify(conversationHistory));
    
        // Find the current chat in the `chats` array (which represents the sidebar history list).
        const chatIndex = chats.findIndex(c => c.id === currentChatId);
        if (chatIndex >= 0) {
            // If found, update its `updatedAt` timestamp to reflect recent activity.
            chats[chatIndex].updatedAt = new Date().toISOString(); 
        } else {
            // Fallback: If the current chat is somehow not in the `chats` array (e.g., a new chat was
            // started but not yet added to the main list due to an "edge case"), add it.
            chats.unshift({
                id: currentChatId,
                title: currentChatTitle.textContent || 'New chat', // Use current title or default
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        }
    
        // Save the updated list of all chats back to local storage.
        localStorage.setItem('chats', JSON.stringify(chats)); 
    }

    /**
     * Updates the visual state of the sidebar (open/closed) based on `isSidebarOpen`
     * and screen width. On mobile, it also manages the overlay and body scrolling.
     */
    function updateSidebarState() {
        const sidebarOverlay = document.getElementById('sidebar-overlay');
        
        if (window.innerWidth <= 768) { // Logic for mobile viewports
            if (isSidebarOpen) {
                sidebar.classList.add('sidebar-open'); // Slide sidebar into view
                sidebarOverlay.classList.add('active'); // Show overlay
                document.body.style.overflow = 'hidden'; // Prevent main body from scrolling
            } else {
                sidebar.classList.remove('sidebar-open'); // Slide sidebar out of view
                sidebarOverlay.classList.remove('active'); // Hide overlay
                document.body.style.overflow = ''; // Restore body scrolling
            }
        } else { // Logic for desktop viewports
            sidebar.style.transform = 'translateX(0)'; // Ensure sidebar is always visible on desktop
            sidebarOverlay.classList.remove('active'); // No overlay on desktop
            document.body.style.overflow = ''; // Restore body scrolling
            sidebar.classList.remove('sidebar-open'); // Remove mobile-specific class if it somehow persisted
        }
    }

    // --- File Upload and Drag & Drop Functions ---

    /**
     * Handles file selection from the file input element.
     * @param {Event} event - The change event fired when a file is selected.
     */
    function handleFileSelect(event) {
        const file = event.target.files[0]; // Get the first selected file
        if (file) {
            processFile(file); // Process the file
        }
        event.target.value = ''; // Clear the input's value to allow selecting the same file again if needed
    }

    /**
     * Handles the `dragover` event for the file drop zone.
     * Prevents default behavior to allow a drop.
     * @param {DragEvent} event - The drag event.
     */
    function handleDragOver(event) {
        event.preventDefault(); // Prevent default browser handling of the drag event
        event.stopPropagation(); // Stop event propagation
        document.getElementById('file-upload-container').classList.remove('hidden'); // Show the file preview area on drag over
        document.getElementById('file-upload-container').classList.add('drag-over');
    }

    /**
     * Handles the `dragleave` event for the file drop zone.
     * @param {DragEvent} event - The drag event.
     */
    function handleDragLeave(event) {
        event.preventDefault(); // Prevent default browser handling
        event.stopPropagation(); // Stop event propagation
        document.getElementById('file-upload-container').classList.remove('drag-over');
        // Hide the file preview area only if no file is currently selected.
        if (!selectedFile) { 
            document.getElementById('file-upload-container').classList.add('hidden');
        }
    }

    /**
     * Handles the `drop` event for the file drop zone.
     * Processes the dropped file.
     * @param {DragEvent} event - The drop event.
     */
    function handleDrop(event) {
        event.preventDefault(); // Prevent default browser handling (e.g., opening file in new tab)
        event.stopPropagation(); // Stop event propagation
        document.getElementById('file-upload-container').classList.remove('drag-over');
        document.getElementById('file-upload-container').classList.add('hidden');
        const file = event.dataTransfer.files[0]; // Get the first dropped file
        if (file) {
            processFile(file); // Process the file
        }
    }

    /**
     * Processes a file selected via input or drag-and-drop.
     * Performs validation (type, size) and sets up a preview if it's an image.
     * @param {File} file - The File object to process.
     */
    function processFile(file) {
        // Show the file preview area immediately when processing starts
        filePreviewArea.classList.remove('hidden');
        fileAttachmentPill.classList.remove('hidden');
        
        // Define accepted image MIME types for Gemini Vision API.
        const acceptedImageTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
        const isImage = acceptedImageTypes.includes(file.type);
        // Detect if it's a text file (common text MIME types or .txt extension).
        const isText = file.type.startsWith('text/') || file.name.endsWith('.txt');

        // Validate file type.
        if (!isImage && !isText) {
            showError('Unsupported file type. Please upload an image (PNG, JPEG, WEBP, GIF) or a text file.');
            clearSelectedFile(); // Clear any partial state
            return;
        }
        
        // Validate file size (e.g., max 20MB, as per Gemini API limits for inline data).
        if (file.size > 20 * 1024 * 1024) { 
            showError('File size exceeds 20MB limit. Please select a smaller file.');
            clearSelectedFile();
            return;
        }

        selectedFile = file; // Store the valid file in the `selectedFile` state variable.
        filePreviewArea.classList.remove('hidden'); // Show the file preview area wrapper.
        fileAttachmentPill.classList.remove('hidden'); // Show the pill itself.

        // Clear the file name display as per user request
        fileNameDisplay.textContent = ''; 
        // Hide the element completely as per user request
        fileNameDisplay.style.display = 'none';

        // Format file size
        const fileSizeKB = file.size / 1024;
        const fileSizeMB = fileSizeKB / 1024;
        let formattedSize;
        if (fileSizeMB >= 1) {
            formattedSize = `${fileSizeMB.toFixed(2)}MB`;
        } else {
            formattedSize = `${fileSizeKB.toFixed(2)}KB`;
        }
        fileSizeDisplay.textContent = formattedSize;


        if (isImage) {
            const reader = new FileReader();
            reader.onload = (e) => {
                filePreviewThumbnail.src = e.target.result;
                filePreviewThumbnail.classList.remove('hidden');
                fileIcon.classList.add('hidden');
                
                // Add image dimensions to preview
                const img = new Image();
                img.onload = function() {
                    fileSizeDisplay.textContent = `${formattedSize} (${this.width}×${this.height})`;
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            // For text files, show a preview of first few lines
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                const lines = content.split('\n').slice(0, 3).join('\n');
                if (content.length > 100) {
                    fileSizeDisplay.textContent = `${formattedSize} (~${Math.ceil(content.length/1000)}KB text)`;
                } else {
                    fileSizeDisplay.textContent = `${formattedSize} (${content.length} chars)`;
                }
                
                // Store the content for display in chat
                selectedFile.textContent = content;
            };
            reader.readAsText(file);
        }
    }

    /**
     * Clears the currently selected file from the UI and resets the `selectedFile` state.
     */

    /**
     * Downloads the currently displayed image from the file preview area.
     */
    function saveImage() {
        if (filePreviewThumbnail.src && !filePreviewThumbnail.classList.contains('hidden')) {
            const link = document.createElement('a');
            link.href = filePreviewThumbnail.src;
            link.download = `user_image_${Date.now()}.png`; // Suggest a filename
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            showError("No image to save.");
        }
    }


    /**
     * Reads a given File object as a Base64 encoded string.
     * This is necessary for sending image data to APIs like Gemini Vision.
     * @param {File} file - The File object to read.
     * @returns {Promise<string>} A Promise that resolves with the Base64 string (without the `data:image/...` prefix).
     */
    function readFileAsBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                // The result is a Data URL (e.g., "data:image/png;base64,iVBORw0...").
                // We split by comma to get just the Base64 part.
                resolve(reader.result.split(',')[1]);
            };
            reader.onerror = (error) => reject(error); // Reject the promise if an error occurs during reading.
            reader.readAsDataURL(file); // Start reading the file as a Data URL.
        });
    }

    // --- Voice Input (Speech-to-Text) Functions ---

    /**
     * Initializes the Web Speech API's SpeechRecognition.
     * Checks for browser support and hides the voice button if not available.
     * Sets up event listeners for the recognition process.
     */
    function initializeSpeechRecognition() {
        // Check if Web Speech API (webkitSpeechRecognition for Chrome/Edge or SpeechRecognition for others) is supported.
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            voiceButton.style.display = 'none'; // Hide the voice input button if API is not supported.
            console.warn('Web Speech API is not supported in this browser. Voice input will be unavailable.');
            return;
        }

        // Get the appropriate SpeechRecognition constructor.
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition(); // Create a new SpeechRecognition instance.
        recognition.interimResults = true; // Set to true to get live, evolving transcription results.
        recognition.continuous = false; // Set to false to stop recognition after a pause in speech.
        recognition.lang = 'en-US'; // Set the language for recognition.

        // Event handler for when speech recognition starts.
        recognition.onstart = () => {
            isListening = true; // Update listening state.
            voiceButton.classList.add('animate-pulse'); // Add a pulsating animation to the button.
            voiceButton.innerHTML = '<i class="fas fa-stop"></i>'; // Change button icon to indicate recording.
            userInput.placeholder = 'Listening... Speak now.'; // Update input field placeholder.
        };

        // Event handler for recognition results (both interim and final).
        recognition.onresult = (event) => {
            let interimTranscript = ''; // For live, incomplete transcriptions.
            let finalTranscript = ''; // For final, complete transcriptions.

            // Iterate through all results in the event.
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript; // Append to final transcript if it's a final result.
                } else {
                    interimTranscript += transcript; // Append to interim transcript for live display.
                }
            }
            // Update the input field with the final transcript (if available) or the current interim transcript.
            userInput.value = finalTranscript || interimTranscript;
            adjustTextareaHeight(); // Adjust textarea height to fit the transcribed text.
        };

        // Event handler for when speech recognition ends (either manually stopped or automatically after a pause).
        recognition.onend = () => {
            isListening = false; // Update listening state.
            voiceButton.classList.remove('animate-pulse'); // Remove the pulsating animation.
            voiceButton.innerHTML = '<i class="fas fa-microphone"></i>'; // Restore the microphone icon.
            userInput.placeholder = 'Message NeoDot...'; // Restore default placeholder.
            // If the user spoke anything (input field is not empty), send the message automatically.
            if (userInput.value.trim() !== '') {
                sendMessage(); 
            }
        };

        // Event handler for speech recognition errors.
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            isListening = false; // Reset listening state.
            voiceButton.classList.remove('animate-pulse'); // Remove animation.
            voiceButton.innerHTML = '<i class="fas fa-microphone"></i>'; // Restore icon.
            userInput.placeholder = 'Message NeoDot...'; // Restore placeholder.
            // Display a user-friendly error message.
            showError(`Voice input error: ${event.error}. Please ensure microphone access is granted.`);
        };
    }

    /**
     * Toggles voice input on/off (starts or stops speech recognition).
     * Requests microphone permissions if not already granted.
     */
    function toggleVoiceInput() {
        if (!recognition) {
            showError("Voice input is not supported by your browser.");
            return;
        }

        if (isListening) {
            recognition.stop(); // If currently listening, stop recognition.
        } else {
            // If not listening, attempt to start recognition.
            // First, request microphone media access. This will prompt the user if not already granted.
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(() => {
                    recognition.start(); // If access is granted, start speech recognition.
                })
                .catch(err => {
                    console.error('Microphone access denied:', err);
                    // Inform the user if microphone access was denied.
                    showError('Microphone access denied. Please allow microphone access to use voice input.');
                });
        }
    }
    function enhanceTextStructure(text) {
        // Split into logical sections
        const sections = text.split(/(?=\n\d+\.|\n-|\n\*|\n[A-Z][^.:!?]+[:.]|\n```)/g);
        
        let formattedText = '';
        let inCodeBlock = false;
        
        sections.forEach(section => {
            if (section.startsWith('```')) {
                inCodeBlock = !inCodeBlock;
                formattedText += section + '\n';
                return;
            }
            
            if (inCodeBlock) {
                formattedText += section;
                return;
            }
            
            // Process regular text sections
            let processedSection = section.trim();
            
            // Add spacing before headings
            if (processedSection.match(/^[A-Z][^.:!?]+[:.]$/)) {
                processedSection = '\n\n' + processedSection + '\n';
            }
            
            // Format lists
            if (processedSection.match(/^\d+\./) || processedSection.match(/^[-*]/)) {
                processedSection = processedSection.replace(/(\n)(\d+\.|\*|-)\s+/g, '$1$2 ');
            }
            
            formattedText += processedSection + '\n';
        });
        
        return formattedText.trim();
    }
    
    // Update handleDragOver to show drop zone
    function handleDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
        document.getElementById('file-upload-container').classList.remove('hidden');
        document.getElementById('file-upload-container').classList.add('drag-over');
    }

    
    // Update handleDragLeave to conditionally hide drop zone
    function handleDragLeave(event) {
        event.preventDefault();
        event.stopPropagation();
        document.getElementById('file-upload-container').classList.remove('drag-over');
        if (!selectedFile) {
            document.getElementById('file-upload-container').classList.add('hidden');
        }
    }

    
   // Update handleDrop to process file and hide drop zone
    function handleDrop(event) {
        event.preventDefault();
        event.stopPropagation();
        document.getElementById('file-upload-container').classList.remove('drag-over');
        document.getElementById('file-upload-container').classList.add('hidden');
        const file = event.dataTransfer.files[0];
        if (file) {
            processFile(file);
        }
    }

    
    // Update clearSelectedFile to properly hide everything
    function clearSelectedFile() {
        selectedFile = null;
        filePreviewArea.classList.add('hidden'); // Hide the preview area
        filePreviewThumbnail.classList.add('hidden');
        filePreviewThumbnail.src = '';
        fileIcon.classList.add('hidden');
        fileNameDisplay.textContent = '';
        fileSizeDisplay.textContent = '';
        saveImageButton.classList.add('hidden');
        document.getElementById('file-upload-container').classList.add('hidden'); // Hide drop zone
    }
    function countTokens(text) {
        // Rough estimation: 1 token ~= 4 characters
        return Math.ceil(text.length / 4);
    }
    
    function truncateToTokens(text, maxTokens) {
        const tokens = countTokens(text);
        if (tokens <= maxTokens) return text;
        
        // Truncate to maxTokens, preserving whole words
        const maxChars = maxTokens * 4;
        return text.substring(0, maxChars).replace(/\s+\S*$/, '') + '...';
    }
