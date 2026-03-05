import React, { useState, useRef } from 'react';
import { ShieldAlert, Upload, PlayCircle, Image as ImageIcon, FileAudio, AlertTriangle, CheckCircle, Activity, Server, Lock, ChevronRight, XCircle, Eye, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import './index.css';

function App() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setError(null);
    const validTypes = ['image/jpeg', 'image/png', 'video/mp4', 'audio/mpeg', 'audio/wav'];

    if (!validTypes.includes(selectedFile.type)) {
      setError('Unsupported format. Only images, videos, and audio are allowed.');
      return;
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      setError('File is quite heavy! Please select a file under 50MB.');
      return;
    }

    setFile(selectedFile);
    setAnalysisResult(null);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);

    const formData = new FormData();
    formData.append('mediaFile', file);

    try {
      const backendUrl = `http://${window.location.hostname}:5000/api/analyze`;
      const response = await fetch(backendUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Analysis request failed.');
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch (err) {
      setError('Whoops! Cannot connect to the local server. Make sure your node backend is running on port 5000.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setAnalysisResult(null);
    setError(null);
  };

  const renderFileIcon = () => {
    if (!file) return <Upload className="upload-icon" />;
    if (file.type.startsWith('video/')) return <PlayCircle className="upload-icon" />;
    if (file.type.startsWith('audio/')) return <FileAudio className="upload-icon" />;
    return <ImageIcon className="upload-icon" />;
  };

  return (
    <div className="app-wrapper">
      {/* Colorful Floating Blobs */}
      <div className="blob-container">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="blob blob-4"></div>
      </div>

      <nav className="navbar container">
        <a href="/" className="logo">
          <div style={{ background: 'linear-gradient(135deg, #ff2a5f, #ff7b00)', padding: '10px', borderRadius: '16px', display: 'flex' }}>
            <ShieldAlert color="white" size={32} strokeWidth={2.5} />
          </div>
          <span style={{ marginLeft: '0.5rem' }}>Media<span className="text-gradient">Guard</span><span style={{ color: 'var(--accent-4)' }}>.ai</span></span>
        </a>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <a href="#features" style={{ fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none' }}>Features</a>
          <a href="https://github.com/Suresh" target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem', borderRadius: '16px' }}>View Source</a>
        </div>
      </nav>

      <main className="container flex-col items-center">
        {/* Hero Section */}
        {!analysisResult && !isAnalyzing && (
          <div style={{ textAlign: 'center', marginBottom: '5rem', marginTop: '3rem' }} className="animate-fade-in">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'white', padding: '8px 20px', borderRadius: '100px', fontWeight: 700, color: 'var(--accent-5)', boxShadow: '0 10px 20px rgba(111, 0, 255, 0.15)', marginBottom: '2rem' }}>
              <Sparkles size={18} /> New AI Vision Engine V3
            </div>
            <h1 className="animate-delay-1">Identify the <span className="text-gradient">Unknown.</span><br />Verify the Truth.</h1>
            <p className="animate-delay-2" style={{ margin: '0 auto 2rem', color: 'var(--text-secondary)' }}>
              A beautifully simple, incredibly powerful AI tool to detect deepfakes and manipulated media instantly. Just drag, drop, and reveal the truth.
            </p>
          </div>
        )}

        {/* Upload & Analysis Area */}
        <div className={`glass-panel w-full animate-fade-in ${!analysisResult ? 'animate-delay-3' : ''}`} style={{ maxWidth: '950px', margin: '0 auto', zIndex: 5 }}>

          {isAnalyzing && (
            <div className="loading-overlay">
              <div className="rainbow-spinner"><div className="rainbow-spinner-inner"></div></div>
              <h2 className="text-gradient" style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>Analyzing Reality...</h2>
              <p style={{ margin: 0, fontWeight: 500 }}>Scanning millions of pixels using our colorful AI magic ✨</p>
            </div>
          )}

          {!analysisResult ? (
            <div className="flex-col gap-6">
              <div
                className={`upload-area ${isDragging ? 'active' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="upload-label"
                  accept="image/jpeg, image/png, video/mp4, audio/mpeg, audio/wav"
                />

                {renderFileIcon()}

                {file ? (
                  <div className="animate-fade-in">
                    <h2 style={{ fontSize: '2.2rem', color: 'var(--accent-5)' }}>{file.name}</h2>
                    <p style={{ marginBottom: 0, fontSize: '1.2rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{(file.size / (1024 * 1024)).toFixed(2)} MB • Selected and Ready!</p>
                  </div>
                ) : (
                  <div>
                    <h2 style={{ fontSize: '2.2rem', color: 'var(--text-primary)' }}>Drop your media right here</h2>
                    <p style={{ marginBottom: 0, color: 'var(--text-secondary)', fontWeight: 500 }}>Upload an image, video, or audio file up to 50MB</p>
                  </div>
                )}
              </div>

              {error && (
                <div className="animate-fade-in" style={{ padding: '1.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '2px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-sm)', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 700, fontSize: '1.1rem' }}>
                  <AlertTriangle size={24} />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex justify-between items-center" style={{ marginTop: '1.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2 text-secondary" style={{ fontWeight: 700 }}><Lock size={20} color="var(--accent-4)" /> Secure Process</div>
                  <div className="flex items-center gap-2 text-secondary" style={{ fontWeight: 700 }}><Server size={20} color="var(--accent-1)" /> Auto-Delete</div>
                </div>

                <div className="flex gap-4" style={{ marginLeft: 'auto' }}>
                  {file && <button className="btn btn-secondary" onClick={resetUpload}>Start Over</button>}
                  <button
                    className="btn btn-primary"
                    onClick={handleAnalyze}
                    disabled={!file || isAnalyzing}
                    style={{ paddingLeft: '3rem', paddingRight: '2.5rem' }}
                  >
                    Reveal Quality <Zap size={22} fill="currentColor" style={{ marginLeft: '0.25rem' }} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Analysis Dashboard */
            <div className="animate-fade-in">
              <div className="flex justify-between items-center" style={{ marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '2px dashed var(--border-color)' }}>
                <div>
                  <h2 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '0.25rem' }}>Verification Report</h2>
                  <p style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: 500 }}>Session #{analysisResult.id} • {analysisResult.fileName}</p>
                </div>
                <button className="btn btn-secondary" onClick={resetUpload} style={{ border: 'none', background: 'rgba(0,0,0,0.05)' }}>Verify New Media</button>
              </div>

              <div className="flex gap-8" style={{ flexWrap: 'wrap' }}>
                {/* Score Column */}
                <div className="flex-col items-center justify-center" style={{ flex: '1', minWidth: '350px' }}>
                  <h3 style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '1.4rem' }}>AI Confidence Score</h3>

                  <div
                    className={`score-circle ${analysisResult.analysis.authenticityScore >= 80 ? 'score-authentic' : 'score-fake'}`}
                    style={{ '--score': `${analysisResult.analysis.authenticityScore}%` }}
                  >
                    {analysisResult.analysis.authenticityScore}<span style={{ fontSize: '2.5rem', opacity: 0.6 }}>%</span>
                  </div>

                  <div className={`status-badge ${analysisResult.analysis.authenticityScore >= 80 ? 'badge-authentic' : 'badge-fake'}`}>
                    {analysisResult.analysis.authenticityScore >= 80 ? <CheckCircle size={24} /> : <XCircle size={24} />}
                    {analysisResult.analysis.conclusion}
                  </div>
                </div>

                {/* Details Column */}
                <div style={{ flex: '1.5', minWidth: '350px' }}>
                  <h3 style={{ fontSize: '1.8rem', color: 'var(--text-primary)' }}>Forensic Details</h3>
                  <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Our AI models verified the following elements with high precision.</p>

                  <ul className="metadata-list">
                    <li className="metadata-item">
                      <span className="metadata-label"><Eye size={22} color="var(--accent-1)" /> Visual Artifacts</span>
                      <span className="metadata-value" style={{ color: analysisResult.analysis.details.facialArtifacts.includes('None') ? 'var(--success)' : 'var(--danger)' }}>
                        {analysisResult.analysis.details.facialArtifacts}
                      </span>
                    </li>
                    <li className="metadata-item">
                      <span className="metadata-label"><Activity size={22} color="var(--accent-2)" /> Pixel Topology</span>
                      <span className="metadata-value" style={{ color: analysisResult.analysis.details.pixelIrregularities.includes('Normal') ? 'var(--success)' : 'var(--danger)' }}>
                        {analysisResult.analysis.details.pixelIrregularities}
                      </span>
                    </li>
                    <li className="metadata-item">
                      <span className="metadata-label"><Server size={22} color="var(--accent-4)" /> Metadata Tracking</span>
                      <span className="metadata-value" style={{ color: analysisResult.analysis.details.metadataIntegrity.includes('Intact') ? 'var(--success)' : 'var(--warning)' }}>
                        {analysisResult.analysis.details.metadataIntegrity}
                      </span>
                    </li>
                    <li className="metadata-item">
                      <span className="metadata-label"><ShieldCheck size={22} color="var(--accent-5)" /> Container Format</span>
                      <span className="metadata-value" style={{ color: 'var(--accent-5)' }}>{analysisResult.fileType}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Feature Highlights */}
        {!analysisResult && !isAnalyzing && (
          <div className="feature-grid w-full animate-fade-in animate-delay-3" id="features" style={{ maxWidth: '1200px' }}>
            <div className="feature-card">
              <div className="feature-icon-wrapper"><Activity size={36} /></div>
              <h3 style={{ fontSize: '1.6rem' }}>Frame Level Analysis</h3>
              <p style={{ fontSize: '1.15rem', margin: 0, color: 'var(--text-secondary)' }}>Examines individual video frames to detect micro-expressions and unnatural AI flaws.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper"><Server size={36} /></div>
              <h3 style={{ fontSize: '1.6rem' }}>Metadata Forensics</h3>
              <p style={{ fontSize: '1.15rem', margin: 0, color: 'var(--text-secondary)' }}>Deep scans file EXIF data, signatures, and footprints to trace its editing history.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper"><Lock size={36} /></div>
              <h3 style={{ fontSize: '1.6rem' }}>Absolute Privacy</h3>
              <p style={{ fontSize: '1.15rem', margin: 0, color: 'var(--text-secondary)' }}>Files are processed in memory and immediately cryptographically destroyed.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
