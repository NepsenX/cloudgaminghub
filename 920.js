(function() {
  document.addEventListener("keydown", function(e) {
    let blocked = false;

    // F12
    if (e.key === "F12") {
      blocked = true;
    }

    // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C
    if (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) {
      blocked = true;
    }

    // Ctrl+U (View Source)
    if (e.ctrlKey && e.key.toLowerCase() === "u") {
      blocked = true;
    }

    // Ctrl+S (Save the page)
    if (e.ctrlKey && e.key.toLowerCase() === "s") {
      blocked = true;
    }

    if (blocked) {
      e.preventDefault();
      e.stopPropagation();
      window.open(
        "https://nepsen.github.io/home",
        "_blank",
        "width=800,height=600,scrollbars=yes,resizable=yes"
      );
      return false;
    }
  });

  // Disable right-click (context menu)
  document.addEventListener("contextmenu", function(e) {
    e.preventDefault();
  });
})();
// Browser Error Simulation Script
(function() {
    // Check if already shown
    if (localStorage.getItem("backend-was-done") === "true") {
        // Don't show code error again, but still show offline if needed
        const isOffline = !navigator.onLine;
        const isWrongDomain = !location.hostname.endsWith("nepsen.github.io");
        
        if (isOffline || isWrongDomain) {
            // Create minimal overlay for offline/wrong domain scenario
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: #f8f9fa;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 99999;
                font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                color: #202124;
                padding: 20px;
                box-sizing: border-box;
            `;
            
            const browserWindow = document.createElement('div');
            browserWindow.style.cssText = `
                width: 100%;
                max-width: 700px;
                background: white;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                color: #202124;
            `;
            
            // Browser detection function
            function detectBrowser() {
                const ua = navigator.userAgent;
                let browser = "Unknown Browser";
                
                if (ua.includes("Chrome") && !ua.includes("Edg") && !ua.includes("OPR")) {
                    browser = "Chrome";
                } else if (ua.includes("Safari") && !ua.includes("Chrome")) {
                    browser = "Safari";
                } else if (ua.includes("Edg")) {
                    browser = "Edge";
                } else if (ua.includes("Firefox")) {
                    browser = "Firefox";
                } else if (ua.includes("SamsungBrowser")) {
                    browser = "Samsung Internet";
                } else if (ua.includes("OPR") || ua.includes("Opera")) {
                    browser = "Opera";
                } else if (ua.includes("UCBrowser")) {
                    browser = "UC Browser";
                } else if (ua.includes("Brave")) {
                    browser = "Brave";
                } else if (ua.includes("Vivaldi")) {
                    browser = "Vivaldi";
                } else if (ua.includes("Tor")) {
                    browser = "Tor Browser";
                } else {
                    browser = "Unknown";
                }
                
                return browser;
            }
            
            // Show offline message
            function showOfflineMessage(browser) {
                let icon = "🌐";
                let title = "";
                let message = "";
                
                if (browser === "Chrome") {
                    icon = "🦖";
                    title = "No internet";
                    message = "Try:\n• Checking the network cables, modem, and router\n• Reconnecting to Wi-Fi\n• Running Network Diagnostics";
                } else if (browser === "Firefox") {
                    icon = "🦊";
                    title = "Unable to connect";
                    message = "Firefox can't establish a connection to the server.";
                } else if (browser === "Safari") {
                    icon = "🍎";
                    title = "You Are Not Connected to the Internet";
                    message = "This page can't be displayed because your computer is currently offline.";
                } else if (browser === "Edge") {
                    icon = "🧩";
                    title = "Hmm... can't reach this page";
                    message = "It looks like you aren't connected to the internet. Try checking your network connection.";
                } else {
                    title = "No Internet Connection";
                    message = "Please check your network connection and try again.";
                }
                
                browserWindow.innerHTML = `
                    <div style="padding: 40px 20px; text-align: center;">
                        <div style="font-size: 80px; margin-bottom: 20px;">${icon}</div>
                        <div style="font-size: 28px; font-weight: 400; margin-bottom: 15px; color: #202124;">${title}</div>
                        <div style="font-size: 15px; color: #5f6368; margin-bottom: 25px; line-height: 1.5; white-space: pre-line;">${message}</div>
                        <div style="display: flex; gap: 10px; justify-content: center;">
                            <button style="padding: 10px 16px; border-radius: 4px; font-size: 14px; font-weight: 500; cursor: pointer; border: none; background: #1a73e8; color: white;" onclick="window.location.reload()">Try again</button>
                        </div>
                    </div>
                `;
                
                overlay.appendChild(browserWindow);
                document.body.appendChild(overlay);
            }
            
            const browser = detectBrowser();
            showOfflineMessage(browser);
        }
        return;
    }

    // Create overlay container
    const overlay = document.createElement('div');
    overlay.id = 'browser-error-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: #f8f9fa;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        color: #202124;
        padding: 20px;
        box-sizing: border-box;
    `;
    
    // Create browser window UI
    const browserWindow = document.createElement('div');
    browserWindow.style.cssText = `
        width: 100%;
        max-width: 700px;
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        color: #202124;
    `;
    
    // Browser tabs
    const tabs = document.createElement('div');
    tabs.style.cssText = `
        display: flex;
        background: #f1f3f4;
        padding: 0 12px;
        border-bottom: 1px solid #dadce0;
    `;
    
    const tab = document.createElement('div');
    tab.style.cssText = `
        padding: 12px 16px;
        font-size: 14px;
        color: #5f6368;
        border-bottom: 2px solid transparent;
        margin-right: 4px;
    `;
    
    const activeTab = document.createElement('div');
    activeTab.style.cssText = `
        padding: 12px 16px;
        font-size: 14px;
        color: #202124;
        border-bottom: 2px solid #1a73e8;
        background: white;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
    `;
    
    activeTab.textContent = 'Error';
    tab.textContent = 'New Tab';
    
    tabs.appendChild(activeTab);
    tabs.appendChild(tab);
    
    // Browser URL bar
    const urlBar = document.createElement('div');
    urlBar.style.cssText = `
        display: flex;
        align-items: center;
        padding: 12px 16px;
        background: #f8f9fa;
        border-bottom: 1px solid #dadce0;
    `;
    
    const securityIcon = document.createElement('div');
    securityIcon.style.cssText = `
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #0b8043;
        margin-right: 8px;
        position: relative;
    `;
    
    securityIcon.innerHTML = `
        <div style="position: absolute; top: 5px; left: 5px; width: 6px; height: 3px; border: 1px solid white; border-bottom: none; border-top-left-radius: 2px; border-top-right-radius: 2px;"></div>
        <div style="position: absolute; top: 8px; left: 3px; width: 10px; height: 5px; border: 1px solid white; border-top: none; border-bottom-left-radius: 2px; border-bottom-right-radius: 2px;"></div>
    `;
    
    const urlText = document.createElement('div');
    urlText.style.cssText = `
        flex: 1;
        background: white;
        padding: 8px 12px;
        border-radius: 4px;
        border: 1px solid #dadce0;
        font-size: 14px;
        color: #5f6368;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    `;
    
    urlText.textContent = window.location.href;
    
    urlBar.appendChild(securityIcon);
    urlBar.appendChild(urlText);
    
    // Error content
    const errorContent = document.createElement('div');
    errorContent.style.cssText = `
        padding: 40px 20px;
        text-align: center;
    `;
    
    const errorIcon = document.createElement('div');
    errorIcon.style.cssText = `
        font-size: 80px;
        margin-bottom: 20px;
    `;
    
    const errorTitle = document.createElement('div');
    errorTitle.style.cssText = `
        font-size: 28px;
        font-weight: 400;
        margin-bottom: 15px;
        color: #202124;
    `;
    
    const errorMessage = document.createElement('div');
    errorMessage.style.cssText = `
        font-size: 15px;
        color: #5f6368;
        margin-bottom: 25px;
        line-height: 1.5;
    `;
    
    const errorDetails = document.createElement('details');
    errorDetails.style.cssText = `
        background: #f8f9fa;
        border-radius: 6px;
        padding: 15px;
        margin: 20px 0;
        text-align: left;
        font-size: 13px;
        color: #5f6368;
        border-left: 4px solid #dadce0;
    `;
    
    const errorSummary = document.createElement('summary');
    errorSummary.style.cssText = `
        font-weight: 500;
        cursor: pointer;
        outline: none;
    `;
    
    errorSummary.textContent = 'Details';
    
    const errorDetailsText = document.createElement('div');
    errorDetailsText.style.cssText = `
        margin-top: 10px;
        font-family: monospace;
        white-space: pre-wrap;
        font-size: 12px;
    `;
    
    errorDetails.appendChild(errorSummary);
    errorDetails.appendChild(errorDetailsText);
    
    const buttons = document.createElement('div');
    buttons.style.cssText = `
        display: flex;
        gap: 10px;
        justify-content: center;
        margin-top: 25px;
    `;
    
    const primaryButton = document.createElement('button');
    primaryButton.style.cssText = `
        padding: 10px 16px;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        border: none;
        background: #1a73e8;
        color: white;
    `;
    
    const secondaryButton = document.createElement('button');
    secondaryButton.style.cssText = `
        padding: 10px 16px;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        border: 1px solid #dadce0;
        background: white;
        color: #1a73e8;
    `;
    
    primaryButton.textContent = 'Try again';
    secondaryButton.textContent = 'Learn more';
    
    buttons.appendChild(primaryButton);
    buttons.appendChild(secondaryButton);
    
    // Browser controls
    const browserControls = document.createElement('div');
    browserControls.style.cssText = `
        display: flex;
        align-items: center;
        padding: 8px 16px;
        background: #f8f9fa;
        border-top: 1px solid #dadce0;
        font-size: 13px;
        color: #5f6368;
    `;
    
    const controlsLeft = document.createElement('div');
    controlsLeft.style.cssText = `
        flex: 1;
        display: flex;
        align-items: center;
    `;
    
    const controlsRight = document.createElement('div');
    controlsRight.style.cssText = `
        display: flex;
        gap: 15px;
    `;
    
    const helpLink = document.createElement('a');
    helpLink.href = '#';
    helpLink.style.cssText = `
        color: #1a73e8;
        text-decoration: none;
    `;
    helpLink.textContent = 'Help';
    
    const dropdown = document.createElement('div');
    dropdown.style.cssText = `
        position: relative;
        display: inline-block;
    `;
    
    const dropdownButton = document.createElement('button');
    dropdownButton.style.cssText = `
        background: none;
        border: none;
        color: #5f6368;
        cursor: pointer;
        font-size: 13px;
    `;
    dropdownButton.textContent = '⋮';
    
    controlsRight.appendChild(helpLink);
    controlsRight.appendChild(dropdownButton);
    
    browserControls.appendChild(controlsLeft);
    browserControls.appendChild(controlsRight);
    
    // Assemble the browser window
    errorContent.appendChild(errorIcon);
    errorContent.appendChild(errorTitle);
    errorContent.appendChild(errorMessage);
    errorContent.appendChild(errorDetails);
    errorContent.appendChild(buttons);
    
    browserWindow.appendChild(tabs);
    browserWindow.appendChild(urlBar);
    browserWindow.appendChild(errorContent);
    browserWindow.appendChild(browserControls);
    
    overlay.appendChild(browserWindow);
    document.body.appendChild(overlay);
    
    // Browser detection function
    function detectBrowser() {
        const ua = navigator.userAgent;
        let browser = "Unknown Browser";
        
        if (ua.includes("Chrome") && !ua.includes("Edg") && !ua.includes("OPR")) {
            browser = "Chrome";
        } else if (ua.includes("Safari") && !ua.includes("Chrome")) {
            browser = "Safari";
        } else if (ua.includes("Edg")) {
            browser = "Edge";
        } else if (ua.includes("Firefox")) {
            browser = "Firefox";
        } else if (ua.includes("SamsungBrowser")) {
            browser = "Samsung Internet";
        } else if (ua.includes("OPR") || ua.includes("Opera")) {
            browser = "Opera";
        } else if (ua.includes("UCBrowser")) {
            browser = "UC Browser";
        } else if (ua.includes("Brave")) {
            browser = "Brave";
        } else if (ua.includes("Vivaldi")) {
            browser = "Vivaldi";
        } else if (ua.includes("Tor")) {
            browser = "Tor Browser";
        } else {
            browser = "Unknown";
        }
        
        return browser;
    }
    
    // Show realistic browser-like message
    function showMessage(type, browser) {
        let icon = "🌐";
        let title = "";
        let message = "";
        let details = "";
        
        // Gather user details
        const userDetails = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            languages: navigator.languages ? navigator.languages.join(', ') : 'Not available',
            cookieEnabled: navigator.cookieEnabled,
            javaEnabled: navigator.javaEnabled ? navigator.javaEnabled() : 'Not available',
            pdfViewerEnabled: navigator.pdfViewerEnabled || 'Not available',
            hardwareConcurrency: navigator.hardwareConcurrency || 'Not available',
            deviceMemory: navigator.deviceMemory || 'Not available',
            maxTouchPoints: navigator.maxTouchPoints || 'Not available',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            screen: `${screen.width}x${screen.height}`,
            colorDepth: `${screen.colorDepth} bit`,
            pixelDepth: `${screen.pixelDepth} bit`,
            availableScreen: `${screen.availWidth}x${screen.availHeight}`,
            innerSize: `${window.innerWidth}x${window.innerHeight}`,
            outerSize: `${window.outerWidth}x${window.outerHeight}`,
            location: window.location.href,
            referrer: document.referrer || 'No referrer',
            date: new Date().toString(),
            localStorage: typeof(Storage) !== "undefined" ? 'Available' : 'Not available',
            sessionStorage: typeof(Storage) !== "undefined" ? 'Available' : 'Not available',
            indexedDB: window.indexedDB ? 'Available' : 'Not available',
            serviceWorker: navigator.serviceWorker ? 'Available' : 'Not available',
            webGL: getWebGLInfo(),
            cookies: document.cookie || 'No cookies'
        };
        
        // Format user details for display
        let userDetailsText = "User Details:\n\n";
        for (const [key, value] of Object.entries(userDetails)) {
            userDetailsText += `${key}: ${value}\n`;
        }
        
        // Set content based on browser and error type
        if (browser === "Chrome") {
            icon = "🦖";
            if (type === "offline") {
                title = "No internet";
                message = "Try:\n• Checking the network cables, modem, and router\n• Reconnecting to Wi-Fi\n• Running Network Diagnostics";
                details = "ERR_INTERNET_DISCONNECTED\n\n" + userDetailsText;
            } else {
                title = "This site can't be reached";
                message = "Try:\n• Checking the connection\n• Checking the proxy and the firewall\n• Running Windows Network Diagnostics";
                details = "ERR_NAME_NOT_RESOLVED\n\n" + userDetailsText;
            }
        } else if (browser === "Firefox") {
            icon = "🦊";
            if (type === "offline") {
                title = "Unable to connect";
                message = "Firefox can't establish a connection to the server.";
                details = "NS_ERROR_UNKNOWN_HOST\n\n" + userDetailsText;
            } else {
                title = "Page isn't working";
                message = "The page isn't redirecting properly. An error occurred during a connection.";
                details = "NS_ERROR_CONNECTION_REFUSED\n\n" + userDetailsText;
            }
        } else if (browser === "Safari") {
            icon = "🍎";
            if (type === "offline") {
                title = "You Are Not Connected to the Internet";
                message = "This page can't be displayed because your computer is currently offline.";
                details = "Safari cannot open the page because your computer is not connected to the Internet.\n\n" + userDetailsText;
            } else {
                title = "Safari Can't Open the Page";
                message = "Safari can't open the page because the server can't be found.";
                details = "Safari cannot open the page. The error is: \"The server cannot be found\"\n\n" + userDetailsText;
            }
        } else if (browser === "Edge") {
            icon = "🧩";
            if (type === "offline") {
                title = "Hmm... can't reach this page";
                message = "It looks like you aren't connected to the internet. Try checking your network connection.";
                details = "ERR_INTERNET_DISCONNECTED\n\n" + userDetailsText;
            } else {
                title = "This page isn't working";
                message = "The site didn't send any data. Try running Windows Network Diagnostics";
                details = "ERR_EMPTY_RESPONSE\n\n" + userDetailsText;
            }
        } else if (browser === "Opera") {
            icon = "🎭";
            if (type === "offline") {
                title = "No internet connection";
                message = "Opera cannot connect to the internet. Please check your network connection and try again.";
                details = "ERR_INTERNET_DISCONNECTED\n\n" + userDetailsText;
            } else {
                title = "Connection failed";
                message = "Opera could not load the webpage because the server sent no data.";
                details = "ERR_EMPTY_RESPONSE\n\n" + userDetailsText;
            }
        } else {
            // Default error message
            icon = "🌐";
            if (type === "offline") {
                title = "No Internet Connection";
                message = "Please check your network connection and try again.";
                details = "ERR_INTERNET_DISCONNECTED\n\n" + userDetailsText;
            } else {
                title = "Unable to Load Content";
                message = "The content you requested is currently unavailable. Please try again later.";
                details = "ERR_CONNECTION_REFUSED\n\n" + userDetailsText;
            }
        }
        
        // Update the UI with the error message
        errorIcon.textContent = icon;
        errorTitle.textContent = title;
        errorMessage.textContent = message;
        errorMessage.style.whiteSpace = 'pre-line';
        errorDetailsText.textContent = details;
        
        // Add event listeners to buttons
        primaryButton.onclick = function() {
            window.location.reload();
        };
        
        secondaryButton.onclick = function() {
            window.open('https://support.google.com/chrome/answer/6098869', '_blank');
        };
    }
    
    // Helper function to get WebGL info
    function getWebGLInfo() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            
            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                }
                return 'Available (no debug info)';
            }
            return 'Not available';
        } catch (e) {
            return 'Error checking WebGL';
        }
    }
    
    const browser = detectBrowser();
    const isOffline = !navigator.onLine;
    const isWrongDomain = !location.hostname.endsWith("nepsen.github.io");
    
    // Offline / Wrong domain first
    if (isOffline || isWrongDomain) {
        showMessage("offline", browser);
        return;
    }
    
    // Online + correct domain -> fetch resources
    const resources = ["/cloudgaimghub/3.js"];
    let allFound = true;
    
    // Check resources
    Promise.all(resources.map(async (res) => {
        try {
            const resp = await fetch(res, { method: "HEAD" });
            if (!resp.ok) return false;
            return true;
        } catch(e) {
            return false;
        }
    })).then(results => {
        allFound = results.every(result => result);
        
        // Show code error if any resource missing
        if(!allFound) {
            showMessage("codeError", browser);
            localStorage.setItem("backend-was-done","true");
        } else {
            // Remove the overlay if everything is fine
            document.body.removeChild(overlay);
        }
    });
})();
