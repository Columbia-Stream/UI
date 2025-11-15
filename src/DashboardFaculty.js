import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

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
      {/* ---------- Top Navigation Bar ---------- */}
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

          {/* Search Button */}
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
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#009EFF")
            }
          >
            Search
          </button>

          {/* Profile Button */}
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
        </div>
      </header>

      {/* Hero Section*/}
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
            padding: "36px 20px 28px",
          }}
        >
          <h1
            style={{
              fontSize: "1.6rem",
              fontWeight: 700,
              letterSpacing: "0.1px",
              margin: 0,
            }}
          >
            Welcome back
          </h1>
          <p
            style={{
              margin: "8px 0 0 0",
              color: "#5A6A84",
              lineHeight: 1.6,
              maxWidth: 760,
            }}
          >
            Browse courses and professors, or resume a recent lecture.
          </p>
        </div>
      </section>

      {/* Main Body */}
      <main
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "28px 20px 110px",
        }}
      >
        {/* Browse Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 18,
            marginBottom: 28,
          }}
        >
          <Card
            title="Browse Courses"
            subtitle="Find lectures by course code or name."
            cta="courses"
            onClick={() => navigate("/courses")}
            icon="📘"
          />
          <Card
            title="Browse Professors"
            subtitle="Browse lectures by professor name."
            cta="professors"
            onClick={() => navigate("/professors")}
            icon="🎓"
          />
        </div>

        {/* Library Section */}
        <SectionTitle>Your Library</SectionTitle>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <VideoTile key={i} />
          ))}
        </div>
      </main>
      {/* Floating Upload Button */}
      <button
        onClick={() => navigate("/upload")}
        style={{
          position: "fixed",
          right: 24,
          bottom: 24,
          background: "#009EFF",
          border: "none",
          color: "white",
          padding: "14px 32px",
          borderRadius: 999,
          fontWeight: 700,
          fontSize: "1.05rem",
          cursor: "pointer",
          boxShadow: "0 14px 28px rgba(0, 70, 140, 0.24)",
          letterSpacing: "0.4px",
          zIndex: 20,
          transition: "background-color .2s ease, box-shadow .2s ease",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = "#0079BF";
          e.currentTarget.style.boxShadow = "0 18px 34px rgba(0, 70, 140, 0.3)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = "#009EFF";
          e.currentTarget.style.boxShadow = "0 14px 28px rgba(0, 70, 140, 0.24)";
        }}
        aria-label="Upload new lecture"
      >
        <span
          aria-hidden
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.25)",
            display: "grid",
            placeItems: "center",
            fontSize: "1.4rem",
            fontWeight: 600,
          }}
        >
          +
        </span>
        Upload
      </button>
    </div>
  );
}

/* ---------- Subcomponents ---------- */
function SectionTitle({ children }) {
  return (
    <h2
      style={{
        fontSize: "1.05rem",
        color: "#1F2A37",
        fontWeight: 700,
        margin: "6px 2px 12px",
        letterSpacing: "0.2px",
      }}
    >
      {children}
    </h2>
  );
}

function Card({ title, subtitle, cta, onClick, icon }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 14,
        border: "1px solid #EAEFF5",
        padding: 18,
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        alignItems: "center",
        gap: 16,
        transition: "border-color .2s ease, transform .06s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#D7E5F5")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#EAEFF5")}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.996)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <div
        aria-hidden
        style={{
          height: 44,
          width: 44,
          borderRadius: 12,
          background: "#F1F8FF",
          display: "grid",
          placeItems: "center",
          fontSize: 20,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontWeight: 700, marginBottom: 2 }}>{title}</div>
        <div style={{ color: "#64748B", fontSize: ".95rem" }}>{subtitle}</div>
      </div>
      <button
        onClick={onClick}
        style={{
          backgroundColor: "#009EFF",
          color: "white",
          border: "none",
          borderRadius: 10,
          padding: "10px 12px",
          fontWeight: 600,
          cursor: "pointer",
          whiteSpace: "nowrap",
          transition: "background-color .2s ease",
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.backgroundColor = "#0080CC")
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = "#009EFF")
        }
      >
        {cta}
      </button>
    </div>
  );
}

function VideoTile() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #EDF2F7",
          borderRadius: 14,
          overflow: "hidden",
          transition:
            "box-shadow .2s ease, transform .06s ease, border-color .2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 6px 24px rgba(20,40,70,0.06)";
          e.currentTarget.style.borderColor = "#E3EBF5";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.borderColor = "#EDF2F7";
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.997)")}
        onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {/* Video Thumbnail Placeholder */}
        <div
          style={{
            height: 132,
            background:
              "linear-gradient(135deg, rgba(0,158,255,0.10), rgba(0,76,153,0.10))",
            display: "grid",
            placeItems: "center",
            color: "#0E5AA7",
            fontWeight: 700,
            letterSpacing: ".3px",
          }}
        >
          Video
        </div>

        {/* Video Info */}
        <div style={{ padding: 14 }}>
          <div
            style={{
              fontWeight: 700,
              marginBottom: 4,
              fontSize: ".98rem",
              lineHeight: 1.35,
              color: "#13243A",
            }}
          >
            COMS 4153 — Lecture 12
          </div>
          <div style={{ color: "#5B6B82", fontSize: ".9rem" }}>
            Prof. Ferguson • 42 min
          </div>
        </div>
      </div>

      <div
        style={{ alignSelf: "flex-end", position: "relative" }}
        ref={menuRef}
      >
        <button
          aria-label="Library item options"
          onClick={() => setMenuOpen((prev) => !prev)}
          style={{
            background: "transparent",
            border: "none",
            padding: 6,
            cursor: "pointer",
            color: "#3C5068",
            fontSize: "1.4rem",
            lineHeight: 1,
          }}
        >
          &#8230;
        </button>

        {menuOpen && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              background: "white",
              border: "1px solid #E2E8F0",
              borderRadius: 14,
              boxShadow: "0 12px 26px rgba(15,35,60,0.16)",
              width: 156,
              padding: "6px 0",
              zIndex: 10,
            }}
          >
            <button
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                padding: "12px 18px",
                textAlign: "left",
                color: "#1F2C3D",
                fontWeight: 500,
                cursor: "pointer",
                fontSize: "0.95rem",
                transition: "background-color .15s ease",
              }}
              onClick={() => setMenuOpen(false)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#F7FAFC")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              Rename
            </button>
            <button
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                padding: "12px 18px",
                textAlign: "left",
                color: "#E11D48",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: "0.95rem",
                transition: "background-color .15s ease",
              }}
              onClick={() => setMenuOpen(false)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#FEF2F2")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <TrashIcon />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function TrashIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect
        x="7"
        y="8"
        width="10"
        height="11"
        rx="2"
        stroke="#E11D48"
        strokeWidth="1.8"
      />
      <path
        d="M9 5.5H15"
        stroke="#E11D48"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M5 7H19"
        stroke="#E11D48"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10 11L10 17"
        stroke="#E11D48"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M14 11L14 17"
        stroke="#E11D48"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
