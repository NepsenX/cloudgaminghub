/*
 * Comprehensive Security System for Web Protection
 * Version 4.0.0
 * Designed specifically for nepsen.github.io
 * 
 * IMPORTANT: This is a very important code for protecting Nepsen's intellectual property.
 *            Never remove or modify this code without authorization.
 */

// ====================== CONFIGURATION ======================
const SECURITY_CONFIG = {
    // Allowed domains (case sensitive)
    allowedDomains: ["nepsen.github.io", "www.nepsen.github.io"],
    
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
    
    // Browser detection patterns (top 10 popular + 10 hacker browsers)
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
        duckduckgo: /DuckDuckGo/,
        // Hacker browsers
        paleMoon: /PaleMoon/,
        waterfox: /Waterfox/,
        librewolf: /LibreWolf/,
        icecat: /IceCat/,
        ungoogled: /Ungoogled/,
        bromite: /Bromite/,
        falkon: /Falkon/,
        qutebrowser: /QuteBrowser/,
        luakit: /Luakit/,
        nyxt: /Nyxt/
    },
    
    // Security logging
    logPrefix: "[SECURITY]",
    localStorageKey: "nepsen_security_log",
    localStorageTriggerKey: "nepsen_security_triggered"
};

// ====================== SECURITY SYSTEM INITIALIZATION ======================
(function() {
    "use strict";
    
    // Check if security was already triggered before
    if (localStorage.getItem(SECURITY_CONFIG.localStorageTriggerKey)) {
        // Just start console spamming without other effects
        startConsoleSpam();
        return;
    }
    
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
            
            // Setup all security measures
            this.setupEventListeners();
            this.checkCriticalFiles();
            this.setupMutationObserver();
            this.disableDevTools();
            this.blockKeyboardShortcuts();
            
            // Periodic checks
            setInterval(() => this.checkCriticalFiles(), 30000);
            setInterval(() => this.checkTampering(), 60000);
            
            // Cache critical files for offline use
            this.cacheCriticalFiles();
            
            this.log("Security system initialized successfully");
        }
        
        // ====================== CORE SECURITY FUNCTIONS ======================
        
        // Cache critical files for offline use
        cacheCriticalFiles() {
            if ('caches' in window) {
                caches.open('nepsen-critical-files').then(cache => {
                    this.config.criticalFiles.forEach(file => {
                        cache.add(file).catch(e => {
                            this.log(`Failed to cache file: ${file}`, e);
                        });
                    });
                });
            }
        }
        
        // ====================== KEYBOARD SHORTCUT BLOCKING ======================
        
        // Block all specified keyboard shortcuts and show ads when pressed
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
                        
                        // Show ads when blocked keys are pressed
                        this.showRandomAd();
                        return false;
                    }
                });
                
                // Special case for F12 which doesn't always show up with e.key
                if (e.keyCode === 123) { // F12
                    e.preventDefault();
                    e.stopPropagation();
                    this.log("Blocked F12 Developer Tools shortcut");
                    this.handleSecurityViolation("Attempted use of F12 Developer Tools");
                    this.showRandomAd();
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
                        startConsoleSpam();
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
                
                xhr.onerror = () => {
                    // Check cache if offline
                    if (!navigator.onLine && 'caches' in window) {
                        caches.match(url).then(response => {
                            resolve(!!response);
                        }).catch(() => resolve(false));
                    } else {
                        resolve(false);
                    }
                };
                
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
                                localStorage.setItem(SECURITY_CONFIG.localStorageTriggerKey, "true");
                                startConsoleSpam();
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
            
            // Mark as triggered in localStorage
            localStorage.setItem(SECURITY_CONFIG.localStorageTriggerKey, "true");
            
            // Show ads immediately
            this.showRandomAd();
            
            // Start console spamming for serious violations
            if (violation.includes('Developer tools') || 
                violation.includes('Console') || 
                violation.includes('DOM tampering')) {
                startConsoleSpam();
            }
        }
        
        // ====================== FAKE ERROR MESSAGES ======================
        
        // Show browser-specific fake error message
        showFakeError(message) {
            let errorHtml = '';
            const browser = this.browser;
            
            // Chrome-like error
            if (browser === 'chrome' || browser === 'edge' || browser === 'opera' || 
                browser === 'brave' || browser === 'vivaldi' || browser === 'ungoogled' || 
                browser === 'bromite') {
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
                            ERR_FILE_NOT_FOUND
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
            else if (browser === 'firefox' || browser === 'paleMoon' || 
                     browser === 'waterfox' || browser === 'librewolf' || 
                     browser === 'icecat') {
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
                            Error code: NS_ERROR_FILE_NOT_FOUND
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
            // IE-like error
            else if (browser === 'ie') {
                errorHtml = `
                    <div style="font-family: Arial, sans-serif; 
                                background-color: #f5f5f5; 
                                padding: 20px; 
                                max-width: 600px; 
                                margin: 50px auto; 
                                text-align: center;">
                        <div style="font-size: 72px; color: #0078d7;">⚠️</div>
                        <h1 style="color: #333; font-size: 24px; margin-bottom: 16px;">Internet Explorer cannot display the webpage</h1>
                        <p style="color: #666; font-size: 16px; margin-bottom: 24px;">
                            ${message}<br>
                            HTTP 404: File not found
                        </p>
                        <div style="margin-top: 24px;">
                            <button style="background-color: #0078d7; color: white; border: none; border-radius: 4px; 
                                        padding: 10px 24px; font-size: 14px; cursor: pointer;">
                                Refresh
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
        
        // Show realistic FBI warning page
        showFBIWarning() {
            if (document.getElementById('fbi-warning-overlay')) return;
            
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
            
            // Generate realistic FBI warning HTML (1000+ lines condensed)
            overlay.innerHTML = `
                <div style="max-width: 1000px; margin: 0 auto; border: 4px solid #d40000; padding: 30px; background-color: #000033; box-shadow: 0 0 20px rgba(255,0,0,0.5);">
                    <!-- FBI Header -->
                    <div style="display: flex; align-items: center; margin-bottom: 30px; border-bottom: 2px solid #d40000; padding-bottom: 20px;">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjMDAyOTVkIiBkPSJNNDQ4IDMySDY0QzI4LjcgMzIgMCA2MC43IDAgOTZ2MzIwYzAgMzUuMyAyOC43IDY0IDY0IDY0aDM4NGMzNS4zIDAgNjQtMjguNyA2NC02NFY5NmMwLTM1LjMtMjguNy02NC02NC02NHoiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMTI4IDE0NGMwLTguOCA3LjItMTYgMTYtMTZoOTZjOC44IDAgMTYgNy4yIDE2IDE2djMyYzAgOC44LTcuMiAxNi0xNiAxNmgtOTZjLTguOCAwLTE2LTcuMi0xNi0xNnYtMzJ6bTAgOTZjMC04LjggNy4yLTE2IDE2LTE2aDk2YzguOCAwIDE2IDcuMiAxNiAxNnYzMmMwIDguOC03LjIgMTYtMTYgMTZoLTk2Yy04LjggMC0xNi03LjItMTYtMTZ2LTMyem0xNjAgMTYwYzAtNDQuMi0zNS44LTgwLTgwLTgwcy04MCAzNS44LTgwIDgwYzAgMjYuNCAxMi44IDQ5LjkgMzIuNSA2NC44IDIuOS0yMS42IDIwLjYtMzguNCA0My4xLTM4LjQgMTUuNSAwIDI5LjEgOC44IDM2LjEgMjEuNyA4LjEtMTIuOSAyMS42LTIxLjcgMzYuMS0yMS43IDIyLjUgMCA0MC4yIDE2LjggNDMuMSAzOC40IDE5LjctMTQuOSAzMi41LTM4LjQgMzIuNS02NC44eiIvPjwvc3ZnPg==" 
                             alt="FBI Logo" style="height: 100px; margin-right: 30px;">
                        <div>
                            <h1 style="color: #d40000; margin: 0; font-size: 42px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">FEDERAL BUREAU OF INVESTIGATION</h1>
                            <p style="margin: 10px 0 0; font-size: 18px; color: #ffffff;">CYBER CRIME DIVISION</p>
                        </div>
                    </div>
                    
                    <!-- Case Information -->
                    <div style="margin-bottom: 30px; background-color: #000044; padding: 20px; border: 1px solid #4444ff;">
                        <h2 style="color: #ffcc00; margin-top: 0; font-size: 28px;">CASE NUMBER: FBI-${Math.floor(10000 + Math.random() * 90000)}-${Math.floor(10000 + Math.random() * 90000)}-NPS</h2>
                        <p style="font-size: 18px; margin-bottom: 5px;"><strong>Date:</strong> ${new Date().toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}</p>
                        <p style="font-size: 18px; margin-bottom: 5px;"><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
                        <p style="font-size: 18px; margin-bottom: 5px;"><strong>IP Address:</strong> [REDACTED]</p>
                        <p style="font-size: 18px; margin-bottom: 5px;"><strong>Location:</strong> [APPROXIMATE LOCATION DETERMINED]</p>
                        <p style="font-size: 18px;"><strong>Device:</strong> ${navigator.userAgent}</p>
                    </div>
                    
                    <!-- Warning Message -->
                    <div style="margin: 30px 0; text-align: center;">
                        <p style="font-size: 32px; color: #ff0000; text-shadow: 0 0 10px rgba(255,0,0,0.5); margin-bottom: 20px;">
                            <strong>WARNING: UNAUTHORIZED ACCESS DETECTED</strong>
                        </p>
                        <p style="font-size: 22px; line-height: 1.5; margin-bottom: 30px;">
                            The Federal Bureau of Investigation has detected unauthorized access to protected intellectual property from this device.
                            This constitutes a violation of 18 U.S. Code § 1030 (Computer Fraud and Abuse Act) and is punishable by fines and imprisonment.
                        </p>
                    </div>
                    
                    <!-- Charges -->
                    <div style="background-color: #000044; padding: 15px; border: 1px solid #4444ff; margin-bottom: 30px;">
                        <h3 style="color: #ffcc00; margin-top: 0; font-size: 24px;">POTENTIAL CHARGES:</h3>
                        <ul style="font-size: 18px; padding-left: 20px;">
                            <li>Unauthorized Access to a Protected Computer System (18 U.S.C. § 1030(a)(2))</li>
                            <li>Intentional Damage to a Protected Computer (18 U.S.C. § 1030(a)(5))</li>
                            <li>Computer Fraud (18 U.S.C. § 1030(a)(4))</li>
                            <li>Theft of Trade Secrets (18 U.S.C. § 1832)</li>
                            <li>Copyright Infringement (17 U.S.C. § 501)</li>
                        </ul>
                    </div>
                    
                    <!-- Penalties -->
                    <div style="background-color: #000044; padding: 15px; border: 1px solid #4444ff; margin-bottom: 30px;">
                        <h3 style="color: #ffcc00; margin-top: 0; font-size: 24px;">POTENTIAL PENALTIES:</h3>
                        <ul style="font-size: 18px; padding-left: 20px;">
                            <li>Fines up to $250,000 (individual) or $500,000 (organization)</li>
                            <li>Imprisonment up to 10 years</li>
                            <li>Civil penalties up to $50,000 per violation</li>
                            <li>Forfeiture of devices used in commission of offense</li>
                        </ul>
                    </div>
                    
                    <!-- Actions Taken -->
                    <div style="margin-bottom: 30px;">
                        <h3 style="color: #ffcc00; font-size: 24px;">ACTIONS TAKEN:</h3>
                        <p style="font-size: 18px; line-height: 1.5;">
                            The FBI Cyber Division has been notified of this incident. Your IP address, location, and device information have been recorded.
                            A digital forensics report has been generated and will be maintained as evidence.
                        </p>
                    </div>
                    
                    <!-- Next Steps -->
                    <div style="margin-bottom: 40px;">
                        <h3 style="color: #ffcc00; font-size: 24px;">NEXT STEPS:</h3>
                        <p style="font-size: 18px; line-height: 1.5;">
                            If you believe this detection is in error, you may contact the FBI Cyber Division at your local field office.
                            Continued unauthorized access attempts will result in escalation to federal prosecution.
                        </p>
                    </div>
                    
                    <!-- Footer -->
                    <div style="text-align: center; border-top: 2px solid #d40000; padding-top: 20px;">
                        <p style="font-size: 16px; color: #aaaaaa;">
                            This is an official notification from the Federal Bureau of Investigation, Cyber Crime Division.
                            Unauthorized distribution or modification of this notice is prohibited under 18 U.S.C. § 2701.
                        </p>
                        <div style="margin-top: 30px;">
                            <button id="fbi-close-btn" style="background-color: #d40000; color: white; border: none; 
                                        padding: 15px 30px; font-size: 18px; cursor: pointer; border-radius: 4px;
                                        box-shadow: 0 0 10px rgba(255,0,0,0.5);">
                                I ACKNOWLEDGE THIS WARNING
                            </button>
                        </div>
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
            startConsoleSpam();
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
                this.showRandomAd();
            });
            
            // Drag and drop prevention
            document.addEventListener('dragstart', (e) => {
                e.preventDefault();
                this.handleSecurityViolation("Drag attempt");
                this.showRandomAd();
            });
            
            // Selection prevention
            document.addEventListener('selectstart', (e) => {
                e.preventDefault();
                this.handleSecurityViolation("Text selection attempt");
                this.showRandomAd();
            });
            
            // Copy prevention
            document.addEventListener('copy', (e) => {
                e.preventDefault();
                this.handleSecurityViolation("Copy attempt");
                this.showRandomAd();
            });
            
            // Cut prevention
            document.addEventListener('cut', (e) => {
                e.preventDefault();
                this.handleSecurityViolation("Cut attempt");
                this.showRandomAd();
            });
            
            // Paste prevention
            document.addEventListener('paste', (e) => {
                e.preventDefault();
                this.handleSecurityViolation("Paste attempt");
                this.showRandomAd();
            });
            
            // Offline/online detection
            window.addEventListener('offline', () => {
                this.log("Browser went offline");
                this.logToLocalStorage("Browser offline");
            });
            
            window.addEventListener('online', () => {
                this.log("Browser came online");
            });
        }
    }
    
    // Function to start console spamming
    function startConsoleSpam() {
        const messages = [
            "SECURITY VIOLATION DETECTED",
            "UNAUTHORIZED ACCESS ATTEMPT",
            "FEDERAL CRIME IN PROGRESS",
            "SYSTEM COMPROMISE DETECTED",
            "ILLEGAL CODE COPYING DETECTED",
            "FBI NOTIFICATION SENT",
            "YOUR LOCATION HAS BEEN LOGGED",
            "TERMINATING SYSTEM PROCESSES",
            "MEMORY DUMP INITIATED",
            "KEYSTROKES BEING RECORDED",
            "SCREEN CAPTURE IN PROGRESS",
            "DEVICE INFORMATION COLLECTED",
            "NETWORK TRAFFIC ANALYZED",
            "DIGITAL FORENSICS REPORT GENERATED",
            "EVIDENCE BEING PRESERVED"
        ];
        
        // Spam console at 1000 messages per second
        const spamInterval = setInterval(() => {
            for (let i = 0; i < 1000; i++) {
                const randomMsg = messages[Math.floor(Math.random() * messages.length)];
                const randomCode = Math.floor(1000 + Math.random() * 9000);
                console.error(`%c[FBI-${randomCode}] ${randomMsg}`, 'color: red; font-size: 14px; font-weight: bold;');
            }
        }, 1000);
        
        // Also try to crash the browser with memory leak
        const memoryLeak = [];
        const leakInterval = setInterval(() => {
            memoryLeak.push(new Array(1000000).fill(Math.random()));
        }, 100);
    }
    
    // Initialize the security system
    const securitySystem = new SecuritySystem(SECURITY_CONFIG);
    
    // Make it accessible for debugging (but protected)
    Object.defineProperty(window, '$$securitySystem', {
        get: () => {
            securitySystem.handleSecurityViolation("Attempted access to security system object");
            securitySystem.showFBIWarning();
            startConsoleSpam();
            return undefined;
        },
        configurable: false,
        enumerable: false
    });
})();
