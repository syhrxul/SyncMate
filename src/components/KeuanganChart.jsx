import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#FF7F50", "#82ca9d", "#8884d8", "#ffc658", "#d0ed57"];

export default function KeuanganChart({ data }) {
  // Contoh agregasi data: jumlah per tipe (Pemasukan & Pengeluaran)
  const aggregatedData = [
    {
      name: "Pemasukan",
      value: data
        .filter((d) => d.tipe === "Pemasukan")
        .reduce((acc, cur) => acc + cur.jumlah, 0),
    },
    {
      name: "Pengeluaran",
      value: data
        .filter((d) => d.tipe === "Pengeluaran")
        .reduce((acc, cur) => acc + cur.jumlah, 0),
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={aggregatedData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={70} // ini buat donut (lubang tengah)
          outerRadius={110}
          fill="#FF7F50"
          label
          // activeIndex dan onMouseEnter untuk interaktivitas opsional
        >
          {aggregatedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  );
}
