// 🌐 Page awareness
const currentPage = window.location.pathname;

// 💬 Chatbot send button logic
document.getElementById("send-btn").onclick = async () => {
  const input = document.getElementById("user-input").value.trim();
  const userName = document.getElementById("lead-name")?.value || "Guest";
  const userEmail = document.getElementById("lead-email")?.value || "guest@example.com";

  if (!input) return;

  document.getElementById("chat-log").innerHTML += `<div><strong>You:</strong> ${input}</div>`;
  document.getElementById("user-input").value = "";

  try {
    const res = await fetch("https://ganeshbabubayya.app.n8n.cloud/webhook/enthiran-chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: userName,
        email: userEmail,
        message: input,
        page: currentPage  // ✅ Correctly sending page path
      })
    });

    const data = await res.json();
    console.log("Response from n8n:", data);

    const reply = data.response || "Sorry, something went wrong.";
    document.getElementById("chat-log").innerHTML += `<div><strong>Bot:</strong> ${reply}</div>`;
  } catch (err) {
    console.error("Chatbot error:", err);
    document.getElementById("chat-log").innerHTML += `<div><strong>Bot:</strong> Error connecting to server.</div>`;
  }
};
