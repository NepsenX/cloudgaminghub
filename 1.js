
    // Configuration
    const config = {
        apiKey: "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",
        apiKey2:"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",
        apiKey3:"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",
        apiKey4:"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",
        apiKey1:"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",
        apiEndpoint: "https://openrouter.ai/api/v1/chat/completions",
        model: "deepseek/deepseek-r1:free",
        temperature: 0.7,
        maxTokens: 164000,
        youtubeApiKey: "AIzaSyAqXHbNakvVR_SCW3_HgEaycrO2oL89URA"
    };

    // DOM Elements
    const chatContainer = document.getElementById('chat-container');        //create by nepsen
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const errorMessage = document.getElementById('error-message');
    const welcomeMessage = document.getElementById('welcome-message');
    const themeToggle = document.getElementById('theme-toggle');
    const newChatButton = document.getElementById('new-chat-sidebar');
    const currentModelDisplay = document.getElementById('current-model');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const chatHistory = document.getElementById('chat-history');
    const currentChatTitle = document.getElementById('current-chat-title');
    const userAccountDisplay = document.getElementById('user-account-display');

    // State
    let conversationHistory = [];
    let isDarkMode = localStorage.getItem('theme') === 'dark' || 
                    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    let currentModel = config.model;
    let isStreaming = false;
    let currentStreamResponse = '';
    let isSidebarOpen = localStorage.getItem('sidebarState') !== 'closed';
    let currentChatId = localStorage.getItem('currentChatId') || generateId();
    let chats = JSON.parse(localStorage.getItem('chats')) || [];
    let userEmail = localStorage.getItem('userEmail') || null;

    // Initialize
    init();
    
        function init() {
            // Check for saved theme preference
            if (localStorage.getItem('theme') === 'dark' || 
                (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
                isDarkMode = true;
            }

            // Check for sidebar state
            if (localStorage.getItem('sidebarState') === 'closed') {
                toggleSidebar();
            }

            // Event listeners
            userInput.addEventListener('keydown', handleInputKeydown);
            themeToggle.addEventListener('click', toggleTheme);
            newChatButton.addEventListener('click', startNewChat);
            sidebarToggle.addEventListener('click', toggleSidebar);

            // Close sidebar when clicking outside on mobile
            document.addEventListener('click', (e) => {
                if (window.innerWidth <= 768 && isSidebarOpen && 
                    !sidebar.contains(e.target) && 
                    e.target !== sidebarToggle) {
                    toggleSidebar();
                }
            });

            // Load chat history
            loadChatHistory();
            
            // Update user account display
            updateUserAccountDisplay();

            // Focus input on page load
            userInput.focus();
        }
    function updateChatVisibility() {
        const hasMessages = conversationHistory.length > 0;
        chatContainer.classList.toggle('active', hasMessages);
        welcomeMessage.classList.toggle('active', !hasMessages);
    }

    function generateId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    // Update the toggleSidebar function:
    function toggleSidebar() {
        isSidebarOpen = !isSidebarOpen;
        localStorage.setItem('sidebarState', isSidebarOpen ? 'open' : 'closed');
        updateSidebarState();
    }

    function updateTheme() {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }

    function toggleTheme() {
        isDarkMode = !isDarkMode;
        
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }
    
    function updateModelDisplay() {
        currentModelDisplay.textContent = 'NeoDot';
    }

    function loadChatHistory() {
        chatHistory.innerHTML = '';
        
        if (chats.length === 0) {
            // Create a default chat if none exists
            chats.push({        //create by nepsen
                id: currentChatId,
                title: 'New chat',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            localStorage.setItem('chats', JSON.stringify(chats));
        }
        
        chats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        
        chats.forEach(chat => {
            const chatItem = document.createElement('div');
            chatItem.className = `flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${chat.id === currentChatId ? 'bg-gray-800' : 'hover:bg-gray-800'}`;
            chatItem.innerHTML = `
                <i class="fas fa-comment"></i>
                <span class="truncate flex-1">${chat.title}</span>
                <i class="fas fa-trash text-gray-500 hover:text-red-400" onclick="deleteChat(event, '${chat.id}')"></i>
            `;
            
            chatItem.addEventListener('click', () => loadChat(chat.id));
            
            chatHistory.appendChild(chatItem);
        });
    }

    function deleteChat(event, chatId) {
        event.stopPropagation();
        
        if (confirm('Are you sure you want to delete this chat?')) {
            // Remove from chats array
            chats = chats.filter(c => c.id !== chatId);
            localStorage.setItem('chats', JSON.stringify(chats));
            
            // Remove chat data
            localStorage.removeItem(`chat_${chatId}`);
            
            // If we're deleting the current chat, start a new one
            if (chatId === currentChatId) {
                startNewChat();
            }
            
            // Update chat history
            loadChatHistory();
        }
    }

    function startNewChat() {
        if (isStreaming) {
            // If we're streaming, stop the current stream
            isStreaming = false;
            hideTypingIndicator();
        }
        
        currentChatId = generateId();
        localStorage.setItem('currentChatId', currentChatId);
        currentChatTitle.textContent = 'New chat';
        
        chats.unshift({
            id: currentChatId,
            title: 'New chat',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        localStorage.setItem('chats', JSON.stringify(chats));
        
        // Reset visibility
        conversationHistory = [];
        updateChatVisibility();
        localStorage.setItem(`chat_${currentChatId}`, JSON.stringify(conversationHistory));
        
        // Clear and show chat container
        chatContainer.innerHTML = '';        //create by nepsen
        // Reset visibility
        chatContainer.classList.remove('false');
        welcomeMessage.classList.add('active');
        userInput.value = '';
        userInput.focus();
        
        // Update chat history
        loadChatHistory();
        
        // Close sidebar on mobile
        if (window.innerWidth <= 768) {
            toggleSidebar();
        }
    }

    function updateChatTitle(newTitle) {
        let chat = chats.find(c => c.id === currentChatId);
        if (chat) {
            chat.title = newTitle.replace(/"/g, ''); // Remove quotes if API returns them
            chat.updatedAt = new Date().toISOString();
        } else {
            // This case should ideally not happen if startNewChat correctly initializes
            chat = {
                id: currentChatId,
                title: newTitle.replace(/"/g, ''),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            chats.unshift(chat);
        }
        localStorage.setItem('chats', JSON.stringify(chats));
        currentChatTitle.textContent = chat.title; // Update display
        loadChatHistory(); // Refresh sidebar
    }


    function insertExample(text) {
        userInput.value = text;
        userInput.focus();
        adjustTextareaHeight();
    }

    function adjustTextareaHeight() {
        userInput.style.height = 'auto';
        userInput.style.height = (userInput.scrollHeight) + 'px';
    }

    function handleInputKeydown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }

    function formatMarkdown(content, isStreaming = false, isHistory = false) {
        // First convert with marked.js for proper markdown parsing
        let formatted = marked.parse(content);
        
        // Process YouTube links - replace with video carousel
        if (!isStreaming && !isHistory) {
            const youtubeRegex = /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/g;
            const youtubeMatches = [...content.matchAll(youtubeRegex)];
            
            if (youtubeMatches.length > 0) {
                // Create video carousel section
                let videoSection = '<div class="video-carousel">';
                
                youtubeMatches.forEach(match => {
                    const videoId = match[1];
                    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
                    const downloadLink = `https://www.y2mate.com/youtube/${videoId}`;
                    
                    videoSection += `
                        <div class="video-carousel-item">
                            <div class="video-container">
                                <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
                            </div>
                            <a href="${downloadLink}" target="_blank" class="download-btn">
                                <i class="fas fa-download mr-1"></i> Download
                            </a>
                        </div>
                    `;
                });
                
                videoSection += '</div>';
                
                // Replace YouTube links in the content with our video section
                formatted = formatted.replace(youtubeRegex, '') + videoSection;
            }
        }        //create by nepsen
        
        // Add source attribution if URL is detected
        const urlRegex = /https?:\/\/[^\s]+/g;
        const urlMatch = content.match(urlRegex);
        
        if (Array.isArray(urlMatch) && urlMatch.length > 0) {
            try {
                const url = new URL(urlMatch[0]);
                formatted += `
                    <div class="source-attribution">
                        <img src="https://www.google.com/s2/favicons?domain=${url.hostname}" alt="${url.hostname}">
                        <span>Source: ${url.hostname}</span>
                    </div>
                `;
            } catch (e) {
                console.warn('Invalid URL skipped:', urlMatch[0]);
            }
        }

        
        return formatted;
    }

    function addCodeBlockButtons(codeBlock) {
        const preElement = codeBlock.parentElement;
    
        // Ensure pre is positioned relative
        preElement.style.position = 'relative';
    
        // Avoid adding buttons multiple times
        if (preElement.querySelector('.copy-button-container')) return;
    
        // Create buttons container
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'copy-button-container flex gap-2 absolute top-2 right-2 z-10';
    
        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs flex items-center gap-1';
        copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy';
    
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(codeBlock.textContent).then(() => {
                copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                copyButton.innerHTML = '<i class="fas fa-times"></i> Failed';
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy';
                }, 2000);
            });
        });
    
        buttonsDiv.appendChild(copyButton);
    
        // Check if the code block is HTML
        const codeLanguage = codeBlock.getAttribute('data-lang') || codeBlock.className || '';
        const isHTML = codeLanguage.toLowerCase().includes('html');
    
        if (isHTML) {
            // Create run button
            const runButton = document.createElement('button');
            runButton.className = 'px-2 py-1 bg-green-700 text-white rounded text-xs flex items-center gap-1';
            runButton.innerHTML = '<i class="fas fa-play"></i> Run';
    
            runButton.addEventListener('click', () => {
                const htmlContent = codeBlock.textContent;
                const newWindow = window.open();
                newWindow.document.open();
                newWindow.document.write(htmlContent);
                newWindow.document.close();
            });
    
            buttonsDiv.appendChild(runButton);
        }
    
        preElement.appendChild(buttonsDiv);
    }


    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'group w-full assistant-message';
        typingDiv.id = 'typing-indicator-container';
        
        const messageWrapper = document.createElement('div');
        messageWrapper.className = 'flex p-4 gap-4 text-base md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl mx-auto';
        
        const avatar = document.createElement('div');
        avatar.className = 'flex-shrink-0 flex flex-col relative items-end';
        
        const avatarIcon = document.createElement('div');
        avatarIcon.className = 'w-8 h-8 rounded-full bg-green-600 flex items-center justify-center';
        avatarIcon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 7C4 5.11438 4 4.17157 4.58579 3.58579C5.17157 3 6.11438 3 8 3H16C17.8856 3 18.8284 3 19.4142 3.58579C20 4.17157 20 5.11438 20 7V15C20 16.8856 20 17.8284 19.4142 18.4142C18.8284 19 17.8856 19 16 19H8C6.11438 19 5.17157 19 4.58579 18.4142C4 17.8284 4 16.8856 4 15V7Z" fill="currentColor"/><path d="M17 12C17 14.2091 15.2091 16 13 16C10.7909 16 9 14.2091 9 12C9 9.79086 10.7909 8 13 8C15.2091 8 17 9.79086 17 12Z" fill="white"/></svg>';
        
        avatar.appendChild(avatarIcon);
                //create by nepsen
        const messageContent = document.createElement('div');
        messageContent.className = 'relative flex-1 min-w-0 flex flex-col';
        
        const typingContent = document.createElement('div');
        typingContent.className = 'flex items-center text-gray-400';
        typingContent.innerHTML = '<span class="typing-indicator"><span></span><span></span><span></span></span> NeoDot is thinking...';
        
        messageContent.appendChild(typingContent);
        
        messageWrapper.appendChild(avatar);
        messageWrapper.appendChild(messageContent);
        //create by nepsen
        typingDiv.appendChild(messageWrapper);
        chatContainer.appendChild(typingDiv);
        
        // Scroll to bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator-container');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    function showError(message) {
        errorMessage.textContent = message;
        setTimeout(() => {        //create by nepsen
            errorMessage.textContent = '';
        }, 5000);
    }

    function updateUserAccountDisplay() {
        const userAccountContainer = document.querySelector('.user-account-container');
        const avatarIcon = userAccountContainer.querySelector('.avatar-icon');
        const userAccountDisplay = document.getElementById('user-account-display');
    
        // Get user email from localStorage
        const userEmail = localStorage.getItem('userEmail');
    
        if (userEmail) {
            // Mask the email (e.g., "us...@domain.com")
            const [username, domain] = userEmail.split('@');
            const maskedUsername = username.substring(0, 2) + '...';
            userAccountDisplay.textContent = `${maskedUsername}@${domain}`;
    
            // Generate Gravatar URL (based on MD5 hash of email)
            const emailHash = md5(userEmail.trim().toLowerCase());
            const gravatarUrl = `https://www.gravatar.com/avatar/${emailHash}?s=64&d=identicon`;
    
            // Set the image
            avatarIcon.innerHTML = '';
            const avatarImg = document.createElement('img');
            avatarImg.src = gravatarUrl;
            avatarImg.alt = 'User Avatar';
            avatarImg.className = 'w-6 h-6 rounded-full';
            avatarIcon.appendChild(avatarImg);
        } else {
            userAccountDisplay.textContent = 'Guest';
            avatarIcon.innerHTML = '<i class="fas fa-user"></i>';
        }
    }
    
    async function searchVideos(query) {
        try {
            // Step 1: Search videos
            const searchResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(query)}&type=video&key=${config.youtubeApiKey}`);
            const searchData = await searchResponse.json();
    
            const videoIds = searchData.items.map(item => item.id.videoId).join(',');
    
            // Step 2: Get video statistics and details
            const videoDetailsResponse = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${config.youtubeApiKey}`);
            const videoDetailsData = await videoDetailsResponse.json();
    
            // Step 3: Filter videos longer than 5 minutes
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
                    // Sort by popularity score
                    const aScore = a.views + a.likes * 5;
                    const bScore = b.views + b.likes * 5;
                    return bScore - aScore;
                });
    
            // Step 4: Random number of videos (1 to 3)
            const randomCount = Math.floor(Math.random() * 3) + 1;
            return filteredVideos.slice(0, randomCount);
    
        } catch (error) {
            console.error("Error fetching videos:", error);
            return [];
        }
    }
    
    // Helper: Convert ISO 8601 duration (e.g., PT6M30S) to seconds
    function parseISO8601Duration(duration) {
        const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        const hours = parseInt(match?.[1] || 0);
        const minutes = parseInt(match?.[2] || 0);
        const seconds = parseInt(match?.[3] || 0);
        return hours * 3600 + minutes * 60 + seconds;
    }


    // Check for personal information questions
    function checkPersonalInfoQuestions(text) {
        const trimmedText = text.trim();
        const lowerCaseText = trimmedText.toLowerCase();
        
        // Define questions related to name, email and password
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
    
        const ipQuestions = [
            "what is my ip?", "what's my ip address?", "do you know my ip?", "tell me my ip address",
            "show my ip", "what is my internet address"
        ];
    
        // Helper function to check exact match (case insensitive)
        function isExactMatch(input, phrases) {
            return phrases.some(phrase => input === phrase.toLowerCase());
        }
    
        // Check name-related questions and declarations
        if (isExactMatch(lowerCaseText, nameQuestions)) {
            const userName = localStorage.getItem('userName') || 'Not Set';
            return { type: 'name', response: `Your name is ${userName}` };
        }
    
        // Check for name declarations with strict patterns and length limit
        const nameDeclarationPatterns = [
            { prefix: "my name is", maxLength: 50 },
            { prefix: "i am", maxLength: 50 },
            { prefix: "call me", maxLength: 50 }
        ];
    
        for (const pattern of nameDeclarationPatterns) {
            if (lowerCaseText.startsWith(pattern.prefix)) {
                const name = trimmedText.substring(pattern.prefix.length).trim();
                
                // Only accept as name if it's reasonably short and not empty
                if (name.length > 0 && name.length <= pattern.maxLength) {
                    localStorage.setItem('userName', name);
                    return { type: 'name', response: `Okay, I'll remember your name is ${name}` };
                }
            }
        }
    
        // Check email-related questions and declarations
        if (isExactMatch(lowerCaseText, emailQuestions)) {
            const userEmail = localStorage.getItem('userEmail') || 'Not Set';
            return { type: 'email', response: `Your email is ${userEmail}` };
        }
    
        // Check for email declarations with strict patterns
        const emailDeclarationPatterns = [
            { prefix: "my email is", validator: isValidEmail },
            { separator: "email address is", validator: isValidEmail }
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
    
            if (email && pattern.validator(email)) {
                localStorage.setItem('userEmail', email);
                userEmail = email;
                updateUserAccountDisplay();
                return { type: 'email', response: `I've stored your email address as ${email}` };
            }
        }
    
        // Check password-related questions
        if (passwordQuestions.some(q => 
            lowerCaseText === q.toLowerCase() || 
            (q.length > 10 && lowerCaseText.includes(q.toLowerCase())))
        ) {
            return { type: 'password', response: "I can't provide or store passwords for security reasons." };
        }
    
        // Check IP-related questions
        if (ipQuestions.some(q => 
            lowerCaseText === q.toLowerCase() || 
            (q.length > 10 && lowerCaseText.includes(q.toLowerCase())))
        ) {
            return { type: 'ip', response: "For security reasons, I can't provide IP address information." };
        }
    
        return null;
    }
    
    // Helper function to validate email format
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email) && email.length <= 100;
    }
