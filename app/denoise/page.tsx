"use client";

import { useState } from "react";
import styles from "./Denoising.module.css";

export default function DenoisePage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleSubmit = async () => {
    setErrorMsg(null);
    if (!file) {
      alert("Pilih gambar dulu");
      return;
    }

    setLoading(true);
    setResultImage(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/denoise", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`API error: ${res.status} ${text}`);
      }

      const data = await res.json();
      setResultImage(`data:image/png;base64,${data.image_base64}`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message ?? "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setResultImage(null);
      setErrorMsg(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResultImage(null);
      setErrorMsg(null);
    }
  };

  const dropAreaClass = [
    styles.dropArea,
    dragActive ? styles.dropAreaActive : styles.dropAreaInactive,
  ].join(" ");

  const buttonClass = [
    styles.submitButton,
    loading || !file ? styles.submitDisabled : styles.submitEnabled,
  ].join(" ");

  return (
    <main className={styles.main}>
      {/* Gradient blur background */}
      <div className={styles.bgWrapper}>
        <div className={styles.bgBlue} />
        <div className={styles.bgPurple} />
        <div className={styles.bgMagenta} />
      </div>

      {/* Tombol kembali ke landing */}
      <div style={{ position: "absolute", top: 24, left: 32, zIndex: 20 }}>
        <a href="/" className={`${styles.backToLandingButton} ${styles.whiteFlash}`}>
          ← Kembali ke Landing
        </a>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>FACECLEAN DENOISER</h1>
          <p className={styles.subtitle}>
            Upload foto wajah ber-noise untuk dibersihkan menggunakan
            Convolutional Autoencoder
          </p>
        </div>

        {/* Upload Section */}
        <div className={styles.uploadSection}>
          <div className={styles.uploadRow}>
            {/* Drop area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={dropAreaClass}
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />

              <div style={{ marginBottom: 16 }}>
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#540087"
                  strokeWidth="2"
                  style={{ margin: "0 auto" }}
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>

              <p className={styles.dropTitle}>
                {file ? file.name : "Klik atau drag & drop gambar di sini"}
              </p>
              <p className={styles.dropHint}>Mendukung JPG, PNG, JPEG</p>
            </div>

            {/* Preview input di sebelah kanan */}
            {file && (
              <div className={styles.inputPreviewBox}>
                <h3 className={styles.inputPreviewTitle}>Preview Input</h3>
                <img
                  src={URL.createObjectURL(file)}
                  alt="input-preview"
                  className={styles.inputPreviewImage}
                />
                <button
                  onClick={() => document.getElementById("fileInput")?.click()}
                  className={styles.changeImageButton}
                >
                  Ganti Foto
                </button>
              </div>
            )}
          </div>

          {/* Tombol submit */}
          <div className={styles.submitWrapper}>
            <button
              onClick={handleSubmit}
              disabled={loading || !file}
              className={buttonClass}
            >
              {loading ? (
                <span className={styles.spinnerWrapper}>
                  <span className={styles.spinner} />
                  Memproses...
                </span>
              ) : (
                "Upload & Denoise"
              )}
            </button>
          </div>

          {errorMsg && (
            <div className={styles.errorBox}>⚠️ Error: {errorMsg}</div>
          )}
        </div>

        {/* Results Section */}
        {(file || resultImage) && (
          <div className={styles.resultSection}>
            <h2 className={styles.resultTitle}>Hasil Pembersihan</h2>

            <div className={styles.resultGrid}>
              {file && (
                <div className={styles.resultCard}>
                  <h3
                    className={`${styles.resultHeading} ${styles.resultHeadingInput}`}
                  >
                    Before (Noisy)
                  </h3>
                  <div className={styles.resultImageWrapper}>
                    <img
                      src={URL.createObjectURL(file)}
                      alt="input"
                      className={styles.resultImage}
                    />
                  </div>
                </div>
              )}

              {resultImage && (
                <div
                  className={`${styles.resultCard} ${styles.resultCardOutput}`}
                >
                  <h3
                    className={`${styles.resultHeading} ${styles.resultHeadingOutput}`}
                  >
                    After (Denoised)
                  </h3>
                  <div className={styles.resultImageWrapper}>
                    <img
                      src={resultImage}
                      alt="output"
                      className={`${styles.resultImage} ${styles.resultImageOutput}`}
                    />
                    <a
                      href={resultImage}
                      download="denoised-image.png"
                      className={styles.downloadLink}
                    >
                      Download
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

