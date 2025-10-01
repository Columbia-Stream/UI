import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [triedSubmit, setTriedSubmit] = useState(false);
  const navigate = useNavigate();
  //only allowed emails
  const allowed = ["@columbia.edu", "@barnard.edu"];

  const hasAllowedDomain = (e) =>
    allowed.some((dom) => e.trim().toLowerCase().endsWith(dom));

  const emailValid = useMemo(
    () => email.length > 0 && hasAllowedDomain(email),
    [email]
  );
  const passwordValid = useMemo(() => password.length > 0, [password]);
  const formValid = emailValid && passwordValid;

  // only show error after or submit attempt, and only if invalid
  const showEmailError =
    (emailTouched || triedSubmit) && email.length > 0 && !emailValid;

  function handleSubmit(e) {
    
    e.preventDefault();
    setTriedSubmit(true);
    if (!formValid) return;

    //api call here
    navigate("/dashboard");
  }

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
          {/* emial box */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <label style={{ width: 110, fontWeight: 600, fontSize: ".95rem", color: "#444" }}>
              Email
            </label>
            <input
              type="email"
              placeholder="your_uni@columbia.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmailTouched(true)}
              style={{
                flex: 1, padding: 12,
                border: `1px solid ${showEmailError ? "#E57373" : "#ccc"}`,
                borderRadius: 6, fontSize: ".95rem", outline: "none",
              }}
            />
          </div>

          {/* error message */}
          {showEmailError && (
            <div
              role="alert"
              style={{
                color: "#B00020", background: "#FDECEC", border: "1px solid #F5B7B1",
                borderRadius: 6, padding: "8px 10px", fontSize: ".86rem",
                marginTop: -8,
              }}
            >
              Only @columbia.edu or @barnard.edu emails allowed. Please log in with your LionMail.
            </div>
          )}

          {/* password  */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <label style={{ width: 110, fontWeight: 600, fontSize: ".95rem", color: "#444" }}>
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                flex: 1, padding: 12, border: "1px solid #ccc",
                borderRadius: 6, fontSize: ".95rem", outline: "none",
              }}
            />
          </div>

          {/* login button */}
          <button
            type="submit"
            disabled={!formValid}
            style={{
              marginTop: 6, width: "100%", padding: 12,
              backgroundColor: formValid ? "#0072C6" : "#A7C2DD",
              color: "white", border: "none", borderRadius: 3,
              fontWeight: "bold", fontSize: ".95rem", textTransform: "uppercase",
              cursor: formValid ? "pointer" : "not-allowed", opacity: formValid ? 1 : 0.9,
              transition: "background-color .2s ease",
            }}
            onMouseOver={(e) => { if (formValid) e.target.style.backgroundColor = "#005999"; }}
            onMouseOut={(e) => { if (formValid) e.target.style.backgroundColor = "#0072C6"; }}
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
}