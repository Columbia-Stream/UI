import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SEARCH_API_BASE = "http://34.172.231.255:8081"; // Composite MS

export default function SearchPage() {
  // Local states for filters
  const [keyword, setKeyword] = useState("");
  const [courseId, setCourseId] = useState("");
  const [prof, setProf] = useState("");

  const [year, setYear] = useState("");        // NEW
  const [semester, setSemester] = useState(""); // NEW

  const [results, setResults] = useState({ items: [] });
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
    "Test Professor 1"
  ];

  const PROFESSOR_MAP = {
    "Donald Ferguson": "abc9",
    "Nakul Verma": "def9",
    "Ansaf Salleb-Aouissi": "ghi2",
    "Daniel Bauer": "db12",
    "Yunzhu Li": "yz56",
    "Parijat Dube": "pjd22",
    "Richard Zemel": "rzm88",
    "Test Professor 1": "ts37471_prof"
  };

  const courseList = [
    "COMSW4153",
    "COMSW4774",
    "COMSW4701",
    "COMSE6998",
    "COMSE4776",
  ];

  const semesterList = ["Fall", "Spring", "Summer"];   // NEW
  const yearList = ["2025", "2024", "2023"];           // NEW

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (keyword.trim() !== "") params.append("q", keyword.trim());
      if (courseId) params.append("course_id", courseId.trim());

      if (prof && professorList.includes(prof)) {
        params.append("prof", PROFESSOR_MAP[prof]);
      }

      // NEW — append year + semester
      if (year) params.append("year", year);
      if (semester) params.append("semester", semester);

      const idToken = localStorage.getItem("authToken");
      if (!idToken) throw new Error("You must be logged in to search");

      const res = await fetch(
        `${SEARCH_API_BASE}/videos/search?${params.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

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
    setYear("");        // NEW
    setSemester("");    // NEW
    setResults({ items: [] });
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
      {/* Left Filter Panel */}
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
          <FilterField
            label="Keyword"
            placeholder="Title or topic"
            value={keyword}
            onChange={setKeyword}
          />

          <CourseDropdown
            label="Course ID"
            placeholder="Type or select a course..."
            value={courseId}
            onChange={setCourseId}
            courses={courseList}
          />

          <ProfessorDropdown
            label="Professor"
            placeholder="Type to search..."
            value={prof}
            onChange={setProf}
            professors={professorList}
          />

          {/* NEW — SEMESTER */}
          <CourseDropdown
            label="Semester"
            placeholder="Fall / Spring / Summer"
            value={semester}
            onChange={setSemester}
            courses={semesterList}
          />

          {/* NEW — YEAR */}
          <CourseDropdown
            label="Year"
            placeholder="2025 / 2024 / 2023"
            value={year}
            onChange={setYear}
            courses={yearList}
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

      {/* Right Results Panel */}
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

        {!loading && results.items?.length === 0 && (
          <p style={{ color: "#6B7280" }}>No videos found.</p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {results.items?.map((v) => (
            <VideoCard key={v.video_id} video={v} />
          ))}
        </div>
      </main>
    </div>
  );
}

/* FilterField */
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

/* Generic Dropdown — reused for course, semester, year */
function CourseDropdown({ label, placeholder, value, onChange, courses }) {
  const [query, setQuery] = useState(value || "");
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  const filtered = courses.filter((c) =>
    c.toLowerCase().includes(query.toLowerCase())
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
          {filtered.map((name) => (
            <li
              key={name}
              onClick={() => {
                onChange(name);
                setQuery(name);
                setShowOptions(false);
              }}
              style={{
                padding: "8px 12px",
                cursor: "pointer",
                fontSize: ".95rem",
                borderBottom: "1px solid #F0F4F8",
              }}
              onMouseDown={(e) => e.preventDefault()}
            >
              {name}
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
  const navigate = useNavigate();
  return (
    <div
      style={{
        background: "white",
        border: "1px solid #E6EBF1",
        borderRadius: 10,
        padding: 18,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 6 }}>
        {video.title}
      </div>

      <div style={{ color: "#5A6A84", fontSize: ".9rem", marginBottom: 8 }}>
        {video.course_name} ({video.course_id}) — {video.semester} {video.year}
      </div>

      <div style={{ color: "#475569", fontSize: ".9rem" }}>
        Prof. {video.prof_uni}
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
        onClick={() => navigate(`/videos/${video.video_id}`)}
      >
        Watch Video
      </button>
    </div>
  );
}
