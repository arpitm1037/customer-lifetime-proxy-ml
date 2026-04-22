import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getHistory, getHistoryDetail } from "../api/api";
import "../styles/main.css";

function HistoryPage({ currentUser, goBack, goUpload, onDataLoaded }) {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHistory() {
      if (!currentUser) return;
      try {
        const res = await getHistory(currentUser.email);
        setHistoryList(res.data);
      } catch {
        setError("Failed to load history.");
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [currentUser]);

  const handleItemClick = async (id) => {
    try {
      const res = await getHistoryDetail(id, currentUser?.email);
      if (res.data && res.data.metrics_json) {
        onDataLoaded(res.data.metrics_json);
      } else {
        alert("No data found for this analysis.");
      }
    } catch {
      alert("Failed to load analysis details.");
    }
  };

  return (
    <>
      <Navbar onBack={goBack} onUpload={goUpload} />
      <div className="dashboard" style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>
        <h2 style={{ marginBottom: "10px" }}>Your Analysis History</h2>
        <p style={{ color: "#666", marginBottom: "30px", fontSize: "1.05rem" }}>
          Select a previous dataset below to view its full analytical dashboard without uploading again.
        </p>

        {loading && <p>Loading history...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && historyList.length === 0 && <p>No history found.</p>}

        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {historyList.map((item) => {
            const date = new Date(item.created_at).toLocaleDateString("en-US", {
              year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
            });
            return (
              <div 
                key={item.id} 
                className="auth-card" 
                onClick={() => handleItemClick(item.id)}
                style={{
                  padding: "20px", 
                  borderRadius: "10px", 
                  backgroundColor: "#fff", 
                  border: "1px solid #eee", 
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)";
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ margin: "0 0 5px 0", fontSize: "1.1rem" }}>{item.filename}</h3>
                    <p style={{ margin: 0, color: "#888", fontSize: "0.9rem" }}>Analyzed on {date}</p>
                    <p style={{ margin: "6px 0 0 0", color: "#666", fontSize: "0.88rem" }}>
                      {item.summary?.total_customers || 0} customers
                      {item.summary?.top_segment ? ` · Top segment: ${item.summary.top_segment}` : ""}
                    </p>
                  </div>
                  <div style={{ color: "#000", fontWeight: "bold" }}>
                    View &rarr;
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default HistoryPage;
