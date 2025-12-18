import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutConfirmDialog from "./LogoutConfirmDialog";

export default function DashboardStudent() {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#FFFFFF",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
        color: "#0E1B2A",
      }}
    >
      {/* ---------- Top Navigation Bar (UNCHANGED) ---------- */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "#FFFFFF",
          borderBottom: "1px solid #E9EEF4",
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              fontWeight: 700,
              letterSpacing: "0.2px",
              fontSize: "1.05rem",
            }}
          >
            ColumbiaStream
          </div>

          <div style={{ flex: 1 }} />

          <button
            onClick={() => navigate("/search")}
            style={{
              background: "#009EFF",
              border: "none",
              color: "white",
              padding: "9px 16px",
              borderRadius: 10,
              fontWeight: 600,
              cursor: "pointer",
              transition: "background-color .2s ease",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#0080CC")
            }
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#009EFF")}
          >
            Search
          </button>

          <button
            onClick={() => navigate("/profile")}
            style={{
              marginLeft: 12,
              background: "#F6F9FC",
              border: "1px solid #E6EEF6",
              color: "#334155",
              padding: "8px 12px",
              borderRadius: 10,
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Profile
          </button>

          <button
            onClick={() => setShowLogoutConfirm(true)}
            style={{
              marginLeft: 12,
              background: "#FFF6F5",
              border: "1px solid #FAD4D4",
              color: "#B42318",
              padding: "8px 14px",
              borderRadius: 10,
              cursor: "pointer",
              fontWeight: 600,
              transition: "background-color .2s ease, border-color .2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#FFE4E0";
              e.currentTarget.style.borderColor = "#F8B4AD";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#FFF6F5";
              e.currentTarget.style.borderColor = "#FAD4D4";
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* ---------- Hero ---------- */}
      <section
        style={{
          borderBottom: "1px solid #F2F5F9",
          background:
            "linear-gradient(180deg, #FAFCFE 0%, rgba(250,252,254,0) 100%)",
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            padding: "44px 20px 30px",
            display: "grid",
            gridTemplateColumns: "1.3fr 0.9fr",
            gap: 18,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "2.1rem",
                fontWeight: 800,
                letterSpacing: "-0.3px",
                margin: 0,
              }}
            >
              Welcome back to ColumbiaStream
            </h1>

            <p
              style={{
                margin: "10px 0 0 0",
                color: "#5A6A84",
                lineHeight: 1.65,
                maxWidth: 760,
                fontSize: "1.03rem",
              }}
            >
              A centralized lecture streaming platform designed for both students and
              faculty — with role-based dashboards and tools.
            </p>
          </div>

          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #EAEFF5",
              borderRadius: 16,
              padding: 18,
              boxShadow: "0 8px 26px rgba(20,40,70,0.06)",
              alignSelf: "start",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background:
                    "linear-gradient(135deg, rgba(0,158,255,0.16), rgba(0,76,153,0.10))",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#0E5AA7",
                }}
              >
                i
              </div>
              <div>
                <div style={{ fontWeight: 800, color: "#13243A" }}>
                  Role-based access
                </div>
                <div style={{ color: "#5A6A84", fontSize: ".92rem", marginTop: 2 }}>
                  Your role determines the dashboard you see.
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 12,
                padding: 12,
                borderRadius: 14,
                background: "#F6FBFF",
                border: "1px solid #DCEEFF",
                color: "#315B86",
                lineHeight: 1.5,
                fontSize: ".93rem",
              }}
            >
              You can set or switch your role in <b>Profile</b>. If you logged in with
              Google, the role can still be updated there.
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Main ---------- */}
      <main
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "28px 20px 72px",
        }}
      >
        {/* Students (2 per row) */}
        <SectionTitle>For Students</SectionTitle>
        <TwoColGrid>
          <FeatureCard
            icon="▶️"
            title="Watch lectures"
            subtitle="Stream recorded lectures anytime, from anywhere."
          />
          <FeatureCard
            icon="🔎"
            title="Browse & search"
            subtitle="Find lectures by topic, course ID, or professor."
          />
          <FeatureCard
            icon="📚"
            title="Course-friendly organization"
            subtitle="Quickly locate what you need for a specific class."
          />
          <FeatureCard
            icon="🧭"
            title="Easy navigation"
            subtitle="Use Search and Profile from the top bar anytime."
          />
        </TwoColGrid>

        <div style={{ height: 22 }} />

        {/* Search section (no tips, no quick tips) */}
        <SectionTitle>How Search Works</SectionTitle>
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #EAEFF5",
            borderRadius: 16,
            padding: 18,
          }}
        >
          <div style={{ color: "#5A6A84", lineHeight: 1.6, marginBottom: 12 }}>
            Search using these categories:
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
              gap: 12,
            }}
          >
            <CategoryCard label="Keyword" example="Title or topic" icon="🔤" />
            <CategoryCard label="Course ID" example="COMS 4153" icon="🏷️" />
            <CategoryCard label="Professor(s)" example="Type to search" icon="🧑‍🏫" />
            <CategoryCard label="Semester" example="Fall / Spring / Summer" icon="🗓️" />
            <CategoryCard label="Year" example="2025 / 2024 / 2023" icon="📌" />
          </div>
        </div>
      </main>

      <LogoutConfirmDialog
        open={showLogoutConfirm}
        onConfirm={handleConfirmLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
}

