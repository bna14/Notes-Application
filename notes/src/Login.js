// Login.js
import React, { useState } from "react";

function Login({ onLogin, onShowSignup }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://notes-application-x57d.onrender.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }), // Remove user_id from body
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("user_id", data.userId); // Store user_id from server response
        onLogin(true); // Call onLogin to log in the user
        console.log("Login successful:", data);
      } else {
        alert("Incorrect username or password");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Error during login");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
      <button onClick={onShowSignup}>Sign Up</button>
    </div>
  );
}

export default Login;
