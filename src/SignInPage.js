import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { COMPOSITE_BASE_URL } from "./config";
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyD1tYM2V3wCxTz1stBFLXo5uPYktavyraU",
    authDomain: "qualified-root-474022-u3.firebaseapp.com",
    projectId: "qualified-root-474022-u3",
    // ... other config fields are optional for auth
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Optional: Add scopes if you need more than the default identity/email/profile
provider.addScope('https://www.googleapis.com/auth/userinfo.email');
provider.getCustomParameters({prompt: 'select_account'})

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [triedSubmit, setTriedSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [oauthError, setOauthError] = useState("");
  const [userEmail, setUserEmail] = useState(null);
  const [token, setToken] = useState(null);


  const navigate = useNavigate();

  const allowed = ["@columbia.edu", "@barnard.edu"];
  const hasAllowedDomain = (e) =>
    allowed.some((dom) => e.trim().toLowerCase().endsWith(dom));

  const emailValid = email.length > 0 && hasAllowedDomain(email);
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

      const res = await fetch(`${COMPOSITE_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.detail || data.message || `Login failed (${res.status})`);
      }
      const idToken = data.id_token || data.idToken;
      if (!idToken) {
        throw new Error("No token returned from server");
      }

      const emailFromApi = data.email || data.user_email;

      localStorage.setItem("authToken", idToken);
      if (emailFromApi) {
        localStorage.setItem("userEmail", emailFromApi);
      }
      if (data.role) {
        localStorage.setItem("userRole", data.role);
      }
      if(data.uni) {
        localStorage.setItem("userUni", data.uni);
      }

      const dashboardRoute =
        data.dashboard_route || data.dashboardRoute || "/dashboard";
      localStorage.setItem("dashboardRoute", dashboardRoute);

      // Show splash then route-specific dashboard
      navigate(
        `/splash?mode=loginSuccess&next=${encodeURIComponent(dashboardRoute)}`
      );
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function processOauthToken(token) {

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${COMPOSITE_BASE_URL}/auth/handle-oauth`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.detail || data.message || `Login failed (${res.status})`);
      }
      

      const emailFromApi = data.email || data.user_email;

      localStorage.setItem("authToken", token);
      if (emailFromApi) {
        localStorage.setItem("userEmail", emailFromApi);
      }
      if (data.role) {
        localStorage.setItem("userRole", data.role);
      }
      if(data.uni) {
        localStorage.setItem("userUni", data.uni);
      }

      const dashboardRoute =
        data.dashboard_route || data.dashboardRoute || "/dashboard";
      localStorage.setItem("dashboardRoute", dashboardRoute);

      // Show splash then route-specific dashboard
      navigate(
        `/splash?mode=loginSuccess&next=${encodeURIComponent(dashboardRoute)}`
      );
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // Function to handle the Google Sign-In process
    const handleGoogleSignIn = async () => {
        setToken(null);
        setUserEmail(null);
        setOauthError("");
        try {
            // Initiate the sign-in with a popup
            const result = await signInWithPopup(auth, provider);
            
            // Get the User object
            const user = result.user;

            // 🔑 CRITICAL STEP: Get the verifiable Firebase ID Token (JWT)
            const idToken = await user.getIdToken();

            // Update component state
            setUserEmail(user.email);
            setToken(idToken);
            console.log("Successfully retrieved ID Token:", idToken);
            
            // 🚨 NEXT STEP: Send this token to your backend for verification
            // Example: await fetch('/api/verify-token', { 
            //              method: 'POST', 
            //              headers: { 'Authorization': `Bearer ${idToken}` }
            //          });

            await processOauthToken(idToken);
            
        } catch (err) {
            console.error("Google Sign-In Error:", err);
            
            
            // Firebase will often return specific error codes here, 
            // for example, if the domain restriction check (columbia.edu/barnard.edu) fails.
            if (err.code === 'auth/unauthorized-domain') {
                 setOauthError("Sign-in failed: Your email domain is not authorized.");
            }
        } 
    };

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

          {showEmailError && (
            <div
              role="alert"
              style={{
                color: "#B00020", background: "#FDECEC", border: "1px solid #F5B7B1",
                borderRadius: 6, padding: "8px 10px", fontSize: ".86rem", marginTop: -8,
              }}
            >
              Only @columbia.edu or @barnard.edu emails allowed. Please log in with your LionMail.
            </div>
          )}

          {/* Password */}
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

          {/* Error */}
          {error && (
            <div role="alert" style={{ color: "#B00020", fontSize: ".9rem" }}>
              {error}
            </div>
          )}

          {/* Login */}
          <button
            type="submit"
            disabled={!formValid || loading}
            style={{
              marginTop: 6, width: "100%", padding: 12,
              backgroundColor: formValid && !loading ? "#0072C6" : "#A7C2DD",
              color: "white", border: "none", borderRadius: 3,
              fontWeight: "bold", fontSize: ".95rem", textTransform: "uppercase",
              cursor: formValid && !loading ? "pointer" : "not-allowed",
              opacity: formValid && !loading ? 1 : 0.9,
              transition: "background-color .2s ease",
            }}
          >
            {loading ? "Logging in..." : "LOGIN"}
          </button>

          <div style={{ fontSize: ".9rem", color: "#5A6A84", marginTop: 8 }}>
            New here? <Link to="/signup">Create an account</Link>
          </div>
        </form>
        <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                style={{
                    backgroundColor: '#4285F4',
                    color: 'white',
                    padding: '10px 20px',
                    fontSize: '16px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                }}
            >
                {'Continue with Google'}
        </button>
        {oauthError && (
            <div
              role="alert"
              style={{
                color: "#B00020", background: "#FDECEC", border: "1px solid #F5B7B1",
                borderRadius: 6, padding: "8px 10px", fontSize: ".86rem", marginTop: -8,
              }}
            >
              {oauthError}
            </div>
          )}
          {/* {userEmail && (
                <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '15px' }}>
                    <p>✅ **Sign-in Successful!**</p>
                    <p>Logged in as: **{userEmail}**</p>
                    
                    <h3>Verifiable ID Token:</h3>
                    <textarea 
                        rows="5" 
                        readOnly 
                        value={token} 
                        style={{ width: '100%', resize: 'none' }}
                        placeholder="ID Token"
                    />
                    <p style={{ fontSize: '12px', color: '#555' }}>Send this JWT to your backend for security verification.</p>
                </div>
            )} */}
      </div>
    </div>
  );
}
