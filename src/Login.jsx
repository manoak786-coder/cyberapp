import { useState } from "react";

export default function Login({ onLogin, onRegister, error, success, loading, registerLoading }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    if (onLogin) onLogin(username, password);
  };

  const handleRegister = () => {
    if (onRegister) onRegister(username, password);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        style={{ width: "100%", padding: "14px 16px", marginBottom: "10px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#fff", fontSize: "14px", fontFamily: "inherit" }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        style={{ width: "100%", padding: "14px 16px", marginBottom: "10px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#fff", fontSize: "14px", fontFamily: "inherit" }}
      />

      {error && <p style={{ color: "#ff4444", fontSize: "12px", margin: "0 0 10px" }}>{error}</p>}
      {success && <p style={{ color: "#00ff88", fontSize: "12px", margin: "0 0 10px" }}>{success}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: "#00ff88", color: "#000", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginBottom: "10px" }}
      >
        {loading ? "CHECKING..." : "START QUIZ →"}
      </button>
      <button
        type="button"
        onClick={handleRegister}
        style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.16)", background: "transparent", color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
      >
        {registerLoading ? "REGISTERING..." : "REGISTER STUDENT"}
      </button>
    </div>
  );
}
