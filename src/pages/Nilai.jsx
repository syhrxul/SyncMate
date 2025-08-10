import { useEffect, useState } from "react";
import { databases } from "../lib/appwrite";
import { Query } from "appwrite";

const databaseId = "6897a656003536fecb03";
const collectionId = "6897a65e0030c01af6e7";

export default function NilaiPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchNilai = async () => {
      try {
        const res = await databases.listDocuments(
          databaseId,
          collectionId,
          [Query.equal("status_code", 2)] // status selesai
        );
        setData(res.documents);
      } catch (err) {
        setError("Gagal mengambil data nilai");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNilai();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const totalSks = data.reduce((sum, item) => sum + (parseInt(item.sks) || 0), 0);
  const rataNilai =
    data.length > 0
      ? (
          data.reduce((sum, item) => sum + (parseFloat(item.nilai) || 0), 0) /
          data.length
        ).toFixed(2)
      : 0;

  return (
    <div style={{ padding: 24, fontFamily }}>
      <h1 style={{ color: "#FF7F50", marginBottom: 16 }}>Daftar Nilai</h1>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...thtdStyle, ...thStyle }}>No</th>
            <th style={{ ...thtdStyle, ...thStyle }}>Mata Kuliah</th>
            <th style={{ ...thtdStyle, ...thStyle }}>SKS</th>
            <th style={{ ...thtdStyle, ...thStyle }}>Semester</th>
            <th style={{ ...thtdStyle, ...thStyle }}>Nilai</th>
            <th style={{ ...thtdStyle, ...thStyle }}>Terakhir Diupdate</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={item.$id} style={{ backgroundColor: "white" }}>
                <td style={thtdStyle}>{index + 1}</td>
                <td style={thtdStyle}>{item.matkul || "-"}</td>
                <td style={thtdStyle}>{item.sks || "-"}</td>
                <td style={thtdStyle}>{item.semester || "-"}</td>
                <td style={thtdStyle}>
                  {item.nilai !== undefined && item.nilai !== null
                    ? item.nilai
                    : "-"}
                </td>
                <td
                  style={{
                    ...thtdStyle,
                    fontSize: "13px",
                    fontStyle: "italic",
                    color: "#666",
                  }}
                >
                  {item.$updatedAt
                    ? new Date(item.$updatedAt).toLocaleDateString() +
                      " " +
                      new Date(item.$updatedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td style={thtdStyle} colSpan="6" align="center">
                Tidak ada data nilai
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <p style={{ marginTop: 16 }}>
        <strong>Total SKS:</strong> {totalSks}
      </p>
    </div>
  );
}
