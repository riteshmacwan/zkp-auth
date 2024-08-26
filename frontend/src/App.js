import React, { useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [challenge, setChallenge] = useState(null);
  const [response, setResponse] = useState("");

  const startAuthentication = async () => {
    const res = await fetch("http://localhost:3000/auth/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    const data = await res.json();
    setChallenge(data.challenge);
  };

  const completeAuthentication = async () => {
    const proof = generateProof(password, challenge);
    const res = await fetch("http://localhost:3000/auth/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, proof }),
    });
    const data = await res.json();
    setResponse(data.message);
  };

  const generateProof = (password, challenge) => {
    // Simulate proof generation using a hash function
    return btoa(password + challenge);
  };

  return (
    <div>
      <h1>ZKP Auth Demo</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={startAuthentication}>Start Authentication</button>
      {challenge && (
        <button onClick={completeAuthentication}>
          Complete Authentication
        </button>
      )}
      {response && <p>{response}</p>}
    </div>
  );
}

export default App;
