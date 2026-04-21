import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";


const SEG = {
  low: "#4f46e5",
  medium: "#0d9488",
  high: "#d97706",
  vip: "#7c3aed",
};

function Chart({ data }) {
  return (
    <BarChart width={700} height={350} data={data} margin={{ top: 8, right: 8, left: 4, bottom: 8 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
      <XAxis dataKey="month" tick={{ fill: "#525252", fontSize: 12 }} axisLine={{ stroke: "#e5e5e5" }} />
      <YAxis tick={{ fill: "#525252", fontSize: 12 }} axisLine={{ stroke: "#e5e5e5" }} />
      <Tooltip
        contentStyle={{
          borderRadius: "8px",
          border: "1px solid #e5e5e5",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
        labelStyle={{ fontWeight: 600, color: "#0a0a0a" }}
      />
      <Legend wrapperStyle={{ paddingTop: "12px" }} />

      <Bar dataKey="Low" fill={SEG.low} radius={[4, 4, 0, 0]} maxBarSize={48} />
      <Bar dataKey="Medium" fill={SEG.medium} radius={[4, 4, 0, 0]} maxBarSize={48} />
      <Bar dataKey="High" fill={SEG.high} radius={[4, 4, 0, 0]} maxBarSize={48} />
      <Bar dataKey="VIP" fill={SEG.vip} radius={[4, 4, 0, 0]} maxBarSize={48} />
    </BarChart>
  );
}

export default Chart;