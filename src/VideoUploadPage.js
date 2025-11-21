import React, { useState, useCallback } from 'react';
import { COMPOSITE_BASE_URL } from './config';


// --- Custom Component for Input Rows ---
const Row = ({ label, children, isError, errorMessage }) => (
  <div style={{ display: "flex", flexDirection: 'column', gap: "4px" }}>
    <label style={{ fontWeight: 600, fontSize: ".95rem", color: isError ? "#B00020" : "#444" }}>
      {label}
    </label>
    {children}
    {isError && (
      <span style={{ color: "#B00020", fontSize: ".8rem", marginTop: "-4px" }}>
        {errorMessage}
      </span>
    )}
  </div>
);

// --- Main Upload Component ---
export default function VideoUploadPage() {
  // --- Form State ---
  const [title, setTitle] = useState("");
  const [offeringId, setOfferingId] = useState("");
  const [profUni, setProfUni] = useState("");
  const [videoFile, setVideoFile] = useState(null);

  // --- Process State ---
  const [status, setStatus] = useState("IDLE"); // IDLE, METADATA_SENT, UPLOADING, COMPLETE, ERROR
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [triedSubmit, setTriedSubmit] = useState(false);
  const [videoId, setVideoId] = useState(null);

  // --- Validation ---
  const fieldsValid = title.length > 0 && offeringId.length > 0 && profUni.length > 0;
  const fileValid = videoFile !== null && videoFile.type.startsWith('video/');
  const formValid = fieldsValid && fileValid;

  // --- Handlers ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setError(null);
      if (status === 'ERROR') setStatus('IDLE');
    }
  };

  /**
   * Step 2: Executes the direct file upload to GCS using the Signed URL.
   * @param {string} url - The signed URL token from the backend.
   * @param {File} file - The file object to upload.
   */
  const uploadFileToGCS = useCallback((url, file) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', url);
      
      // CRITICAL: Content-Type must match the type used in backend signing
      xhr.setRequestHeader('Content-Type', file.type); 

      // Progress listener
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentage = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentage);
          setStatus('UPLOADING');
        }
      };

      // Completion listener
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve('Upload Complete');
        } else {
          console.error("GCS Upload Error Response:", xhr.responseText);
          reject(`GCS Upload Failed: HTTP ${xhr.status}. Check console for details (CORS or Signature Mismatch).`);
        }
      };

      // Network error listener
      xhr.onerror = () => {
        reject('Network connection failed during upload.');
      };

      xhr.send(file);
    });
  }, []);

  /**
   * Step 1: Submits metadata to the backend to get the Signed URL.
   */
  async function handleSubmit(e) {
    e.preventDefault();
    setTriedSubmit(true);
    setError(null);
    if (!formValid) return;

    try {
      setStatus('METADATA_SENT');
      setUploadProgress(0);

      // --- 1. Request Signed URL and DB Write ---
      const metadataPayload = {
        videoTitle:title,
        offering_id: parseInt(offeringId, 10), // Ensure it's an integer
        prof_uni: profUni,
        mime_type: videoFile.type, // Send MIME type for signing
      };

      const res = await fetch(`${COMPOSITE_BASE_URL}/videos/start_upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metadataPayload),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to initiate upload process.");
      }

      const { signed_url, video_id } = data;
      setVideoId(video_id);
      
      // --- 2. Execute Direct GCS Upload ---
      await uploadFileToGCS(signed_url, videoFile);
      
      setStatus('COMPLETE');

    } catch (err) {
      setError(err.message || 'An unknown error occurred during submission.');
      setStatus('ERROR');
    }
  }

  const handleReset = () => {
    setTitle("");
    setOfferingId("");
    setProfUni("");
    setVideoFile(null);
    setUploadProgress(0);
    setError(null);
    setStatus('IDLE');
    setTriedSubmit(false);
    setVideoId(null);
    document.getElementById('file-upload-input').value = null; // Clear file input
  };

  // --- Render Status and Progress ---
  const renderStatusBox = () => {
    const isWorking = status === 'METADATA_SENT' || status === 'UPLOADING';
    const isSuccess = status === 'COMPLETE';
    const isError = status === 'ERROR';

    let message = "Fill out the form and select a video to begin.";
    let bgColor = '#F0F4F8'; // Light gray/blue
    let textColor = '#444';
    let progressColor = 'bg-blue-600';

    if (isWorking) {
      message = status === 'METADATA_SENT' ? "Sending metadata & creating DB record..." : `Uploading file... ${uploadProgress}%`;
    } else if (isSuccess) {
      message = `Upload and DB Entry Complete! Video ID: ${videoId}`;
      bgColor = '#E8F5E9'; // Light green
      textColor = '#1B5E20'; // Dark green
      progressColor = 'bg-green-600';
    } else if (isError) {
      message = error;
      bgColor = '#FDECEC'; // Light red
      textColor = '#B00020'; // Dark red
      progressColor = 'bg-red-600';
    }

    return (
      <div style={{ marginTop: 20, padding: 15, borderRadius: 8, backgroundColor: bgColor, border: `1px solid ${isError ? '#B00020' : isSuccess ? '#1B5E20' : '#A7C2DD'}` }}>
        <p style={{ color: textColor, fontWeight: 500, fontSize: '.9rem' }}>
          {message}
        </p>
        {(isWorking || isSuccess || isError) && (
          <div style={{ marginTop: 10, height: 10, backgroundColor: '#ccc', borderRadius: 5, overflow: 'hidden' }}>
            <div 
              style={{ 
                width: `${uploadProgress}%`, 
                height: '100%', 
                backgroundColor: progressColor, 
                transition: 'width 0.5s ease',
              }}
            />
          </div>
        )}
      </div>
    );
  };

  // --- Render ---
  return (
    <div
      style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", minHeight: "100vh",
        background: "transparent",
        fontFamily: "Arial, sans-serif",
        padding: '20px 0'
      }}
    >
      <h1 style={{ color: "white", marginBottom: 20, fontSize: "2rem", letterSpacing: 1 }}>
        Upload Video
      </h1>

      <div
        style={{
          backgroundColor: "white", padding: 40, borderRadius: 12,
          boxShadow: "0 6px 20px rgba(0,0,0,0.2)", width: 500, maxWidth: '90%'
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
          
          {/* Title */}
          <Row 
            label="Video Title" 
            isError={triedSubmit && title.length === 0} 
            errorMessage="Title is required."
          >
            <input
              type="text"
              placeholder="e.g., Intro to Microservices"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyle}
              disabled={status !== 'IDLE' && status !== 'ERROR'}
            />
          </Row>

          {/* Offering ID (INT field) */}
          <Row 
            label="Offering ID (DB INT)" 
            isError={triedSubmit && offeringId.length === 0} 
            errorMessage="Offering ID is required for JOINs."
          >
            <input
              type="number"
              placeholder="e.g., 123"
              value={offeringId}
              onChange={(e) => setOfferingId(e.target.value)}
              style={inputStyle}
              disabled={status !== 'IDLE' && status !== 'ERROR'}
            />
          </Row>
          
          {/* Prof UNI (VARCHAR field) */}
          <Row 
            label="Professor UNI" 
            isError={triedSubmit && profUni.length === 0} 
            errorMessage="Professor UNI is required."
          >
            <input
              type="text"
              placeholder="e.g., ts3747"
              value={profUni}
              onChange={(e) => setProfUni(e.target.value)}
              style={inputStyle}
              disabled={status !== 'IDLE' && status !== 'ERROR'}
            />
          </Row>
          

          {/* File Upload */}
          <Row 
            label="Select Video File"
            isError={triedSubmit && !fileValid} 
            errorMessage="A valid video file is required."
          >
            <input
              id="file-upload-input"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              style={{ border: 'none', padding: 0 }}
              disabled={status !== 'IDLE' && status !== 'ERROR'}
            />
          </Row>

          {/* Status and Progress Display */}
          {renderStatusBox()}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!formValid || status !== 'IDLE'}
            style={{
              marginTop: 15,
              width: "100%",
              padding: 12,
              backgroundColor: formValid && status === 'IDLE' ? "#0072C6" : "#A7C2DD",
              color: "white",
              border: "none",
              borderRadius: 3,
              fontWeight: "bold",
              fontSize: "1rem",
              textTransform: "uppercase",
              cursor: formValid && status === 'IDLE' ? "pointer" : "not-allowed",
              transition: "background-color .2s ease",
            }}
          >
            {status === 'UPLOADING' ? `UPLOADING ${uploadProgress}%` : 
             status === 'METADATA_SENT' ? 'WAITING FOR GCS TOKEN...' :
             status === 'COMPLETE' ? 'UPLOAD SUCCESSFUL!' :
             status === 'ERROR' ? 'RETRY UPLOAD' :
             'START UPLOAD PROCESS'}
          </button>

        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  fontSize: ".95rem",
  outline: "none",
};