import React, { useState } from "react";
import axios from "axios";
import { generateProof } from "./utils/zkp-utils";
import { poseidon } from "circomlib";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const storedHash = "/* fetch from server */";
        const { proof, publicSignals } = await generateProof(
          password,
          storedHash
        );

        await axios.post("http://localhost:3000/auth/login", {
          username,
          proof: JSON.stringify(proof),
          publicSignals: JSON.stringify(publicSignals),
        });
      } else {
        const hashedPassword = poseidon([password]);
        await axios.post("http://localhost:3000/auth/register", {
          username,
          hashedPassword,
        });
      }
      setMessage("Request successful");
    } catch (error) {
      setMessage("Error occurred");
    }
  };

  return (
    <div>
      <h2>{isLogin ? "Login" : "Register"}</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">{isLogin ? "Login" : "Register"}</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
