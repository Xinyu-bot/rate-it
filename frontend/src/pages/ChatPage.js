// src/pages/ChatPage.js
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function ChatPage() {
  const { isAuthenticated, accessToken } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const handleSend = async () => {
    if (!isAuthenticated) {
      alert("You must log in or sign up to send messages!");
      return;
    }

    try {
      const res = await fetch("https://localhost:5000/api/chat/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // <--- attach the token
        },
        body: JSON.stringify({ userMessage: message }),
      });
      const data = await res.json();
      setResponse(JSON.stringify(data));
    } catch (error) {
      console.error("Error calling chat API:", error);
      setResponse("Error occurred.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>ChatBox</h2>
      <textarea
        rows="4"
        cols="50"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <br />
      <button onClick={handleSend}>Send</button>
      <div style={{ marginTop: "1rem", whiteSpace: "pre-wrap" }}>
        <strong>Response:</strong> {response}
      </div>
    </div>
  );
}

export default ChatPage;
