import React, { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'; // Added useNavigate
import Hls from 'hls.js';

const VideoPage = () => {
  const videoRef = useRef(null);
  const navigate = useNavigate(); // Hook for navigation
  const [searchParams] = useSearchParams();
  
  // 1. Get all parameters from the URL
  const videoUrl = searchParams.get('link');
  const title = searchParams.get('title') || "Unknown Title";
  const term = searchParams.get('term') || "";
  const year = searchParams.get('year') || "";

  useEffect(() => {
    if (!videoUrl || !videoRef.current) return;
    
    const video = videoRef.current;

    // 1. Native Safari (Priority)
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoUrl;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(e => console.error("Autoplay blocked:", e));
      });
    }
    // 2. HLS.js (Chrome/Windows)
    else if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(e => console.error("Autoplay blocked:", e));
      });
      return () => hls.destroy();
    }
  }, [videoUrl]);

  if (!videoUrl) return <div style={styles.error}>Error: No video link provided</div>;

  return (
    <div style={styles.container}>
      
      {/* --- TOP BAR --- */}
      <div style={styles.topBar}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          ← Back
        </button>
      </div>

      {/* --- TITLE SECTION --- */}
      <div style={styles.header}>
        <h1 style={styles.title}>{title}</h1>
        <h3 style={styles.subtitle}>{term} {year}</h3>
      </div>

      {/* --- VIDEO PLAYER --- */}
      <div style={styles.playerWrapper}>
        <video 
          ref={videoRef} 
          controls 
          muted 
          playsInline
          crossOrigin="anonymous"
          style={styles.video} 
        />
      </div>
    </div>
  );
};

// --- STYLES ---
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column', // Stack items vertically
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#121212', // Dark background for cinema feel
    color: 'white',
    padding: '20px'
  },
  topBar: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: '20px'
  },
  backButton: {
    backgroundColor: '#333',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  title: {
    fontSize: '32px',
    margin: '0 0 10px 0',
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: '18px',
    color: '#aaa', // Light gray for subtitle
    margin: '0',
    fontWeight: 'normal'
  },
  playerWrapper: {
    width: '90%',           // Takes up 90% of screen width
    maxWidth: '1280px',     // Stops growing at this size (large desktop)
    aspectRatio: '16/9',    // Forces standard video shape
    backgroundColor: 'black',
    boxShadow: '0px 10px 30px rgba(0,0,0,0.5)', // Nice shadow
    borderRadius: '10px',
    overflow: 'hidden'
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  },
  error: {
    color: 'white', 
    textAlign: 'center', 
    marginTop: '50px'
  }
};

export default VideoPage;