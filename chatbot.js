// 🔍 UTM extractor
function getUTMParams() {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    utm_source: urlParams.get('utm_source') || "Direct",
    utm_medium: urlParams.get('utm_medium') || "Web",
    utm_campaign: urlParams.get('utm_campaign') || "None"
  };
}

// 🤖 Create chatbot icon
const botIcon = document.createElement("div");
botIcon.id = "chatbot-icon";
botIcon.innerHTML = '<img src="assets/tbn-bot-icon.png" alt="Chatbot" />';
document.body.appendChild(botIcon);

// 💬 Create chatbot container
const chatContainer = document.createElement("div");
chatContainer.id = "chatbot-container";
chatContainer.innerHTML = `
  <div id="chat-header">🤖 Enthiran</div>
  <div id="chat-log"></div>
  <input type="text" id="user-input" placeholder="Ask me anything..." />
  <button id="send-btn">Send</button>
  <div id="lead-form">
    <h4>Leave Your Details</h4>
    <input type="text" id="lead-name" placeholder="Your Name" />
    <input type="email" id="lead-email" placeholder="Your Email" />
    <textarea id="lead-message" placeholder="Your Message or Appointment Request"></textarea>
    <button id="submit-lead">Submit</button>
  </div>
`;
document.body.appendChild(chatContainer);

botIcon.onclick = () => chatContainer.classList.toggle("visible");

// 💬 Chatbot conversation

const getCurrentPage = () => window.location.pathname || "unknown";

document.getElementById("send-btn").onclick = async () => {
  const input = document.getElementById("user-input").value.trim();
  const userName = document.getElementById("lead-name")?.value || "Guest";
  const userEmail = document.getElementById("lead-email")?.value || "guest@example.com";
  const page = getCurrentPage();

  if (!input) return;
  document.getElementById("chat-log").innerHTML += `<div><strong>You:</strong> ${input}</div>`;
  document.getElementById("user-input").value = "";

  try {
    const res = await fetch("https://ganeshbabubayya.app.n8n.cloud/webhook/enthiran-chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: userName, email: userEmail, message: input, page })
    });

    const data = await res.json();
    console.log("Response from n8n:", data);
    const reply = data.response || 'Sorry, something went wrong.';
    document.getElementById("chat-log").innerHTML += `<div><strong>Bot:</strong> ${reply}</div>`;
  } catch (err) {
    console.error("Chatbot error:", err);
    document.getElementById("chat-log").innerHTML += `<div><strong>Bot:</strong> Error connecting to server.</div>`;
  }
};

// 📩 Lead form submission with UTM tracking
document.getElementById("submit-lead").onclick = async () => {
  const name = document.getElementById("lead-name").value;
  const email = document.getElementById("lead-email").value;
  const message = document.getElementById("lead-message").value;
  const page = getCurrentPage();

  if (!name || !email || !message) return alert("Please fill all fields");

  const utmParams = getUTMParams(); // ⬅️ Add campaign tracking

  try {
    const res = await fetch("https://ganeshbabubayya.app.n8n.cloud/webhook/lead-capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        message,
        ...utmParams, // ⬅️ Include utm_source, utm_medium, utm_campaign
        page // include current page
      })
    });

    const result = await res.json();
    console.log("Lead response:", result);

    alert(`🎉 Thanks, ${name}! We'll get back to you shortly.`);

    // Clear the form
    document.getElementById("lead-name").value = "";
    document.getElementById("lead-email").value = "";
    document.getElementById("lead-message").value = "";

  } catch (err) {
    console.error("Lead submission error:", err);
    alert("Lead submission failed.");
  }
};
