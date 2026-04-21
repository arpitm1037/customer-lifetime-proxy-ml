function Navbar({ onBack, onAbout, onUpload }) {
  return (
    <div className="nav-container">
      <div className="nav-left">
        {onBack ? (
          <button type="button" className="nav-back" onClick={() => onBack()}>
            Back
          </button>
        ) : null}
        <h2 className="nav-logo">Retail LTV</h2>
      </div>

      <div className="nav-right" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        {onUpload ? (
          <button
            type="button"
            className="nav-about"
            onClick={() => onUpload()}
          >
            Upload
          </button>
        ) : null}

        {onAbout ? (
          <button
            type="button"
            className="nav-about"
            onClick={() => onAbout()}
          >
            About
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default Navbar;
