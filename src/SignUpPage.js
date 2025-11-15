import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "./config"; 



export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // default
  const [emailTouched, setEmailTouched] = useState(false);
  const [triedSubmit, setTriedSubmit] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const allowed = ["@columbia.edu", "@barnard.edu"];
  const hasAllowedDomain = (e) =>
    allowed.some((dom) => e.trim().toLowerCase().endsWith(dom));

  const emailValid =
    email.length > 0 && hasAllowedDomain(email);
  const passwordValid = password.length > 0;
  const formValid = emailValid && passwordValid;

  const showEmailError =
    (emailTouched || triedSubmit) && email.length > 0 && !emailValid;




    async function handleSubmit(e) {
        e.preventDefault();
        setTriedSubmit(true);
        if (!formValid) return;
      
        try {
          setLoading(true);
          setError("");
      
          const res = await fetch(`${API_BASE}/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              password,
              role,
            }),
          });
      
          const data = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(data.detail || data.message || "Signup failed");
      
        //   navigate("/login");
          navigate(`/splash?mode=signupSuccess&next=${encodeURIComponent("/login")}`);


        } catch (err) {
          setError(err.message || "Something went wrong");
        } finally {
          setLoading(false);
        }
      }

//   function handleSubmit(e) {
//     e.preventDefault();
//     setTriedSubmit(true);
//     if (!formValid) return;

//     // later: send {uni, email, password, role} to API
//     console.log({ email, password, role });
//     navigate("/login");
//   }

  return (
    <div
      style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", height: "100vh",
        background: "linear-gradient(135deg, #002855, #004C99)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ color: "white", marginBottom: 40, fontSize: "2.5rem", letterSpacing: 1 }}>
        ColumbiaStream
      </h1>

      <div
        style={{
          backgroundColor: "white", padding: 40, borderRadius: 12,
          boxShadow: "0 6px 20px rgba(0,0,0,0.2)", width: 420,
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Email */}
          <Row label="Email">
            <input
              type="email"
              placeholder="your_uni@columbia.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmailTouched(true)}
              style={{
                ...inputStyle,
                border: `1px solid ${showEmailError ? "#E57373" : "#ccc"}`,
              }}
            />
          </Row>
          {showEmailError && (
            <div
              role="alert"
              style={{
                color: "#B00020", background: "#FDECEC", border: "1px solid #F5B7B1",
                borderRadius: 6, padding: "8px 10px", fontSize: ".86rem",
                marginTop: -8,
              }}
            >
              Only @columbia.edu or @barnard.edu emails allowed.
            </div>
          )}

          {/* Password */}
          <Row label="Password">
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </Row>

          {/* Role */}
          <Row label="Role">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ ...inputStyle, padding: "10px" }}
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
            </select>
          </Row>

          {/* Error */}
          {error && (
            <div
              role="alert"
              style={{
                color: "#B00020",
                fontSize: ".9rem",
              }}
            >
              {error}
            </div>
          )}

          {/* Signup button */}
          <button
            type="submit"
            disabled={!formValid || loading}
            style={{
              marginTop: 6,
              width: "100%",
              padding: 12,
              backgroundColor: formValid && !loading ? "#0072C6" : "#A7C2DD",
              color: "white",
              border: "none",
              borderRadius: 3,
              fontWeight: "bold",
              fontSize: ".95rem",
              textTransform: "uppercase",
              cursor: formValid && !loading ? "pointer" : "not-allowed",
              opacity: formValid && !loading ? 1 : 0.9,
              transition: "background-color .2s ease",
            }}
          >
            {loading ? "SIGNING UP..." : "SIGN UP"}
          </button>

          <div
            style={{
              fontSize: ".9rem",
              color: "#5A6A84",
              marginTop: 8,
            }}
          >
            Already a member? <a href="/login">Log in</a>
          </div>
        </form>
      </div>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <label style={{ width: 110, fontWeight: 600, fontSize: ".95rem", color: "#444" }}>
        {label}
      </label>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  fontSize: ".95rem",
  outline: "none",
};
