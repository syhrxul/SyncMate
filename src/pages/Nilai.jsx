import { useEffect, useState } from "react";
import { databases } from "../lib/appwrite";
import { Query } from "appwrite";
import Tabel from "../components/Tabel";

const databaseId = "6897a656003536fecb03";
const collectionId = "6897a65e0030c01af6e7";

export default function NilaiPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";

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
      <h1 style={{ color: "#FF7F50", marginBottom: 20, fontWeight: "bold", fontSize: 28 }}>
        Daftar Nilai
      </h1>

      <Tabel
        columns={[
          { header: "No", key: "no", render: (_, i) => i + 1 },
          { header: "Mata Kuliah", key: "matkul" },
          { header: "SKS", key: "sks" },
          { header: "Semester", key: "semester" },
          { header: "Nilai", key: "nilai" },
          {
            header: "Terakhir Diupdate",
            key: "updatedAt",
            render: (item) =>
              item.$updatedAt
                ? new Date(item.$updatedAt).toLocaleDateString() +
                  " " +
                  new Date(item.$updatedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "-",
          },
        ]}
        data={data}
        loading={loading}
        error={error}
      />

      <p style={{ marginTop: 16 }}>
        <strong>Total SKS:</strong> {totalSks}
      </p>
    </div>
  );
}
