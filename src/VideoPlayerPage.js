import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { useParams, useNavigate } from "react-router-dom";
import { COMPOSITE_BASE_URL } from "./config";

function VideoPlayerPage() {
  const { videoId } = useParams();
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [videoData, setVideoData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const token = localStorage.getItem("authToken") || "";
      const res = await fetch(`${COMPOSITE_BASE_URL}/videos/${videoId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const data = await res.json();
      if (cancelled) return;

      setVideoData(data);

      const url = data?.gcs_path;                 // must be https://.../playlist.m3u8
      const videoEl = videoRef.current;
      if (!url || !videoEl) return;

      // fresh instance each time
      if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }

      // ensure autoplay-friendly: muted + inline
      videoEl.muted = true;
      videoEl.playsInline = true;
      videoEl.crossOrigin = "anonymous";

      if (Hls.isSupported()) {
        const hls = new Hls({
          autoStartLoad: true,
          xhrSetup: (xhr) => { xhr.withCredentials = false; },
        });
        hlsRef.current = hls;

        // helpful debug — watch level and segment fetches
        hls.on(Hls.Events.LEVEL_LOADING, (_, d) => console.log("LEVEL_LOADING:", d?.url));
        hls.on(Hls.Events.LEVEL_LOADED,  (_, d) => console.log("LEVEL_LOADED segs:", d?.details?.fragments?.length));
        hls.on(Hls.Events.FRAG_LOADING,  (_, d) => console.log("FRAG_LOADING:", d?.frag?.url));
        hls.on(Hls.Events.ERROR,         (_, d) => console.error("HLS ERROR:", d.type, d.details, d?.response?.code, d?.response?.url));

        hls.attachMedia(videoEl);
        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          hls.loadSource(url);                    // load AFTER attach
        });

        // ensure loader actually kicks on all browsers
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          hls.startLoad(0);                       // start fetching immediately
          // nudge playback to satisfy autoplay policies; muted so it succeeds
          videoEl.play().catch(() => {});
        });
      } else if (videoEl.canPlayType("application/vnd.apple.mpegurl")) {
        videoEl.src = url;                        // Safari / iOS native
        // Kick playback so segments fetch
        videoEl.play().catch(() => {});
      } else {
        videoEl.src = url;                        // MP4-only fallback
      }
    })().catch(console.error);

    return () => {
      cancelled = true;
      if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }
    };
  }, [videoId]);

  if (!videoData) {
    return <div style={{ padding: 40, fontSize: 20, fontWeight: 600 }}>Loading video...</div>;
  }

  return (
    <div style={{
      maxWidth: "900px", margin: "40px auto", padding: "20px 30px",
      background: "white", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      fontFamily: "Inter, system-ui, sans-serif"
    }}>
      <button onClick={() => navigate("/search")} style={{
        marginBottom: 20, background: "transparent", border: "none",
        color: "#2563eb", cursor: "pointer", fontSize: "1rem", fontWeight: 500, padding: 0
      }}>
        ← Back to Search
      </button>

      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 12, color: "#111827" }}>
        {videoData.title}
      </h1>

      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: "1.05rem", color: "#374151", margin: "6px 0" }}>
          <strong>Course:</strong> {videoData.course_id}
        </p>
        <p style={{ fontSize: "1.05rem", color: "#374151", margin: "6px 0" }}>
          <strong>Professor:</strong> {videoData.prof_uni}
        </p>
      </div>

      <div style={{ width: "100%", background: "#000", borderRadius: 10, overflow: "hidden" }}>
        <video
          key={videoId}                 // force fresh <video> per route
          ref={videoRef}
          controls
          playsInline
          preload="metadata"
          crossOrigin="anonymous"
          style={{ width: "100%", maxHeight: 520 }}
        />
      </div>
    </div>
  );
}

export default VideoPlayerPage;














// import React, { useEffect, useRef, useState } from "react";
// import Hls from "hls.js";
// import { useParams, useNavigate } from "react-router-dom";
// import { COMPOSITE_BASE_URL } from "./config";

// function VideoPlayerPage() {
//   const { videoId } = useParams();
//   const videoRef = useRef(null);
//   const hlsRef = useRef(null);
//   const [videoData, setVideoData] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     let cancelled = false;

//     (async () => {
//       try {
//         const token = localStorage.getItem("authToken") || "";
//         const res = await fetch(`${COMPOSITE_BASE_URL}/videos/${videoId}`, {
//           headers: token ? { Authorization: `Bearer ${token}` } : {},
//         });
//         if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
//         const data = await res.json();
//         if (cancelled) return;

//         setVideoData(data);

//         const url = data?.gcs_path; // must be an HTTPS .m3u8 that’s publicly readable or signed
//         const videoEl = videoRef.current;
//         if (!url || !videoEl) return;

//         // destroy any previous instance
//         if (hlsRef.current) {
//           hlsRef.current.destroy();
//           hlsRef.current = null;
//         }

//         if (Hls.isSupported()) {
//           const hls = new Hls({
//             autoStartLoad: true,
//             xhrSetup: (xhr) => { xhr.withCredentials = false; },
//           });
//           hlsRef.current = hls;

//           videoEl.crossOrigin = "anonymous";
//           hls.attachMedia(videoEl);
//           hls.on(Hls.Events.MEDIA_ATTACHED, () => {
//             hls.loadSource(url); // load AFTER attach
//           });

//           // optional debug (helpful if segments don’t load)
//           hls.on(Hls.Events.FRAG_LOADING, (_, d) => console.log("segment:", d?.frag?.url));
//           hls.on(Hls.Events.ERROR, (_, d) => console.error("hls error:", d.type, d.details, d?.response?.code));
//         } else if (videoEl.canPlayType("application/vnd.apple.mpegurl")) {
//           // Safari / iOS native HLS
//           videoEl.src = url;
//         } else {
//           // Fallback (only works if url is MP4)
//           videoEl.src = url;
//         }
//       } catch (e) {
//         if (!cancelled) console.error(e);
//       }
//     })();

//     return () => {
//       cancelled = true;
//       if (hlsRef.current) {
//         hlsRef.current.destroy();
//         hlsRef.current = null;
//       }
//     };
//   }, [videoId]);

//   if (!videoData) {
//     return (
//       <div style={{ padding: 40, fontSize: 20, fontWeight: 600 }}>
//         Loading video...
//       </div>
//     );
//   }

//   return (
//     <div
//       style={{
//         maxWidth: "900px",
//         margin: "40px auto",
//         padding: "20px 30px",
//         background: "white",
//         borderRadius: "12px",
//         boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
//         fontFamily: "Inter, system-ui, sans-serif",
//       }}
//     >
//       {/* Back to Search Button */}
//       <button
//         onClick={() => navigate("/search")}
//         style={{
//           marginBottom: "20px",
//           background: "transparent",
//           border: "none",
//           color: "#2563eb",
//           cursor: "pointer",
//           fontSize: "1rem",
//           fontWeight: 500,
//           padding: "0",
//         }}
//       >
//         ← Back to Search
//       </button>

//       {/* Title */}
//       <h1
//         style={{
//           fontSize: "2rem",
//           fontWeight: 700,
//           marginBottom: "12px",
//           color: "#111827",
//         }}
//       >
//         {videoData.title}
//       </h1>

//       {/* Metadata */}
//       <div style={{ marginBottom: "28px" }}>
//         <p style={{ fontSize: "1.05rem", color: "#374151", margin: "6px 0" }}>
//           <strong>Course:</strong> {videoData.course_id}
//         </p>
//         <p style={{ fontSize: "1.05rem", color: "#374151", margin: "6px 0" }}>
//           <strong>Professor:</strong> {videoData.prof_uni}
//         </p>
//       </div>

//       {/* Video Player */}
//       <div
//         style={{
//           width: "100%",
//           background: "#000",
//           borderRadius: "10px",
//           overflow: "hidden",
//         }}
//       >
//         <video
//           key={videoId}            // forces a fresh element on route change
//           ref={videoRef}
//           controls
//           playsInline
//           preload="metadata"
//           crossOrigin="anonymous"
//           style={{ width: "100%", maxHeight: "520px" }}
//         />
//       </div>
//     </div>
//   );
// }

// export default VideoPlayerPage;











// import React, { useEffect, useRef, useState } from "react";
// import Hls from "hls.js";
// import { useParams, useNavigate } from "react-router-dom";
// import { COMPOSITE_BASE_URL } from "./config";

// function VideoPlayerPage() {
//   const { videoId } = useParams();
//   const videoRef = useRef(null);
//   const [videoData, setVideoData] = useState(null);
//   const navigate = useNavigate();
//   const hlsRef = useRef(null);


//  useEffect(() => {
//   let cancelled = false;

//   (async () => {
//     const token = localStorage.getItem("authToken") || "";
//     const res = await fetch(`${COMPOSITE_BASE_URL}/videos/${videoId}`, {
//       headers: token ? { Authorization: `Bearer ${token}` } : {},
//     });
//     if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
//     const data = await res.json();
//     if (cancelled) return;

//     setVideoData(data);

//     const url = data?.gcs_path;
//     const videoEl = videoRef.current;
//     if (!url || !videoEl) return;

//     if (Hls.isSupported()) {
//       if (hlsRef.current) hlsRef.current.destroy();
//       const hls = new Hls({ xhrSetup: (xhr) => { xhr.withCredentials = false; } });
//       hlsRef.current = hls;

//       videoEl.crossOrigin = "anonymous";
//       hls.attachMedia(videoEl);
//       hls.on(Hls.Events.MEDIA_ATTACHED, () => hls.loadSource(url));
//     } else if (videoEl.canPlayType("application/vnd.apple.mpegurl")) {
//       videoEl.src = url; // Safari/iOS
//     } else {
//       videoEl.src = url; // direct MP4 fallback
//     }
//   })().catch(console.error);

//   return () => {
//     cancelled = true;
//     if (hlsRef.current) {
//       hlsRef.current.destroy();
//       hlsRef.current = null;
//     }
//   };
// }, [videoId]); 

//   // useEffect(() => {
//   //   async function load() {
//   //     const token = localStorage.getItem("authToken");

//   //     const res = await fetch(`${COMPOSITE_BASE_URL}/videos/${videoId}`, {
//   //       headers: { Authorization: `Bearer ${token}` },
//   //     });

//   //     const data = await res.json();
//   //     setVideoData(data);

//   //     const url = data.gcs_path;

//   //     if (Hls.isSupported()) {
//   //       const hls = new Hls();
//   //       hls.attachMedia(videoRef.current);
//   //       hls.loadSource(url);

//   //     } else {
//   //       videoRef.current.src = url; // Safari fallback
//   //     }
//   //   }

//   //   load();
//   // }, [videoId]);

//   if (!videoData) {
//     return (
//       <div style={{ padding: 40, fontSize: 20, fontWeight: 600 }}>
//         Loading video...
//       </div>
//     );
//   }

//   return (
//     <div
//       style={{
//         maxWidth: "900px",
//         margin: "40px auto",
//         padding: "20px 30px",
//         background: "white",
//         borderRadius: "12px",
//         boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
//         fontFamily: "Inter, system-ui, sans-serif",
//       }}
//     >

//       {/* Back to Search Button */}
//       <button
//         onClick={() => navigate("/search")}
//         style={{
//           marginBottom: "20px",
//           background: "transparent",
//           border: "none",
//           color: "#2563eb",
//           cursor: "pointer",
//           fontSize: "1rem",
//           fontWeight: 500,
//           padding: "0",
//         }}
//       >
//         ← Back to Search
//       </button>

//       {/* Title */}
//       <h1
//         style={{
//           fontSize: "2rem",
//           fontWeight: 700,
//           marginBottom: "12px",
//           color: "#111827",
//         }}
//       >
//         {videoData.title}
//       </h1>

//       {/* Metadata */}
//       <div style={{ marginBottom: "28px" }}>
//         <p style={{ fontSize: "1.05rem", color: "#374151", margin: "6px 0" }}>
//           <strong>Course:</strong> {videoData.course_id}
//         </p>
//         <p style={{ fontSize: "1.05rem", color: "#374151", margin: "6px 0" }}>
//           <strong>Professor:</strong> {videoData.prof_uni}
//         </p>
//       </div>

//       {/* Video Player */}
//       <div
//         style={{
//           width: "100%",
//           background: "#000",
//           borderRadius: "10px",
//           overflow: "hidden",
//         }}
//       >
//         <video
//           ref={videoRef}
//           controls
//           style={{ width: "100%", maxHeight: "520px" }}
//         />
//       </div>
//     </div>
//   );
// }

// export default VideoPlayerPage;
