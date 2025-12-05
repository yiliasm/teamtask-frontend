import { useState } from "react";
import axios from "axios";

function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:4000/api/auth/register", {
        email,
        username,
        password,
      });

      alert("Registration successful!");
      window.location.href = "/";
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Create an Account</h2>

      <form onSubmit={handleRegister} style={{ maxWidth: 300 }}>
        <input
          type="email"
          placeholder="Email"
          required
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
        />

        <input
          type="text"
          placeholder="Username"
          required
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
        />

        <input
          type="password"
          placeholder="Password"
          required
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
        />

        <button type="submit" style={{ width: "100%", padding: 10 }}>
          Register
        </button>
      </form>

      <p style={{ marginTop: 20 }}>
        Already have an account? <a href="/">Login</a>
      </p>
    </div>
  );
}

export default Register;