// Image generation utility (shows 4 images side-by-side)
function generateResponseImage(keyword) {
    let imagesHTML = '';
    for (let i = 1; i <= 2; i++) {
        const imageUrl = `https://picsum.photos/seed/${encodeURIComponent(keyword + i)}/300/200`;
        imagesHTML += `
<div class="response-image">
    <img src="${imageUrl}" alt="${keyword.replace(/"/g, '&quot;')} ${i}">
</div>
        `;
    }
    return `<div class="response-image-row">${imagesHTML}</div>`;
}


// Main sendMessage function with integrated image support
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Clear errors and disable input
    errorMessage.textContent = '';
    userInput.disabled = false;
    sendButton.disabled = false;

    // Check personal questions first
    const personalInfoResponse = checkPersonalInfoQuestions(message);
    if (personalInfoResponse) {
        addMessage('user', message);
        userInput.value = '';
        adjustTextareaHeight();
        addMessage('assistant', personalInfoResponse.response);
        conversationHistory.push(
            { role: 'user', content: message },
            { role: 'assistant', content: personalInfoResponse.response }
        );
        saveConversation();
        enableInput();
        return;
    }

    // Add user message
    addMessage('user', message);
    userInput.value = '';
    adjustTextareaHeight();
    conversationHistory.push({ role: 'user', content: message });

    // Show typing indicator
    showTypingIndicator();

    try {
        // Generate chat title if first message
        const isFirstMessageInNewChat = conversationHistory.length === 1 && currentChatTitle.textContent === 'New chat';
        if (isFirstMessageInNewChat) {
            try {
                const titleMessages = [
                    { role: 'system', content: 'Generate a very short, concise, and descriptive title (3-7 words) for the following user message. Respond with just the title, no extra text, no quotes.' },
                    { role: 'user', content: message }
                ];
                const titleResponse = await callOpenRouterAPI(titleMessages);
                updateChatTitle(titleResponse.trim().replace(/^"|"$/g, ''));
            } catch (titleError) {
                console.log('Title generation failed:', titleError);
                updateChatTitle(message.split(/\s+/).slice(0, 5).join(' '));
            }
        }

        // Get videos
        let videos = [];
        try {
            videos = await searchVideos(message) || [];
        } catch (videoError) {
            console.log('Video search failed:', videoError);
        }

        // Try knowledge base first
        let knowledgeResponse = await getKnowledgeResponse(message);
        let aiResponse = '';
        
        if (!knowledgeResponse || knowledgeResponse.includes('No information found')) {
            try {
                aiResponse = await callOpenRouterAPI(conversationHistory);
            } catch (aiError) {
                console.log('AI response failed:', aiError);
                aiResponse = "Here's what I found:";
            }
        }

        // Build response
        let fullResponse = '';
        
        if (knowledgeResponse && !knowledgeResponse.includes('No information found')) {
            fullResponse += knowledgeResponse;
        } else {
            // Only show image when using AI response
            fullResponse += generateResponseImage(message);
            fullResponse += `<div class="ai-response">${aiResponse}</div>`;
        }
        
        // Add videos
        if (videos.length > 0) {
            fullResponse += `<div class="videos-section">`;
            videos.forEach(video => {
                fullResponse += `
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
            fullResponse += `</div>`;
        } else {
            fullResponse += `<div class="no-videos">No related videos found</div>`;
        }

        // Final fallback
        if (!fullResponse) {
            fullResponse = "I couldn't find any information. Please try rephrasing your question.";
        }

        // Display and save
        hideTypingIndicator();
        addMessage('assistant', fullResponse);
        conversationHistory.push({ role: 'assistant', content: fullResponse });
        saveConversation();
    } catch (error) {
        console.error('Error:', error);
        hideTypingIndicator();
        addMessage('assistant', "I'm having trouble responding. Please try again later.");
        conversationHistory.push({ role: 'assistant', content: "I'm having trouble responding. Please try again later." });
        saveConversation();
    } finally {
        enableInput();
    }
}

// Enhanced responsive CSS for images (add once)
if (!document.querySelector('style#response-image-style')) {
    const style = document.createElement('style');
    style.id = 'response-image-style';
    style.textContent = `
        .response-image-row {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            justify-content: center;
            margin-bottom: 20px;
        }
        .response-image {
            flex: 0 1 45%;
            max-width: 45%;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            background: #f5f5f5;
        }
        .response-image img {
            width: 100%;
            height: auto;
            display: block;
            min-height: 200px;
            object-fit: cover;
        }
        @media (max-width: 768px) {
            .response-image {
                flex: 0 1 45%;
                max-width: 45%;
            }
            .response-image img {
                min-height: 150px;
            }
        }
        @media (max-width: 480px) {
            .response-image {
                flex: 0 1 100%;
                max-width: 100%;
            }
        }
    `;
    document.head.appendChild(style);
}
    
    // New function with retry logic for API calls
    async function callOpenRouterAPIWithRetry(messages, retries = 2) {
        try {
            return await callOpenRouterAPI(messages);
        } catch (error) {
            if (retries > 0) {
                console.log(`Retrying API call (${retries} attempts left)...`);
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
                return await callOpenRouterAPIWithRetry(messages, retries - 1);
            }
            throw error;
        }
    }
    
    // Improved fallback response generator
    function getFallbackResponse(query, knowledgeAttempted, aiAttempted) {
        const fallbacks = [
            "I'm having trouble finding information about that. Could you try rephrasing?",
            "I couldn't retrieve an answer for that question. Please try again later.",
            "My sources didn't return any results for that query. Maybe try a different question?",
            "I'm unable to provide an answer right now. You might find what you're looking for by searching online."
        ];
        
        // More specific fallbacks based on what failed
        if (!knowledgeAttempted && !aiAttempted) {
            return "I couldn't connect to any information sources. Please check your internet connection.";
        }
        if (knowledgeAttempted && !aiAttempted) {
            return "I couldn't find any knowledge about that topic. Maybe try asking differently?";
        }
        
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }
    
    // New function to get knowledge-based responses from multiple free APIs
    async function getKnowledgeResponse(query) {
        // Try DuckDuckGo Instant Answer API first (no key required)
        try {
            const ddgResponse = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`);
            if (ddgResponse.ok) {
                const data = await ddgResponse.json();
                
                // Check if we have a good response
                if (data.AbstractText || data.RelatedTopics?.length > 0) {
                    let response = `<div class="knowledge-response">`;
                    
                    // Add image if available
                    if (data.Image) {
                        response += `<img src="https://duckduckgo.com${data.Image}" class="knowledge-image" alt="${data.Heading || query}">`;
                    }
                    
                    response += `<div class="knowledge-text">`;
                    
                    // Add heading
                    if (data.Heading) {
                        response += `<h3>${data.Heading}</h3>`;
                    }
                    
                    // Add abstract text
                    if (data.AbstractText) {
                        response += `<p>${data.AbstractText}</p>`;
                    }
                    
                    // Add related topics
                    if (data.RelatedTopics?.length > 0) {
                        response += ``;
                        data.RelatedTopics.slice(0, 3).forEach(topic => {
                            if (topic.FirstURL && topic.Text) {
                                response += `<li><a href="${topic.FirstURL}" target="_blank">${topic.Text}</a></li>`;
                            }
                        });
                        response += `</ul></div>`;
                    }
                    
                    // Add source link
                    if (data.AbstractURL) {
                        response += `<a href="${data.AbstractURL}" target="_blank" class="source-link">Read more</a>`;
                    }
                    
                    response += `</div></div>`;
                    return response;
                }
            }
        } catch (ddgError) {
            console.log('DuckDuckGo search failed:', ddgError);
        }
    
        // Try Wikipedia API (no key required)
        try {
            const wikiResponse = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
            if (wikiResponse.ok) {
                const data = await wikiResponse.json();
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
                    return response;
                }
            }
        } catch (wikiError) {
            console.log('Wikipedia search failed:', wikiError);
        }
    
        // Try Wordnik for definitions (no key required for limited use)
        try {
            const wordnikResponse = await fetch(`https://api.wordnik.com/v4/word.json/${encodeURIComponent(query)}/definitions?limit=3&sourceDictionaries=all&useCanonical=true`);
            if (wordnikResponse.ok) {
                const definitions = await wordnikResponse.json();
                if (definitions.length > 0) {        //create by nepsen
                    let response = `<div class="knowledge-response">`;
                    response += `<div class="knowledge-text">`;
                    response += `<h3>Definition of ${query}</h3>`;
                    definitions.slice(0, 3).forEach((def, index) => {
                        response += `<p><strong>${index + 1}.</strong> ${def.text}</p>`;
                    });
                    response += `<a href="https://www.wordnik.com/words/${encodeURIComponent(query)}" target="_blank" class="source-link">More definitions</a>`;
                    response += `</div></div>`;
                    return response;
                }
            }
        } catch (wordnikError) {
            console.log('Wordnik search failed:', wordnikError);
        }
        return null; // Return null if no knowledge found
    }
    // Modified addMessage function to ensure proper avatar and message display
    function addMessage(role, content, isHistory = false) {
        // Update visibility when adding first message
        if (conversationHistory.length === 0) {
            updateChatVisibility();
        }
    
        const messageDiv = document.createElement('div');
        messageDiv.className = `group w-full ${role === 'user' ? 'user-message' : 'assistant-message'}`;
        
        const messageWrapper = document.createElement('div');
        messageWrapper.className = `flex p-4 gap-4 text-base md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl mx-auto`;
        
        const avatar = document.createElement('div');
        avatar.className = `flex-shrink-0 flex flex-col relative items-end`;
        
        const avatarIcon = document.createElement('div');
        avatarIcon.className = `w-8 h-8 rounded-full flex items-center justify-center ${role === 'user' ? 'bg-blue-600' : 'bg-green-600'}`;
        avatarIcon.innerHTML = role === 'user' ? 
            '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" fill="currentColor"/><path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" fill="currentColor"/></svg>' : 
            '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z" fill="var(--primary-color)"/><path d="M12 6C8.686 6 6 8.686 6 12C6 15.314 8.686 18 12 18C15.314 18 18 15.314 18 12C18 8.686 15.314 6 12 6Z" fill="white"/><path d="M12 10C10.895 10 10 10.895 10 12C10 13.105 10.895 14 12 14C13.105 14 14 13.105 14 12C14 10.895 13.105 10 12 10Z" fill="var(--primary-color)"/></svg>';
        
        avatar.appendChild(avatarIcon);
        
        const messageContent = document.createElement('div');
        messageContent.className = 'relative flex-1 min-w-0 flex flex-col';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-markdown flex-1';
        contentDiv.innerHTML = formatMarkdown(content, false, isHistory);
        
        messageContent.appendChild(contentDiv);
        
        // Always show avatar on left, message on right
        messageWrapper.appendChild(avatar);
        messageWrapper.appendChild(messageContent);
        
        messageDiv.appendChild(messageWrapper);
        chatContainer.appendChild(messageDiv);
        
        // Apply syntax highlighting
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
            addCodeBlockButtons(block);
        });
        
        // Scroll to bottom
        messageDiv.scrollIntoView({ behavior: 'smooth' });
        
        updateChatVisibility();
        
        return messageDiv;
    }
        
    function loadChat(chatId) {
        const chat = chats.find(c => c.id === chatId);
        if (!chat) return;
        
        currentChatId = chatId;
        currentChatTitle.textContent = chat.title;
        
        // Load conversation history
        const chatData = JSON.parse(localStorage.getItem(`chat_${chatId}`)) || [];
        conversationHistory = chatData;
        
        // Clear and render messages (only once)
        chatContainer.innerHTML = '';
        conversationHistory.forEach(msg => {
            addMessage(msg.role, msg.content, true);
        });
        
        // Update visibility after loading
        updateChatVisibility();
        if (conversationHistory.length === 0) {
            welcomeMessage.style.display = 'block';
        } else {
            welcomeMessage.style.display = 'none';
        }
                //create by nepsen
        // Update chat history UI
        loadChatHistory();
        
        // Close sidebar on mobile
        if (window.innerWidth <= 768) {
            toggleSidebar();
        }
    }

        
    // Save conversation to localStorage (unchanged from previous)
    function saveConversation() {
        // Save current conversation
        localStorage.setItem(`chat_${currentChatId}`, JSON.stringify(conversationHistory));
        
        // Update chat list        //create by nepsen
        const chatIndex = chats.findIndex(c => c.id === currentChatId);
        if (chatIndex >= 0) {
            chats[chatIndex].updatedAt = new Date().toISOString();
        } else {
            chats.unshift({
                id: currentChatId,
                title: currentChatTitle.textContent || 'New chat',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        }
        localStorage.setItem('chats', JSON.stringify(chats));
    }
    async function callOpenRouterAPI(message) {
        const apiKeys = [
            config.apiKey,  // Primary key
            config.apiKey1, // Fallback 1
            config.apiKey2, // Fallback 2
            config.apiKey3, // Fallback 3
            config.apiKey4  // Fallback 4
        ].filter(Boolean); // Remove empty keys
    
        // STRICT NeoDot identity enforcement
        const fullMessage = [
            {
                role: "system",
                content: "You are **NeoDot**, a logical and structured chatbot created by Nepsen. " +
                         "You **must always** respond as NeoDot, never as any other AI (e.g., not DeepSeek, ChatGPT, etc.). " +
                         "Your responses should be concise, technically precise, and maintain a neutral tone. " +
                         "If asked about your identity, respond: 'I am NeoDot, a logical code-base chatbot by Nepsen.'"
            },
            ...(Array.isArray(message) ? message : [message])
        ];
    
        const body = {
            model: currentModel,
            messages: fullMessage,
            temperature: config.temperature,
            max_tokens: config.maxToken,
        };
    
        let lastError = null;
        let keySpecificErrors = [];
    
        for (let i = 0; i < apiKeys.length; i++) {
            const apiKey = apiKeys[i];
            try {
                const response = await fetch(config.apiEndpoint, {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': window.location.href,
                        'X-Title': 'NeoDot (by Nepsen)'
                    },
                    body: JSON.stringify(body)
                });
    
                if (!response.ok) {
                    const errorData = await response.json();
                    const errorMsg = errorData.error?.message || `API error (Key ${i+1}: ${apiKey.slice(0, 5)}...)`;
                    keySpecificErrors.push(`API Key ${i+1} failed: ${errorMsg}`);
                    throw new Error(errorMsg);
                }
    
                const data = await response.json();
                return data.choices?.[0]?.message?.content || "NeoDot couldn't generate a response.";
    
            } catch (error) {
                console.error(`NeoDot API Error (Key ${i+1}: ${apiKey?.slice(0, 5)}...):`, error);
                lastError = error;
                
                // If this is the last key and we're still failing, show all key-specific errors
                if (i === apiKeys.length - 1) {
                    console.error("NeoDot: All API keys failed. Key-specific errors:", keySpecificErrors);
                    return "NeoDot is currently unavailable. Please try again later.";
                }
                
                await new Promise(resolve => setTimeout(resolve, 500)); // Small delay before retry
            }
        }
    
        // This will only be reached if there are no API keys at all
        console.error("NeoDot: please try later.");
        return "NeoDot is currently unavailable. please try later.";
    }
    // Update the updateSidebarState function:
    function updateSidebarState() {
        const sidebarOverlay = document.getElementById('sidebar-overlay');
        
        if (window.innerWidth <= 768) {
            // Mobile behavior
            if (isSidebarOpen) {
                sidebar.classList.add('sidebar-open');
                sidebarOverlay.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            } else {
                sidebar.classList.remove('sidebar-open');
                sidebarOverlay.classList.remove('active');
                document.body.style.overflow = ''; // Allow scrolling
            }
        } else {
            // Desktop behavior - always visible
            sidebar.style.transform = 'translateX(0)';
            sidebarOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Allow scrolling
        }
    }

    // Add this new function to manage visibility
    function resetChatView() {
        // Hide all existing messages
        const messages = document.querySelectorAll('.user-message, .assistant-message');
        messages.forEach(msg => {
            msg.style.display = 'none';
        });
        
        // Show the chat container        //create by nepsen
        chatContainer.style.display = 'block';
        
        // Show welcome message if no history
        if (conversationHistory.length === 0) {
            welcomeMessage.style.display = 'block';
        } else {
            welcomeMessage.style.display = 'none';
        }
    }
