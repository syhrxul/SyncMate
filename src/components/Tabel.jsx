import React from "react";

const fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: 20,
  fontFamily,
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  borderRadius: 8,
  overflow: "hidden",
};
const thtdStyle = {
  padding: 12,
  textAlign: "left",
  borderBottom: "1px solid #eee",
  color: "#333",
};
const thStyle = {
  backgroundColor: "#FF7F50",
  color: "white",
  fontWeight: "600",
  fontSize: 16,
};
const btnStyle = {
  padding: "8px 16px",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: "600",
  fontFamily,
  transition: "all 0.3s ease",
};

const Tabel = ({
  columns,
  data,
  page,
  totalPages,
  onPageChange,
  loading,
  error,
}) => {
  if (loading) return <p>Loading data...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (data.length === 0) return <p style={{ color: "#666" }}>Tidak ada data.</p>;

  return (
    <>
      <table style={tableStyle}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ ...thtdStyle, ...thStyle, width: col.width }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={row.$id || rowIndex} style={{ backgroundColor: "white" }}>
              {columns.map((col) => (
                <td key={col.key} style={thtdStyle}>
                  {col.render ? col.render(row, rowIndex) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div
          style={{
            marginTop: 12,
            display: "flex",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <button
            style={{
              ...btnStyle,
              backgroundColor: page === 1 ? "#ccc" : "#FF7F50",
              color: page === 1 ? "#666" : "white",
              cursor: page === 1 ? "default" : "pointer",
            }}
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            Prev
          </button>
          <span style={{ alignSelf: "center", fontWeight: "600" }}>
            Halaman {page} dari {totalPages}
          </span>
          <button
            style={{
              ...btnStyle,
              backgroundColor: page === totalPages ? "#ccc" : "#FF7F50",
              color: page === totalPages ? "#666" : "white",
              cursor: page === totalPages ? "default" : "pointer",
            }}
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default Tabel;
