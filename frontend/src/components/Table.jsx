import React, { useState } from "react";
import "./table.css";
import { getCustomerDetail } from "../api/api";

function Table({ data, disableClick }) {
  const [modalData, setModalData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRowClick = async (customerId) => {
    if (disableClick) return;
    setLoading(true);
    try {
      const res = await getCustomerDetail(customerId);
      setModalData(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load customer records.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => setModalData(null);

  const renderTrend = (val) => {
    const num = Number(val);
    if (num > 0) return "Increasing 📈";
    if (num < 0) return "Decreasing 📉";
    return "Stable";
  };

  return (
    <div className="table-container relative">
      <h3>Customer Segmentation Table</h3>

      <table>
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>Segment</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              onClick={() => handleRowClick(item.customer_id)}
              style={{ cursor: disableClick ? "default" : "pointer" }}
            >
              <td>{item.customer_id}</td>
              <td>
                <span className={`tag ${item.predicted_bucket.toLowerCase()}`}>
                  {item.predicted_bucket}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {loading && (
        <div className="modal-overlay">
          <div className="modal-card">
            <p>Loading Details...</p>
          </div>
        </div>
      )}

      {modalData && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Customer Insights</h3>
              <button className="close-btn" onClick={closeModal}>✕</button>
            </div>

            <div className="modal-body">
              <div className="info-group">
                <span className="label">Customer ID:</span>
                <span className="value">{modalData.customer_id}</span>
              </div>
              <div className="info-group">
                <span className="label">Segment:</span>
                <span className={`tag ${modalData.segment.toLowerCase()}`}>{modalData.segment}</span>
              </div>

              <hr className="modal-divider" />

              <div className="info-grid">
                <div>
                  <span className="label">Recency:</span>
                  <span className="value">{modalData.recency} days</span>
                </div>
                <div>
                  <span className="label">Frequency:</span>
                  <span className="value">{modalData.frequency} orders</span>
                </div>
                <div>
                  <span className="label">Monetary:</span>
                  <span className="value">${Number(modalData.monetary).toFixed(2)}</span>
                </div>
                <div>
                  <span className="label">Tenure:</span>
                  <span className="value">{modalData.tenure} days</span>
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <span className="label">Trend:</span>
                  <span className="value">{renderTrend(modalData.trend)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Table;
