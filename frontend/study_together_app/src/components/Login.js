import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api";
import "../styles/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await loginUser({ email, password });

      const token = res.data;

      if (!token || token.length < 20) {
        alert("Invalid Credentials");
        return;
      }

      // ✅ Save token
      localStorage.setItem("token", token);
      localStorage.setItem("email", email);

      alert("Login Successful ✅");

      navigate("/dashboard"); 

    } catch (err) {
      alert(err.response?.data || "Login failed");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <h1>Study Together</h1>
        <p>Collaborate. Focus. Achieve More 🎯</p>
      </div>

      <div className="login-right">
        <div className="login-card">
          <h2>Welcome Back 👋</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleLogin}>Sign In</button>

          <p>
            New here? <Link to="/register">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;