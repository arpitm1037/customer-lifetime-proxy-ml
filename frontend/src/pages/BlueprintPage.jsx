import React, { useMemo, useState } from "react";
import Chart from "../components/Chart";
import Table from "../components/Table";
import Navbar from "../components/Navbar";
import "../styles/main.css";
import "../styles/dashboard.css";

const DEMO_DATA = [
  { customer_id: "CUST-001", monetary: 4500, predicted_bucket: "VIP" },
  { customer_id: "CUST-002", monetary: 2100, predicted_bucket: "High" },
  { customer_id: "CUST-003", monetary: 800, predicted_bucket: "Medium" },
  { customer_id: "CUST-004", monetary: 150, predicted_bucket: "Low" },
  { customer_id: "CUST-005", monetary: 6000, predicted_bucket: "VIP" },
  { customer_id: "CUST-006", monetary: 250, predicted_bucket: "Low" },
  { customer_id: "CUST-007", monetary: 2200, predicted_bucket: "High" },
  { customer_id: "CUST-008", monetary: 850, predicted_bucket: "Medium" },
];

const DEMO_CHART_DATA = [
  { month: "Jan", VIP: 10, High: 20, Medium: 30, Low: 40 },
  { month: "Feb", VIP: 12, High: 22, Medium: 28, Low: 38 },
  { month: "Mar", VIP: 15, High: 25, Medium: 25, Low: 35 },
];

const DEMO_COHORT_DATA = [
  { cohort_month: "2023-01", total_customers: 100, returning_customers: 40, retention_rate: 40.0 },
  { cohort_month: "2023-02", total_customers: 120, returning_customers: 42, retention_rate: 35.0 },
  { cohort_month: "2023-03", total_customers: 150, returning_customers: 60, retention_rate: 40.0 }
];

function BlueprintPage({ goBack, goUpload, goAbout }) {
  const [filterSegment, setFilterSegment] = useState("All");
  const [filterCohortMonth, setFilterCohortMonth] = useState("All");

  const filteredData = useMemo(() => {
    if (filterSegment === "All") return DEMO_DATA;
    return DEMO_DATA.filter((item) => item.predicted_bucket === filterSegment);
  }, [filterSegment]);

  const filteredCohortData = useMemo(() => {
    if (filterCohortMonth === "All") return DEMO_COHORT_DATA;
    return DEMO_COHORT_DATA.filter((row) => row.cohort_month === filterCohortMonth);
  }, [filterCohortMonth]);

  const segmentStats = useMemo(() => {
    const stats = {
      Low: { count: 0, revenue: 0 },
      Medium: { count: 0, revenue: 0 },
      High: { count: 0, revenue: 0 },
      VIP: { count: 0, revenue: 0 },
    };

    DEMO_DATA.forEach((item) => {
      const bucket = item.predicted_bucket;
      const value = item.monetary || 0;
      stats[bucket].count++;
      stats[bucket].revenue += value;
    });

    return stats;
  }, []);

  const totalRevenue = Object.values(segmentStats).reduce(
    (sum, s) => sum + s.revenue,
    0
  );

  return (
    <>
      <Navbar onBack={goBack} onUpload={goUpload} onAbout={goAbout} />

      <div className="dashboard">
        <h2>What users can take away??</h2>
        
        <p style={{ color: "#666", marginBottom: "20px", lineHeight: "1.6", fontSize: "1.05rem" }}>
          By uploading your data, you will unlock deep analytical capabilities including:<br/>
          • <strong>Customer Segmentation</strong> into VIP, High, Medium, and Low value tiers.<br/>
          • <strong>Cohort Retention Insights</strong> to track customer loyalty over time.<br/>
          • <strong>Customer-Level Analysis</strong> for targeted marketing and action.
        </p>

        <div className="segments">
          {Object.keys(segmentStats).map((key) => {
            const seg = segmentStats[key];

            const percent = totalRevenue
              ? Math.round((seg.revenue / totalRevenue) * 100)
              : 0;

            return (
              <div className="segment-card" key={key}>
                <div className="segment-header">
                  <span className={`dot ${key.toLowerCase()}`}></span>
                  <h3>{key}</h3>
                </div>
                <p>{seg.count} customers</p>
                <span className="percent">
                  {percent}% of revenue
                </span>
              </div>
            );
          })}
        </div>

        <div className="chart-section">
          <h3>Customer Segmentation Over Time</h3>
          <Chart data={DEMO_CHART_DATA} />
        </div>

        {DEMO_COHORT_DATA && DEMO_COHORT_DATA.length > 0 && (
          <div className="cohort-section" style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px", marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <div>
                <h3 style={{ margin: 0 }}>Customer Retention by Cohort</h3>
                <p style={{ color: "#666", fontSize: "14px", margin: "5px 0 0 0" }}>Shows how many customers return after their first purchase</p>
              </div>
              <div>
                <label style={{ marginRight: "10px", fontWeight: "bold" }}>Filter by Month: </label>
                <select
                  value={filterCohortMonth}
                  onChange={(e) => setFilterCohortMonth(e.target.value)}
                  style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
                >
                  <option value="All">All</option>
                  {DEMO_COHORT_DATA.map((row, idx) => (
                    <option key={idx} value={row.cohort_month}>{row.cohort_month}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Cohort Month</th>
                  <th>Total Customers</th>
                  <th>Returning Customers</th>
                  <th>Retention %</th>
                </tr>
              </thead>
              <tbody>
                {filteredCohortData.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.cohort_month}</td>
                    <td>{row.total_customers}</td>
                    <td>{row.returning_customers}</td>
                    <td>{row.retention_rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="table-header-controls" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <h3>Customer Details</h3>
          <div>
            <label style={{ marginRight: "10px", fontWeight: "bold" }}>Filter by Segment: </label>
            <select
              value={filterSegment}
              onChange={(e) => setFilterSegment(e.target.value)}
              style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
            >
              <option value="All">All</option>
              <option value="VIP">VIP</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <Table data={filteredData} disableClick={true} />
      </div>
    </>
  );
}

export default BlueprintPage;
