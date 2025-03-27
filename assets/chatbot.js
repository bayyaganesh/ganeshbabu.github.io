
document.getElementById("chatbot-icon").onclick = () => {
  const box = document.getElementById("chatbot-container");
  box.style.display = box.style.display === "flex" ? "none" : "flex";
  box.style.flexDirection = "column";
};

document.getElementById("send-btn").onclick = async () => {
  const input = document.getElementById("user-input");
  const log = document.getElementById("chat-log");
  const message = input.value.trim();
  if (!message) return;
  log.innerHTML += `<div><strong>You:</strong> ${message}</div>`;
  input.value = "";

  try {
    const res = await fetch("https://ganeshbabubayya.app.n8n.cloud/webhook/tbn-poc-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });
    const data = await res.json();
    log.innerHTML += `<div><strong>Bot:</strong> ${data.reply || "I'll get back to you on that!"}</div>`;
    log.scrollTop = log.scrollHeight;
  } catch (e) {
    log.innerHTML += `<div><strong>Bot:</strong> Something went wrong.</div>`;
  }
};

document.getElementById("submit-lead").onclick = async () => {
  const name = document.getElementById("lead-name").value.trim();
  const email = document.getElementById("lead-email").value.trim();
  const message = document.getElementById("lead-message").value.trim();
  const status = document.getElementById("status-msg");

  if (!name || !email || !message) {
    status.innerText = "Please fill all fields.";
    status.style.color = "red";
    return;
  }

  try {
    const res = await fetch("https://ganeshbabubayya.app.n8n.cloud/webhook/tbn-poc-leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message })
    });
    status.innerText = "✅ Submitted successfully!";
    status.style.color = "green";
    document.getElementById("lead-name").value = "";
    document.getElementById("lead-email").value = "";
    document.getElementById("lead-message").value = "";
  } catch (e) {
    status.innerText = "❌ Failed to submit lead.";
    status.style.color = "red";
  }
};
