async function shortenUrl() {
  const input = document.getElementById("inputUrl");
  const resultDiv = document.getElementById("result");
  const shortUrlField = document.getElementById("shortUrl");
  const historyList = document.getElementById("historyList");

  const longUrl = input.value.trim();

  // Validate input
  if (!longUrl || !isValidUrl(longUrl)) {
    alert("Please enter a valid URL.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ originalUrl: longUrl })
    });

    const data = await response.json();

    if (response.ok && data.shortUrl) {
      shortUrlField.value = data.shortUrl;
      resultDiv.classList.remove("hidden");

      // Store in history (localStorage)
      let history = JSON.parse(localStorage.getItem("miniurl_history")) || [];
      history.unshift(data.shortUrl);
      history = history.slice(0, 3); // Keep only last 3
      localStorage.setItem("miniurl_history", JSON.stringify(history));

      // Show history
      renderHistory(history);
    } else {
      alert(data.error || "Something went wrong.");
    }
  } catch (err) {
    console.error(err);
    alert("Server error. Please try again later.");
  }
}

function copyUrl() {
  const shortUrlField = document.getElementById("shortUrl");
  shortUrlField.select();
  shortUrlField.setSelectionRange(0, 99999); // For mobile
  navigator.clipboard.writeText(shortUrlField.value)
    .then(() => alert("Short URL copied!"))
    .catch(() => alert("Failed to copy"));
}

function renderHistory(history) {
  const historyList = document.getElementById("historyList");
  historyList.innerHTML = "";
  history.forEach(url => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${url}" target="_blank">${url}</a>`;
    historyList.appendChild(li);
  });
}

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Load history on page load
window.onload = () => {
  const history = JSON.parse(localStorage.getItem("miniurl_history")) || [];
  renderHistory(history);
};
