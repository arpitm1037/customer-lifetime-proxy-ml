import Navbar from "../components/Navbar";
import Upload from "../components/Upload";
import "../styles/main.css";

function UploadPage({ onDone, goBack, goAbout }) {
  return (
    <div className="page-first">

      <Navbar onBack={goBack} onAbout={goAbout} />

      <div className="center">
        <h1 className="upload-title">Upload Your Data</h1>

        <Upload onDone={onDone} />
      </div>

    </div>
  );
}

export default UploadPage;