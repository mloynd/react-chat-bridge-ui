import React, { useState } from 'react';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await fetch('https://bridge-y5on.onrender.com/bridge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: input })  // ✅ key fix here
      });

      const data = await response.json();
      setMessages([...newMessages, { role: 'assistant', content: data.reply || JSON.stringify(data) }]);
    } catch (error) {
      setMessages([...newMessages, { role: 'assistant', content: 'Error connecting to bridge.' }]);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ height: '400px', overflowY: 'auto', border: '1px solid #ccc', marginBottom: 10, padding: 10 }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ margin: '5px 0', color: msg.role === 'user' ? 'blue' : 'green' }}>
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && sendMessage()}
        style={{ width: '80%', marginRight: 10 }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
