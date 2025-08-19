<script>
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
</script>