/* ---------- UI helpers ---------- */

function SectionTitle({ children }) {
  return (
    <h2
      style={{
        fontSize: "1.1rem",
        color: "#1F2A37",
        fontWeight: 800,
        margin: "6px 2px 12px",
        letterSpacing: "0.2px",
      }}
    >
      {children}
    </h2>
  );
}

function TwoColGrid({ children }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: 18,
      }}
    >
      <style>
        {`
          @media (max-width: 860px) {
            .twoColGridFallback { grid-template-columns: 1fr !important; }
          }
        `}
      </style>
      <div className="twoColGridFallback" style={{ display: "contents" }}>
        {children}
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, subtitle }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 18,
        border: "1px solid #E6EEF6",
        padding: 22,
        transition: "border-color .2s ease, box-shadow .2s ease, transform .06s ease",
        minHeight: 120,
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#D7E5F5";
        e.currentTarget.style.boxShadow = "0 12px 30px rgba(20,40,70,0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#E6EEF6";
        e.currentTarget.style.boxShadow = "none";
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.996)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <div
        aria-hidden
        style={{
          height: 56,
          width: 56,
          borderRadius: 18,
          background: "#F1F8FF",
          display: "grid",
          placeItems: "center",
          fontSize: 22,
          flex: "0 0 auto",
        }}
      >
        {icon}
      </div>

      <div>
        <div
          style={{
            fontWeight: 900,
            marginBottom: 6,
            color: "#13243A",
            fontSize: "1.08rem",
          }}
        >
          {title}
        </div>
        <div style={{ color: "#64748B", fontSize: "1.02rem", lineHeight: 1.45 }}>
          {subtitle}
        </div>
      </div>
    </div>
  );
}

function CategoryCard({ label, example, icon }) {
  return (
    <div
      style={{
        background: "#FBFDFF",
        border: "1px solid #E2EFFB",
        borderRadius: 16,
        padding: 16,
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          background: "#EEF7FF",
          display: "grid",
          placeItems: "center",
          fontSize: 18,
        }}
        aria-hidden
      >
        {icon}
      </div>
      <div>
        <div style={{ fontWeight: 900, color: "#13243A", fontSize: "1.02rem" }}>
          {label}
        </div>
        <div style={{ color: "#5A6A84", fontSize: "1rem", marginTop: 4 }}>
          {example}
        </div>
      </div>
    </div>
  );
}