import { useEffect, useState } from "react";
import { databases, ID } from "../lib/appwrite";

const databaseId = "6897a656003536fecb03";
const collectionId = "689864f7001efb7198d9"; // khusus jadwal

export default function JadwalKuliah() {
  const [jadwal, setJadwal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    matkul: "",
    tanggal: "",
    jam_mulai: "",
    jam_selesai: "",
    ruangan: "",
    dosen: "",
    semester: "",
  });

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
  const formStyle = {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    marginTop: 20,
    maxWidth: 500,
  };
  const labelStyle = { display: "block", marginBottom: 8, fontWeight: "600" };
  const inputStyle = {
    width: "100%",
    padding: 8,
    marginTop: 4,
    marginBottom: 12,
    border: "1px solid #ccc",
    borderRadius: 4,
  };
  const btnStyle = {
    padding: "8px 16px",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontWeight: "600",
  };

  useEffect(() => {
    fetchJadwal();
  }, []);

  const fetchJadwal = async () => {
    try {
      setLoading(true);
      const res = await databases.listDocuments(databaseId, collectionId);
      setJadwal(res.documents);
    } catch (err) {
      setError("Gagal memuat jadwal");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await databases.createDocument(databaseId, collectionId, ID.unique(), {
        matkul: formData.matkul,
        due_date: formData.tanggal,
        jam_mulai: formData.jam_mulai,
        jam_selesai: formData.jam_selesai,
        ruangan: formData.ruangan,
        dosen: formData.dosen,
        semester: formData.semester,
      });
      setFormVisible(false);
      setFormData({
        matkul: "",
        tanggal: "",
        jam_mulai: "",
        jam_selesai: "",
        ruangan: "",
        dosen: "",
        semester: "",
      });
      fetchJadwal();
    } catch (err) {
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, fontFamily }}>
      <h1 style={{ color: "#FF7F50", marginBottom: 16 }}>Jadwal Kuliah</h1>

      <button
        onClick={() => setFormVisible(!formVisible)}
        style={{
          ...btnStyle,
          backgroundColor: "#4caf50",
          color: "white",
          marginBottom: 16,
        }}
      >
        {formVisible ? "Tutup Form" : "Tambah Jadwal"}
      </button>

      {formVisible && (
        <form style={formStyle} onSubmit={handleSubmit}>
          <label style={labelStyle}>
            Mata Kuliah:
            <input
              type="text"
              name="matkul"
              value={formData.matkul}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </label>

          <label style={labelStyle}>
            Tanggal:
            <input
              type="date"
              name="tanggal"
              value={formData.tanggal}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </label>

          <label style={labelStyle}>
            Jam Mulai:
            <input
              type="time"
              name="jam_mulai"
              value={formData.jam_mulai}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </label>

          <label style={labelStyle}>
            Jam Selesai:
            <input
              type="time"
              name="jam_selesai"
              value={formData.jam_selesai}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </label>

          <label style={labelStyle}>
            Ruangan:
            <input
              type="text"
              name="ruangan"
              value={formData.ruangan}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            Dosen:
            <input
              type="text"
              name="dosen"
              value={formData.dosen}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            Semester:
            <input
              type="text"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>

          <div>
            <button
              type="submit"
              disabled={formLoading}
              style={{
                ...btnStyle,
                backgroundColor: "#4caf50",
                color: "white",
                marginRight: 12,
              }}
            >
              {formLoading ? "Menyimpan..." : "Simpan"}
            </button>
            <button
              type="button"
              onClick={() => setFormVisible(false)}
              style={{
                ...btnStyle,
                backgroundColor: "#f44336",
                color: "white",
              }}
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p>Loading jadwal...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : jadwal.length === 0 ? (
        <p style={{ color: "#666" }}>Tidak ada jadwal kuliah.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={{ ...thtdStyle, ...thStyle, width: 50 }}>No.</th>
              <th style={{ ...thtdStyle, ...thStyle }}>Mata Kuliah</th>
              <th style={{ ...thtdStyle, ...thStyle }}>Tanggal</th>
              <th style={{ ...thtdStyle, ...thStyle }}>Jam</th>
              <th style={{ ...thtdStyle, ...thStyle }}>Ruangan</th>
              <th style={{ ...thtdStyle, ...thStyle }}>Dosen</th>
              <th style={{ ...thtdStyle, ...thStyle }}>Semester</th>
            </tr>
          </thead>
          <tbody>
            {jadwal.map((j, i) => (
              <tr key={j.$id} style={{ backgroundColor: "white" }}>
                <td style={thtdStyle}>{i + 1}</td>
                <td style={thtdStyle}>{j.matkul || "-"}</td>
                <td style={thtdStyle}>
                  {j.due_date
                    ? new Date(j.due_date).toLocaleDateString()
                    : "-"}
                </td>
                <td style={thtdStyle}>
                  {j.jam_mulai && j.jam_selesai
                    ? `${j.jam_mulai} - ${j.jam_selesai}`
                    : "-"}
                </td>
                <td style={thtdStyle}>{j.ruangan || "-"}</td>
                <td style={thtdStyle}>{j.dosen || "-"}</td>
                <td style={thtdStyle}>{j.semester || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
