import { useState } from "react";
import "./upload.css";

function Upload({ onDone }) {
  const [file, setFile] = useState(null);

  const handleUpload = () => {
    if (!file) return;
    
    
    if (!file.name.toLowerCase().endsWith(".csv")) {
        alert("Only CSV files are allowed");
        setFile(null); // Reset selection
        return;
    }
    
    onDone(file);
  };

  return (
    <div className="upload-container">

      <div className="upload-box">
        <div className="upload-icon">⬆</div>

        <p>Drag and drop your file here</p>
        <p>or</p>

        <input
          type="file"
          id="fileInput"
          hidden
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <label htmlFor="fileInput" className="browse-btn">
          Browse Files
        </label>

        {file && <p className="file-name">{file.name}</p>}
      </div>

      <button
        className="continue-btn"
        disabled={!file}
        onClick={handleUpload}
      >
        Continue
      </button>

    </div>
  );
}

export default Upload;