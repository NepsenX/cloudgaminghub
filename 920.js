/*
 * Comprehensive Security System for Web Protection
 * Version 4.1.0
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
    localStorageTriggerKey: "nepsen_security_triggered",
    
    // Protection modes
    protectionModes: {
        // Allow text selection but show ads when copying
        allowSelect: true,
        // Allow right-click but show ads on context menu
        allowRightClick: true,
        // Allow normal navigation and JS execution
        allowNavigation: true
    }
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
                { keys: ["Control", "Shift", "p"], name: "Command Menu" }
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
        
        // ====================== EVENT LISTENERS ======================
        
        // Setup event listeners with less intrusive protection
        setupEventListeners() {
            // Context menu handling
            if (!this.config.protectionModes.allowRightClick) {
                document.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    this.handleSecurityViolation("Right-click context menu attempt");
                    this.showRandomAd();
                });
            } else {
                document.addEventListener('contextmenu', (e) => {
                    this.log("Right-click detected (allowed but monitored)");
                });
            }
            
            // Copy handling - allow selection but show ads on copy
            if (!this.config.protectionModes.allowSelect) {
                document.addEventListener('selectstart', (e) => {
                    e.preventDefault();
                    this.handleSecurityViolation("Text selection attempt");
                    this.showRandomAd();
                });
            }
            
            document.addEventListener('copy', (e) => {
                this.handleSecurityViolation("Copy attempt");
                this.showRandomAd();
            });
            
            // Cut handling
            document.addEventListener('cut', (e) => {
                this.handleSecurityViolation("Cut attempt");
                this.showRandomAd();
            });
            
            // Paste handling - allow but monitor
            document.addEventListener('paste', (e) => {
                this.log("Paste detected (allowed but monitored)");
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
        
        // ====================== OTHER FUNCTIONS (remain the same as previous version) ======================
        // [Previous implementations of other functions like disableDevTools, checkCriticalFiles, 
        // showFBIWarning, showRandomAd, etc. would go here]
        // ...
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
            "TERMINATING SYSTEM PROCESSES"
        ];
        
        // Spam console at 1000 messages per second
        const spamInterval = setInterval(() => {
            for (let i = 0; i < 1000; i++) {
                const randomMsg = messages[Math.floor(Math.random() * messages.length)];
                const randomCode = Math.floor(1000 + Math.random() * 9000);
                console.error(`%c[FBI-${randomCode}] ${randomMsg}`, 'color: red; font-size: 14px; font-weight: bold;');
            }
        }, 1000);
    }
    
    // Initialize the security system with less intrusive protection
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
