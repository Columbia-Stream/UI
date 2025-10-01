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
      {/* columbia stream bar */}
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
        
          <input
            type="search"
            placeholder="Search courses, professors, or lectures"
            style={{
              width: 360,
              maxWidth: "45vw",
              padding: "10px 12px",
              border: "1px solid #DCE4EE",
              borderRadius: 10,
              outline: "none",
              fontSize: ".95rem",
              transition: "box-shadow .2s ease, border-color .2s ease",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#BFD9F2";
              e.currentTarget.style.boxShadow =
                "0 0 0 4px rgba(0,158,255,0.08)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#DCE4EE";
              e.currentTarget.style.boxShadow = "none";
            }}
          />

          <button
            style={{
              marginLeft: 12,
              background: "#F6F9FC",
              border: "1px solid #E6EEF6",
              color: "#334155",
              padding: "8px 12px",
              borderRadius: 10,
              cursor: "pointer",
            }}
          >
            Profile
          </button>
        </div>
      </header>

      
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

      {/* main bodyt */}
      <main style={{ maxWidth: 1120, margin: "0 auto", padding: "28px 20px 56px" }}>
        {/* browse section*/}
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
            onClick={() => alert("add route to /courses")}
            icon="📘"
          />
          <Card
            title="Browse Professors"
            subtitle="Browse lectures by professor name."
            cta="professors"
            onClick={() => alert("add route to /professors")}
            icon="🎓"
          />
        </div>

        {/* continue watching */}
        <SectionTitle>Continue Watching</SectionTitle>

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
    </div>
  );
}



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
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0080CC")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#009EFF")}
      >
        {cta}
      </button>
    </div>
  );
}

function VideoTile() {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #EDF2F7",
        borderRadius: 14,
        overflow: "hidden",
        transition: "box-shadow .2s ease, transform .06s ease, border-color .2s ease",
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
      {/* video thumbnail will be here */}
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

      {/* random data for the video */}
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
          COMS 4153 — Lecture  12
        </div>
        <div style={{ color: "#5B6B82", fontSize: ".9rem" }}>
          Prof. Ferguson • 42 min
        </div>
      </div>
    </div>
  );
}