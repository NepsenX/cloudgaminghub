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
      window.open("https://nepsen.github.io/home", "_blank");
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
        
        // Detect browser from user agent
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
        } else if (ua.includes("Facebook")) {
            browser = "Facebook Mobile";
        } else if (ua.includes("Instagram")) {
            browser = "Instagram Mobile";
        } else if (ua.includes("Twitter")) {
            browser = "Twitter Mobile";
        } else if (ua.includes("Snapchat")) {
            browser = "Snapchat";
        } else if (ua.includes("WhatsApp")) {
            browser = "WhatsApp";
        } else if (ua.includes("Discord")) {
            browser = "Discord";
        } else if (ua.includes("LinkedIn")) {
            browser = "LinkedIn";
        } else if (ua.includes("Messenger")) {
            browser = "Facebook Messenger";
        } else if (ua.includes("Pinterest")) {
            browser = "Pinterest";
        } else if (ua.includes("Spotify")) {
            browser = "Spotify";
        } else if (ua.includes("TikTok")) {
            browser = "TikTok";
        } else if (ua.includes("YouTube")) {
            browser = "YouTube";
        } else if (ua.includes("Netflix")) {
            browser = "Netflix";
        } else if (ua.includes("Amazon")) {
            browser = "Amazon Shopping";
        } else if (ua.includes("Slack")) {
            browser = "Slack";
        } else if (ua.includes("Telegram")) {
            browser = "Telegram";
        } else if (ua.includes("WeChat")) {
            browser = "WeChat";
        } else if (ua.includes("Signal")) {
            browser = "Signal";
        } else if (ua.includes("Zoom")) {
            browser = "Zoom";
        } else if (ua.includes("Twitch")) {
            browser = "Twitch";
        } else if (ua.includes("Reddit")) {
            browser = "Reddit";
        } else if (ua.includes("PayPal")) {
            browser = "PayPal";
        } else if (ua.includes("CashApp")) {
            browser = "Cash App";
        } else if (ua.includes("Venmo")) {
            browser = "Venmo";
        } else if (ua.includes("Robinhood")) {
            browser = "Robinhood";
        } else if (ua.includes("Coinbase")) {
            browser = "Coinbase";
        } else if (ua.includes("eBay")) {
            browser = "eBay";
        } else if (ua.includes("Etsy")) {
            browser = "Etsy";
        } else if (ua.includes("Shopify")) {
            browser = "Shopify";
        } else if (ua.includes("Walmart")) {
            browser = "Walmart";
        } else if (ua.includes("Target")) {
            browser = "Target";
        } else if (ua.includes("BestBuy")) {
            browser = "Best Buy";
        } else if (ua.includes("HomeDepot")) {
            browser = "Home Depot";
        } else if (ua.includes("Lowe's")) {
            browser = "Lowe's";
        } else if (ua.includes("Wayfair")) {
            browser = "Wayfair";
        } else if (ua.includes("IKEA")) {
            browser = "IKEA";
        } else if (ua.includes("Nike")) {
            browser = "Nike";
        } else if (ua.includes("Adidas")) {
            browser = "Adidas";
        } else if (ua.includes("Under Armour")) {
            browser = "Under Armour";
        } else if (ua.includes("Pandora")) {
            browser = "Pandora";
        } else if (ua.includes("SoundCloud")) {
            browser = "SoundCloud";
        } else if (ua.includes("Shazam")) {
            browser = "Shazam";
        } else if (ua.includes("Audible")) {
            browser = "Audible";
        } else if (ua.includes("Kindle")) {
            browser = "Kindle";
        } else if (ua.includes("Goodreads")) {
            browser = "Goodreads";
        } else if (ua.includes("Duolingo")) {
            browser = "Duolingo";
        } else if (ua.includes("Coursera")) {
            browser = "Coursera";
        } else if (ua.includes("Udemy")) {
            browser = "Udemy";
        } else if (ua.includes("Khan Academy")) {
            browser = "Khan Academy";
        } else if (ua.includes("Google Classroom")) {
            browser = "Google Classroom";
        } else if (ua.includes("Google Drive")) {
            browser = "Google Drive";
        } else if (ua.includes("Dropbox")) {
            browser = "Dropbox";
        } else if (ua.includes("OneDrive")) {
            browser = "Microsoft OneDrive";
        } else if (ua.includes("iCloud")) {
            browser = "iCloud";
        } else if (ua.includes("Evernote")) {
            browser = "Evernote";
        } else if (ua.includes("Notion")) {
            browser = "Notion";
        } else if (ua.includes("Trello")) {
            browser = "Trello";
        } else if (ua.includes("Asana")) {
            browser = "Asana";
        } else if (ua.includes("Jira")) {
            browser = "Jira";
        } else if (ua.includes("Salesforce")) {
            browser = "Salesforce";
        } else if (ua.includes("HubSpot")) {
            browser = "HubSpot";
        } else if (ua.includes("QuickBooks")) {
            browser = "QuickBooks";
        } else if (ua.includes("TurboTax")) {
            browser = "TurboTax";
        } else if (ua.includes("Mint")) {
            browser = "Mint";
        } else if (ua.includes("Credit Karma")) {
            browser = "Credit Karma";
        } else if (ua.includes("Zillow")) {
            browser = "Zillow";
        } else if (ua.includes("Trulia")) {
            browser = "Trulia";
        } else if (ua.includes("Realtor.com")) {
            browser = "Realtor.com";
        } else if (ua.includes("Airbnb")) {
            browser = "Airbnb";
        } else if (ua.includes("VRBO")) {
            browser = "VRBO";
        } else if (ua.includes("Booking.com")) {
            browser = "Booking.com";
        } else if (ua.includes("Expedia")) {
            browser = "Expedia";
        } else if (ua.includes("Kayak")) {
            browser = "Kayak";
        } else if (ua.includes("Uber")) {
            browser = "Uber";
        } else if (ua.includes("Lyft")) {
            browser = "Lyft";
        } else if (ua.includes("DoorDash")) {
            browser = "DoorDash";
        } else if (ua.includes("Uber Eats")) {
            browser = "Uber Eats";
        } else if (ua.includes("Grubhub")) {
            browser = "Grubhub";
        } else if (ua.includes("Postmates")) {
            browser = "Postmates";
        } else if (ua.includes("Instacart")) {
            browser = "Instacart";
        } else if (ua.includes("Shipt")) {
            browser = "Shipt";
        } else if (ua.includes("Google Maps")) {
            browser = "Google Maps";
        } else if (ua.includes("Waze")) {
            browser = "Waze";
        } else if (ua.includes("Apple Maps")) {
            browser = "Apple Maps";
        } else if (ua.includes("Weather Channel")) {
            browser = "Weather Channel";
        } else if (ua.includes("AccuWeather")) {
            browser = "AccuWeather";
        } else if (ua.includes("MyFitnessPal")) {
            browser = "MyFitnessPal";
        } else if (ua.includes("Strava")) {
            browser = "Strava";
        } else if (ua.includes("Fitbit")) {
            browser = "Fitbit";
        } else if (ua.includes("Garmin")) {
            browser = "Garmin";
        } else if (ua.includes("Calm")) {
            browser = "Calm";
        } else if (ua.includes("Headspace")) {
            browser = "Headspace";
        } else if (ua.includes("WebMD")) {
            browser = "WebMD";
        } else if (ua.includes("MyChart")) {
            browser = "MyChart";
        } else if (ua.includes("Teladoc")) {
            browser = "Teladoc";
        } else if (ua.includes("23andMe")) {
            browser = "23andMe";
        } else if (ua.includes("Ancestry")) {
            browser = "Ancestry";
        } else if (ua.includes("Bumble")) {
            browser = "Bumble";
        } else if (ua.includes("Tinder")) {
            browser = "Tinder";
        } else if (ua.includes("Hinge")) {
            browser = "Hinge";
        } else if (ua.includes("Match.com")) {
            browser = "Match.com";
        } else if (ua.includes("OKCupid")) {
            browser = "OKCupid";
        } else if (ua.includes("ESPN")) {
            browser = "ESPN";
        } else if (ua.includes("NFL")) {
            browser = "NFL";
        } else if (ua.includes("NBA")) {
            browser = "NBA";
        } else if (ua.includes("MLB")) {
            browser = "MLB";
        } else if (ua.includes("NHL")) {
            browser = "NHL";
        } else if (ua.includes("Disney+")) {
            browser = "Disney+";
        } else if (ua.includes("Hulu")) {
            browser = "Hulu";
        } else if (ua.includes("HBO Max")) {
            browser = "HBO Max";
        } else if (ua.includes("Peacock")) {
            browser = "Peacock";
        } else if (ua.includes("Paramount+")) {
            browser = "Paramount+";
        } else if (ua.includes("Prime Video")) {
            browser = "Amazon Prime Video";
        } else if (ua.includes("Apple TV+")) {
            browser = "Apple TV+";
        }
        
        return browser;
    }
    
    // Show realistic browser-like message
    function showMessage(type, browser) {
        let icon = "🌐";
        let title = "";
        let message = "";
        let details = "";
        
        // Set content based on browser and error type
        if (browser.includes("Chrome")) {
            icon = "🦖";
            if (type === "offline") {
                title = "No internet";
                message = "Try:\n• Checking the network cables, modem, and router\n• Reconnecting to Wi-Fi\n• Running Network Diagnostics";
                details = "ERR_INTERNET_DISCONNECTED";
            } else {
                title = "This site can't be reached";
                message = "Try:\n• Checking the connection\n• Checking the proxy and the firewall\n• Running Windows Network Diagnostics";
                details = "ERR_NAME_NOT_RESOLVED";
            }
        } else if (browser.includes("Firefox")) {
            icon = "🦊";
            if (type === "offline") {
                title = "Unable to connect";
                message = "Firefox can't establish a connection to the server at example.com.";
                details = "NS_ERROR_UNKNOWN_HOST";
            } else {
                title = "Page isn't working";
                message = "The page isn't redirecting properly. An error occurred during a connection to example.com.";
                details = "NS_ERROR_CONNECTION_REFUSED";
            }
        } else if (browser.includes("Safari")) {
            icon = "🍎";
            if (type === "offline") {
                title = "You Are Not Connected to the Internet";
                message = "This page can't be displayed because your computer is currently offline.";
                details = "Safari cannot open the page because your computer is not connected to the Internet.";
            } else {
                title = "Safari Can't Open the Page";
                message = "Safari can't open the page because the server can't be found.";
                details = "Safari cannot open the page. The error is: \"The server cannot be found\"";
            }
        } else if (browser.includes("Edge")) {
            icon = "🧩";
            if (type === "offline") {
                title = "Hmm... can't reach this page";
                message = "It looks like you aren't connected to the internet. Try checking your network connection.";
                details = "ERR_INTERNET_DISCONNECTED";
            } else {
                title = "This page isn't working";
                message = "example.com didn't send any data. Try running Windows Network Diagnostics.";
                details = "ERR_EMPTY_RESPONSE";
            }
        } else if (browser.includes("Opera")) {
            icon = "🎭";
            if (type === "offline") {
                title = "No internet connection";
                message = "Opera cannot connect to the internet. Please check your network connection and try again.";
                details = "ERR_INTERNET_DISCONNECTED";
            } else {
                title = "Connection failed";
                message = "Opera could not load the webpage because the server sent no data.";
                details = "ERR_EMPTY_RESPONSE";
            }
        } else if (browser.includes("Facebook")) {
            icon = "📘";
            if (type === "offline") {
                title = "Connection Problem";
                message = "Check your network connection and try again.";
                details = "Facebook couldn't load content. Please check your internet connection.";
            } else {
                title = "Content Not Available";
                message = "The content you requested cannot be displayed right now. It may be temporarily unavailable.";
                details = "The content is currently unavailable. Please try again later.";
            }
        } else if (browser.includes("Instagram")) {
            icon = "📸";
            if (type === "offline") {
                title = "No Internet Connection";
                message = "Please check your connection and try again.";
                details = "Instagram couldn't load. Please check your internet connection.";
            } else {
                title = "Couldn't Load Content";
                message = "We couldn't complete your request. Please try again.";
                details = "Content temporarily unavailable. Please try again later.";
            }
        } else if (browser.includes("YouTube")) {
            icon = "📺";
            if (type === "offline") {
                title = "You're offline";
                message = "Check your connection. Try watching on YouTube Go.";
                details = "YouTube requires an internet connection. Check your network settings.";
            } else {
                title = "Something went wrong";
                message = "We're working on it and we'll get it fixed as soon as we can.";
                details = "Playback ID: XXXX-XXXX-XXXX-XXXX";
            }
        } else if (browser.includes("TikTok")) {
            icon = "🎵";
            if (type === "offline") {
                title = "No network connection";
                message = "Please check your connection and try again.";
                details = "TikTok requires an internet connection. Check your network settings.";
            } else {
                title = "Couldn't load video";
                message = "Video currently unavailable. Please try again later.";
                details = "Video temporarily unavailable. Please try again later.";
            }
        } else {
            // Default error message
            icon = "🌐";
            if (type === "offline") {
                title = "No Internet Connection";
                message = "Please check your network connection and try again.";
                details = "ERR_INTERNET_DISCONNECTED";
            } else {
                title = "Unable to Load Content";
                message = "The content you requested is currently unavailable. Please try again later.";
                details = "ERR_CONNECTION_REFUSED";
            }
        }
        
        // Update the UI with the error message
        errorIcon.textContent = icon;
        errorTitle.textContent = title;
        errorMessage.textContent = message;
        errorDetailsText.textContent = details;
        
        // Add event listeners to buttons
        primaryButton.onclick = function() {
            window.location.reload();
        };
        
        secondaryButton.onclick = function() {
            window.open('https://support.google.com/chrome/answer/6098869', '_blank');
        };
    }
    
    // Check if already shown
    if (localStorage.getItem("backend-was-done") === "true") return;
    
    const browser = detectBrowser();
    const isOffline = !navigator.onLine;
    const isWrongDomain = !location.href.startsWith("https://nepsen.github.io");
    
    // Offline / Wrong domain first
    if (isOffline || isWrongDomain) {
        showMessage("offline", browser);
        return;
    }
    

})();
