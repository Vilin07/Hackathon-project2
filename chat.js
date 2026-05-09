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