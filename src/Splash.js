import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Splash() {
  const { search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const mode = params.get("mode");                 // e.g., "signupSuccess"
    const next = params.get("next") || "/login";     // default to /login

    // small pause so user sees feedback
    const timer = setTimeout(() => {
      navigate(next, { replace: true });
    }, 1000);

    return () => clearTimeout(timer);
  }, [search, navigate]);

  const messageByMode = {
    signupSuccess: "Account created successfully. Redirecting to login…",
    loginSuccess: "Welcome back! Redirecting to your dashboard…",
  };

  const message =
    messageByMode[new URLSearchParams(search).get("mode")] ||
    "Redirecting…";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #002855, #004C99)",
        color: "white",
        fontFamily: "Arial, sans-serif",
        padding: 24,
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.12)",
          padding: 28,
          borderRadius: 12,
          backdropFilter: "blur(6px)",
          boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
          textAlign: "center",
          minWidth: 320,
        }}
      >
        <div style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: 10 }}>
          ColumbiaStream
        </div>
        <div style={{ marginBottom: 14 }}>{message}</div>
        <Spinner />
      </div>
    </div>
  );
}

function Spinner() {
  // lightweight CSS spinner
  return (
    <div
      style={{
        width: 28,
        height: 28,
        border: "3px solid rgba(255,255,255,0.5)",
        borderTopColor: "#fff",
        borderRadius: "50%",
        margin: "0 auto",
        animation: "spin 0.9s linear infinite",
      }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}