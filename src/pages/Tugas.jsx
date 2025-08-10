import { useCallback, useEffect, useState } from "react";
import { databases, ID } from "../lib/appwrite";

const databaseId = "6897a656003536fecb03";
const collectionId = "6897a65e0030c01af6e7";

const statusMapping = {
  0: "Belum dikerjakan",
  1: "Sedang dikerjakan",
  2: "Selesai",
};

const PAGE_SIZE = 10;

export default function Tugas() {
  const [tugas, setTugas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Daftar mata kuliah dan semester otomatis dari data tugas
  const [matkulList, setMatkulList] = useState([]);
  const [semesterList, setSemesterList] = useState([]);
  const [sksList, setSksList] = useState([]);

  const [formVisible, setFormVisible] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    $id: null,
    title: "",
    description: "",
    due_date: "",
    status_code: 0,
    matkul: "",
    matkulBaru: "",
    nilai: "",
    semester: "",
    semesterBaru: "",
    sks: "",
    sksBaru: "",
  });

  // Pilihan urut
  const [sortBy, setSortBy] = useState("deadline"); // "deadline" atau "baru"

  // Pagination state
  const [page, setPage] = useState(1);

  // Validasi document ID
  function isValidDocumentId(id) {
    if (!id || id === null || id === undefined || id === "") return false;
    return (
      typeof id === "string" &&
      id.length <= 36 &&
      /^[a-zA-Z0-9][a-zA-Z0-9.\-_]*$/.test(id)
    );
  }

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

  const fetchTugas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await databases.listDocuments(databaseId, collectionId);
      let docs = response.documents;

      // Update daftar matkul dari tugas yang ada
      const matkulSet = new Set(
        docs.map((d) => d.matkul).filter(Boolean)
      );
      setMatkulList(Array.from(matkulSet));

      // Update daftar semester dari tugas yang ada
      const semesterSet = new Set(
        docs.map((d) => d.semester).filter(Boolean)
      );
      setSemesterList(Array.from(semesterSet));

      // Update daftar SKS dari tugas yang ada
      const sksSet = new Set(
        docs.map((d) => d.sks).filter(Boolean)
      );
      setSksList(Array.from(sksSet));

      // Urutkan data
      if (sortBy === "deadline") {
        docs = docs.sort((a, b) => {
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date) - new Date(b.due_date);
        });
      } else if (sortBy === "baru") {
        docs = docs.sort((a, b) => {
          if (a.$createdAt && b.$createdAt) {
            return new Date(b.$createdAt) - new Date(a.$createdAt);
          }
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(b.due_date) - new Date(a.due_date);
        });
      }

      setTugas(docs);
      setLoading(false);
      setPage(1);
    } catch (err) {
      setError(err.message || "Gagal ambil data tugas");
      setLoading(false);
    }
  }, [sortBy]);

  useEffect(() => {
    fetchTugas();
  }, [fetchTugas]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "status_code" ? Number(value) : value,
    }));
  }

  // Saat pilih matkul dari dropdown
  function handleMatkulSelect(e) {
    const val = e.target.value;
    if (val === "__new__") {
      setFormData((prev) => ({
        ...prev,
        matkul: "",
        matkulBaru: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        matkul: val,
        matkulBaru: "",
      }));
    }
  }

  // Saat pilih semester dari dropdown
  function handleSemesterSelect(e) {
    const val = e.target.value;
    if (val === "__new__") {
      setFormData((prev) => ({
        ...prev,
        semester: "",
        semesterBaru: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        semester: val,
        semesterBaru: "",
      }));
    }
  }

  function handleSksSelect(e) {
    const val = e.target.value;
    if (val === "__new__") {
      setFormData((prev) => ({
        ...prev,
        sks: "",
        sksBaru: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        sks: val,
        sksBaru: "",
      }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormLoading(true);

    if (!formData.title.trim()) {
      alert("Judul tugas tidak boleh kosong");
      setFormLoading(false);
      return;
    }
    if (!formData.due_date) {
      alert("Deadline harus diisi");
      setFormLoading(false);
      return;
    }

    // Tentukan nilai matkul yang akan disimpan
    let matkulToSave = formData.matkul;
    if (formData.matkulBaru.trim()) {
      matkulToSave = formData.matkulBaru.trim();
      if (!matkulList.includes(matkulToSave)) {
        setMatkulList((prev) => [...prev, matkulToSave]);
      }
    }

    // Tentukan nilai semester yang akan disimpan
    let semesterToSave = formData.semester;
    if (formData.semesterBaru.trim()) {
      semesterToSave = formData.semesterBaru.trim();
      if (!semesterList.includes(semesterToSave)) {
        setSemesterList((prev) => [...prev, semesterToSave]);
      }
    }

    let sksToSave = formData.sks;
    if (formData.sksBaru.trim()) {
      sksToSave = formData.sksBaru.trim();
      if (!sksList.includes(sksToSave)) {
        setSksList((prev) => [...prev, sksToSave]);
      }
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      due_date: new Date(formData.due_date).toISOString(),
      status_code: Number(formData.status_code),
      matkul: matkulToSave,
      nilai: formData.status_code === 2 ? formData.nilai.trim() : "",
      semester: semesterToSave,
      sks: sksToSave,
    };

    try {
      if (isValidDocumentId(formData.$id)) {
        await databases.updateDocument(
          databaseId,
          collectionId,
          formData.$id,
          payload
        );
      } else {
        await databases.createDocument(
          databaseId,
          collectionId,
          ID.unique(),
          payload
        );
      }

      setFormLoading(false);
      setFormVisible(false);
      setFormData({
        $id: null,
        title: "",
        description: "",
        due_date: "",
        status_code: 0,
        matkul: "",
        matkulBaru: "",
        nilai: "",
        semester: "",
        semesterBaru: "",
        sks: "",
        sksBaru: "",
      });
      await fetchTugas();
    } catch (err) {
      alert("Gagal simpan tugas: " + (err.message || err));
      setFormLoading(false);
    }
  }

  function handleEdit(t) {
    setFormData({
      $id: t.$id,
      title: t.title || "",
      description: t.description || "",
      due_date: t.due_date ? toDatetimeLocal(t.due_date) : "",
      status_code: t.status_code || 0,
      matkul: t.matkul || "",
      matkulBaru: "",
      nilai: t.nilai || "",
      semester: t.semester || "",
      semesterBaru: "",
      sks: t.sks || "",
      sksBaru: "",
    });
    setFormVisible(true);
  }

  async function handleDelete(id) {
    if (!window.confirm("Yakin ingin menghapus tugas ini?")) return;
    try {
      await databases.deleteDocument(databaseId, collectionId, id);
      await fetchTugas();
    } catch (err) {
      alert("Gagal hapus tugas: " + (err.message || err));
    }
  }

  function handleAddNew() {
    setFormData({
      $id: null,
      title: "",
      description: "",
      due_date: "",
      status_code: 0,
      matkul: "",
      matkulBaru: "",
      nilai: "",
      semester: "",
      semesterBaru: "",
      sks: "",
      sksBaru: "",
    });
    setFormVisible(true);
  }

  function handleCancel() {
    setFormVisible(false);
    setFormData({
      $id: null,
      title: "",
      description: "",
      due_date: "",
      status_code: 0,
      matkul: "",
      matkulBaru: "",
      nilai: "",
      semester: "",
      semesterBaru: "",
      sks: "",
      sksBaru: "",
    });
  }

  // Pagination: hitung data untuk page sekarang
  const startIdx = (page - 1) * PAGE_SIZE;
  const pagedTugas = tugas.slice(startIdx, startIdx + PAGE_SIZE);
  const totalPages = Math.ceil(tugas.length / PAGE_SIZE);

  // Styles (sama seperti kode aslinya)
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
  const textareaStyle = {
    ...inputStyle,
    resize: "vertical",
    minHeight: 80,
  };
  const labelStyle = {
    fontWeight: "600",
    fontSize: 14,
    display: "block",
  };

  return (
    <div style={{ padding: 24, fontFamily }}>
      <h1 style={{ color: "#FF7F50", marginBottom: 16 }}>Daftar Tugas</h1>

      <div style={{ marginBottom: 12 }}>
        <label htmlFor="sortSelect" style={{ marginRight: 8, fontWeight: "600" }}>
          Urutkan berdasarkan:
        </label>
        <select
          id="sortSelect"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ padding: "6px 10px", fontSize: 16, borderRadius: 6, border: "1px solid #ccc" }}
          disabled={loading}
        >
          <option value="deadline">Deadline Terdekat</option>
          <option value="baru">Tugas Terbaru</option>
        </select>
      </div>

      <button
        style={{ ...addBtnStyle, marginTop: 12 }}
        onClick={handleAddNew}
        disabled={formLoading}
      >
        {formLoading ? "Loading..." : "Tambah Tugas"}
      </button>

      {loading ? (
        <p>Loading data tugas...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : tugas.length === 0 ? (
        <p style={{ color: "#666" }}>Tidak ada tugas.</p>
      ) : (
        <>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={{ ...thtdStyle, ...thStyle, width: 50 }}>No.</th>
                <th style={{ ...thtdStyle, ...thStyle }}>Judul</th>
                <th style={{ ...thtdStyle, ...thStyle }}>Deskripsi</th>
                <th style={{ ...thtdStyle, ...thStyle, width: 160 }}>Deadline</th>
                <th style={{ ...thtdStyle, ...thStyle, width: 130 }}>Status</th>
                <th style={{ ...thtdStyle, ...thStyle }}>Mata Kuliah</th>
                <th style={{ ...thtdStyle, ...thStyle }}>Smt</th>
                <th style={{ ...thtdStyle, ...thStyle, width: 140 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pagedTugas.map((t, i) => (
                <tr key={t.$id} style={{ backgroundColor: "white" }}>
                  <td style={thtdStyle}>{startIdx + i + 1}</td>
                  <td style={thtdStyle}>{t.title}</td>
                  <td style={thtdStyle}>{t.description}</td>
                  <td style={thtdStyle}>
                    {t.due_date
                      ? new Date(t.due_date).toLocaleDateString() +
                        " " +
                        new Date(t.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : "-"}
                  </td>
                  <td style={thtdStyle}>{statusMapping[t.status_code] ?? "Unknown"}</td>
                  <td style={thtdStyle}>
                      {t.matkul ? `${t.matkul} (${t.sks || "-"} SKS)` : "-"}
                   </td>

                  <td style={thtdStyle}>{t.semester || "-"}</td>
                  <td style={thtdStyle}>
                    <button
                      style={editBtnStyle}
                      onClick={() => handleEdit(t)}
                      disabled={formLoading}
                    >
                      Edit
                    </button>
                    <button
                      style={delBtnStyle}
                      onClick={() => handleDelete(t.$id)}
                      disabled={formLoading}
                    >
                      Hapus
                    </button>
                  </td>
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
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
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
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {formVisible && (
        <form style={formStyle} onSubmit={handleSubmit} noValidate>
          <h2 style={{ marginBottom: 24, fontWeight: "700" }}>
            {formData.$id ? "Edit Tugas" : "Tambah Tugas"}
          </h2>

          <label style={labelStyle}>
            Judul:
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={inputStyle}
              disabled={formLoading}
              placeholder="Masukkan judul tugas"
              autoComplete="off"
            />
          </label>

          <label style={labelStyle}>
            Deskripsi:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              style={textareaStyle}
              disabled={formLoading}
              placeholder="Masukkan deskripsi tugas"
            />
          </label>

          <label style={labelStyle}>
            Deadline:
            <input
              type="datetime-local"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              required
              disabled={formLoading}
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            Status:
            <select
              name="status_code"
              value={formData.status_code}
              onChange={handleChange}
              disabled={formLoading}
              style={inputStyle}
            >
              <option value={0}>Belum dikerjakan</option>
              <option value={1}>Sedang dikerjakan</option>
              <option value={2}>Selesai</option>
            </select>
          </label>

          <label style={labelStyle}>
            Mata Kuliah:
            <select
              name="matkul"
              value={formData.matkul || "__new__"}
              onChange={handleMatkulSelect}
              disabled={formLoading}
              style={inputStyle}
            >
              <option value="">-- Pilih Mata Kuliah --</option>
              {matkulList.map((mk) => (
                <option key={mk} value={mk}>
                  {mk}
                </option>
              ))}
              <option value="__new__">Tambah mata kuliah baru...</option>
            </select>
          </label>

          {/* Input matkul baru jika pilih Tambah */}
          {formData.matkul === "" && (
            <label style={labelStyle}>
              Mata Kuliah Baru:
              <input
                type="text"
                name="matkulBaru"
                value={formData.matkulBaru}
                onChange={handleChange}
                disabled={formLoading}
                placeholder="Masukkan nama mata kuliah baru"
                style={inputStyle}
                autoComplete="off"
              />
            </label>
          )}

          <label style={labelStyle}>
            Semester:
            <select
              name="semester"
              value={formData.semester || "__new__"}
              onChange={handleSemesterSelect}
              disabled={formLoading}
              style={inputStyle}
            >
              <option value="">-- Pilih Semester --</option>
              {semesterList.map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
              <option value="__new__">Tambah semester baru...</option>
            </select>
          </label>

          {/* Input semester baru jika pilih Tambah */}
          {formData.semester === "" && (
            <label style={labelStyle}>
              Semester Baru:
              <input
                type="text"
                name="semesterBaru"
                value={formData.semesterBaru}
                onChange={handleChange}
                disabled={formLoading}
                placeholder="Masukkan nama semester baru"
                style={inputStyle}
                autoComplete="off"
              />
            </label>
          )}

          <label style={labelStyle}>
            SKS:
            <select
              name="sks"
              value={formData.sks || "__new__"}
              onChange={handleSksSelect}
              disabled={formLoading}
              style={inputStyle}
            >
              <option value="">-- Pilih SKS --</option>
              {sksList.map((sks) => (
                <option key={sks} value={sks}>
                  {sks}
                </option>
              ))}
              <option value="__new__">Tambah SKS baru...</option>
            </select>
          </label>  

          {formData.sks === "" && (
            <label style={labelStyle}>
              SKS Baru:
              <input
                type="text"
                name="sksBaru"
                value={formData.sksBaru}
                onChange={handleChange}
                disabled={formLoading}
                placeholder="Masukkan jumlah SKS baru"
                style={inputStyle}
                autoComplete="off"
              />
            </label>
          )}

          {/* Input nilai muncul hanya kalau status selesai */}
          {formData.status_code === 2 && (
            <label style={labelStyle}>
              Nilai:
              <input
                type="text"
                name="nilai"
                value={formData.nilai}
                onChange={handleChange}
                disabled={formLoading}
                placeholder="Masukkan nilai"
                style={inputStyle}
                autoComplete="off"
              />
            </label>
          )}

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
              disabled={formLoading}
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
    </div>
  );
}
