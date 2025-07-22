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
    // YouTube API Keys
    const YOUTUBE_API_KEYS = [
        'AIzaSyApcT3rCOm8ExUbnkzxFKmov89xlnV9eek'
    ];
    let currentYoutubeApiKeyIndex = 0;

    // Advertisement video URLs
    const ADVERTISEMENT_URLS = [
        "https://www.youtube.com/embed/GwGTPb6J-mE?si=SSej5znhh7C1xpMs", 
        "https://www.youtube.com/embed/XgsHx_O5L4k?si=vCpucY8rq3pIJpTv",
        "https://www.youtube.com/embed/DNm3YY6TwmM?si=RCUGHYZ4swg9WESK"
    ];

    // Gemini API Keys provided by the user
    const GEMINI_API_KEYS = [
        'AIzaSyBqW56DFI4xft0GS1xk9GNPLoG6LVpr_Rs'
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
    // Create an array of ad placeholder URLs
    const adPlaceholders = [
        "https://www.youtube.com/embed/GwGTPb6J-mE?si=SSej5znhh7C1xpMs", 
        "https://www.youtube.com/embed/XgsHx_O5L4k?si=vCpucY8rq3pIJpTv",
        "https://www.youtube.com/embed/DNm3YY6TwmM?si=RCUGHYZ4swg9WESK"
    ];
    const config = {
        geminiFlashModel: "gemini-2.0-flash", // For summary, file analysis, and DeepSeek fallback
        geminiImageGenModel: "imagen-3.0-generate-002", // For image generation
        deepSeekModel: "deepseek/deepseek-r1:free", // DeepSeek model name changed to OpenRouter format
        geminiApiEndpoint: "https://generativelanguage.googleapis.com/v1beta/models/",
        deepSeekApiEndpoint: "https://openrouter.ai/api/v1/chat/completions", // OpenRouter endpoint
        temperature: 0.7,
        maxTokens: 164000, 
    };

    // Function to build prompt with memory for Pollinations.AI
    function buildPromptWithMemory(chatHistory, currentInput) {
        let formattedPrompt = '';

        // Get the last user and assistant messages
        const lastUserMsg = [...chatHistory].reverse().find(msg => msg.role === 'user');
        const lastAssistantMsg = [...chatHistory].reverse().find(msg => msg.role === 'assistant');

        if (lastUserMsg) {
            const userText = lastUserMsg.parts?.map(part => part.text || '').join(' ').trim();
            if (userText) {
                formattedPrompt += `I said: ${userText}\n`;
            }
        }

        if (lastAssistantMsg) {
            const assistantText = lastAssistantMsg.parts?.map(part => part.text || '').join(' ').trim();
            if (assistantText) {
                formattedPrompt += `You replied: ${assistantText}\n`;
            }
        }

        formattedPrompt += `Now I say: ${currentInput}`;

        return formattedPrompt;
    }

    // Main function to generate the URL and handle fallback
    async function generatePollinationsUrl(chatHistory, currentInput, model) {
        const prompt = buildPromptWithMemory(chatHistory, currentInput);
        const encodedPrompt = encodeURIComponent(prompt);

        // Check if email is too long
        if (currentInput.length > 45) {
            return 'SEND_TO_IMAGE_AI_VIDEO';
        }

        const primaryUrl = `https://text.pollinations.ai/${encodedPrompt}?model=${model}`;
        const fallbackUrl = `https://text.pollinations.ai/${encodeURIComponent(currentInput)}?model=${model}`;

        try {
            const res = await fetch(primaryUrl);
            if (!res.ok) throw new Error('Primary failed');
            return primaryUrl;
        } catch (err) {
            return fallbackUrl;
        }
    }

    // Function to speak text using Speech Synthesis API
    function speakText(text, button) {
        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            speechSynthesis.cancel();
            
            // Check if already speaking
            if (button.innerHTML.includes('stop') || button.innerHTML.includes('square')) {
                button.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="m19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>';
                const tooltip = button.querySelector('div');
                if (tooltip) tooltip.textContent = 'Listen';
                return;
            }
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.volume = 0.8;
            
            // Update button state
            button.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
            const tooltip = button.querySelector('div');
            if (tooltip) tooltip.textContent = 'Stop';
            
            // Event handlers
            utterance.onend = () => {
                button.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="m19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>';
                const tooltip = button.querySelector('div');
                if (tooltip) tooltip.textContent = 'Listen';
            };
            
            utterance.onerror = (event) => {
                console.error('Speech synthesis error:', event.error);
                button.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="m19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>';
                const tooltip = button.querySelector('div');
                if (tooltip) tooltip.textContent = 'Listen';
            };
            
            speechSynthesis.speak(utterance);
        } else {
            alert('Text-to-speech is not supported in your browser.');
        }
    }

    // Function to download conversation as PDF
    function downloadConversationAsPDF() {
        try {
            // Get all messages from the chat
            const messages = [];
            const messageElements = document.querySelectorAll('.user-message, .assistant-message');
            
            messageElements.forEach(msgEl => {
                const role = msgEl.classList.contains('user-message') ? 'User' : 'NeoDot';
                const contentEl = msgEl.querySelector('.message-markdown');
                if (contentEl) {
                    const text = contentEl.textContent || contentEl.innerText;
                    messages.push(`${role}: ${text}\n\n`);
                }
            });
            
            if (messages.length === 0) {
                alert('No conversation to download.');
                return;
            }
            
            // Create HTML content for PDF
            const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>NeoDot Conversation</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; }
        h1 { color: #00ff9d; text-align: center; }
        .message { margin-bottom: 20px; padding: 10px; border-left: 3px solid #00ff9d; }
        .user { border-left-color: #007bff; }
        .assistant { border-left-color: #00ff9d; }
        .sender { font-weight: bold; color: #333; }
        .timestamp { color: #666; font-size: 0.9em; }
    </style>
</head>
<body>
    <h1>NeoDot Conversation</h1>
    <p class="timestamp">Generated on: ${new Date().toLocaleString()}</p>
    ${messages.map((msg, index) => {
        const isUser = msg.startsWith('User:');
        const content = msg.substring(msg.indexOf(':') + 1).trim();
        return `<div class="message ${isUser ? 'user' : 'assistant'}">
            <div class="sender">${isUser ? 'User' : 'NeoDot'}:</div>
            <div>${content.replace(/\n/g, '<br>')}</div>
        </div>`;
    }).join('')}
</body>
</html>`;
            
            // Create blob and download
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `neodot-conversation-${new Date().toISOString().split('T')[0]}.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert('Error downloading conversation. Please try again.');
        }
    }

    // Function to add response action buttons at the end of assistant messages (ChatGPT/DeepSeek style)
    function addResponseActionButtons(messageContent, contentDiv) {
        const responseActionsDiv = document.createElement('div');
        responseActionsDiv.className = 'response-actions flex items-center gap-1 mt-2 opacity-0 transition-opacity duration-300';
        responseActionsDiv.style.justifyContent = 'flex-start';
        
        // Copy response button - modern minimal style
        const copyResponseBtn = document.createElement('button');
        copyResponseBtn.className = 'copy-response-btn group relative inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200';
        copyResponseBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="m4 16c-1.1 0-2-.9-2-2v-10c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
        copyResponseBtn.setAttribute('aria-label', 'Copy response');
        
        // Add tooltip
        const copyTooltip = document.createElement('div');
        copyTooltip.className = 'absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 z-50';
        copyTooltip.textContent = 'Copy';
        copyResponseBtn.appendChild(copyTooltip);
        
        copyResponseBtn.addEventListener('click', () => {
            const messageText = contentDiv.textContent || contentDiv.innerText;
            navigator.clipboard.writeText(messageText).then(() => {
                copyResponseBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-green-500"><polyline points="20,6 9,17 4,12"/></svg>';
                copyTooltip.textContent = 'Copied!';
                setTimeout(() => {
                    copyResponseBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="m4 16c-1.1 0-2-.9-2 2v-10c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
                    copyTooltip.textContent = 'Copy';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy response: ', err);
                copyResponseBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-red-500"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
                copyTooltip.textContent = 'Failed';
                setTimeout(() => {
                    copyResponseBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="m4 16c-1.1 0-2-.9-2-2v-10c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
                    copyTooltip.textContent = 'Copy';
                }, 2000);
            });
        });
        
        // Download PDF button - modern minimal style
        const downloadPdfBtn = document.createElement('button');
        downloadPdfBtn.className = 'download-pdf-btn group relative inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200';
        downloadPdfBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>';
        downloadPdfBtn.setAttribute('aria-label', 'Download conversation');
        
        const downloadTooltip = document.createElement('div');
        downloadTooltip.className = 'absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 z-50';
        downloadTooltip.textContent = 'Download';
        downloadPdfBtn.appendChild(downloadTooltip);
        
        downloadPdfBtn.addEventListener('click', () => {
            downloadConversationAsPDF();
        });
        
        // Voice button - modern minimal style
        const voiceBtn = document.createElement('button');
        voiceBtn.className = 'voice-btn group relative inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200';
        voiceBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="m19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>';
        voiceBtn.setAttribute('aria-label', 'Read aloud');
        
        const voiceTooltip = document.createElement('div');
        voiceTooltip.className = 'absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 z-50';
        voiceTooltip.textContent = 'Listen';
        voiceBtn.appendChild(voiceTooltip);
        
        voiceBtn.addEventListener('click', () => {
            speakText(contentDiv.textContent || contentDiv.innerText, voiceBtn);
        });
        
        responseActionsDiv.appendChild(copyResponseBtn);
        responseActionsDiv.appendChild(downloadPdfBtn);
        responseActionsDiv.appendChild(voiceBtn);
        messageContent.appendChild(responseActionsDiv);
        
        // Show buttons with fade-in animation after a brief delay
        setTimeout(() => {
            responseActionsDiv.style.opacity = '1';
        }, 200);
    }

    // Function to download code with appropriate file extension
    function downloadCode(codeContent, language) {
        const extensions = {
            'javascript': 'js',
            'python': 'py',
            'html': 'html',
            'css': 'css',
            'java': 'java',
            'cpp': 'cpp',
            'c': 'c',
            'php': 'php',
            'ruby': 'rb',
            'go': 'go',
            'rust': 'rs',
            'typescript': 'ts',
            'jsx': 'jsx',
            'tsx': 'tsx',
            'sql': 'sql',
            'json': 'json',
            'xml': 'xml',
            'yaml': 'yml',
            'yml': 'yml',
            'bash': 'sh',
            'shell': 'sh',
            'powershell': 'ps1',
            'markdown': 'md',
            'txt': 'txt'
        };
        
        const lang = language.toLowerCase();
        const extension = extensions[lang] || 'txt';
        const filename = `code.${extension}`;
        
        const blob = new Blob([codeContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // DOM Elements
    const chatContainer = document.getElementById('chat-container');
    const userInput = document.getElementById('user-input');
    const sendStopButton = document.getElementById('send-stop-button');
    const summarizeButton = document.getElementById('summarize-button'); 
    const errorMessage = document.getElementById('error-message');
    const welcomeMessage = document.getElementById('welcome-message');
    const newChatButtonSidebar = document.getElementById('new-chat-sidebar'); // Renamed
    const newChatButtonMinimal = document.getElementById('new-chat-minimal'); // New
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const chatHistory = document.getElementById('chat-history');
    const currentChatTitle = document.getElementById('current-chat-title');
    const userAccountDisplay = document.getElementById('user-account-display');
    const fileButton = document.getElementById('file-button');
    const fileUpload = document.getElementById('file-upload-input');
    
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
    const MESSAGE_RATE_LIMIT = 1000; // 1 second between messages
    
    // Global state for selected tool
    let currentSelectedTool = null;
    
    // Initialize tool visibility on page load
    function initializeToolVisibility() {
        currentSelectedTool = null;
        if (selectedToolView) {
            selectedToolView.classList.add('hidden');
        }
        if (closeToolButton) {
            closeToolButton.classList.add('hidden');
        }
        updateToolVisibility();
    }

    
    // 5. Input Bar (Input Bar) - New Buttons
    // Using optional chaining for elements that might not exist yet
    const clearInputButton = document.getElementById('clear-input-button');
    const emojiButton = document.getElementById('emoji-button');
    const toolsButton = document.getElementById('tools-button');
    const plusMenuButton = document.getElementById('plus-menu-button') || null;
    const toolsDropdown = document.getElementById('tools-dropdown');
    const emojiDropdown = document.getElementById('emoji-dropdown');
    const searchWebButton = document.getElementById('search-web-button');
    const voiceModeButton = document.getElementById('voice-mode-button');
    const selectedToolView = document.getElementById('selected-tool-view');
    const selectedToolName = document.getElementById('selected-tool-name');
    const closeToolButton = document.getElementById('close-tool-button');

    // Removed Plus Menu elements in favor of Tools approach

    // 3. New Settings (Settings) - Modal DOM Elements
    const settingsModal = document.getElementById('settings-modal');
    const closeSettingsButton = document.getElementById('close-settings');
    const saveSettingsButton = document.getElementById('save-settings');
    const resetToDefaultButton = document.getElementById('reset-to-default');
    const settingsSidebarButton = document.getElementById('settings-sidebar');
    const settingsMinimalButton = document.getElementById('settings-minimal');
    const settingsHeaderButton = document.getElementById('settings-header');

    const themeSelect = document.getElementById('theme-select');
    const chatbotNameInput = document.getElementById('chatbot-name');
    const inputSaveToggle = document.getElementById('input-save-toggle');
    const glassEffectToggle = document.getElementById('glass-effect-toggle');

    // 4. Background Changing (Background Changing) DOM Elements
    const backgroundColorPresets = document.getElementById('background-color-presets');
    const backgroundImageUploadArea = document.getElementById('background-image-upload-area');
    const backgroundImageInput = document.getElementById('background-image-input');
    const backgroundImagePreview = document.getElementById('background-image-preview');
    const backgroundOpacitySlider = document.getElementById('background-opacity');
    const backgroundBlurSlider = document.getElementById('background-blur');
    const clearBackgroundButton = document.getElementById('clear-background-button');

    // 1. Theme (Theme) - Top Navigation Bar Theme Toggle Button
    const themeToggleButton = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

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
    let isSidebarOpen = false; // 2. Sidebar (Sidebar) - Hidden by default on desktop.
    let stopGeneratingFlag = false; // 10. Message Stop - Stop Generating Button

    // 7. Thinking (Thinking) Upgrade - Timer
    let thinkingStartTime = 0;
    let thinkingInterval = null;

    // New constants for AI context management (summarization)
    const MAX_CONVERSATION_HISTORY_CHARS = 4000; // Roughly 1000 tokens for direct history (example value)
    const SUMMARIZE_TRIGGER_CHARS = 5000; // Summarize if conversation history exceeds this many characters
    const SUMMARIZE_PROMPT_MAX_CHARS = 4000; // Max chars to send to summarization model

    // Default settings
    const defaultSettings = {
        theme: 'auto',
        chatbotName: 'NeoDot',
        inputSave: true, // Whether to save input text between sessions
        glassEffect: 'auto', // auto, on, off
        background: {
            type: 'none', // 'none', 'color', 'image'
            value: '', // hex color or base64 image URL
            opacity: 1,
            blur: 0,
            images: [] // For multiple background images
        }
    };
    let currentSettings = { ...defaultSettings };

    /**
     * Initializes the application by setting up event listeners, loading chat history,
     * updating UI elements, and initializing speech recognition.
     */
    function init() {
        // Load settings from localStorage or use defaults
        loadSettings();
        applySettings();

        // Apply initial sidebar state based on saved state or default
        const savedSidebarState = localStorage.getItem('sidebarState');
        if (savedSidebarState === 'open') { // Desktop default is closed, so only open if explicitly saved as open
            isSidebarOpen = true;
        } else {
            isSidebarOpen = false; // Default to closed on desktop
        }
        updateSidebarState();

        // Initialize tool visibility
        initializeToolVisibility();

        // Register all event listeners
        userInput.addEventListener('keydown', handleInputKeydown);
        // Don't hide welcome message on input - only hide after sending first message
        userInput.addEventListener('input', () => {
            // Only update visibility based on conversation history, not input content
            updateChatVisibility();
            // Save input state as user types
            saveInputState();
        });

        newChatButtonSidebar.addEventListener('click', startNewChat);
        newChatButtonMinimal.addEventListener('click', startNewChat); // New
        sidebarToggle.addEventListener('click', toggleSidebar);
        fileButton.addEventListener('click', () => fileUpload.click()); 
        fileUpload.addEventListener('change', handleFileSelect);
        removeFileButton.addEventListener('click', clearSelectedFile); // Use new button
        saveImageButton.addEventListener('click', saveImage); // New button listener
        voiceButton.addEventListener('click', toggleVoiceInput);
        summarizeButton.addEventListener('click', summarizeConversation);
        clearInputButton.addEventListener('click', clearInput); // 5. Input Bar (Input Bar) - New Button
        
        // Tools menu functionality
        if (toolsButton) toolsButton.addEventListener('click', toggleToolsMenu);
        if (emojiButton) emojiButton.addEventListener('click', toggleEmojiDropdown);
        
        // Set up single handler for search button
        if (searchWebButton) {
            // Remove any existing listeners (just to be safe)
            searchWebButton.replaceWith(searchWebButton.cloneNode(true));
            // Get fresh reference and add single listener
            const freshSearchButton = document.getElementById('search-web-button');
            if (freshSearchButton) {
                freshSearchButton.addEventListener('click', handleWebSearch);
            }
        }
        
        // Close tool button - Replace with a fresh listener to prevent multiple triggers
        if (closeToolButton) {
            closeToolButton.replaceWith(closeToolButton.cloneNode(true));
            const freshCloseButton = document.getElementById('close-tool-button');
            if (freshCloseButton) {
                freshCloseButton.addEventListener('click', closeSelectedTool);
            }
        }
        
        // Tool selection is now handled directly in handleWebSearch
        // No need for separate listeners that might conflict
        
        const summarizeBtn = document.getElementById('summarize-button');
        if (summarizeBtn) {
            summarizeBtn.addEventListener('click', () => {
                showSelectedTool('Summary');
            });
        }
        
        const createImageButton = document.getElementById('create-image-button');
        if (createImageButton) {
            createImageButton.addEventListener('click', () => {
                showSelectedTool('Create Image');
                setGenerateImageMode(); // Add image generation mode
            });
        }
        
        // Emoji selection
        document.querySelectorAll('.emoji-option').forEach(emoji => {
            emoji.addEventListener('click', () => {
                userInput.value += emoji.textContent;
                adjustTextareaHeight();
                hideEmojiDropdown();
                userInput.focus();
            });
        });
        
        // Voice Mode button event listener
        voiceModeButton.addEventListener('click', () => {
            openVoiceMode();
            hideToolsMenu();
        });

        // Removed Plus Menu event listeners in favor of Tools approach
        


        // Combined Send/Stop button
        sendStopButton.addEventListener('click', handleSendStop);


        // 3. New Settings (Settings) - Modal Event Listeners
        settingsSidebarButton.addEventListener('click', openSettingsModal);
        settingsMinimalButton.addEventListener('click', openSettingsModal);
        settingsHeaderButton.addEventListener('click', openSettingsModal);
        closeSettingsButton.addEventListener('click', closeSettingsModal);
        saveSettingsButton.addEventListener('click', saveSettings);
        resetToDefaultButton.addEventListener('click', resetSettingsToDefault);

        // Glass effect toggle
        glassEffectToggle.addEventListener('change', () => {
            currentSettings.glassEffect = glassEffectToggle.checked ? 'on' : 'off';
            applyGlassEffect();
        });

        // 4. Background Changing (Background Changing) Event Listeners
        setupBackgroundColorPresets();
        backgroundImageUploadArea.addEventListener('click', () => backgroundImageInput.click());
        backgroundImageInput.addEventListener('change', handleBackgroundImageSelect);
        clearBackgroundButton.addEventListener('click', clearBackground);
        backgroundOpacitySlider.addEventListener('input', updateBackgroundLivePreview);
        backgroundBlurSlider.addEventListener('input', updateBackgroundLivePreview);

        // 1. Theme (Theme) - Top Navigation Bar Theme Toggle Button
        themeToggleButton.addEventListener('click', toggleTheme);

        // Drag and Drop listeners for file uploads (on chat container)
        chatContainer.addEventListener('dragover', handleDragOver);
        chatContainer.addEventListener('dragleave', handleDragLeave);
        chatContainer.addEventListener('drop', handleDrop);
        const fileUploadContainer = document.getElementById('file-upload-container');
        fileUploadContainer.addEventListener('dragover', handleDragOver);
        fileUploadContainer.addEventListener('dragleave', handleDragLeave);
        fileUploadContainer.addEventListener('drop', handleDrop);
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

        // Close chat menus when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.chat-menu-button')) {
                document.querySelectorAll('.chat-menu-dropdown.active').forEach(menu => {
                    menu.classList.remove('active');
                });
            }
        });
        
        // Add clipboard paste functionality
        initializeClipboardPaste();

        // 9. Input Text Save/Restore
        window.addEventListener('beforeunload', saveInputState);
        restoreInputState();
        
        // 10. URL Parameter Detection for ?text={message}
        const urlParams = new URLSearchParams(window.location.search);
        const userText = urlParams.get("text");
        if (userText) {
            // Set the message in the input field
            const userInput = document.getElementById('user-input');
            if (userInput) {
                userInput.value = userText;
                adjustTextareaHeight(); // Adjust height if needed
                // Automatically send the message
                sendMessage();
            }
        }
        
        // Force glass effect when background image is set
        if (document.body.classList.contains('custom-background')) {
          document.getElementById('chat-container').classList.add('glass-enabled');
        }
    }

    /**
     * Tools Menu Functions
     */
    function toggleToolsMenu() {
        if (toolsDropdown) {
            toolsDropdown.classList.toggle('hidden');
            if (!toolsDropdown.classList.contains('hidden')) {
                hideEmojiDropdown(); // Close emoji dropdown if open
            }
        }
    }
    
    function hideToolsMenu() {
        if (toolsDropdown) {
            toolsDropdown.classList.add('hidden');
        }
    }
    
    function showSelectedTool(toolName) {
        // Set the global state
        currentSelectedTool = toolName;
        
        // Update the UI elements if they exist
        if (selectedToolView && selectedToolName) {
            // Make tool view visible
            selectedToolView.classList.remove('hidden');
            
            // Set the tool name text
            selectedToolName.textContent = toolName;
            
            // Update placeholder text based on tool
            if (userInput) {
                switch(toolName) {
                    case 'Web Search':
                        userInput.placeholder = "Enter search query...";
                        break;
                    case 'Create Image':
                        userInput.placeholder = "Describe an image ...";
                        break;
                    case 'Summary':
                        userInput.placeholder = "Summarizing conversation...";
                        break;
                    default:
                        userInput.placeholder = "Message NeoDot...";
                }
            }
            
            // Hide dropdown menus
            hideToolsMenu();
            
            // Update visibility of related UI elements
            updateToolVisibility();
            
            // Focus the input for better UX
            if (userInput) userInput.focus();
        }
    }
    
    function closeSelectedTool() {
        // Set tool state to null immediately
        currentSelectedTool = null;
        
        // Perform immediate UI updates without relying on updateToolVisibility
        if (selectedToolView) {
            selectedToolView.classList.add('hidden');
        }
        
        if (selectedToolName) {
            selectedToolName.textContent = '';
        }
        
        if (closeToolButton) {
            closeToolButton.classList.add('hidden');
        }
        
        // Additional safety: ensure tool data attribute is cleared
        if (userInput) {
            delete userInput.dataset.mode;
            userInput.placeholder = "Message NeoDot..."; // Reset placeholder text
        }
        
        // Finally call updateToolVisibility to ensure consistency
        updateToolVisibility();
        
        // Force a UI update with a minimal timeout
        setTimeout(() => {
            updateSendButton();
        }, 0);
    }

    function updateToolVisibility() {
        // First check if the elements exist
        if (!selectedToolView || !closeToolButton) return;
        
        // Then check the current tool state
        if (currentSelectedTool) {
            // Tool is active - show the UI components
            selectedToolView.classList.remove('hidden');
            closeToolButton.classList.remove('hidden');
        } else {
            // No active tool - hide the UI components
            selectedToolView.classList.add('hidden');
            closeToolButton.classList.add('hidden');
        }
        
        // Ensure any tool-specific UI is reset when no tool is selected
        if (!currentSelectedTool) {
            // Reset placeholder text if no tool is selected
            if (userInput) {
                userInput.placeholder = "Message NeoDot...";
            }
        }
    }
    

    function toggleEmojiDropdown() {
        if (emojiDropdown) {
            emojiDropdown.classList.toggle('hidden');
        }
    }
    
    function hideEmojiDropdown() {
        if (emojiDropdown) {
            emojiDropdown.classList.add('hidden');
        }
    }
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (event) => {
        // Tools dropdown
        if (toolsButton && toolsDropdown && 
            !toolsButton.contains(event.target) && 
            !toolsDropdown.contains(event.target)) {
            hideToolsMenu();
        }
        
        // Emoji dropdown
        if (emojiButton && emojiDropdown && 
            !emojiButton.contains(event.target) && 
            !emojiDropdown.contains(event.target)) {
            hideEmojiDropdown();
        }
    });
    
    // Voice Input Handler
    function handleVoiceInput() {
      if (!('webkitSpeechRecognition' in window)) {
        alert('Your browser does not support Speech Recognition!');
        return;
      }
    
      const recognition = new webkitSpeechRecognition();
    
      // Use browser's language setting for "all language" support
      recognition.lang = navigator.language || 'en-US';
    
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
    
      recognition.start();
    
      recognition.onstart = () => {
        console.log('Voice recognition started...');
        voiceButton.classList.add('listening');
      };
    
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Transcript:', transcript);
        userInput.value = transcript;
        updateSendButton();
      };
    
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        alert('Speech recognition error: ' + event.error);
      };
    
      recognition.onend = () => {
        console.log('Voice recognition ended.');
        voiceButton.classList.remove('listening');
      };
    }
    /**
     * Web search functionality - improved to work like other tools
     */
    async function handleWebSearch() {
        // First check if we're already in Web Search mode
        const alreadyInWebSearchMode = (currentSelectedTool === 'Web Search');
        
        // If not already in web search mode, set it
        if (!alreadyInWebSearchMode) {
            showSelectedTool('Web Search');
            return; // Exit early - first click just sets the mode
        }
        
        // If we get here, we're already in Web Search mode, so perform the search
        const query = userInput.value.trim();
        if (!query) {
            showError("Please enter a search query first.");
            return;
        }

        // Hide welcome message
        if (welcomeMessage) {
            welcomeMessage.style.display = 'none';
        }
        
        // Set up streaming state like regular message sending
        disableInput();
        isStreaming = true;
        stopGeneratingFlag = false;
        updateSendButton();
        showTypingIndicator();
        
        try {
            // Add user message
            await addMessage('user', `🔍 Search: ${query}`);
            
            // Clear input immediately after adding user message
            userInput.value = '';
            adjustTextareaHeight();
            
            // Search with multiple sources
            const searchResults = await performWebSearch(query);
            
            hideTypingIndicator();
            
            let response = `## 🔍 Search Results for "${query}"\n\n`;
            
            if (searchResults.length > 0) {
                searchResults.forEach((result, index) => {
                    response += `### ${index + 1}. [${result.title}](${result.url})\n`;
                    response += `${result.snippet}\n\n`;
                });
                
                response += `---\n\n### 📚 **Sources:**\n`;
                searchResults.forEach((result, index) => {
                    const favicon = `https://www.google.com/s2/favicons?domain=${result.domain}&sz=16`;
                    response += `${index + 1}. ![${result.domain}](${favicon}) **${result.domain}** - [${result.title}](${result.url})\n`;
                });
            } else {
                response += "❌ No results found for your search query.";
            }
            
            await addMessage('assistant', response);
            
            // Add to conversation history
            conversationHistory.push(
                { role: 'user', parts: [{ text: `🔍 Search: ${query}` }] },
                { role: 'assistant', parts: [{ text: response }] }
            );
            saveConversation();
            
        } catch (error) {
            console.error('Search error:', error);
            hideTypingIndicator();
            await addMessage('assistant', "Sorry, I couldn't perform the web search at this moment.");
            
            // Add error to conversation history
            conversationHistory.push(
                { role: 'user', parts: [{ text: `🔍 Search: ${query}` }] },
                { role: 'assistant', parts: [{ text: "Sorry, I couldn't perform the web search at this moment." }] }
            );
            saveConversation();
        } finally {
            // Reset streaming state
            isStreaming = false;
            enableInput();
            updateSendButton();
            
            // Clear the selected tool after search is complete
            closeSelectedTool();
        }
    }

    /**
     * Perform web search using multiple APIs for better results
     */
    async function performWebSearch(query) {
        try {
            // First try DuckDuckGo Instant Answer API
            let results = [];
            
            try {
                const ddgResponse = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`);
                
                if (ddgResponse.ok) {
                    const ddgData = await ddgResponse.json();
                    
                    // Process abstract if available
                    if (ddgData.AbstractText && ddgData.AbstractURL) {
                        results.push({
                            title: ddgData.Heading || query,
                            snippet: ddgData.AbstractText,
                            url: ddgData.AbstractURL,
                            domain: new URL(ddgData.AbstractURL).hostname
                        });
                    }
                    
                    // Process related topics
                    if (ddgData.RelatedTopics && ddgData.RelatedTopics.length > 0) {
                        ddgData.RelatedTopics.slice(0, 3).forEach(topic => {
                            if (topic.FirstURL && topic.Text) {
                                results.push({
                                    title: topic.Text.split(' - ')[0] || topic.Text.substring(0, 50),
                                    snippet: topic.Text,
                                    url: topic.FirstURL,
                                    domain: new URL(topic.FirstURL).hostname
                                });
                            }
                        });
                    }
                }
            } catch (ddgError) {
                console.warn('DuckDuckGo search failed:', ddgError);
            }
            
            // If no results from DuckDuckGo, try Wikipedia
            if (results.length === 0) {
                try {
                    const wikiResponse = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
                    
                    if (wikiResponse.ok) {
                        const wikiData = await wikiResponse.json();
                        if (wikiData.extract && wikiData.content_urls) {
                            results.push({
                                title: wikiData.title,
                                snippet: wikiData.extract,
                                url: wikiData.content_urls.desktop.page,
                                domain: 'wikipedia.org'
                            });
                        }
                    }
                } catch (wikiError) {
                    console.warn('Wikipedia search failed:', wikiError);
                }
            }
            
            // If still no results, create a fallback message
            if (results.length === 0) {
                results.push({
                    title: `Search results for "${query}"`,
                    snippet: `No specific results found, but you can search for "${query}" on these platforms:`,
                    url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
                    domain: 'google.com'
                });
                
                results.push({
                    title: `${query} on Wikipedia`,
                    snippet: `Find comprehensive information about "${query}" on Wikipedia`,
                    url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query.replace(/ /g, '_'))}`,
                    domain: 'wikipedia.org'
                });
            }
            
            return results;
        } catch (error) {
            console.error('Web search failed:', error);
            // Return fallback results even on complete failure
            return [{
                title: `Search for "${query}"`,
                snippet: `Search functionality temporarily unavailable. Try searching manually.`,
                url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
                domain: 'google.com'
            }];
        }
    }

    /**
     * Image fullscreen functionality
     */
    function openImageFullscreen(imageSrc, altText) {
        const modal = document.getElementById('image-fullscreen-modal');
        const fullscreenImage = document.getElementById('fullscreen-image');
        
        fullscreenImage.src = imageSrc;
        fullscreenImage.alt = altText || 'Fullscreen Image';
        modal.classList.add('active');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    function closeImageFullscreen() {
        const modal = document.getElementById('image-fullscreen-modal');
        modal.classList.remove('active');
        
        // Restore body scroll
        document.body.style.overflow = '';
    }

    // Close fullscreen on click outside image or ESC key
    document.getElementById('image-fullscreen-modal').addEventListener('click', (e) => {
        if (e.target.id === 'image-fullscreen-modal') {
            closeImageFullscreen();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeImageFullscreen();
        }
    });

    // Removed Plus Menu functions in favor of Tools approach
    function handleSendStop() {
        const buttonMode = sendStopButton.getAttribute('data-mode');
        
        if (buttonMode === 'send' && isStreaming) {
            // If in stop mode and currently streaming, stop the generation
            stopGeneration();
        } else {
            // In all other cases, just send the message
            // This works the same on all device sizes
            sendMessage();
        }
    }
    function stopGeneration() {
        stopGeneratingFlag = false;
        isStreaming = true;
        hideTypingIndicator();
        enableInput();
        updateSendButton();
        
        // Add a message indicating generation was stopped
        const stopMessage = document.createElement('div');
        stopMessage.className = 'text-center text-sm my-2 text-[var(--text-color)] opacity-75';
        stopMessage.innerHTML = '<i class="fas fa-stop-circle"></i> Generation stopped by user';
        
        // Insert the stop message after the last message
        if (chatContainer.lastChild) {
            chatContainer.appendChild(stopMessage);
            stopMessage.scrollIntoView({ behavior: 'smooth' });
        }
    }
    function updateSendButton() {
        if (!sendStopButton) return;
        
        if (isStreaming) {
            // In streaming mode - show stop button
            sendStopButton.innerHTML = '<i class="fas fa-stop"></i>';
            sendStopButton.title = 'Stop Generating';
            sendStopButton.style.background = '#ff4d4d';
            sendStopButton.style.color = 'white';
            sendStopButton.setAttribute('data-mode', 'stop');
        } else {
            // Normal mode - show send button
            sendStopButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
            sendStopButton.title = 'Send Message';
            
            // If we're in a special tool mode, adjust button appearance
            if (currentSelectedTool) {
                switch(currentSelectedTool) {
                    case 'Web Search':
                        sendStopButton.title = 'Search';
                        break;
                    case 'Create Image':
                        sendStopButton.title = 'Generate Image';
                        break;
                    case 'Summary':
                        sendStopButton.title = 'Summarize';
                        break;
                }
            }
            
            // Normal send button appearance
            sendStopButton.style.background = 'var(--primary-color)';
            sendStopButton.style.color = '#000';
            sendStopButton.setAttribute('data-mode', 'send');
        }
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
     * 2. Sidebar (Sidebar) - Toggle Function
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
            chatItem.className = `flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${chat.id === currentChatId ? 'bg-[var(--message-user-bg)]' : 'hover:bg-[var(--message-user-bg)]'}`;
            chatItem.innerHTML = `
                <i class="fas fa-comment" style="color: var(--text-color);"></i>
                <span class="chat-title-text truncate flex-1" style="color: var(--text-color);">${chat.title}</span>
                <div class="chat-menu-button" onclick="toggleChatMenu(event, '${chat.id}')">
                    <i class="fas fa-ellipsis-v" style="color: var(--text-color); opacity: 0.7;"></i>
                    <div class="chat-menu-dropdown" id="chat-menu-${chat.id}">
                        <button class="chat-menu-item" onclick="startRenameChat(event, '${chat.id}')">
                            <i class="fas fa-edit"></i>
                            Rename
                        </button>
                        <button class="chat-menu-item delete" onclick="deleteChat(event, '${chat.id}')">
                            <i class="fas fa-trash"></i>
                            Delete
                        </button>
                    </div>
                </div>
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
    /**
     * Toggles the chat menu dropdown visibility
     * @param {Event} event - The click event
     * @param {string} chatId - The ID of the chat
     */
    function toggleChatMenu(event, chatId) {
        event.stopPropagation(); // Prevent loading the chat
        
        // Close all other open menus first
        document.querySelectorAll('.chat-menu-dropdown.active').forEach(menu => {
            if (menu.id !== `chat-menu-${chatId}`) {
                menu.classList.remove('active');
            }
        });
        
        // Toggle the clicked menu
        const menu = document.getElementById(`chat-menu-${chatId}`);
        if (menu) {
            menu.classList.toggle('active');
        }
    }
    
    /**
     * Starts the rename process for a chat
     * @param {Event} event - The click event
     * @param {string} chatId - The ID of the chat to rename
     */
    function startRenameChat(event, chatId) {
        event.stopPropagation(); // Prevent loading the chat
        
        // Close the menu
        const menu = document.getElementById(`chat-menu-${chatId}`);
        if (!menu) return; // Exit if menu not found
        
        menu.classList.remove('active');
        
        // Find the chat item and title span
        const chatItem = event.target.closest('.flex.items-center.gap-3.p-2');
        if (!chatItem) return; // Exit if chat item not found
        
        const titleSpan = chatItem.querySelector('.chat-title-text');
        if (!titleSpan) return; // Exit if title span not found
        
        const currentTitle = titleSpan.textContent;
        
        // Create rename input
        const renameContainer = document.createElement('div');
        renameContainer.className = 'chat-rename-container';
        renameContainer.innerHTML = `
            <input type="text" class="chat-rename-input" value="${currentTitle}" maxlength="50">
            <div class="chat-rename-controls">
                <button class="chat-rename-save" onclick="saveRenameChat(event, '${chatId}')">Save</button>
                <button class="chat-rename-cancel" onclick="cancelRenameChat(event, '${chatId}')">Cancel</button>
            </div>
        `;
        
        // Replace title with input
        titleSpan.style.display = 'none';
        titleSpan.insertAdjacentElement('afterend', renameContainer);
        
        // Focus and select the input
        const input = renameContainer.querySelector('.chat-rename-input');
        input.focus();
        input.select();
        
        // Handle Enter and Escape keys
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                saveRenameChat(event, chatId);
            } else if (e.key === 'Escape') {
                cancelRenameChat(event, chatId);
            }
        });
    }
    
    /**
     * Saves the new chat name
     * @param {Event} event - The click event
     * @param {string} chatId - The ID of the chat to rename
     */
    function saveRenameChat(event, chatId) {
        event.stopPropagation();
        
        const chatItem = event.target.closest('.flex.items-center.gap-3.p-2');
        if (!chatItem) return; // Exit if chat item not found
        
        const renameContainer = chatItem.querySelector('.chat-rename-container');
        if (!renameContainer) return; // Exit if rename container not found
        
        const input = renameContainer.querySelector('.chat-rename-input');
        const titleSpan = chatItem.querySelector('.chat-title-text');
        if (!input || !titleSpan) return; // Exit if elements not found
        
        const newTitle = input.value.trim();
        
        if (newTitle && newTitle !== titleSpan.textContent) {
            // Update the chat title in the data
            updateChatTitle(newTitle);
            titleSpan.textContent = newTitle;
        }
        
        // Clean up rename UI
        titleSpan.style.display = '';
        renameContainer.remove();
    }
    
    /**
     * Cancels the rename process
     * @param {Event} event - The click event
     * @param {string} chatId - The ID of the chat
     */
    function cancelRenameChat(event, chatId) {
        event.stopPropagation();
        
        const chatItem = event.target.closest('.flex.items-center.gap-3.p-2');
        if (!chatItem) return; // Exit if chat item not found
        
        const renameContainer = chatItem.querySelector('.chat-rename-container');
        const titleSpan = chatItem.querySelector('.chat-title-text');
        if (!renameContainer || !titleSpan) return; // Exit if elements not found
        
        // Clean up rename UI
        titleSpan.style.display = '';
        renameContainer.remove();
    }

    function deleteChat(event, chatId) {
        event.stopPropagation(); // Prevent loading the chat when deleting
        
        // Close the menu first
        const menu = document.getElementById(`chat-menu-${chatId}`);
        if (menu) {
            menu.classList.remove('active');
        }

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
            stopGeneration();
        }
        
        currentChatId = generateId(); // Generate a brand new unique ID for the new chat
        currentChatTitle.textContent = 'New Chat'; // Set the header title
        
        // Add the new chat entry to the beginning of the chats array in memory
        chats.unshift({
            id: currentChatId,
            title: 'New Chat',
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
    }    /**
     * Starts a new chat session, clearing the conversation and UI.
     */
    function startNewChat() {
        // Stop any ongoing streaming if a new chat is started
        if (isStreaming) {
            stopGeneration();
        }
        
        currentChatId = generateId(); // Generate a brand new unique ID for the new chat
        localStorage.setItem('currentChatId', currentChatId);
        currentChatTitle.textContent = 'New Chat'; // Set the header title
        
        // Add the new chat entry to the beginning of the chats array in memory
        chats.unshift({
            id: currentChatId,
            title: 'New Chat',
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
        
        // Restore saved input for this new chat ID
        restoreInputState();
        
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
        welcomeMessage.style.display = 'none'; // Hide welcome message when example is inserted
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
            // Enter key behavior as requested by user
            // On mobile: Enter key should always send message when clicked, regardless of streaming
            if (window.innerWidth <= 768) {
                sendMessage();
            } else {
                // On desktop: Only send if not currently streaming, to prevent multiple sends
                if (!isStreaming) {
                    sendMessage();
                }
            }
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
            .replace(/(\S)\n\n(\S)/g, '$1\n\n$2'); // Preserve double line break

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
        codeBlocks.forEach((block, index) => {
            const escapedCode = escapeHtml(block.code);
            const isMermaid = block.isMermaid;
            const diagramId = block.diagramUniqueId;
            const langClass = isMermaid ? 'mermaid' : (block.lang ? `language-${block.lang}` : '');
        
            let codeBlockHtml = `
                <div class="code-block-wrapper">
                    <pre><code class="${langClass}" ${isMermaid ? `data-code-id="${diagramId}"` : ''}>${escapedCode}</code></pre>
            `;
        
            if (isMermaid) {
                // Add Show Diagram button and hidden diagram container
                codeBlockHtml += `
                    <button class="show-diagram-btn" data-target="${diagramId}">Show Diagram</button>
                    <div id="${diagramId}" class="mermaid-diagram-container hidden"></div>
                `;
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
    
        // Create download button for all code blocks
        const downloadButton = document.createElement('button');
        downloadButton.className = 'download-button px-2 py-1 bg-blue-600 text-white rounded text-xs flex items-center gap-1';
        downloadButton.innerHTML = '<i class="fas fa-download"></i> Download';
        
        downloadButton.addEventListener('click', () => {
            downloadCode(codeBlock.textContent, codeLanguage);
        });
        buttonsDiv.appendChild(downloadButton);

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
                            mermaidDiagramContainer.innerHTML = `<p style="color:red;">Failed to render diagram. Check console for details.</p>`;
                        }
                    });
            } else {
                console.error("Mermaid.js is not loaded, cannot render diagram.");
                if (mermaidDiagramContainer) {
                    mermaidDiagramContainer.innerHTML = `<p style="color:red;">Mermaid.js library not loaded. Diagram cannot be rendered.</p>`;
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
     * 7. Thinking (Thinking) Upgrade - Typing Indicator with Timer
     * Displays a typing indicator to show that NeoDot is processing.
     */
    function showTypingIndicator() {
        hideTypingIndicator(); // Remove any existing indicator
        const typingDiv = document.createElement('div');
        typingDiv.className = 'group w-full assistant-message';
        typingDiv.id = 'typing-indicator-container'; // Assign an ID to easily find and remove it
        
        const messageWrapper = document.createElement('div');
        messageWrapper.className = 'flex p-4 gap-4 text-base md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl mx-auto message-wrapper';
        
        const avatar = document.createElement('div');
        avatar.className = 'flex-shrink-0 flex flex-col relative items-end avatar-icon';
        
        const avatarIcon = document.createElement('div');
        avatarIcon.className = 'w-8 h-8 rounded-full bg-green-600 flex items-center justify-center logo-thinking';
        avatarIcon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 7C4 5.11438 4 4.17157 4.58579 3.58579C5.17157 3 6.11438 3 8 3H16C17.8856 3 18.8284 3 19.4142 3.58579C20 4.17157 20 5.11438 20 7V15C20 16.8856 20 17.8284 19.4142 18.4142C18.8284 19 17.8856 19 16 19H8C6.11438 19 5.17157 19 4.58579 18.4142C4 17.8284 4 16.8856 4 15V7Z" fill="currentColor"/><path d="M17 12C17 14.2091 15.2091 16 13 16C10.7909 16 9 14.2091 9 12C9 9.79086 10.7909 8 13 8C15.2091 8 17 9.79086 17 12Z" fill="white"/></svg>';
        
        avatar.appendChild(avatarIcon);
        
        const messageContent = document.createElement('div');
        messageContent.className = 'relative flex-1 min-w-0 flex flex-col message-content';
        
        const typingContent = document.createElement('div');
        typingContent.className = 'flex items-center text-gray-400';
        typingContent.innerHTML = '<span class="typing-indicator"><span></span><span></span><span></span></span> NeoDot is thinking... <span id="thinking-timer">0s</span>';
        
        messageContent.appendChild(typingContent);
        
        messageWrapper.appendChild(avatar);
        messageWrapper.appendChild(messageContent);
        
        typingDiv.appendChild(messageWrapper);
        chatContainer.appendChild(typingDiv);
        
        chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to bottom to show indicator

        thinkingStartTime = Date.now();
        thinkingInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - thinkingStartTime) / 1000);
            const timerElement = document.getElementById('thinking-timer');
            if (timerElement) {
                timerElement.textContent = `${elapsed}s`;
            }
        }, 1000);
    }

    /**
     * Hides the typing indicator.
     */
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator-container');
        if (typingIndicator) {
            typingIndicator.remove(); // Remove the element from the DOM
        }
        if (thinkingInterval) {
            clearInterval(thinkingInterval);
            thinkingInterval = null;
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
        
                // Step 3: Filter videos longer than 2 minutes (120 seconds) - reduced threshold for more results
                const filteredVideos = videoDetailsData.items
                    .filter(video => {
                        const duration = parseISO8601Duration(video.contentDetails.duration);
                        return duration >= 120;
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
        
                // Step 4: Return videos with advertisement system
                // Use the ADVERTISEMENT_URLS constant defined above
                
                // Always show exactly 1 content video and 1 ad - total 2 items
                const showAd = true; // Always show ad (100% chance)
                const maxVideos = 1; // Always 1 content video
                
                // Limit content videos based on our rules
                let finalVideos = filteredVideos.slice(0, maxVideos);
                
                // Add advertisement if we should show one (30% chance)
                
                return finalVideos;
        
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
            "what's my name?", "what is my name?", "do you know my name?", "who am i?", "tell me my name",
            "আমার নাম কি?", "আমার নাম কী?", "আপনি কি আমার নাম জানেন?", "আমি কে?", "আমার নাম বলুন"
        ];
    
        const emailQuestions = [
            "what is my email?", "what is my email address?", "do you know my email?", "tell me my email", 
            "tell my email address", "আমার ইমেল কি?", "আমার ইমেল ঠিকানা কি?", "আপনি কি আমার ইমেল জানেন?", "আমার ইমেল বলুন"
        ];
    
        const passwordQuestions = [
            "what is my password?", "what is my email password?", "please write my email password", 
            "plz tell me my email password", "plz write my email password", "please tell me my email password",
            "আমার পাসওয়ার্ড কি?", "আমার ইমেল পাসওয়ার্ড কি?", "দয়া করে আমার ইমেল পাসওয়ার্ড লিখুন",
            "দয়া করে আমার ইমেল পাসওয়ার্ড বলুন"
        ];
    
        // Helper to check for exact matches (case-insensitive)
        function isExactMatch(input, phrases) {
            return phrases.some(phrase => input === phrase.toLowerCase());
        }
    
        // Handle name questions
        if (isExactMatch(lowerCaseText, nameQuestions)) {
            const userName = localStorage.getItem('userName') || 'not set';
            return { type: 'name', response: `Your name is ${userName}.` };
        }
    
        // Handle name declarations and enforce max length
        const nameDeclarationPatterns = [
            { prefix: "my name is", maxLength: 45 },
            { prefix: "i am", maxLength: 45 },
            { prefix: "call me", maxLength: 45 },
            { prefix: "আমার নাম হল", maxLength: 45 },
            { prefix: "আমি", maxLength: 45 },
            { prefix: "আমাকে ডাকুন", maxLength: 45 }
        ];
    
        for (const pattern of nameDeclarationPatterns) {
            if (lowerCaseText.startsWith(pattern.prefix)) {
                const name = trimmedText.substring(pattern.prefix.length).trim();
                
                if (name.length > 0 && name.length <= pattern.maxLength) {
                    localStorage.setItem('userName', name);
                    return { type: 'name', response: `Okay, I'll remember your name is ${name}.` };
                } else if (name.length > pattern.maxLength) {
                    return { type: 'name', response: `That name is too long. Please keep it under ${pattern.maxLength} characters.` };
                }
            }
        }
    
        // Handle email questions
        if (isExactMatch(lowerCaseText, emailQuestions)) {
            const userEmail = localStorage.getItem('userEmail') || 'not set';
            return { type: 'email', response: `Your email is ${userEmail}.` };
        }
    
        // Handle email declarations and enforce max length and validation
        const emailDeclarationPatterns = [
            { prefix: "my email is", validator: isValidEmail, maxLength: 45 },
            { separator: "email address is", validator: isValidEmail, maxLength: 45 },
            { prefix: "আমার ইমেল হল", validator: isValidEmail, maxLength: 45 },
            { separator: "ইমেল ঠিকানা হল", validator: isValidEmail, maxLength: 45 }
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
                    updateUserAccountDisplay();
                    return { type: 'email', response: `I have saved your email address as ${email}.` };
                } else if (email.length > pattern.maxLength) {
                    return { type: 'email', response: `This email address is too long. Please keep it under ${pattern.maxLength} characters.` };
                } else {
                    return { type: 'email', response: `That does not appear to be a valid email address.` };
                }
            }
        }
    
        // Handle password questions (always deny for security)
        if (passwordQuestions.some(q => 
            lowerCaseText === q.toLowerCase() || 
            (q.length > 10 && lowerCaseText.includes(q.toLowerCase())))
        ) {
            return { type: 'password', response: "I cannot provide or store passwords for security reasons." };
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
    <img src="${imageUrl}" alt="${keyword.replace(/"/g, '&quot;')} ${i+1}" onclick="openImageFullscreen('${imageUrl}', '${keyword.replace(/"/g, '&quot;')} ${i+1}')">
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
            // Generate Pollinations.ai URL with keyword and index
            const pollinationsInput = `${keyword} ${i}`.replace(/\s+/g, '-').toLowerCase();
            const imageUrl = `https://image.pollinations.ai/prompt/${pollinationsInput}`;
            
            // Create temporary image element to process watermark removal
            const tempImg = new Image();
            tempImg.crossOrigin = 'anonymous';
            tempImg.src = imageUrl;
            
            // Wait for image to load
            await new Promise((resolve) => {
                tempImg.onload = resolve;
            });
            
            // Create canvas for watermark removal
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas dimensions (cropping 5% from right and bottom)
            const cropRight = Math.min(tempImg.width * 0.05, 100) + 2; // Extra 2px
            const cropBottom = Math.min(tempImg.height * 0.05, 100) + 2; // Extra 2px
            canvas.width = tempImg.width - cropRight;
            canvas.height = tempImg.height - cropBottom;
            
            // Draw cropped image
            ctx.drawImage(
                tempImg,
                0, 0,
                canvas.width, canvas.height,
                0, 0,
                canvas.width, canvas.height
            );
            
            // Get final image URL
            const processedImageUrl = canvas.toDataURL('image/jpeg');
            
            // Add to HTML
            imagesHTML += `
        <div class="response-image">
            <img src="${processedImageUrl}" alt="${keyword.replace(/"/g, '&quot;')} ${i}" 
                 onclick="openImageFullscreen('${processedImageUrl}', '${keyword.replace(/"/g, '&quot;')} ${i}')">
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
        clearInputButton.disabled = false;
        emojiButton.disabled = false;
        if (plusMenuButton) plusMenuButton.disabled = false;
        userInput.focus(); // Ensure input is focused after enabling
        updateSendButton(); // Update button state
    }

    /**
     * Disables user input fields and buttons during processing to prevent multiple submissions.
     */

    /**
     * Calls either the Gemini API (for multi-modal/summarization/fallback) or DeepSeek API (for text-only).
     * @param {Array<Object>} chatHistory - The conversation history (array of {role, parts} objects).
     * @param {string} [additionalInstruction] - Optional additional instruction for the model (e.g., for title generation).
     * @param {boolean} [preferGemini=false] - If true, forces the use of Gemini Flash over DeepSeek.
     * @returns {Promise<string>} The generated text response.
     */
    async function callGeminiOrDeepSeekAPI(chatHistory, additionalInstruction = "", preferGemini = false) {
        // 10. Message Stop - Check flag for stopping generation
        if (stopGeneratingFlag) {
            throw new Error("Generation stopped by user.");
        }
    
        const systemInstructionContent = 
            "You are **NeoDot**, a logical and structured chatbot created by Nepsen. " +
            "You must **always** respond as NeoDot, not as any other AI (e.g., DeepSeek, ChatGPT, etc.). " +
            "Your responses should be concise, technically accurate, and in a neutral tone. " +
            "If asked about your identity, respond: 'I am NeoDot, a logical code-based chatbot created by Nepsen.'" +
            (additionalInstruction ? `\n\n${additionalInstruction}` : "");
    
        const processedHistory = chatHistory.map(msg => {
            if (msg.parts) {
                return {
                    role: msg.role,
                    parts: msg.parts.map(part => ({
                        ...part,
                        text: part.text ? truncateToTokens(part.text, 2000) : part.text
                    }))
                };
            }
            return {
                role: msg.role,
                content: msg.content
            };
        });
    
        // Check if any part in processedHistory has inlineData, implying a multi-modal request
        const hasInlineData = processedHistory.some(msg => msg.parts && msg.parts.some(part => part.inlineData));
    
        // First try to determine the appropriate model based on message content
        if (!hasInlineData && processedHistory.length > 0) {
            const lastUserMessage = processedHistory.find(msg => msg.role === 'user');
            if (lastUserMessage) {
                const userText = lastUserMessage.parts.map(p => p.text).join(' ');
                const pollinationsInput = encodeURIComponent(userText);
                
                console.log("Attempting to classify message type with Pollinations.ai...");
                try {
                    // Get classification using the specified URL format
                    const classificationUrl = `https://text.pollinations.ai/only%20say%20which%20topic%20this%20message%20belongs%20to%20from%20this%20list%3A%20Casual%20Conversation%2FLong%20Essays%20%26%20Analysis%2FCode%20Generation%20%26%20Debug%2FCreative%20Writing%2FShort%20Answers%20%26%20FAQ%2FCode%20Help%20(Dedicated).%20The%20message%20is%3A%20${pollinationsInput}?model=openai`;
                    
                    const classificationResponse = await fetch(classificationUrl);
                    
                    if (classificationResponse.ok) {
                        const classification = (await classificationResponse.text()).trim();
                        console.log("Message classified as:", classification);
                        
                        // Determine the appropriate model based on classification
                        let model;
                        switch(classification) {
                            case 'Casual Conversation':
                                model = 'openai';
                                break;
                            case 'Long Essays & Analysis':
                                model = 'openai';
                                break;
                            case 'Code Generation & Debug':
                                model = 'qwen-coder';
                                break;
                            case 'Creative Writing':
                                model = 'mistral';
                                break;
                            case 'Short Answers & FAQ':
                                model = 'phi';
                                break;
                            case 'Code Help (Dedicated)':
                                model = 'qwen-coder';
                                break;
                            default:
                                model = 'openai'; // default fallback
                        }
                        
                        console.log(`Attempting to use Pollinations.ai with model ${model}...`);
                        // Fix: use the last user message text from processed history instead of undefined userText
                        const lastUserMsg = processedHistory.find(msg => msg.role === 'user');
                        const lastUserInput = lastUserMsg ? lastUserMsg.parts.map(p => p.text || '').join(' ').trim() : '';
                        
                        // Use the new generatePollinationsUrl function
                        const urlResult = await generatePollinationsUrl(conversationHistory, lastUserInput, model);
                        
                        if (urlResult === 'SEND_TO_IMAGE_AI_VIDEO') {
                            console.warn('Prompt too long for URL, switching to image-ai-video mode');
                            throw new Error('Prompt too long');
                        }
                        
                        const response = await fetch(urlResult);
                        
                        if (response.ok) {
                            const text = await response.text();
                            if (text && text.trim().length > 0) {
                                console.log("Pollinations.ai call successful.");
                                return text;
                            }
                        }

                    }
                } catch (error) {
                    console.warn(`Pollinations.ai classification attempt failed: ${error.message}`);
                    // Continue to fallback options
                }
            }
        }
    
        // Fallback to standard API chain
        let lastDeepSeekError = null;
        let lastGeminiError = null;
    
        if (!preferGemini && !hasInlineData) {
            console.log("Attempting to use DeepSeek (OpenRouter)...");
            for (let i = 0; i < DEEPSEEK_API_KEYS.length; i++) {
                if (stopGeneratingFlag) throw new Error("Generation stopped by user.");
                const apiKey = DEEPSEEK_API_KEYS[currentDeepSeekApiKeyIndex];
                try {
                    const deepSeekMessages = processedHistory.map(msg => ({
                        role: msg.role === 'user' ? 'user' : 'assistant',
                        content: msg.parts.map(p => p.text).join('\n')
                    }));
                    
                    const deepSeekBody = {
                        model: config.deepSeekModel,
                        messages: [{ role: "system", content: systemInstructionContent }].concat(deepSeekMessages),
                        temperature: config.temperature,
                        max_tokens: Math.min(config.maxTokens, 4096),
                        stream: false
                    };
    
                    const response = await fetch(config.deepSeekApiEndpoint, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${apiKey}`
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
                        throw new Error("DeepSeek (OpenRouter) response unexpected or empty.");
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
        
        console.log("Attempting to use Gemini Flash...");
        for (let i = 0; i < GEMINI_API_KEYS.length; i++) {
            if (stopGeneratingFlag) throw new Error("Generation stopped by user.");
            const geminiApiKey = GEMINI_API_KEYS[currentGeminiApiKeyIndex];
            const geminiApiUrl = `${config.geminiApiEndpoint}${config.geminiFlashModel}:generateContent?key=${geminiApiKey}`; 
    
            try {
                const headers = { 'Content-Type': 'application/json' }; 
                const geminiBody = {
                    contents: processedHistory,
                    generationConfig: {
                        temperature: config.temperature,
                        maxOutputTokens: Math.min(config.maxTokens, 8192)
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
                return data.candidates?.[0]?.content?.parts?.[0]?.text || "NeoDot could not generate a response.";
            } catch (error) {
                console.warn(`Gemini API attempt failed: ${error.message}`);
                lastGeminiError = error;
                currentGeminiApiKeyIndex = (currentGeminiApiKeyIndex + 1) % GEMINI_API_KEYS.length;
                if (i === GEMINI_API_KEYS.length - 1) {
                    let combinedErrorMessage = "NeoDot is currently unavailable. ";
                    if (lastDeepSeekError) {
                        combinedErrorMessage += `DeepSeek API failed: ${lastDeepSeekError.message}. `;
                    }
                    combinedErrorMessage += `All Gemini API keys failed: ${lastGeminiError.message}. Please check both API key setups or try again later.`;
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
        isGeneratingImage = true;
        isStreaming = true;
        showTypingIndicator();
        disableInput();
        updateSendButton();
    
        try {
            // First try Pollinations.ai
            console.log("Attempting Pollinations.ai image generation...");
            const pollinationsInput = prompt.replace(/\s+/g, '-').toLowerCase();
            const pollinationsUrl = `https://image.pollinations.ai/prompt/${pollinationsInput}`;
            
            const pollinationsResponse = await fetch(pollinationsUrl);
            
            if (pollinationsResponse.ok) {
                const blob = await pollinationsResponse.blob();
                const originalImageUrl = URL.createObjectURL(blob);
                
                return await new Promise((resolve) => {
                    const img = new Image();
                    img.src = originalImageUrl;
                    
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        
                        // Calculate crop - adding 1-2px extra to bottom only
                        const cropRight = Math.min(img.width * 0.05, 100);
                        const cropBottom = Math.min(img.height * 0.05, 100) + 12; // Added 2px extra
                        
                        canvas.width = img.width - cropRight;
                        canvas.height = img.height - cropBottom;
                        
                        // Draw original image (cropped)
                        ctx.drawImage(
                            img, 
                            0, 0, 
                            canvas.width, canvas.height,
                            0, 0,
                            canvas.width, canvas.height
                        );
                        
                        // Enhanced watermark removal
                        try {
                            // Check bottom-right 20x20px area for watermark
                            const watermarkCheckArea = ctx.getImageData(
                                canvas.width - 20,
                                canvas.height - 20,
                                20, 20
                            );
                            
                            let watermarkPixels = 0;
                            const data = watermarkCheckArea.data;
                            for (let i = 0; i < data.length; i += 4) {
                                // Detect semi-transparent white (common watermark color)
                                if (data[i] > 220 && data[i+1] > 220 && data[i+2] > 220 && data[i+3] > 100) {
                                    watermarkPixels++;
                                }
                            }
                            
                            // If watermark detected in >25% of checked area
                            if (watermarkPixels > 100) {
                                // Cut additional 1px if needed
                                canvas.height -= 1;
                                ctx.clearRect(0, 0, canvas.width, canvas.height);
                                ctx.drawImage(
                                    img, 
                                    0, 0, 
                                    canvas.width, canvas.height,
                                    0, 0,
                                    canvas.width, canvas.height
                                );
                            }
                        } catch (e) {
                            console.log("Watermark detection error:", e);
                        }
                        
                        resolve(canvas.toDataURL('image/png'));
                    };
                });
            } else {
                throw new Error("Pollinations.ai failed");
            }
        } catch (pollinationsError) {
            console.warn("Falling back to Gemini:", pollinationsError.message);
            
            try {
                const payload = { instances: [{ prompt: prompt }], parameters: { "sampleCount": 1 } };
                const apiKey = ""; 
                const apiUrl = `${config.geminiApiEndpoint}${config.geminiImageGenModel}:predict?key=${apiKey}`;
    
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
    
                if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    
                const result = await response.json();
                if (result.predictions?.[0]?.bytesBase64Encoded) {
                    return `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
                }
                throw new Error("Empty response");
            } catch (geminiError) {
                console.error("Gemini error:", geminiError);
                showError(`Image generation failed: ${geminiError.message}`);
                return null;
            }
        } finally {
            isGeneratingImage = false;
            isStreaming = false;
            hideTypingIndicator();
            enableInput();
        }
    } /**
     * Summarizes the current conversation history using the Gemini API.
     * Displays a typing indicator during summarization.
     */
    async function summarizeConversation() {
        if (conversationHistory.length === 0) {
            showError("No conversation to summarize.");
            return;
        }

        disableInput(); // Disable input during summarization
        isStreaming = true;
        showTypingIndicator(); // Show typing indicator
        updateSendButton();

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
            await addMessage('assistant', "Sorry, I couldn't summarize the conversation at this moment.");
            conversationHistory.push({ role: 'assistant', parts: [{ text: "Failed to summarize conversation." }] });
            saveConversation();
        } finally {
            isStreaming = false;
            enableInput(); // Re-enable input after operation
        }
    }

    /**
     * 6. Typing Effect (Typing Effects) - Enhanced with real typing animation
     * Streams text character by character to a given DOM element,
     * simulating a typing effect with cursor.
     * @param {HTMLElement} element - The DOM element to stream text into.
     * @param {string} text - The full text content to stream.
     * @param {number} speed = 15 - Delay in milliseconds per character.
     * @returns {Promise<void>} A promise that resolves when streaming is complete.
     */
    async function streamTextToElement(element, text, speed = 15) {
        const charArray = text.split('');
        element.innerHTML = ''; // Clear existing content
    
        // Add cursor initially
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        element.appendChild(cursor);
    
        const batchSize = 10;  // 10x faster = type 10 characters per delay
    
        for (let i = 0; i < charArray.length; i += batchSize) {
            if (stopGeneratingFlag) break; // stop signal
    
            const batch = charArray.slice(i, i + batchSize).join('');
            const textNode = document.createTextNode(batch);
            element.insertBefore(textNode, cursor);
    
            chatContainer.scrollTop = chatContainer.scrollHeight;
            await new Promise(resolve => setTimeout(resolve, speed));
        }
    
        // Remove cursor when done
        if (cursor && cursor.parentNode) {
            cursor.remove();
        }
    }

    // Function to detect ad blocker
    function detectAdBlock() {
        return new Promise((resolve) => {
            let isBlocked = false;
            let checkDone = 0;
    
            // Check 1: Test ad element
            let testAd = document.createElement("div");
            testAd.innerHTML = "&nbsp;";
            testAd.className = "adsbox";
            testAd.style.display = "block";
            testAd.style.position = "absolute";
            testAd.style.left = "-9999px";
            document.body.appendChild(testAd);
    
            setTimeout(function () {
                if (testAd.offsetHeight === 0 || testAd.offsetParent === null) {
                    isBlocked = true;
                }
                testAd.remove();
                done();
            }, 100);
    
            // Check 2: Test adsbygoogle script
            let script = document.createElement("script");
            script.type = "text/javascript";
            script.onerror = function () {
                isBlocked = true;
                done();
            };
            script.onload = function () {
                done();
            };
            script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
            document.body.appendChild(script);
    
            function done() {
                checkDone++;
                if (checkDone === 2) {
                    resolve(isBlocked);
                }
            }
        });
    }
    function containsMaliciousCode(input) {
        // Allow all code patterns - no restrictions
        // This function now always returns false to enable all code input
        return false;
    }
    function enableInput() {
        userInput.disabled = false;
        // sendButton রেফারেন্স মুছে ফেলো
        fileButton.disabled = false; 
        voiceButton.disabled = false; 
        summarizeButton.disabled = false; 
        clearInputButton.disabled = false;
        emojiButton.disabled = false;
        if (plusMenuButton) plusMenuButton.disabled = false;
        userInput.focus();
        updateSendButton();
    }
    
    function disableInput() {
        userInput.disabled = false;
        // sendButton রেফারেন্স মুছে ফেলো
        fileButton.disabled = true;
        voiceButton.disabled = true;
        summarizeButton.disabled = true;
        clearInputButton.disabled = true;
        emojiButton.disabled = true;
        if (plusMenuButton) plusMenuButton.disabled = true;
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
            showError(`Please wait ${remainingTime} seconds before sending another message.`);
            return;
        }
        lastMessageTime = now;

        const message = userInput.value.trim()
        // Code input is now enabled - removed malicious code blocking
        // All code patterns are now allowed for user input
        // Check if there's no message and no file selected; if so, show error and exit.
        if (!message && !selectedFile) {
            showError("Please type a message or select a file.");
            return;
        }

        errorMessage.textContent = ''; // Clear any previous error messages
        disableInput(); // Disable input and buttons while processing to prevent duplicate actions
        isStreaming = true;
        stopGeneratingFlag = false; // 10. Message Stop - Reset flag for new request
        updateSendButton(); // Update send button to show stop
        hideToolsMenu(); // Hide tools menu when sending

        // Hide welcome message when sending
        welcomeMessage.style.display = 'none';

        // --- Image Generation Request Handling (AI generating image from text prompt) ---
        // Check if user is in generate image mode or message contains image generation triggers
        const isImageMode = userInput.dataset.mode === 'generate-image';
        
        // Define image generation triggers
        const imageGenerationTriggers = [
            "generate an image of", "create an image", "create a image", "create a logo",
            "draw a picture of", "show me an image of", "display a picture of",
            "make an illustration of", "generate me", "create me", "draw me"
        ];
        
        const isImageCommand = imageGenerationTriggers.some(trigger => 
            message.toLowerCase().startsWith(trigger)
        );
        
        if (isImageMode || isImageCommand) {
            
            // Reset input mode first
            if (isImageMode) {
                userInput.placeholder = "Message NeoDot...";
                userInput.style.borderColor = '';
                delete userInput.dataset.mode;
            }
            
            // For image mode, use the whole message as prompt, otherwise extract from command
            let imagePrompt;
            if (isImageMode) {
                imagePrompt = message.trim();
            } else {
                imagePrompt = message.substring(message.toLowerCase().indexOf(" of ") + 4).trim();
            }
            
            if (imagePrompt) {
                // Add user message showing the image request
                addMessage('user', isImageMode ? `Create an image: ${imagePrompt}` : message);
                
                // Do not save user image generation messages to prevent persistence after reload
                // We only display the user's message but don't add it to conversation history
                userInput.value = ''; // Clear input field
                adjustTextareaHeight(); // Reset textarea height
                clearSelectedFile(); // Clear any attached file
                
                const imageUrl = await generateImage(imagePrompt); // Call the image generation API
                if (imageUrl) {
                    // If image generation is successful, display the image in the chat
                    // Note: Images are not saved locally and will not persist after page reload
                    
                    // Instead of creating HTML string that gets escaped, we'll create DOM elements directly
                    // in the addMessage function to prevent the HTML from being displayed as text
                    
                    // Create a custom response object with image information
                    const imageResponse = {
                        type: 'image',
                        imageUrl: imageUrl,
                        imagePrompt: imagePrompt
                    };
                    
                    // Pass this object to addMessage (this will handle adding to conversation history)
                    addMessage('assistant', imageResponse);
                } else {
                    // If image generation fails, display a generic error message
                    addMessage('assistant', "Sorry, I couldn't create the image at this moment.");
                    // Store the failure in conversation history
                    conversationHistory.push({ role: 'assistant', parts: [{ text: "Failed to generate image." }] });
                }
                // Note: Images will not be saved to localStorage and won't persist after reload
                saveConversation(); // Save the updated conversation state
                isStreaming = false;
                enableInput(); // Re-enable input fields
                
                // Important: Clear the selected tool state
                closeSelectedTool();
                
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
            isStreaming = false;
            enableInput(); // Re-enable input fields
            return; // Exit the function as personal info is handled
        }

        // --- Check for Web Search Tool Selection ---
        if (currentSelectedTool === 'Web Search' && message) {
            try {
                addMessage('user', `🔍 Search: ${message}`);
                userInput.value = '';
                adjustTextareaHeight();
                
                showTypingIndicator();
                const searchResults = await performWebSearch(message);
                hideTypingIndicator();
                
                let response = `## 🔍 Search Results for "${message}"\n\n`;
                
                if (searchResults && searchResults.length > 0) {
                    searchResults.forEach((result, index) => {
                        response += `### ${index + 1}. [${result.title}](${result.url})\n`;
                        response += `${result.snippet}\n\n`;
                    });
                    
                    response += `---\n\n### 📚 **Sources:**\n`;
                    searchResults.forEach((result, index) => {
                        const favicon = `https://www.google.com/s2/favicons?domain=${result.domain}&sz=16`;
                        response += `${index + 1}. ![${result.domain}](${favicon}) **${result.domain}** - [${result.title}](${result.url})\n`;
                    });
                } else {
                    response += "❌ No results found for your search query.";
                }
                
                await addMessage('assistant', response);
                
                // Add to conversation history
                conversationHistory.push(
                    { role: 'user', parts: [{ text: `🔍 Search: ${message}` }] },
                    { role: 'assistant', parts: [{ text: response }] }
                );
                saveConversation();
                
                // Clear selected tool after use
                closeSelectedTool();
                
            } catch (error) {
                console.error('Web search error:', error);
                hideTypingIndicator();
                await addMessage('assistant', "Sorry, I couldn't perform the web search at this moment.");
                closeSelectedTool();
            } finally {
                isStreaming = false;
                enableInput();
                updateSendButton();
            }
            return;
        }

        // --- Standard Message Processing (for non-image/non-personal info queries) ---
        
        // Store the display content for the user's message, including the file
        let userDisplayContent = message; // Start with the text message

        if (selectedFile) {
            try {
                const base64Data = await readFileAsBase64(selectedFile);
                // Add file display to the user's message immediately
                if (selectedFile.type.startsWith('image/')) {
                    userDisplayContent += `<div class="mt-2"><img src="data:${selectedFile.type};base64,${base64Data}" alt="Attached Image" class="attached-file-preview-in-chat" onclick="openImageFullscreen('data:${selectedFile.type};base64,${base64Data}', 'Attached Image')"></div>`;
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
                isStreaming = false;
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
                isStreaming = false;
                enableInput();
                return;
            }
        }

        // Push the user's full message (with parts) to the in-memory conversation history.
        const userHistoryItem = { role: 'user', parts: geminiPartsForHistory };
        
        // If there's a selected file that's an image, store its data URL for persistence
        if (selectedFile && selectedFile.type && selectedFile.type.startsWith('image/')) {
            try {
                const base64Data = await readFileAsBase64(selectedFile);
                userHistoryItem.userImageUrl = `data:${selectedFile.type};base64,${base64Data}`;
            } catch (error) {
                console.error("Failed to save image URL for persistence:", error);
            }
        }
        
        conversationHistory.push(userHistoryItem);

        userInput.value = ''; 
        adjustTextareaHeight(); 
        clearSelectedFile(); 

        showTypingIndicator(); 

        try {
            const isFirstMessageInNewChat = conversationHistory.length === 1 && currentChatTitle.textContent === 'New Chat';
            if (isFirstMessageInNewChat && message) {
                try {
                    // Prepare Pollinations API call for title generation (no memory needed for titles)
                    const encodedPrompt = encodeURIComponent(
                        `Create a 3-7 word title based on this message: "${message}". Respond ONLY with the title text - no quotes, no punctuation, no additional text or explanations.`
                    );
                    const pollinationsURL = `https://text.pollinations.ai/${encodedPrompt}?model=openai`;
            
                    const response = await fetch(pollinationsURL);
                    const titleText = await response.text();
            
                    // Clean the title
                    const cleanTitle = titleText.trim()
                        .replace(/^["'`]|["'`]$/g, '')  // Remove all quote types
                        .replace(/[.,;:!?]$/, '')       // Remove trailing punctuation
                        .substring(0, 30)               // Limit length
                        .trim();
            
                    // Set the cleaned title or fallback
                    updateChatTitle(cleanTitle || message.split(/\s+/).slice(0, 4).join(' '));
            
                } catch (titleError) {
                    console.log('Pollinations title generation failed, using fallback:', titleError);
                    const words = message.split(/\s+/).filter(w => w.length > 0);
                    updateChatTitle(
                        words.slice(0, Math.min(5, words.length)).join(' ') +
                        (words.length > 5 ? '...' : '')
                    );
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
                console.log("History too long, attempting to generate summary for context...");
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
                        { role: "system", parts: [{ text: `Summary of previous conversation: ${summary}` }] },
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
                
                // Add empty ad iframe at the top when there are multiple videos
                if (videos.length > 0) {
                    const isBlocked = await detectAdBlock();
                    const adUrl = isBlocked
                        ? adPlaceholders[Math.floor(Math.random() * adPlaceholders.length)]
                        : ADVERTISEMENT_URLS[Math.floor(Math.random() * ADVERTISEMENT_URLS.length)];
              
                    fullResponseHTML += `
<div class="video-item ad-container">
  <div class="video-container">
      <iframe id="ad-frame" src="${adUrl}" frameborder="0" allowfullscreen></iframe>
  </div>
  <div class="video-footer">
      <a href="${ADVERTISEMENT_URLS}" target="_blank" class="download-btn">
          <i class="fas fa-download"></i> Download
      </a>
  </div>
</div>`;
                }
                
                // Add the actual video embeds
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
            fullResponseHTML = "I couldn't find any information. Please rephrase your question or provide a clearer file.";
        }

        hideTypingIndicator(); 

        const assistantMessageDiv = document.createElement('div');
        assistantMessageDiv.className = `group w-full assistant-message`;
        
        const messageWrapper = document.createElement('div');
        messageWrapper.className = `flex p-4 gap-4 text-base md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl mx-auto message-wrapper`;
        
        const avatar = document.createElement('div');
        avatar.className = `flex-shrink-0 flex flex-col relative items-end avatar-icon`;
        
        const avatarIcon = document.createElement('div');
        avatarIcon.className = `w-8 h-8 rounded-full bg-green-600 flex items-center justify-center`;
        avatarIcon.innerHTML = '<svg class="logo" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z" fill="var(--primary-color)"/><path d="M12 6C8.686 6 6 8.686 6 12C6 15.314 8.686 18 12 18C15.314 18 18 15.314 18 12C18 8.686 15.314 6 12 6Z" fill="white"/><path d="M12 10C10.895 10 10 10.895 10 12C10 13.105 10.895 14 12 14C13.105 14 14 13.105 14 12C14 10.895 13.105 10 12 10Z" fill="var(--primary-color)"/></svg>';
        
        avatar.appendChild(avatarIcon);
        
        const messageContent = document.createElement('div');
        messageContent.className = 'relative flex-1 min-w-0 flex flex-col message-content';
        
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

        // 6. Typing Effect (Typing Effects) - Enhanced real typing animation
        await streamTextToElement(contentDiv, aiTextContent); // Show typing effect for text only
        
        // After typing is complete, add the full formatted content
        contentDiv.innerHTML = formatMarkdown(fullResponseHTML); 

        // Only add code block buttons to <code> elements that are children of <pre>
        document.querySelectorAll('pre code').forEach((block) => {
            if (block.parentElement && block.parentElement.tagName === 'PRE') {
                hljs.highlightElement(block); 
                addCodeBlockButtons(block); 
            }
        });
        
        // Add response action buttons right after content is added
        addResponseActionButtons(messageContent, contentDiv);
        
        chatContainer.scrollTop = chatContainer.scrollHeight; 

        conversationHistory.push({ role: 'assistant', parts: [{ text: fullResponseHTML }] }); 
        saveConversation(); 
        isStreaming = false;
        enableInput();
    } catch (error) {
        console.error('Error in sendMessage:', error);
        hideTypingIndicator(); 
        addMessage('assistant', "I'm having trouble responding. Please try again later."); 
        conversationHistory.push({ role: 'assistant', parts: [{ text: "I'm having trouble responding. Please try again later." }] });
        saveConversation();
    } finally {
        isStreaming = false;
        enableInput(); 
        welcomeMessage.style.display = 'none';
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
                width: 200px;
                height: 200px;
                display: block;
                object-fit: cover; /* Makes images square and crops to fit */
                background: transparent;
                cursor: pointer;
                transition: transform 0.2s ease;
            }
            .response-image img:hover {
                transform: scale(1.05);
            }
            @media (max-width: 768px) {
                .response-image-row {
                    flex-wrap: nowrap !important;
                    overflow-x: auto !important;
                    padding: 10px 0;
                    gap: 15px;
                    scroll-snap-type: x mandatory;
                    -webkit-overflow-scrolling: touch;
                }
                .response-image-row::-webkit-scrollbar {
                    display: none;
                }
                .response-image {
                    flex: 0 0 200px !important;
                    max-width: 200px !important;
                    scroll-snap-align: start;
                }
                .response-image img {
                    width: 200px !important;
                    height: 200px !important;
                }
            }
        `;
        document.head.appendChild(style);
    }    /**
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
                        response += `<img src="https://duckduckgo.com${data.Image}" class="knowledge-image" alt="${data.Heading || query}" onclick="openImageFullscreen('https://duckduckgo.com${data.Image}', '${data.Heading || query}')">`;
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
                        response += `<a href="${data.AbstractURL}" target="_blank" class="source-link">Read More</a>`;
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
            const wikiResponse = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`); // English Wikipedia
            if (wikiResponse.ok) {
                const data = await wikiResponse.json();
                // Check for extract and ensure it's not a disambiguation page
                if (data.extract && !data.extract.includes('may refer to:')) {
                    let response = `<div class="knowledge-response">`;
                    if (data.thumbnail?.source) {
                        response += `<img src="${data.thumbnail.source}" class="knowledge-image" alt="${data.title}" onclick="openImageFullscreen('${data.thumbnail.source}', '${data.title}')">`;
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
     * Adds response action buttons to the assistant's message content.
     * This includes copy, download PDF, and any other action buttons.
     * @param {HTMLElement} messageContent - The message content container element.
     * @param {HTMLElement} contentDiv - The content div containing the message.
     */
    function addResponseActionButtons(messageContent, contentDiv) {
        // Determine if this is a user message or assistant message
        const isUserMessage = messageContent.closest('.user-message') !== null;
        
        // Create buttons container with ChatGPT/DeepSeek style
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'response-actions flex items-center justify-start gap-1 mt-3 mb-2 opacity-70 hover:opacity-100 transition-opacity duration-200';
        
        // Copy to clipboard button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-response-btn group relative inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200';
        copyButton.title = 'Copy';
        copyButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="m4 16c-1.1 0-2-.9-2-2v-10c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
        copyButton.addEventListener('click', () => {
            // Get the text content from the message
            const textToCopy = contentDiv.textContent;
            navigator.clipboard.writeText(textToCopy).then(() => {
                // Show a temporary success indicator
                const originalHTML = copyButton.innerHTML;
                copyButton.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    copyButton.innerHTML = originalHTML;
                }, 2000);
            });
        });
        
        // If this is a user message, add an edit button
        if (isUserMessage) {
            const editButton = document.createElement('button');
            editButton.className = 'edit-message-btn group relative inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200';
            editButton.title = 'Edit & Resend';
            editButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>';
            editButton.addEventListener('click', () => {
                // Get the text content from the user message
                const textToEdit = contentDiv.textContent;
                // Set it as the current input value
                userInput.value = textToEdit;
                // Adjust the textarea height
                adjustTextareaHeight();
                // Focus the input
                userInput.focus();
            });
            actionsContainer.appendChild(editButton);
        }
        
        // Download as PDF button
        const pdfButton = document.createElement('button');
        pdfButton.className = 'download-pdf-btn group relative inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200';
        pdfButton.title = 'Download PDF';
        pdfButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>';
        pdfButton.addEventListener('click', () => {
            // Get HTML content to convert to PDF
            const content = contentDiv.innerHTML;
            
            // Create a new window for PDF generation
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>NeoDot Chat Export</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        pre { background-color: #f0f0f0; padding: 10px; border-radius: 5px; overflow-x: auto; }
                        code { font-family: monospace; }
                        img { max-width: 100%; height: auto; }
                    </style>
                </head>
                <body>
                    ${content}
                </body>
                </html>
            `);
            
            // Wait for content to load then print as PDF
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 500);
        });
        
        // Download text file button
        const downloadButton = document.createElement('button');
        downloadButton.className = 'flex items-center justify-center w-8 h-8 rounded-md hover:bg-[var(--message-user-bg)] text-[var(--text-color)] transition-all duration-200 border border-transparent hover:border-[var(--border-color)]';
        downloadButton.title = 'Download';
        downloadButton.innerHTML = '<i class="fas fa-download text-sm"></i>';
        downloadButton.addEventListener('click', () => {
            // Get the text content from the message
            const textToDownload = contentDiv.textContent;
            
            // Create a blob with the text content
            const blob = new Blob([textToDownload], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            
            // Create a download link and trigger the download
            const a = document.createElement('a');
            a.href = url;
            a.download = `neodot-response-${new Date().toISOString().split('T')[0]}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            // Show a temporary success indicator
            const originalHTML = downloadButton.innerHTML;
            downloadButton.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                downloadButton.innerHTML = originalHTML;
            }, 2000);
        });
        
        // Read aloud/Speech button
        const speechButton = document.createElement('button');
        speechButton.className = 'voice-btn group relative inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200';
        speechButton.title = 'Read aloud';
        speechButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="m19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>';
        speechButton.addEventListener('click', () => {
            // Get the text content from the message
            const textToSpeak = contentDiv.textContent;
            
            // Check if speech synthesis is supported
            if ('speechSynthesis' in window) {
                // Stop any ongoing speech
                window.speechSynthesis.cancel();
                
                // Create speech utterance
                const utterance = new SpeechSynthesisUtterance(textToSpeak);
                
                // Set speech properties
                utterance.rate = 0.9;
                utterance.pitch = 1;
                utterance.volume = 1;
                
                // Visual feedback during speech
                const originalHTML = speechButton.innerHTML;
                speechButton.innerHTML = '<i class="fas fa-stop text-sm"></i>';
                speechButton.title = 'Stop reading';
                
                // Handle speech end
                utterance.onend = () => {
                    speechButton.innerHTML = originalHTML;
                    speechButton.title = 'Read aloud';
                };
                
                // Handle speech error
                utterance.onerror = () => {
                    speechButton.innerHTML = originalHTML;
                    speechButton.title = 'Read aloud';
                    console.error('Speech synthesis error');
                };
                
                // Click to stop functionality
                const stopSpeech = () => {
                    window.speechSynthesis.cancel();
                    speechButton.innerHTML = originalHTML;
                    speechButton.title = 'Read aloud';
                };
                
                // Update click handler to stop speech if currently speaking
                speechButton.onclick = () => {
                    if (window.speechSynthesis.speaking) {
                        stopSpeech();
                    } else {
                        // Start speech again
                        speechButton.click();
                    }
                };
                
                // Start speaking
                window.speechSynthesis.speak(utterance);
            } else {
                alert('Speech synthesis is not supported in your browser.');
            }
        });
        
        // Add appropriate buttons to the container based on message type
        actionsContainer.appendChild(copyButton);
        
        // Only add these buttons to assistant messages
        if (!messageContent.closest('.user-message')) {
            actionsContainer.appendChild(speechButton);
            actionsContainer.appendChild(pdfButton);
            actionsContainer.appendChild(downloadButton);
        }
        
        // Add the actions container to the message content
        messageContent.appendChild(actionsContainer);
        
        // Make buttons visible right away
        setTimeout(() => {
            actionsContainer.classList.add('visible');
        }, 500);
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
        messageWrapper.className = `flex p-4 gap-4 text-base md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl mx-auto message-wrapper`;
        
        const avatar = document.createElement('div');
        avatar.className = 'flex-shrink-0 flex flex-col relative items-end avatar-icon';
        
        const avatarIcon = document.createElement('div');
        // Apply different background colors for user and assistant avatars.
        avatarIcon.className = `w-8 h-8 rounded-full flex items-center justify-center ${role === 'user' ? 'bg-blue-600' : 'bg-green-600'}`;
        // SVG icons for user and assistant.
        avatarIcon.innerHTML = role === 'user' ? 
            '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" fill="currentColor"/><path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" fill="currentColor"/></svg>' : 
            '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z" fill="var(--primary-color)"/><path d="M12 6C8.686 6 6 8.686 6 12C6 15.314 8.686 18 12 18C15.314 18 18 15.314 18 12C18 8.686 15.314 6 12 6Z" fill="white"/><path d="M12 10C10.895 10 10 10.895 10 12C10 13.105 10.895 14 12 14C13.105 14 14 13.105 14 12C14 10.895 13.105 10 12 10Z" fill="var(--primary-color)"/></svg>';
        
        avatar.appendChild(avatarIcon);
        
        const messageContent = document.createElement('div');
        messageContent.className = 'relative flex-1 min-w-0 flex flex-col message-content';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-markdown flex-1'; // This div will hold the parsed Markdown/HTML content
        messageContent.appendChild(contentDiv);
        
        messageWrapper.appendChild(avatar);
        messageWrapper.appendChild(messageContent);
        
        messageDiv.appendChild(messageWrapper);
        chatContainer.appendChild(messageDiv); // Append the new message to the chat container
        
        // Special handling for generated images with custom response object
        if (role === 'assistant' && typeof content === 'object' && content.type === 'image') {
            // Create image container
            const imageContainer = document.createElement('div');
            imageContainer.className = 'generated-image-container';
            imageContainer.style.position = 'relative';
            imageContainer.style.display = 'inline-block';
            imageContainer.style.margin = '1rem 0';
            
            // Create image element
            const img = document.createElement('img');
            img.src = content.imageUrl;
            img.alt = content.imagePrompt;
            img.className = 'generated-image';
            img.onclick = function() { openImageFullscreen(content.imageUrl, content.imagePrompt); };
            
            // Create download button
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'image-download-btn';
            downloadBtn.title = 'Download Image';
            downloadBtn.style.position = 'absolute';
            downloadBtn.style.top = '10px';
            downloadBtn.style.right = '10px';
            downloadBtn.style.background = 'rgba(0, 0, 0, 0.7)';
            downloadBtn.style.color = 'white';
            downloadBtn.style.border = 'none';
            downloadBtn.style.borderRadius = '50%';
            downloadBtn.style.width = '40px';
            downloadBtn.style.height = '40px';
            downloadBtn.style.cursor = 'pointer';
            downloadBtn.style.display = 'flex';
            downloadBtn.style.alignItems = 'center';
            downloadBtn.style.justifyContent = 'center';
            downloadBtn.style.fontSize = '16px';
            downloadBtn.style.zIndex = '10';
            downloadBtn.style.transition = 'all 0.3s ease';
            downloadBtn.innerHTML = '<i class="fas fa-download"></i>';
            
            // Attach download functionality to button
            downloadBtn.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent opening the fullscreen when clicking download
                downloadImage(content.imageUrl, content.imagePrompt);
            });
            
            // Append elements to container
            imageContainer.appendChild(img);
            imageContainer.appendChild(downloadBtn);
            
            // Append container to message content
            contentDiv.appendChild(imageContainer);
            
            // Record image information for conversation history
            const imageText = `[Generated image: ${content.imagePrompt}]`;
            
            // Update conversation history with the image URL for persistence
            if (!isHistory) {
                conversationHistory.push({ 
                    role: 'assistant', 
                    parts: [{ text: imageText }],
                    processedImageUrl: content.imageUrl // Save image URL for persistence
                });
                
                // Save the updated conversation
                saveConversation();
            }
            
            return messageDiv;
        }
        // Handle content display based on role and whether it's a new message or from history.
        else if (role === 'user') {
            // Check if content contains image HTML (from history) or base64 data
            if (content && content.includes('<div class="mt-2"><img src="data:')) {
                // This is loading an image from history - render as HTML
                contentDiv.innerHTML = content;
            } else if (content && content.includes('data:image/')) {
                // This content contains base64 image data - extract text and image separately
                const base64Match = content.match(/(data:image\/[^;]+;base64,[A-Za-z0-9+/=]+)/);
                if (base64Match) {
                    const base64Data = base64Match[1];
                    const textPart = content.replace(base64Data, '').trim();
                    
                    // Set text content (without base64)
                    contentDiv.textContent = textPart;
                    
                    // Create image element for the base64 data
                    const imageContainer = document.createElement('div');
                    imageContainer.className = 'mt-2';
                    const img = document.createElement('img');
                    img.src = base64Data;
                    img.alt = 'Attached Image';
                    img.className = 'attached-file-preview-in-chat';
                    img.onclick = function() { openImageFullscreen(base64Data, 'Attached Image'); };
                    imageContainer.appendChild(img);
                    contentDiv.appendChild(imageContainer);
                } else {
                    // Fallback: display as text
                    contentDiv.textContent = content;
                }
            } else {
                // Regular text message - escape HTML content and display as text
                contentDiv.textContent = content; // Prevent HTML execution by using textContent
            }
            
            // Add copy and edit buttons for new user messages
            addResponseActionButtons(messageContent, contentDiv);
            
            // Handle file attachments separately as read-only display (for new messages)
            if (selectedFile && selectedFile.type && selectedFile.type.startsWith('image/')) {
                const fileDiv = document.createElement('div');
                fileDiv.className = 'file-attachment';
                const img = document.createElement('img');
                img.src = filePreviewThumbnail.src;
                img.alt = 'Attached Image';
                fileDiv.appendChild(img);
                contentDiv.appendChild(fileDiv);
            } else if (selectedFile && selectedFile.textContent) {
                const fileDiv = document.createElement('div');
                fileDiv.className = 'file-attachment';
                const pre = document.createElement('pre');
                const code = document.createElement('code');
                const textContent = selectedFile.textContent.substring(0, 500) + (selectedFile.textContent.length > 500 ? '...' : '');
                code.textContent = textContent; // Use textContent to prevent execution
                pre.appendChild(code);
                fileDiv.appendChild(pre);
                contentDiv.appendChild(fileDiv);
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

            // 6. Typing Effect (Typing Effects) - Enhanced real typing animation
            await streamTextToElement(contentDiv, aiTextContent); // Show typing effect first
            
            // After typing is complete, show full formatted content
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
            
            // Add response action buttons for assistant messages IMMEDIATELY after content is complete
            // This ensures buttons appear right after typing animation finishes
            addResponseActionButtons(messageContent, contentDiv);
            
            messageDiv.scrollIntoView({ behavior: 'smooth' }); // Scroll to the new message

        } else {
            // For user messages (both historical and new) - escape HTML to prevent code execution
            if (role === 'user') {
                contentDiv.textContent = content; // Use textContent to prevent HTML interpretation
                // Add copy and edit buttons for user messages
                addResponseActionButtons(messageContent, contentDiv);
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
                
                // Add response action buttons for assistant messages from history
                addResponseActionButtons(messageContent, contentDiv);
            }
            
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
            // Check if this is a message with a generated image that needs to be reconstructed
            if (msg.role === 'assistant' && msg.processedImageUrl) {
                // Create a custom response object with the saved image URL
                const imageResponse = {
                    type: 'image',
                    imageUrl: msg.processedImageUrl,
                    imagePrompt: msg.parts[0]?.text.replace('[Generated image: ', '').replace(']', '')
                };
                // Display the image
                addMessage(msg.role, imageResponse, true);
            }
            // Check if this is a user message with an attached image that needs to be reconstructed
            else if (msg.role === 'user' && msg.userImageUrl) {
                // Create an HTML string with the embedded image
                const imageHtml = `${msg.parts[0]?.text || ''}<div class="mt-2"><img src="${msg.userImageUrl}" alt="Attached Image" class="attached-file-preview-in-chat" onclick="openImageFullscreen('${msg.userImageUrl}', 'Attached Image')"></div>`;
                // Display the message with the image
                addMessage(msg.role, imageHtml, true);
            }
            // Regular text message
            else {
                const contentToDisplay = msg.parts && Array.isArray(msg.parts) 
                                     ? msg.parts.map(part => part.text || '').join(' ') // For user text (will be escaped)
                                     : msg.content || ''; // For assistant's saved HTML (or old format content)
                addMessage(msg.role, contentToDisplay, true);
            }
        });
    
        updateChatVisibility(); // Update visibility of the welcome message based on loaded history.
    
        // Restore saved input for this chat ID
        restoreInputState();
    
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
                title: currentChatTitle.textContent || 'New Chat', // Use current title or default
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        }
    
        // Save the updated list of all chats back to local storage.
        localStorage.setItem('chats', JSON.stringify(chats)); 
    }

    /**
     * 2. Sidebar (Sidebar) - Visual State Update
     * Updates the visual state of the sidebar (open/closed) based on `isSidebarOpen`
     * and screen width. On mobile, it also manages the overlay and body scrolling.
     */
    function updateSidebarState() {
        const sidebarOverlay = document.getElementById('sidebar-overlay');
        const sidebarContent = document.querySelector('.sidebar-content');
        const sidebarMinimal = document.querySelector('.sidebar-minimal');

        if (window.innerWidth <= 768) { // Logic for mobile viewports
            sidebar.classList.remove('sidebar-open'); // Remove desktop open class
            sidebarMinimal.style.display = 'none'; // Hide minimal view on mobile
            sidebarContent.style.opacity = '1'; // Always show full content on mobile
            if (isSidebarOpen) {
                sidebar.style.transform = 'translateX(0)'; // Slide sidebar into view
                sidebarOverlay.classList.add('active'); // Show overlay
                document.body.style.overflow = 'hidden'; // Prevent main body from scrolling
            } else {
                sidebar.style.transform = 'translateX(-100%)'; // Slide sidebar out of view
                sidebarOverlay.classList.remove('active'); // Hide overlay
                document.body.style.overflow = ''; // Restore body scrolling
            }
        } else { // Logic for desktop viewports
            sidebar.style.transform = 'translateX(0)'; // Ensure sidebar is always visible on desktop
            sidebarOverlay.classList.remove('active'); // No overlay on desktop
            document.body.style.overflow = ''; // Restore body scrolling
            
            if (isSidebarOpen) {
                sidebar.classList.add('sidebar-open');
                sidebarContent.style.opacity = '1';
                sidebarMinimal.style.display = 'none';
            } else {
                sidebar.classList.remove('sidebar-open');
                sidebarContent.style.opacity = '0';
                sidebarMinimal.style.display = 'flex';
            }

            // Desktop hover logic
            sidebar.onmouseenter = () => {
                if (!isSidebarOpen) {
                    sidebar.classList.add('sidebar-open');
                    sidebarContent.style.opacity = '1';
                    sidebarMinimal.style.display = 'none';
                }
            };
            sidebar.onmouseleave = () => {
                if (!isSidebarOpen) {
                    sidebar.classList.remove('sidebar-open');
                    sidebarContent.style.opacity = '0';
                    sidebarMinimal.style.display = 'flex';
                }
            };
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
                    fileSizeDisplay.textContent = `${formattedSize} (~${Math.ceil(content.length/1000)}KB Text)`;
                } else {
                    fileSizeDisplay.textContent = `${formattedSize} (${content.length} characters)`;
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
    function clearSelectedFile() {
        selectedFile = null;
        filePreviewArea.classList.add('hidden'); // Hide the preview area
        fileAttachmentPill.classList.add('hidden');
        filePreviewThumbnail.classList.add('hidden');
        filePreviewThumbnail.src = '';
        fileIcon.classList.add('hidden');
        fileNameDisplay.textContent = '';
        fileSizeDisplay.textContent = '';
        saveImageButton.classList.add('hidden');
        document.getElementById('file-upload-container').classList.add('hidden'); // Hide drop zone
    }

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
     * Downloads a generated image with a specified name.
     * @param {string} imageUrl - The URL of the image to download.
     * @param {string} imageName - The name to use for the downloaded file.
     */
    function downloadImage(imageUrl, imageName) {
        try {
            // Create a sanitized filename from the image name
            const filename = imageName
                .replace(/[^a-z0-9]/gi, '_') // Replace non-alphanumeric with underscore
                .toLowerCase()
                .substring(0, 30) // Limit length
                + '.png'; // Add extension
                
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Download failed:', error);
            showError("Failed to download image. Trying alternate method...");
            
            // Fallback: open image in new tab if download fails
            window.open(imageUrl, '_blank');
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
        recognition.lang = 'en-US'; // Set the language for recognition to English (United States).

        // Event handler for when speech recognition starts.
        recognition.onstart = () => {
            isListening = true; // Update listening state.
            voiceButton.classList.add('voice-recording'); // Add recording animation
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
            voiceButton.classList.remove('voice-recording'); // Remove recording animation
            voiceButton.innerHTML = '🎤'; // Restore the microphone icon.
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
            voiceButton.classList.remove('voice-recording'); // Remove animation.
            voiceButton.innerHTML = '🎤'; // Restore icon.
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
                    showError('Microphone access denied. Please grant microphone access to use voice input.');
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

    // 5. Input Bar (Input Bar) - Clear Input
    function clearInput() {
        userInput.value = '';
        adjustTextareaHeight();
        clearSelectedFile();
        hidePlusMenu();
    }
    
    // 9. Input Text Save/Restore - Enhanced with Chat ID support
    function saveInputState() {
        // If input saving is disabled in settings, don't save anything
        if (!currentSettings.inputSave) return; // Check from settings

        const savedState = {
            inputValue: userInput.value,
            selectedFile: null
        };

        if (selectedFile) {
            // Save file as Base64
            const reader = new FileReader();
            reader.onload = (e) => {
                savedState.selectedFile = {
                    name: selectedFile.name,
                    type: selectedFile.type,
                    size: selectedFile.size,
                    data: e.target.result // Base64 data
                };
                // Save with chat ID as key
                localStorage.setItem(`neoDotInputState_${currentChatId}`, JSON.stringify(savedState));
            };
            reader.readAsDataURL(selectedFile);
        } else {
            // Save with chat ID as key
            localStorage.setItem(`neoDotInputState_${currentChatId}`, JSON.stringify(savedState));
        }
    }

    function restoreInputState() {
        if (!currentSettings.inputSave) return; // Check from settings

        // Try to restore from current chat ID first
        let savedStateString = localStorage.getItem(`neoDotInputState_${currentChatId}`);
        
        if (savedStateString) {
            try {
                const savedState = JSON.parse(savedStateString);
                userInput.value = savedState.inputValue || '';
                adjustTextareaHeight();

                if (savedState.selectedFile && savedState.selectedFile.data) {
                    // Restore file from Base64 data
                    fetch(savedState.selectedFile.data)
                        .then(res => res.blob())
                        .then(blob => {
                            const restoredFile = new File([blob], savedState.selectedFile.name, { type: savedState.selectedFile.type });
                            processFile(restoredFile); // Process file and show preview
                        })
                        .catch(e => {
                            console.error("Failed to load restored file:", e);
                            showError("Problem loading previous file.");
                        });
                }
            } catch (e) {
                console.error("Problem parsing input state:", e);
                showError("Problem loading previous input.");
            }
        }
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

    // Voice Mode Functions
    function openVoiceMode() {
        const voiceModeModal = document.getElementById('voice-mode-modal');
        const voiceModeIframe = document.getElementById('voice-mode-iframe');
        
        // Only load the iframe when opening the modal
        voiceModeIframe.src = 'voice.html';
        voiceModeModal.classList.add('active');
        
        // Prevent body scrolling when modal is open
        document.body.style.overflow = 'hidden';
    }

    function closeVoiceMode() {
        const voiceModeModal = document.getElementById('voice-mode-modal');
        const voiceModeIframe = document.getElementById('voice-mode-iframe');
        
        // Clear the iframe src to stop it from running in the background
        voiceModeIframe.src = '';
        voiceModeModal.classList.remove('active');
        
        // Restore body scrolling
        document.body.style.overflow = 'auto';
    }

    // Image download function
    function downloadImage(imageUrl, filename) {
        try {
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = filename.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Download failed:', error);
            // Fallback: open image in new tab
            window.open(imageUrl, '_blank');
        }
    }

    // 3. New Settings (Settings) - Modal Functions
    function openSettingsModal() {
        settingsModal.classList.add('active');
        // Load settings when modal is opened
        themeSelect.value = currentSettings.theme;
        chatbotNameInput.value = currentSettings.chatbotName;
        inputSaveToggle.checked = currentSettings.inputSave;
        glassEffectToggle.checked = currentSettings.glassEffect === 'on';
        
        // Load background settings
        backgroundOpacitySlider.value = currentSettings.background.opacity;
        backgroundBlurSlider.value = currentSettings.background.blur;
        updateBackgroundLivePreview(); // Update preview
        
        // Show uploaded images
        backgroundImagePreview.innerHTML = '';
        if (currentSettings.background.images && currentSettings.background.images.length > 0) {
            currentSettings.background.images.forEach(imgData => {
                const img = document.createElement('img');
                img.src = imgData;
                backgroundImagePreview.appendChild(img);
            });
        }
    }

    function closeSettingsModal() {
        settingsModal.classList.remove('active');
    }

    function saveSettings() {
        currentSettings.theme = themeSelect.value;
        currentSettings.chatbotName = chatbotNameInput.value;
        
        // Ensure input save toggle is properly read
        currentSettings.inputSave = inputSaveToggle.checked;
        
        // Ensure the glass effect toggle is properly read
        currentSettings.glassEffect = glassEffectToggle.checked ? 'on' : 'off';

        // Save background settings
        currentSettings.background.opacity = parseFloat(backgroundOpacitySlider.value);
        currentSettings.background.blur = parseFloat(backgroundBlurSlider.value);
        // Uploaded images are already in currentSettings.background.images

        // Save to localStorage for persistence
        localStorage.setItem('neoDotSettings', JSON.stringify(currentSettings));
        
        // Apply the updated settings
        applySettings();
        
        // Close the modal
        closeSettingsModal();
        
        // Show confirmation
        showError("Settings saved successfully!");
    }

    function resetSettingsToDefault() {
        // Confirmation dialog
        const confirmReset = document.createElement('div');
        confirmReset.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
        confirmReset.innerHTML = `
            <div class="bg-gray-800 p-6 rounded-lg shadow-xl text-center">
                <p class="text-white mb-4">Are you sure you want to reset all settings to default?</p>
                <div class="flex justify-center gap-4">
                    <button id="cancel-reset" class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Cancel</button>
                    <button id="confirm-reset" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Reset</button>
                </div>
            </div>
        `;
        document.body.appendChild(confirmReset);

        document.getElementById('cancel-reset').addEventListener('click', () => {
            confirmReset.remove();
        });

        document.getElementById('confirm-reset').addEventListener('click', () => {
            confirmReset.remove();
            currentSettings = { ...defaultSettings };
            localStorage.setItem('neoDotSettings', JSON.stringify(currentSettings));
            applySettings();
            // Update settings modal
            themeSelect.value = currentSettings.theme;
            chatbotNameInput.value = currentSettings.chatbotName;
            inputSaveToggle.checked = currentSettings.inputSave;
            glassEffectToggle.checked = currentSettings.glassEffect === 'on';
            backgroundOpacitySlider.value = currentSettings.background.opacity;
            backgroundBlurSlider.value = currentSettings.background.blur;
            backgroundImagePreview.innerHTML = ''; // Clear uploaded images
            showError("Settings reset to default!");
        });
    }

    function loadSettings() {
        const savedSettings = localStorage.getItem('neoDotSettings');
        if (savedSettings) {
            currentSettings = { ...defaultSettings, ...JSON.parse(savedSettings) };
        }
    }

    function applySettings() {
        // Apply theme
        applyTheme(currentSettings.theme);
        // Apply glass effect
        applyGlassEffect();
        // Apply background
        applyBackground(currentSettings.background.type, currentSettings.background.value, currentSettings.background.opacity, currentSettings.background.blur);
    }

    // Glass effect application
    function applyGlassEffect() {
        const body = document.body;
        
        if (currentSettings.glassEffect === 'on') {
            body.classList.add('glass-enabled');
        } else if (currentSettings.glassEffect === 'off') {
            body.classList.remove('glass-enabled');
        } else { // auto
            // Auto mode: enable glass when custom background is set
            if (body.classList.contains('custom-background')) {
                body.classList.add('glass-enabled');
            } else {
                body.classList.remove('glass-enabled');
            }
        }
    }

    // 1. Theme (Theme) - Theme Change Function
    function applyTheme(themeName) {
        const body = document.body;
        body.removeAttribute('data-theme'); // Remove all old theme classes

        if (themeName === 'auto') {
            // Follow system theme
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                body.setAttribute('data-theme', 'dark');
                themeIcon.className = 'fas fa-moon';
            } else {
                body.setAttribute('data-theme', 'light');
                themeIcon.className = 'fas fa-sun';
            }
        } else {
            body.setAttribute('data-theme', themeName);
            if (themeName.includes('dark')) {
                themeIcon.className = 'fas fa-moon';
            } else {
                themeIcon.className = 'fas fa-sun';
            }
        }
        localStorage.setItem('theme', themeName); // Save theme
    }

    function toggleTheme() {
        const currentTheme = localStorage.getItem('theme') || 'auto';
        let newTheme;
        if (currentTheme === 'dark') {
            newTheme = 'light';
        } else if (currentTheme === 'light') {
            newTheme = 'light-blue';
        } else if (currentTheme === 'light-blue') {
            newTheme = 'dark-blue';
        } else if (currentTheme === 'dark-blue') {
            newTheme = 'auto';
        } else { // 'auto'
            newTheme = 'dark';
        }
        applyTheme(newTheme);
        themeSelect.value = newTheme; // Update theme select in settings modal
    }

    // 3. New Settings (Settings) - Category Collapse/Expand
    function toggleSettingSection(sectionId) {
        const sectionContent = document.getElementById(sectionId);
        const icon = sectionContent.previousElementSibling.querySelector('i');
        if (sectionContent.classList.contains('expanded')) {
            sectionContent.classList.remove('expanded');
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        } else {
            sectionContent.classList.add('expanded');
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        }
    }

    // 4. Background Changing (Background Changing) Functions
    const presetColors = [
        '#121212', '#ffffff', '#007bff', '#00b8ff', '#1a202c', // Default, White, Blue, Light Blue, Dark Blue
        '#ff5722', '#4caf50', '#9c27b0', '#ffc107', '#607d8b', // Orange, Green, Purple, Amber, Blue Grey
        '#e91e63', '#00bcd4', '#795548', '#f44336' // Pink, Cyan, Brown, Red
    ];

    function setupBackgroundColorPresets() {
        backgroundColorPresets.innerHTML = '';
        presetColors.forEach(color => {
            const colorBox = document.createElement('div');
            colorBox.className = 'color-box';
            colorBox.style.backgroundColor = color;
            colorBox.title = color;
            colorBox.addEventListener('click', () => {
                currentSettings.background.type = 'color';
                currentSettings.background.value = color;
                applyBackground(currentSettings.background.type, currentSettings.background.value, currentSettings.background.opacity, currentSettings.background.blur);
                // Remove 'selected' class from all color boxes
                document.querySelectorAll('.color-box').forEach(box => box.classList.remove('selected'));
                // Add 'selected' class to the current color box
                colorBox.classList.add('selected');
            });
            backgroundColorPresets.appendChild(colorBox);
        });
        // Select default color
        const defaultColor = currentSettings.background.type === 'color' ? currentSettings.background.value : '#121212';
        const selectedBox = Array.from(backgroundColorPresets.children).find(box => box.style.backgroundColor === defaultColor);
        if (selectedBox) {
            selectedBox.classList.add('selected');
        }
    }

    function handleBackgroundImageSelect(event) {
        const files = event.target.files;
        if (files.length > 0) {
            currentSettings.background.images = []; // Clear previous images
            backgroundImagePreview.innerHTML = ''; // Clear preview

            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    currentSettings.background.images.push(e.target.result);
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    backgroundImagePreview.appendChild(img);
                    
                    // If it's the first image, set the background
                    if (currentSettings.background.images.length === 1) {
                        currentSettings.background.type = 'image';
                        currentSettings.background.value = e.target.result;
                        applyBackground(currentSettings.background.type, currentSettings.background.value, currentSettings.background.opacity, currentSettings.background.blur);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    }

    function applyBackground(type, value, opacity, blur) {
        const body = document.body;
        body.style.backgroundImage = 'none';
        body.style.backgroundColor = 'var(--bg-color)'; // Default background color based on theme

        if (type === 'color') {
            body.style.backgroundColor = value;
            body.classList.remove('custom-background');
        } else if (type === 'image' && value) {
            body.style.backgroundImage = `url('${value}')`;
            body.classList.add('custom-background');
        } else {
            body.classList.remove('custom-background');
        }

        body.style.opacity = opacity;
        body.style.filter = `blur(${blur}px)`;
        
        // Apply glass effect if in auto mode
        if (currentSettings.glassEffect === 'auto') {
            applyGlassEffect();
        }
    }

    function updateBackgroundLivePreview() {
        const opacity = parseFloat(backgroundOpacitySlider.value);
        const blur = parseFloat(backgroundBlurSlider.value);
        
        document.body.style.opacity = opacity;
        document.body.style.filter = `blur(${blur}px)`;
    }

    function clearBackground() {
        currentSettings.background = {
            type: 'none',
            value: '',
            opacity: 1,
            blur: 0,
            images: []
        };
        applyBackground('none', '', 1, 0);
        backgroundOpacitySlider.value = 1;
        backgroundBlurSlider.value = 0;
        backgroundImagePreview.innerHTML = '';
        // Remove 'selected' class from all color boxes
        document.querySelectorAll('.color-box').forEach(box => box.classList.remove('selected'));
        showError("Background cleared!");
    }

    // Initialize clipboard paste functionality
    function initializeClipboardPaste() {
        // Add paste event listener to the entire document
        document.addEventListener('paste', handlePasteEvent);
        
        // Also listen on the text input specifically
        userInput.addEventListener('paste', handlePasteEvent);
    }

    /**
     * Handles paste events from clipboard, specifically for images
     * @param {ClipboardEvent} event - The paste event
     */
    function handlePasteEvent(event) {
        // Get clipboard data
        const clipboardData = event.clipboardData || window.clipboardData;
        
        if (!clipboardData) return;
        
        // Check for files in clipboard
        const items = clipboardData.items;
        let hasImage = false;
        
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            
            // Check if the item is an image
            if (item.type.indexOf('image') !== -1) {
                hasImage = true;
                
                // Prevent default paste behavior for images
                event.preventDefault();
                
                // Get the file from clipboard
                const file = item.getAsFile();
                
                if (file) {
                    // Process the pasted image file
                    processFile(file);
                    
                    // Show success message
                    showError(`Image pasted: ${file.name || 'clipboard-image.png'} (${formatFileSize(file.size)})`);
                }
                
                break; // Process only the first image found
            }
        }
        
        // If pasting in input field and no image was found, allow normal text paste
        if (!hasImage && event.target === userInput) {
            // Let the default paste behavior handle text
            return;
        }
    }


    function setGenerateImageMode() {
        // Set placeholder text for image generation
        userInput.placeholder = "Describe an image....";
        userInput.focus();
        
        // Add visual indicator that we're in image mode
        userInput.style.borderColor = 'var(--primary-color)';
        
        // Store the mode for handling in send function
        userInput.dataset.mode = 'generate-image';
    }

    // উদাহরণ:
    window.addEventListener('resize', updateSidebarState);
    
    // পরে, component destroy হলে
    window.removeEventListener('resize', updateSidebarState);

