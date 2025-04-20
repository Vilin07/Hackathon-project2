const chatBox = document.getElementById("chat-box");

async function sendMessage() {
  const input = document.getElementById("user-input");
  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage("user", userMessage);
  input.value = "";

  appendMessage("bot", "Typing...");

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [{ role: "user", content: userMessage }],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    const data = await response.json();
    console.log("API Response:", data); 

    const botReply = data.choices?.[0]?.message?.content || "No response from Mistral.";

    chatBox.lastChild.remove(); 
    appendMessage("bot", botReply);
  } catch (error) {
    chatBox.lastChild.remove();
    appendMessage("bot", "Oops! Something went wrong.");
    console.error(error);
  }
}

function appendMessage(sender, message) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${sender}`;
  msgDiv.textContent = message;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}