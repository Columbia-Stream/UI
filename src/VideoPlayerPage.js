import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { useParams, useNavigate } from "react-router-dom";
import { COMPOSITE_BASE_URL } from "./config";

function VideoPlayerPage() {
  const { videoId } = useParams();
  const videoRef = useRef(null);
  const [videoData, setVideoData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem("authToken");

      const res = await fetch(`${COMPOSITE_BASE_URL}/videos/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setVideoData(data);

      const url = data.gcs_path;

      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(videoRef.current);
      } else {
        videoRef.current.src = url; // Safari fallback
      }
    }

    load();
  }, [videoId]);

  if (!videoData) {
    return (
      <div style={{ padding: 40, fontSize: 20, fontWeight: 600 }}>
        Loading video...
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px 30px",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >

      {/* Back to Search Button */}
      <button
        onClick={() => navigate("/search")}
        style={{
          marginBottom: "20px",
          background: "transparent",
          border: "none",
          color: "#2563eb",
          cursor: "pointer",
          fontSize: "1rem",
          fontWeight: 500,
          padding: "0",
        }}
      >
        ← Back to Search
      </button>

      {/* Title */}
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: 700,
          marginBottom: "12px",
          color: "#111827",
        }}
      >
        {videoData.title}
      </h1>

      {/* Metadata */}
      <div style={{ marginBottom: "28px" }}>
        <p style={{ fontSize: "1.05rem", color: "#374151", margin: "6px 0" }}>
          <strong>Course:</strong> {videoData.course_id}
        </p>
        <p style={{ fontSize: "1.05rem", color: "#374151", margin: "6px 0" }}>
          <strong>Professor:</strong> {videoData.prof_uni}
        </p>
      </div>

      {/* Video Player */}
      <div
        style={{
          width: "100%",
          background: "#000",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <video
          ref={videoRef}
          controls
          style={{ width: "100%", maxHeight: "520px" }}
        />
      </div>
    </div>
  );
}

export default VideoPlayerPage;
