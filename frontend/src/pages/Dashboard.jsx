import { useMemo, useState } from "react";
import Chart from "../components/Chart";
import Table from "../components/Table";
import Navbar from "../components/Navbar";
import "../styles/main.css";
import "../styles/dashboard.css";

function Dashboard({ data, chartData, cohortData, goBack, goAbout }) {
  const [filterSegment, setFilterSegment] = useState("All");
  const [filterCohortMonth, setFilterCohortMonth] = useState("All");

  const filteredData = useMemo(() => {
    if (filterSegment === "All") return data;
    return data.filter((item) => item.predicted_bucket === filterSegment);
  }, [data, filterSegment]);

  const filteredCohortData = useMemo(() => {
    if (filterCohortMonth === "All") return cohortData;
    return cohortData.filter((row) => row.cohort_month === filterCohortMonth);
  }, [cohortData, filterCohortMonth]);

  const segmentStats = useMemo(() => {
    const stats = {
      Low: { count: 0, revenue: 0 },
      Medium: { count: 0, revenue: 0 },
      High: { count: 0, revenue: 0 },
      VIP: { count: 0, revenue: 0 },
    };

    data.forEach((item) => {
      const bucket = item.predicted_bucket;
      const value = item.monetary || 0;

      stats[bucket].count++;
      stats[bucket].revenue += value;
    });

    return stats;
  }, [data]);


  const totalRevenue = Object.values(segmentStats).reduce(
    (sum, s) => sum + s.revenue,
    0
  );

  const insights = useMemo(() => {
    const list = [];
    if (!data.length || Object.keys(segmentStats).length === 0) return list;

    // 1. RETENTION INSIGHT
    if (cohortData && cohortData.length > 1) {
      const latest = cohortData[0];
      const oldest = cohortData[cohortData.length - 1];

      if (latest.retention_rate < oldest.retention_rate) {
        list.push("Recent cohorts show significantly lower retention compared to earlier cohorts");
      }
    }

   
    const maxSegment = Object.keys(segmentStats).reduce((a, b) =>
      segmentStats[a].count > segmentStats[b].count ? a : b
    );

    if (maxSegment === "Low") {
      list.push("Majority of customers are low-value, indicating opportunity for upselling");
    } else {
      list.push(`Most customers belong to ${maxSegment} segment`);
    }

   
    const maxRevenueSegment = Object.keys(segmentStats).reduce((a, b) =>
      segmentStats[a].revenue > segmentStats[b].revenue ? a : b
    );

    list.push(`${maxRevenueSegment} customers contribute the highest share of revenue`);

   
    if (cohortData && cohortData.length > 0) {
      const best = cohortData.reduce((a, b) =>
        a.retention_rate > b.retention_rate ? a : b
      );

      const worst = cohortData.reduce((a, b) =>
        a.retention_rate < b.retention_rate ? a : b
      );

      list.push(`Best cohort: ${best.cohort_month} (${best.retention_rate}%)`);
      list.push(`Worst cohort: ${worst.cohort_month} (${worst.retention_rate}%)`);
    }

    return list;
  }, [data, cohortData, segmentStats]);

  return (
    <>
      <Navbar onBack={goBack} onAbout={goAbout} />

      <div className="dashboard">
        <h2>Customer Insights</h2>

        {insights.length > 0 && (
          <div className="summary" style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px", border: "1px solid #e6e6e6", marginBottom: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <h3 style={{ margin: "0 0 15px 0", fontSize: "1.1rem", fontWeight: "600", color: "#111", fontFamily: "Arial, sans-serif" }}>
              Customer Insights Summary
            </h3>
            <ul style={{ margin: "0", paddingLeft: "20px", color: "#444", fontSize: "0.95rem", lineHeight: "1.8" }}>
              {insights.map((text, index) => (
                <li key={index}>{text}</li>
              ))}
            </ul>
          </div>
        )}

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
          <Chart data={chartData} />
        </div>

        {cohortData && cohortData.length > 0 && (
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
                  {cohortData.map((row, idx) => (
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

        <Table data={filteredData} />
      </div>
    </>
  );
}

export default Dashboard;