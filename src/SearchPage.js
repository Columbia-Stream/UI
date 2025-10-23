import { useState, useEffect } from "react";

// TEMP: backend base for your FastAPI Search microservice
const SEARCH_API_BASE = "http://127.0.0.1:8001/api";

export default function SearchPage() {
  // Local states for filters
  const [keyword, setKeyword] = useState("");
  const [courseId, setCourseId] = useState("");
  const [prof, setProf] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Static dropdown data
  const professorList = [
    "Donald Ferguson",
    "Nakul Verma",
    "Ansaf Salleb-Aouissi",
    "Daniel Bauer",
    "Yunzhu Li",
    "Parijat Dube",
    "Richard Zemel",
  ];

  const courseList = [
    "COMS W4153",
    "COMS W4774",
    "COMS W4701",
    "COMS E6998",
    "COMS E4776",
  ];

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (keyword) params.append("q", keyword);
      if (courseId) params.append("course_id", courseId);
      if (prof) params.append("prof", prof);

      const idToken = localStorage.getItem("authToken");
      if (!idToken) throw new Error("You must be logged in to search");

      const res = await fetch(`${SEARCH_API_BASE}/search?${params.toString()}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch search results");
      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setKeyword("");
    setCourseId("");
    setProf("");
    setResults([]);
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "320px 1fr",
        minHeight: "100vh",
        background: "#F8FAFD",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* Left Filter Panel*/}
      <aside
        style={{
          background: "white",
          borderRight: "1px solid #E5EAF1",
          padding: "28px 20px",
        }}
      >
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "#002855",
            marginBottom: 24,
          }}
        >
          Search Videos
        </h2>

        <form
          onSubmit={handleSearch}
          style={{ display: "flex", flexDirection: "column", gap: 18 }}
        >
          {/* Keyword */}
          <FilterField
            label="Keyword"
            placeholder="Title or topic"
            value={keyword}
            onChange={setKeyword}
          />

          {/* Course ID Dropdown */}
          <CourseDropdown
            label="Course ID"
            placeholder="Type or select a course..."
            value={courseId}
            onChange={setCourseId}
            courses={courseList}
          />

          {/* Professor Dropdown */}
          <ProfessorDropdown
            label="Professor"
            placeholder="Type to search..."
            value={prof}
            onChange={setProf}
            professors={professorList}
          />

          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                background: "#004C99",
                color: "white",
                padding: "10px 0",
                border: "none",
                borderRadius: 8,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {loading ? "Searching..." : "Search"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              style={{
                flex: 1,
                background: "#F6F9FC",
                border: "1px solid #E6EEF6",
                borderRadius: 8,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Reset
            </button>
          </div>
        </form>
      </aside>

      {/*Right Results Panel*/}
      <main style={{ padding: "32px 40px" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: 16 }}>
          Search Results
        </h1>

        {error && (
          <div
            style={{
              background: "#FFE5E5",
              border: "1px solid #FFC7C7",
              padding: 12,
              borderRadius: 8,
              color: "#B00020",
              marginBottom: 20,
            }}
          >
            {error}
          </div>
        )}

        {loading && <p>Loading...</p>}

        {!loading && results.length === 0 && (
          <p style={{ color: "#6B7280" }}>No videos found.</p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {results.map((v) => (
            <VideoCard key={v.video_id} video={v} />
          ))}
        </div>
      </main>
    </div>
  );
}

/*FilterField*/
function FilterField({ label, placeholder, value, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontWeight: 600, fontSize: ".95rem", color: "#1E293B" }}>
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: "10px 12px",
          border: "1px solid #DCE4EE",
          borderRadius: 8,
          outline: "none",
          fontSize: ".95rem",
        }}
      />
    </div>
  );
}

/* Course Dropdown */
function CourseDropdown({ label, placeholder, value, onChange, courses }) {
  const [query, setQuery] = useState(value || "");
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  const filtered = courses.filter((course) =>
    course.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ position: "relative" }}>
      <label style={{ fontWeight: 600, fontSize: ".95rem", color: "#1E293B" }}>
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowOptions(true);
        }}
        onFocus={() => setShowOptions(true)}
        onBlur={() => setTimeout(() => setShowOptions(false), 100)}
        style={{
          width: "100%",
          padding: "10px 12px",
          border: "1px solid #DCE4EE",
          borderRadius: 8,
          outline: "none",
          fontSize: ".95rem",
          boxSizing: "border-box",
        }}
      />

      {showOptions && filtered.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "white",
            border: "1px solid #E6EEF6",
            borderRadius: 8,
            marginTop: 4,
            padding: 0,
            listStyle: "none",
            maxHeight: 150,
            overflowY: "auto",
            zIndex: 10,
          }}
        >
          {filtered.map((courseName) => (
            <li
              key={courseName}
              onClick={() => {
                onChange(courseName);
                setQuery(courseName);
                setShowOptions(false);
              }}
              style={{
                padding: "8px 12px",
                cursor: "pointer",
                fontSize: ".95rem",
                borderBottom: "1px solid #F0F4F8",
              }}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#F6F9FC")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "white")
              }
            >
              {courseName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* Professor Dropdown */
function ProfessorDropdown({ label, placeholder, value, onChange, professors }) {
  const [query, setQuery] = useState(value || "");
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  const filtered = professors.filter((prof) =>
    prof.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ position: "relative" }}>
      <label style={{ fontWeight: 600, fontSize: ".95rem", color: "#1E293B" }}>
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowOptions(true);
        }}
        onFocus={() => setShowOptions(true)}
        onBlur={() => setTimeout(() => setShowOptions(false), 100)}
        style={{
          width: "100%",
          padding: "10px 12px",
          border: "1px solid #DCE4EE",
          borderRadius: 8,
          outline: "none",
          fontSize: ".95rem",
          boxSizing: "border-box",
        }}
      />

      {showOptions && filtered.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "white",
            border: "1px solid #E6EEF6",
            borderRadius: 8,
            marginTop: 4,
            padding: 0,
            listStyle: "none",
            maxHeight: 150,
            overflowY: "auto",
            zIndex: 10,
          }}
        >
          {filtered.map((profName) => (
            <li
              key={profName}
              onClick={() => {
                onChange(profName);
                setQuery(profName);
                setShowOptions(false);
              }}
              style={{
                padding: "8px 12px",
                cursor: "pointer",
                fontSize: ".95rem",
                borderBottom: "1px solid #F0F4F8",
              }}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#F6F9FC")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "white")
              }
            >
              {profName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* Video Card */
function VideoCard({ video }) {
  return (
    <div
      style={{
        background: "white",
        border: "1px solid #E6EBF1",
        borderRadius: 10,
        padding: 18,
        transition: "box-shadow .2s ease, transform .1s ease",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 6 }}>
        {video.title}
      </div>
      <div style={{ color: "#5A6A84", fontSize: ".9rem", marginBottom: 8 }}>
        {video.course_name} ({video.course_id})
      </div>
      <div style={{ color: "#475569", fontSize: ".9rem" }}>
        Prof. {video.prof_name}
      </div>
      <div style={{ fontSize: ".85rem", color: "#6B7280", marginTop: 6 }}>
        Uploaded: {new Date(video.uploaded_at).toLocaleDateString()}
      </div>
      <button
        style={{
          marginTop: 10,
          width: "100%",
          background: "#009EFF",
          color: "white",
          border: "none",
          borderRadius: 8,
          padding: "10px 0",
          cursor: "pointer",
          fontWeight: 600,
        }}
        onClick={() => window.open(video.gcs_path, "_blank")}
      >
        Watch Video
      </button>
    </div>
  );
}
