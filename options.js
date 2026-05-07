// Saves options to chrome.storage
function saveOptions() {
  const sortBy = document.getElementById("sortBy").value;
  const sortOrder = document.getElementById("sortOrder").value;

  chrome.storage.sync.set(
    {
      sortBy: sortBy,
      sortOrder: sortOrder,
    },
    function () {
      // Update status to let user know options were saved.
      const status = document.getElementById("status");
      status.textContent = "Options saved.";
      setTimeout(function () {
        status.textContent = "";
      }, 2000);
    },
  );
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restoreOptions() {
  chrome.storage.sync.get(
    {
      sortBy: "solved", // default value
      sortOrder: "desc", // default value
    },
    function (items) {
      document.getElementById("sortBy").value = items.sortBy;
      document.getElementById("sortOrder").value = items.sortOrder;
    },
  );
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener("click", saveOptions);
