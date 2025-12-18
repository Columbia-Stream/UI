// 







import { useNavigate } from "react-router-dom";
import LogoutConfirmDialog from "./LogoutConfirmDialog";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="page">
      {/* HEADER (UNCHANGED) */}
      <header className="header">
        <div className="left">
          <h2>ColumbiaStream</h2>
        </div>
        <div className="right">
          <button onClick={() => navigate("/search")}>Search</button>
          <button onClick={() => navigate("/profile")}>Profile</button>
          <LogoutConfirmDialog />
        </div>
      </header>

      {/* MAIN */}
      <main className="main">
        {/* HERO */}
        <h1 style={{ fontSize: "2.1rem", fontWeight: 800, marginBottom: 8 }}>
          Welcome to ColumbiaStream
        </h1>

        <p style={{ maxWidth: 820, lineHeight: 1.6, color: "#5A6A84" }}>
          A centralized lecture streaming platform designed for both students and faculty.
          Browse courses, discover professors, and access recorded lectures across departments —
          all in one place.
        </p>

        <div
          style={{
            marginTop: 14,
            display: "inline-flex",
            gap: 10,
            alignItems: "center",
            padding: "10px 12px",
            borderRadius: 12,
            background: "#F6F9FC",
            border: "1px solid #E6EEF6",
            fontSize: ".95rem",
          }}
        >
          ℹ️ Features change based on your role. You can update your role anytime from Profile.
        </div>

        {/* STUDENT CAPABILITIES */}
        <SectionTitle>For Students</SectionTitle>
        <CapabilityGrid
          items={[
            { icon: "▶️", title: "Watch lectures", desc: "Stream recorded lectures across courses and departments." },
            { icon: "🔎", title: "Browse & search", desc: "Find lectures by course, professor, or title." },
            { icon: "⭐", title: "Save for later", desc: "Bookmark important lectures to revisit anytime." },
            { icon: "📚", title: "Course library", desc: "Access organized course content in one place." },
          ]}
        />

        {/* FACULTY CAPABILITIES */}
        <SectionTitle>For Faculty</SectionTitle>
        <CapabilityGrid
          items={[
            { icon: "⬆️", title: "Upload lectures", desc: "Upload recordings and make them available to students securely." },
            { icon: "🗂️", title: "Organize content", desc: "Attach uploads to courses and semesters." },
            { icon: "👥", title: "Share with students", desc: "Deliver course material through one platform." },
            { icon: "🔎", title: "Browse platform", desc: "Explore lectures across departments." },
          ]}
        />
      </main>
    </div>
  );
}

/* UI helpers */
function SectionTitle({ children }) {
  return <h2 style={{ margin: "28px 0 14px 0" }}>{children}</h2>;
}

function CapabilityGrid({ items }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
      {items.map((i) => (
        <CapabilityCard key={i.title} {...i} />
      ))}
    </div>
  );
}

function CapabilityCard({ icon, title, desc }) {
  return (
    <div style={{ border: "1px solid #EAEFF5", borderRadius: 14, padding: 18, background: "#fff" }}>
      <div style={{ fontSize: 22 }}>{icon}</div>
      <div style={{ fontWeight: 700, marginTop: 10 }}>{title}</div>
      <div style={{ marginTop: 6, color: "#5B6B82" }}>{desc}</div>
    </div>
  );
}