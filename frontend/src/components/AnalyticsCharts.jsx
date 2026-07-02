import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function AnalyticsCharts({ data }) {
  if (!data) return null;

  const barChartData = [
    { name: "New", value: data.new, fill: "#F59E0B" },
    { name: "Contacted", value: data.contacted, fill: "#0EA5E9" },
    { name: "Converted", value: data.converted, fill: "#16A34A" },
  ];

  const pieChartData = [
    { name: "New", value: data.new, fill: "#F59E0B" },
    { name: "Contacted", value: data.contacted, fill: "#0EA5E9" },
    { name: "Converted", value: data.converted, fill: "#16A34A" },
  ].filter((item) => item.value > 0);

  const COLORS = ["#F59E0B", "#0EA5E9", "#16A34A"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bar Chart */}
      <div className="card p-6">
        <h3 className="font-display text-lg text-ink mb-4">Leads by Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="name" tick={{ fill: "#6B7280", fontSize: 12 }} />
            <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
              }}
              cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="card p-6">
        <h3 className="font-display text-lg text-ink mb-4">Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value, percent }) =>
                `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value} leads`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
