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
