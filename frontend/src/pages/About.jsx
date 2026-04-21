import Navbar from "../components/Navbar";
import "../styles/main.css";
import "../styles/about.css";

function About({ goBack }) {
  return (
    <div className="page-about">

      <Navbar onBack={goBack} />

      <div className="about-container">

        <h1 className="about-title">About Retail LTV System</h1>

        <p className="about-sub">
          Predict customer value early and make smarter business decisions.
        </p>

     
        <div className="about-section">
          <h3>What this app does</h3>
          <ul>
            <li>Analyzes customer transaction data</li>
            <li>Generates behavior-based features</li>
            <li>Predicts future customer value</li>
            <li>Segments customers into Low, Medium, High, VIP</li>
          </ul>
        </div>

      
        <div className="about-section">
          <h3>How retail users can benefit</h3>
          <ul>
            <li><b>VIP:</b> Retain and reward top customers</li>
            <li><b>High:</b> Upsell and increase engagement</li>
            <li><b>Medium:</b> Convert to high-value users</li>
            <li><b>Low:</b> Target with campaigns</li>
          </ul>
        </div>

        
        <div className="about-section">
          <h3>How to use this app</h3>
          <ol>
            <li>Upload your retail dataset (CSV)</li>
            <li>System processes and cleans data</li>
            <li>Features are generated automatically</li>
            <li>Model predicts customer segments</li>
            <li>View insights on dashboard</li>
          </ol>
        </div>

        
        <div className="about-section">
          <h3>Why this matters</h3>
          <ul>
            <li>Identify high-value customers early</li>
            <li>Improve retention strategies</li>
            <li>Increase revenue with better targeting</li>
          </ul>
        </div>

      </div>

    </div>
  );
}

export default About;