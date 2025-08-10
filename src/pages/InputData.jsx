import { useCallback, useEffect, useState } from "react";
import { databases, ID } from "../lib/appwrite";

const databaseId = "6897a656003536fecb03";
const collectionId = "68988680001a4d66863d";

const PAGE_SIZE = 10;

export default function InputData() {
  const [transaksi, setTransaksi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [akunList, setAkunList] = useState([]);
  const [metodePembayaranList, setMetodePembayaranList] = useState([]);

  const [formVisible, setFormVisible] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  function getCurrentLocalDatetimeString() {
    const now = new Date();
    const pad = (num) => num.toString().padStart(2, "0");
    const yyyy = now.getFullYear();
    const mm = pad(now.getMonth() + 1);
    const dd = pad(now.getDate());
    const hh = pad(now.getHours());
    const min = pad(now.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  }

  const [formData, setFormData] = useState({
    $id: null,
    datetime: getCurrentLocalDatetimeString(),
    jumlah: "",
    tipe: "Pengeluaran",
    kategori: "",
    akun: "",
    deskripsi: "",
    metode_pembayaran: "",
    akunBaru: "",
    metodePembayaranBaru: "",
  });

  const [page, setPage] = useState(1);

  function toDatetimeLocal(dateString) {
    if (!dateString) return "";
    const dt = new Date(dateString);
    const pad = (num) => num.toString().padStart(2, "0");
    const yyyy = dt.getFullYear();
    const mm = pad(dt.getMonth() + 1);
    const dd = pad(dt.getDate());
    const hh = pad(dt.getHours());
    const min = pad(dt.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  }

  const fetchTransaksi = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await databases.listDocuments(databaseId, collectionId);
      let docs = response.documents;

      const akunSet = new Set(docs.map((d) => d.akun).filter(Boolean));
      setAkunList(Array.from(akunSet));

      const metodeSet = new Set(docs.map((d) => d.metode_pembayaran).filter(Boolean));
      setMetodePembayaranList(Array.from(metodeSet));

      docs = docs.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));

      setTransaksi(docs);
    } catch (err) {
      setError(err.message || "Gagal mengambil data transaksi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransaksi();
  }, [fetchTransaksi]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleDynamicSelect(e, field, newField) {
    const { value } = e.target;
    if (value === "__new__") {
      setFormData((prev) => ({ ...prev, [field]: "", [newField]: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value, [newField]: "" }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormLoading(true);

    if (!formData.jumlah) {
      alert("Jumlah tidak boleh kosong");
      setFormLoading(false);
      return;
    }

    let akunToSave = formData.akun;
    if (formData.akunBaru.trim()) {
      akunToSave = formData.akunBaru.trim();
    }

    let metodeToSave = formData.metode_pembayaran;
    if (formData.metodePembayaranBaru.trim()) {
      metodeToSave = formData.metodePembayaranBaru.trim();
    }

    const payload = {
      datetime: new Date(formData.datetime).toISOString(),
      jumlah: Number(formData.jumlah),
      tipe: formData.tipe,
      kategori: formData.kategori,
      akun: akunToSave,
      deskripsi: formData.deskripsi,
      metode_pembayaran: metodeToSave,
    };

    try {
      if (formData.$id) {
        await databases.updateDocument(databaseId, collectionId, formData.$id, payload);
      } else {
        await databases.createDocument(databaseId, collectionId, ID.unique(), payload);
      }
      handleCancel();
      fetchTransaksi();
    } catch (err) {
      alert("Gagal simpan transaksi: " + (err.message || err));
    } finally {
      setFormLoading(false);
    }
  }

  function handleEdit(t) {
    setFormData({
      $id: t.$id,
      datetime: toDatetimeLocal(t.datetime),
      jumlah: t.jumlah || "",
      tipe: t.tipe || "Pengeluaran",
      kategori: t.kategori || "",
      akun: t.akun || "",
      deskripsi: t.deskripsi || "",
      metode_pembayaran: t.metode_pembayaran || "",
      akunBaru: "",
      metodePembayaranBaru: "",
    });
    setFormVisible(true);
  }

  async function handleDelete(id) {
    if (!window.confirm("Yakin ingin menghapus transaksi ini?")) return;
    try {
      await databases.deleteDocument(databaseId, collectionId, id);
      fetchTransaksi();
    } catch (err) {
      alert("Gagal hapus transaksi: " + (err.message || err));
    }
  }

  function handleAddNew() {
    setFormVisible(true);
  }

  function handleCancel() {
    setFormVisible(false);
    setFormData({
      $id: null,
      datetime: getCurrentLocalDatetimeString(),
      jumlah: "",
      tipe: "Pengeluaran",
      kategori: "",
      akun: "",
      deskripsi: "",
      metode_pembayaran: "",
      akunBaru: "",
      metodePembayaranBaru: "",
    });
  }

  const startIdx = (page - 1) * PAGE_SIZE;
  const pagedTransaksi = transaksi.slice(startIdx, startIdx + PAGE_SIZE);
  const totalPages = Math.ceil(transaksi.length / PAGE_SIZE);

  const fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
  const tableStyle = { width: "100%", borderCollapse: "collapse", marginTop: 20, fontFamily, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderRadius: 8, overflow: "hidden" };
  const thtdStyle = { padding: 12, textAlign: "left", borderBottom: "1px solid #eee", color: "#333" };
  const thStyle = { backgroundColor: "#FF7F50", color: "white", fontWeight: "600", fontSize: 16 };
  const btnStyle = { padding: "8px 16px", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: "600", fontFamily, transition: "all 0.3s ease" };
  const addBtnStyle = { ...btnStyle, backgroundColor: "#FF7F50", color: "white", boxShadow: "0 4px 8px rgba(255,127,80,0.4)" };
  const editBtnStyle = { ...btnStyle, backgroundColor: "#4caf50", color: "white", marginRight: 8, boxShadow: "0 3px 6px rgba(76,175,80,0.4)" };
  const delBtnStyle = { ...btnStyle, backgroundColor: "#f44336", color: "white", boxShadow: "0 3px 6px rgba(244,67,54,0.4)" };
  const formStyle = { marginTop: 20, padding: 24, borderRadius: 12, background: "linear-gradient(135deg, #ffaf7b, #ff7f50)", boxShadow: "0 8px 20px rgba(255,127,80,0.4)", fontFamily, color: "white" };
  const inputStyle = { width: "100%", padding: "10px 12px", marginTop: 6, marginBottom: 16, borderRadius: 8, border: "none", fontSize: 16, fontFamily, boxSizing: "border-box", backgroundColor: 'white', color: '#333' };
  const textareaStyle = { ...inputStyle, resize: "vertical", minHeight: 80 };
  const labelStyle = { fontWeight: "600", fontSize: 14, display: "block" };

  return (
    <div style={{ padding: 24, fontFamily }}>
      <h1 style={{ color: "#FF7F50", marginBottom: 20, fontWeight: "bold", fontSize: 28 }}>
       Input Data
      </h1>

      <button style={{ ...addBtnStyle, marginTop: 12 }} onClick={handleAddNew} disabled={formLoading}>
        {formLoading ? "Loading..." : "Tambah Transaksi"}
      </button>

      {formVisible && (
        <form style={formStyle} onSubmit={handleSubmit} noValidate>
          <h2 style={{ marginBottom: 24, fontWeight: "700" }}>{formData.$id ? "Edit Transaksi" : "Tambah Transaksi"}</h2>
          <label style={labelStyle}>Tanggal & Waktu:
            <input type="datetime-local" name="datetime" value={formData.datetime} onChange={handleChange} required style={inputStyle} />
          </label>
          <label style={labelStyle}>Jumlah (Rp):
            <input type="number" name="jumlah" value={formData.jumlah} onChange={handleChange} required style={inputStyle} placeholder="Masukkan jumlah" />
          </label>
          <label style={labelStyle}>Tipe:
            <select name="tipe" value={formData.tipe} onChange={handleChange} style={inputStyle}>
              <option value="Pengeluaran">Pengeluaran</option>
              <option value="Pemasukan">Pemasukan</option>
            </select>
          </label>
          <label style={labelStyle}>Kategori:
            <input type="text" name="kategori" value={formData.kategori} onChange={handleChange} style={inputStyle} placeholder="Contoh: Makanan, Gaji" />
          </label>
          <label style={labelStyle}>Akun:
            <select name="akun" value={formData.akun} onChange={(e) => handleDynamicSelect(e, 'akun', 'akunBaru')} style={inputStyle}>
              <option value="">-- Pilih Akun --</option>
              {akunList.map((a) => (<option key={a} value={a}>{a}</option>))}
              <option value="__new__">Tambah akun baru...</option>
            </select>
          </label>
          {formData.akun === "" && (
            <label style={labelStyle}>Akun Baru:
              <input type="text" name="akunBaru" value={formData.akunBaru} onChange={handleChange} placeholder="Masukkan nama akun baru" style={inputStyle} />
            </label>
          )}
          <label style={labelStyle}>Metode Pembayaran:
            <select name="metode_pembayaran" value={formData.metode_pembayaran} onChange={(e) => handleDynamicSelect(e, 'metode_pembayaran', 'metodePembayaranBaru')} style={inputStyle}>
              <option value="">-- Pilih Metode --</option>
              {metodePembayaranList.map((m) => (<option key={m} value={m}>{m}</option>))}
              <option value="__new__">Tambah metode baru...</option>
            </select>
          </label>
          {formData.metode_pembayaran === "" && (
            <label style={labelStyle}>Metode Pembayaran Baru:
              <input type="text" name="metodePembayaranBaru" value={formData.metodePembayaranBaru} onChange={handleChange} placeholder="Masukkan metode pembayaran baru" style={inputStyle} />
            </label>
          )}
          <label style={labelStyle}>Deskripsi:
            <textarea name="deskripsi" value={formData.deskripsi} onChange={handleChange} rows={3} style={textareaStyle} placeholder="Catatan tambahan" />
          </label>
          <div style={{ marginTop: 20 }}>
            <button type="submit" disabled={formLoading} style={editBtnStyle}>
              {formLoading ? "Menyimpan..." : "Simpan"}
            </button>
            <button type="button" onClick={handleCancel} disabled={formLoading} style={delBtnStyle}>
              Batal
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <>
          {transaksi.length === 0 ? (
            <p style={{ color: "#666", textAlign: 'center', marginTop: 20 }}>Belum ada transaksi.</p>
          ) : (
            <>
              <table style={tableStyle}>
                <thead>
                  <tr>
                <th style={{ ...thtdStyle, ...thStyle }}>Tanggal</th>
                <th style={{ ...thtdStyle, ...thStyle }}>Jumlah</th>
                <th style={{ ...thtdStyle, ...thStyle }}>Tipe</th>
                <th style={{ ...thtdStyle, ...thStyle }}>Kategori</th>
                <th style={{ ...thtdStyle, ...thStyle }}>Akun</th>
                <th style={{ ...thtdStyle, ...thStyle }}>Metode</th>
                <th style={{ ...thtdStyle, ...thStyle }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedTransaksi.map((t) => (
                    <tr key={t.$id} style={{ backgroundColor: t.tipe === 'Pemasukan' ? '#e8f5e9' : '#ffebee' }}>
                      <td style={thtdStyle}>{new Date(t.datetime).toLocaleString()}</td>
                      <td style={{ ...thtdStyle, color: t.tipe === 'Pemasukan' ? 'green' : 'red' }}>
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(t.jumlah)}
                      </td>
                      <td style={thtdStyle}>{t.tipe}</td>
                      <td style={thtdStyle}>{t.kategori}</td>
                      <td style={thtdStyle}>{t.akun}</td>
                      <td style={thtdStyle}>{t.metode_pembayaran}</td>
                      <td style={thtdStyle}>
                        <button style={editBtnStyle} onClick={() => handleEdit(t)}>Edit</button>
                        <button style={delBtnStyle} onClick={() => handleDelete(t.$id)}>Hapus</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalPages > 1 && (
                <div style={{ marginTop: 12, display: "flex", justifyContent: "center", gap: 12 }}>
                  <button style={{ ...btnStyle, backgroundColor: page === 1 ? "#ccc" : "#FF7F50", color: page === 1 ? "#666" : "white", cursor: page === 1 ? "default" : "pointer" }} disabled={page === 1} onClick={() => setPage((p) => Math.max(p - 1, 1))}>
                    Prev
                  </button>
                  <span style={{ alignSelf: "center", fontWeight: "600" }}>
                    Halaman {page} dari {totalPages}
                  </span>
                  <button style={{ ...btnStyle, backgroundColor: page === totalPages ? "#ccc" : "#FF7F50", color: page === totalPages ? "#666" : "white", cursor: page === totalPages ? "default" : "pointer" }} disabled={page === totalPages} onClick={() => setPage((p) => Math.min(p + 1, totalPages))}>
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
