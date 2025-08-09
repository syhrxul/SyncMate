import React, { useEffect, useState } from "react";
import { databases, ID } from "../lib/appwrite";

const databaseId = "6897a656003536fecb03";
const collectionId = "6897a65e0030c01af6e7";

const statusMapping = {
  0: "Belum dikerjakan",
  1: "Sedang dikerjakan",
  2: "Selesai",
};

export default function Tugas() {
  const [tugas, setTugas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    $id: null,
    title: "",
    description: "",
    due_date: "",
    status_code: 0,
  });
  const [formLoading, setFormLoading] = useState(false);

  // Sorting: 'deadline' atau 'newest'
  const [sortBy, setSortBy] = useState("deadline");

  // Pagination
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  function isValidDocumentId(id) {
    if (!id || id === null || id === undefined || id === "") return false;
    return typeof id === "string" && 
           id.length <= 36 && 
           /^[a-zA-Z0-9][a-zA-Z0-9.\-_]*$/.test(id);
  }

  async function fetchTugas() {
    try {
      setLoading(true);
      setError(null);
      const response = await databases.listDocuments(databaseId, collectionId);
      setTugas(response.documents);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Gagal ambil data tugas");
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTugas();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === 'status_code' ? Number(value) : value 
    }));
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

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      due_date: formData.due_date,
      status_code: Number(formData.status_code),
    };

    try {
      if (isValidDocumentId(formData.$id)) {
        await databases.updateDocument(databaseId, collectionId, formData.$id, payload);
      } else {
        await databases.createDocument(databaseId, collectionId, ID.unique(), payload);
      }
      
      setFormLoading(false);
      setFormVisible(false);
      setFormData({ $id: null, title: "", description: "", due_date: "", status_code: 0 });
      setCurrentPage(1); // reset halaman ke awal setelah update
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
      due_date: t.due_date ? t.due_date.split("T")[0] + "T" + (t.due_date.split("T")[1] || "00:00") : "",
      status_code: t.status_code || 0,
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
    setFormData({ $id: null, title: "", description: "", due_date: "", status_code: 0 });
    setFormVisible(true);
  }

  function handleCancel() {
    setFormVisible(false);
    setFormData({ $id: null, title: "", description: "", due_date: "", status_code: 0 });
  }

  // Urutkan tugas sesuai sortBy
  function getSortedTugas() {
    const tugasCopy = [...tugas];
    if (sortBy === "deadline") {
      return tugasCopy.sort((a, b) => {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date) - new Date(b.due_date);
      });
    } else if (sortBy === "newest") {
      // Urut berdasarkan waktu buat, properti $createdAt ada di dokumen Appwrite
      return tugasCopy.sort((a, b) => {
        if (!a.$createdAt) return 1;
        if (!b.$createdAt) return -1;
        return new Date(b.$createdAt) - new Date(a.$createdAt);
      });
    }
    return tugasCopy;
  }

  // Pagination - hitung data yang akan ditampilkan di halaman sekarang
  const sortedTugas = getSortedTugas();
  const totalPages = Math.ceil(sortedTugas.length / itemsPerPage);
  const pagedTugas = sortedTugas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Styles singkat
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

      {/* Pilih sort */}
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="sortBy" style={{ marginRight: 8, fontWeight: "600" }}>
          Urutkan berdasarkan:
        </label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={e => { setSortBy(e.target.value); setCurrentPage(1); }}
          style={{ padding: 8, borderRadius: 6, fontSize: 16 }}
        >
          <option value="deadline">Deadline Tercepat</option>
          <option value="newest">Tugas Terbaru</option>
        </select>
      </div>

      <button
        style={{ ...addBtnStyle, marginBottom: 24 }}
        onClick={handleAddNew}
        disabled={formLoading}
        onMouseEnter={e => e.currentTarget.style.filter = "brightness(110%)"}
        onMouseLeave={e => e.currentTarget.style.filter = "brightness(100%)"}
      >
        {formLoading ? "Loading..." : "Tambah Tugas"}
      </button>

      {loading && <p>Loading tugas...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && tugas.length === 0 && <p>Tidak ada tugas.</p>}

      {!loading && !error && tugas.length > 0 && (
        <>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={{ ...thtdStyle, ...thStyle }}>Judul</th>
                <th style={{ ...thtdStyle, ...thStyle }}>Deskripsi</th>
                <th style={{ ...thtdStyle, ...thStyle }}>Deadline</th>
                <th style={{ ...thtdStyle, ...thStyle }}>Status</th>
                <th style={{ ...thtdStyle, ...thStyle }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pagedTugas.map((t) => (
                <tr key={t.$id} style={{ backgroundColor: "white" }}>
                  <td style={thtdStyle}>{t.title}</td>
                  <td style={thtdStyle}>{t.description}</td>
                  <td style={thtdStyle}>
                    {t.due_date 
                      ? new Date(t.due_date).toLocaleString(undefined, {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) 
                      : "-"}
                  </td>
                  <td style={thtdStyle}>{statusMapping[t.status_code] ?? "Unknown"}</td>
                  <td style={thtdStyle}>
                    <button 
                      style={editBtnStyle} 
                      onClick={() => handleEdit(t)} 
                      disabled={formLoading}
                      onMouseEnter={e => e.currentTarget.style.filter = "brightness(110%)"}
                      onMouseLeave={e => e.currentTarget.style.filter = "brightness(100%)"}
                    >
                      Edit
                    </button>
                    <button 
                      style={delBtnStyle} 
                      onClick={() => handleDelete(t.$id)} 
                      disabled={formLoading}
                      onMouseEnter={e => e.currentTarget.style.filter = "brightness(110%)"}
                      onMouseLeave={e => e.currentTarget.style.filter = "brightness(100%)"}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 12 }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              style={{
                padding: "8px 16px",
                borderRadius: 6,
                border: "none",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                backgroundColor: currentPage === 1 ? "#ccc" : "#FF7F50",
                color: "white",
                fontWeight: "600",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={e => { if(currentPage !==1) e.currentTarget.style.filter = "brightness(110%)"}}
              onMouseLeave={e => { if(currentPage !==1) e.currentTarget.style.filter = "brightness(100%)"}}
            >
              Prev
            </button>
            <span style={{ alignSelf: "center", fontWeight: "600" }}>
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{
                padding: "8px 16px",
                borderRadius: 6,
                border: "none",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                backgroundColor: currentPage === totalPages ? "#ccc" : "#FF7F50",
                color: "white",
                fontWeight: "600",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={e => { if(currentPage !==totalPages) e.currentTarget.style.filter = "brightness(110%)"}}
              onMouseLeave={e => { if(currentPage !==totalPages) e.currentTarget.style.filter = "brightness(100%)"}}
            >
              Next
            </button>
          </div>
        </>
      )}

      {formVisible && (
        <form style={{
          marginTop: 20,
          padding: 24,
          borderRadius: 12,
          background: "linear-gradient(135deg, #ffaf7b, #ff7f50)",
          boxShadow: "0 8px 20px rgba(255,127,80,0.4)",
          fontFamily,
          color: "white",
        }} onSubmit={handleSubmit} noValidate>
          <h2 style={{ marginBottom: 24, fontWeight: "700" }}>
            {formData.$id ? "Edit Tugas" : "Tambah Tugas"}
          </h2>
          
          <label style={{ fontWeight: "600", fontSize: 14, display: "block" }}>
            Judul:
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                marginTop: 6,
                marginBottom: 16,
                borderRadius: 8,
                border: "none",
                fontSize: 16,
                fontFamily,
                boxSizing: "border-box",
              }}
              disabled={formLoading}
              placeholder="Masukkan judul tugas"
              autoComplete="off"
            />
          </label>
          
          <label style={{ fontWeight: "600", fontSize: 14, display: "block" }}>
            Deskripsi:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              style={{
                width: "100%",
                padding: "10px 12px",
                marginTop: 6,
                marginBottom: 16,
                borderRadius: 8,
                border: "none",
                fontSize: 16,
                fontFamily,
                boxSizing: "border-box",
                resize: "vertical",
                minHeight: 80,
              }}
              disabled={formLoading}
              placeholder="Masukkan deskripsi tugas"
            />
          </label>
          
          <label style={{ fontWeight: "600", fontSize: 14, display: "block" }}>
            Deadline:
            <input
              type="datetime-local"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              required
              disabled={formLoading}
              style={{
                width: "100%",
                padding: "10px 12px",
                marginTop: 6,
                marginBottom: 16,
                borderRadius: 8,
                border: "none",
                fontSize: 16,
                fontFamily,
                boxSizing: "border-box",
              }}
            />
          </label>
          
          <label style={{ fontWeight: "600", fontSize: 14, display: "block" }}>
            Status:
            <select
              name="status_code"
              value={formData.status_code}
              onChange={handleChange}
              disabled={formLoading}
              style={{
                width: "100%",
                padding: "10px 12px",
                marginTop: 6,
                marginBottom: 16,
                borderRadius: 8,
                border: "none",
                fontSize: 16,
                fontFamily,
                boxSizing: "border-box",
              }}
            >
              {Object.entries(statusMapping).map(([key, val]) => (
                <option key={key} value={key}>
                  {val}
                </option>
              ))}
            </select>
          </label>
          
          <button 
            type="submit" 
            disabled={formLoading} 
            style={{
              padding: "12px",
              width: "100%", 
              borderRadius: 8,
              backgroundColor: "#FF7F50",
              color: "white",
              fontWeight: "700",
              fontSize: 16,
              cursor: "pointer",
              boxShadow: "0 4px 8px rgba(255,127,80,0.4)",
              border: "none",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.filter = "brightness(110%)"}
            onMouseLeave={e => e.currentTarget.style.filter = "brightness(100%)"}
          >
            {formLoading ? "Menyimpan..." : "Simpan"}
          </button>
          
          <button
            type="button"
            onClick={handleCancel}
            disabled={formLoading}
            style={{
              padding: "12px",
              width: "100%", 
              borderRadius: 8,
              backgroundColor: "#555",
              color: "white",
              fontWeight: "700",
              fontSize: 16,
              cursor: "pointer",
              boxShadow: "none",
              border: "none",
              marginTop: 8,
              transition: "all 0.3s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.filter = "brightness(110%)"}
            onMouseLeave={e => e.currentTarget.style.filter = "brightness(100%)"}
          >
            Batal
          </button>
        </form>
      )}
    </div>
  );
}
