// Check if we have the list query parameter
const urlParams = new URLSearchParams(window.location.search);

if (urlParams.has("list")) {
  // Load settings from sync storage
  chrome.storage.sync.get(
    {
      sortBy: "solved",
      sortOrder: "desc",
    },
    (settings) => {
      const tbody = document.querySelector("table.problems>tbody");
      if (!tbody) return;

      // Get all rows
      const allRows = Array.from(tbody.querySelectorAll("tr"));
      if (allRows.length <= 1) return; // Only header or empty

      // The first row is the header, isolate it
      const headerRow = allRows[0];
      // The rest are problems
      const problemRows = allRows.slice(1);

      // Sort the problem rows
      problemRows.sort((a, b) => {
        const getVal = (row) => {
          const noticeSpan = row.querySelector("span.small.notice");
          if (!noticeSpan) return 0; // In case there is no notice span, treat as 0

          // Expected format: "solved / attempted" (e.g., "7695/9")
          // sometimes the text might just be a number if no one else attempted but they solved, etc.
          // It's usually safe to split by "/" assuming default CF formatting.
          const textParts = noticeSpan.textContent.split("/");

          let solved = 0;
          let attempted = 0;

          if (textParts.length >= 1) {
            solved = parseInt(textParts[0].trim(), 10) || 0;
          }
          if (textParts.length >= 2) {
            attempted = parseInt(textParts[1].trim(), 10) || 0;
          }

          return settings.sortBy === "attempted" ? attempted : solved;
        };

        const valA = getVal(a);
        const valB = getVal(b);

        if (settings.sortOrder === "asc") {
          return valA - valB;
        } else {
          return valB - valA;
        }
      });

      // Re-append sorted rows (appendChild moves the existing element)
      problemRows.forEach((row) => {
        tbody.appendChild(row);
      });

      // Show popup notification
      showNotification();
    },
  );
}

function showNotification() {
  const popup = document.createElement("div");
  popup.textContent = "Problems sorted by extension!";

  // Style the popup
  Object.assign(popup.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 20px",
    borderRadius: "5px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    zIndex: "999999",
    fontFamily: "Arial, sans-serif",
    fontSize: "14px",
    opacity: "0",
    transition: "opacity 0.3s ease-in-out",
  });

  document.body.appendChild(popup);

  // Fade in
  requestAnimationFrame(() => {
    popup.style.opacity = "1";
  });

  // Fade out and remove after a few seconds
  setTimeout(() => {
    popup.style.opacity = "0";
    setTimeout(() => {
      popup.remove();
    }, 300); // Wait for transition
  }, 3000);
}
