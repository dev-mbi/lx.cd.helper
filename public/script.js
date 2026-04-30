const chatBox = document.getElementById("chatBox");

// add message
function addMessage(text, type) {
  const div = document.createElement("div");
  div.classList.add("msg", type);
  div.innerText = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
  return div;
}

// typing indicator
function typing() {
  const div = document.createElement("div");
  div.classList.add("msg", "bot");
  div.innerText = "AI is thinking...";
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
  return div;
}

// send message
async function send() {
  const input = document.getElementById("input");
  const text = input.value;

  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  const loading = typing();

  try {
    const res = await fetch("/api/command", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();

    loading.remove();

    const botMsg = addMessage(data.content, "bot");

    // copy button
    const btn = document.createElement("button");
    btn.innerText = "Copy";
    btn.classList.add("copy-btn");

    btn.onclick = () => {
      navigator.clipboard.writeText(data.content);
      btn.innerText = "Copied!";
      setTimeout(() => (btn.innerText = "Copy"), 1000);
    };

    botMsg.appendChild(btn);

  } catch (err) {
    loading.remove();
    addMessage("❌ Error getting response", "bot");
  }
}