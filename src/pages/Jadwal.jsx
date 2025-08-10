import { useEffect, useState } from "react";
import { databases, ID } from "../lib/appwrite";

const databaseId = "6897a656003536fecb03";
const collectionId = "689864f7001efb7198d9"; // khusus jadwal

export default function JadwalKuliah() {
  const [jadwal, setJadwal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    $id: null,
    matkul: "",
    tanggal: "",
    jam_mulai: "",
    jam_selesai: "",
    ruangan: "",
    dosen: "",
    semester: "",
    sks: "",
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
    marginTop: 20,
    padding: 24,
    borderRadius: 12,
    background: "linear-gradient(135deg, #ffaf7b, #ff7f50)",
    boxShadow: "0 8px 20px rgba(255,127,80,0.4)",
    fontFamily,
    color: "white",
  };
  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    marginTop: 6,
    marginBottom: 16,
    borderRadius: 8,
    border: "none",
    fontSize: 16,
    fontFamily,
    boxSizing: "border-box",
  };
  const labelStyle = {
    fontWeight: "600",
    fontSize: 14,
    display: "block",
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
  const addBtnStyle = {
    ...btnStyle,
    backgroundColor: "#FF7F50",
    color: "white",
    boxShadow: "0 4px 8px rgba(255,127,80,0.4)",
  };
  const editBtnStyle = {
    ...btnStyle,
    backgroundColor: "#4caf50",
    color: "white",
    marginRight: 8,
    boxShadow: "0 3px 6px rgba(76,175,80,0.4)",
  };
  const delBtnStyle = {
    ...btnStyle,
    backgroundColor: "#f44336",
    color: "white",
    boxShadow: "0 3px 6px rgba(244,67,54,0.4)",
  };

  useEffect(() => {
    fetchJadwal();
  }, []);

  const fetchJadwal = async () => {
    try {
      setLoading(true);
      const res = await databases.listDocuments(databaseId, collectionId);
      setJadwal(res.documents);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEdit = (j) => {
    setFormData({
      $id: j.$id,
      matkul: j.matkul || "",
      dosen: j.dosen || "",
      tanggal: j.due_date ? new Date(j.due_date).toISOString().split('T')[0] : "",
      jam_mulai: j.jam_mulai || "",
      jam_selesai: j.jam_selesai || "",
      ruangan: j.ruangan || "",
      semester: j.semester || "",
      sks: j.sks || "",
    });
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus jadwal ini?")) return;
    try {
      await databases.deleteDocument(databaseId, collectionId, id);
      fetchJadwal();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus jadwal.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    const payload = {
      matkul: formData.matkul,
      due_date: formData.tanggal,
      jam_mulai: formData.jam_mulai,
      jam_selesai: formData.jam_selesai,
      ruangan: formData.ruangan,
      dosen: formData.dosen,
      semester: formData.semester,
      sks: formData.sks,
    };

    try {
      if (formData.$id) {
        await databases.updateDocument(databaseId, collectionId, formData.$id, payload);
      } else {
        await databases.createDocument(databaseId, collectionId, ID.unique(), payload);
      }
      handleCancel();
      fetchJadwal();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan jadwal.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleAddNew = () => {
    setFormData({
      $id: null,
      matkul: "",
      tanggal: "",
      jam_mulai: "",
      jam_selesai: "",
      ruangan: "",
      dosen: "",
      semester: "",
      sks: "",
    });
    setFormVisible(true);
  };

  const handleCancel = () => {
    setFormVisible(false);
    setFormData({
      $id: null,
      matkul: "",
      tanggal: "",
      jam_mulai: "",
      jam_selesai: "",
      ruangan: "",
      dosen: "",
      semester: "",
      sks: "",
    });
  };

  return (
    <div style={{ padding: 24, fontFamily }}>
      <h1 style={{ color: "#FF7F50", marginBottom: 20, fontWeight: "bold", fontSize: 28 }}>
        Jadwal Kuliah
      </h1>

      <button
        onClick={handleAddNew}
        style={{ ...addBtnStyle, marginTop: 12 }}
      >
        Tambah Jadwal
      </button>

      {formVisible && (
        <form style={formStyle} onSubmit={handleSubmit}>
          <h2 style={{ marginBottom: 24, fontWeight: "700" }}>
            {formData.$id ? "Edit Jadwal" : "Tambah Jadwal"}
          </h2>
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

          <label style={labelStyle}>
            SKS:
            <input
              type="number"
              name="sks"
              value={formData.sks}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>

          <div style={{ marginTop: 20 }}>
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
              onClick={handleCancel}
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
              <th style={{ ...thtdStyle, ...thStyle }}>SKS</th>
              <th style={{ ...thtdStyle, ...thStyle }}>Smt</th>
              <th style={{ ...thtdStyle, ...thStyle, width: 140 }}>Aksi</th>
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
                <td style={thtdStyle}>{j.sks || "-"}</td>
                <td style={thtdStyle}>{j.semester || "-"}</td>
                <td style={thtdStyle}>
                  <button
                    style={editBtnStyle}
                    onClick={() => handleEdit(j)}
                    disabled={formLoading}
                  >
                    Edit
                  </button>
                  <button
                    style={delBtnStyle}
                    onClick={() => handleDelete(j.$id)}
                    disabled={formLoading}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
