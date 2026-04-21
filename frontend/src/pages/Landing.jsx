import Navbar from "../components/Navbar";
import "../styles/main.css";

function Landing({ goNext, goAbout }) {
  return (
    <div className="page-first">

      <Navbar onAbout={goAbout} />

      <div className="center">
        <h1 className="hero-title">
          Understand Your Customers Better
        </h1>

        <p className="hero-sub">
          Predict future customer value and segment them intelligently
        </p>

        <button onClick={goNext}>Get Started</button>
      </div>

    </div>
  );
}

export default Landing;