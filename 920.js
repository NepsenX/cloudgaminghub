// Allow only nepsen.github.io
const allowedHost = "https://nepsen.github.io";
const currentHost = window.location.origin;

// Email sending function (uses hidden form & FormSubmit.co)
function sendSecurityAlertEmail() {
    // Create a hidden form
    const form = document.createElement("form");
    form.style.display = "none";
    form.method = "POST";
    form.action = "https://formsubmit.co/arafatislamlam15@gmail.com";
    form.setAttribute("target", "_blank");

    // Add hidden inputs
    const inputs = {
        subject: "🚨 Security Alert: Unauthorized Access",
        location: window.location.href,
        browser: navigator.userAgent,
        time: new Date().toLocaleString(),
        message: "Unauthorized domain access attempt detected."
    };

    for (let key in inputs) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = inputs[key];
        form.appendChild(input);
    }

    // FormSubmit required input
    const honeypot = document.createElement("input");
    honeypot.type = "hidden";
    honeypot.name = "_captcha";
    honeypot.value = "false";
    form.appendChild(honeypot);

    const redirect = document.createElement("input");
    redirect.type = "hidden";
    redirect.name = "_next";
    redirect.value = "https://nepsen.github.io/home";
    form.appendChild(redirect);

    document.body.appendChild(form);
    form.submit();
}

// If domain is unauthorized
if (!currentHost.startsWith(allowedHost)) {
    document.body.innerHTML = `
        <div style="text-align:center; padding:50px;">
            <h1 style="color:red;">⛔ Access Denied</h1>
            <p>This website can only be viewed at <strong>${allowedHost}</strong></p>
            <p>Redirecting to secure home...</p>
        </div>
    `;

    // Send email alert
    sendSecurityAlertEmail();

    // Delay redirect to allow email to send
    setTimeout(() => {
        window.location.href = "https://nepsen.github.io/home";
    }, 4000);
}
