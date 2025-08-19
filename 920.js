
(function() {
  document.addEventListener("keydown", function(e) {
    // F12
    if (e.key === "F12") {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C
    if (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+U (View Source)
    if (e.ctrlKey && e.key.toLowerCase() === "u") {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+S (Save page)
    if (e.ctrlKey && e.key.toLowerCase() === "s") {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  });

  // Disable right-click (context menu)
  document.addEventListener("contextmenu", function(e) {
    e.preventDefault();
  });
})();
(async function safeLoader() {
  // If error was already shown, do nothing
  if (localStorage.getItem("backend-was-done") === "true") return;

  // Helper: show a styled message
  function showMessage(text) {
    const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const box = document.createElement("div");
    box.textContent = text;
    Object.assign(box.style, {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      padding: "20px 30px",
      borderRadius: "12px",
      fontFamily: "system-ui, sans-serif",
      background: dark ? "#111" : "#fff",
      color: dark ? "#eee" : "#222",
      border: `1px solid ${dark ? "#eee" : "#222"}`,
      boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
      zIndex: "9999",
      textAlign: "center",
      minWidth: "200px"
    });

    document.body.appendChild(box);
  }

  // Step 1: show offline message only if NOT on nepsen.github.io
  if (!location.href.startsWith("https://nepsen.github.io")) {
    showMessage("You are offline. Please get online.");
    return;
  }

  // Step 2: try fetching resources
  const resources = ["cloudgaimghub/1.js", "ishahi/index.html"];
  let allFound = true;

  for (let res of resources) {
    try {
      const resp = await fetch(res, { method: "GET" });
      if (!resp.ok) allFound = false;
    } catch (e) {
      allFound = false;
    }
  }

  // Step 3: show code error **once** and save
  if (!allFound) {
    showMessage("Code not found");
    localStorage.setItem("backend-was-done", "true");
  }
})();

