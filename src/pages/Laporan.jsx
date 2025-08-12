import { useEffect, useState } from "react";
import { databases } from "../lib/appwrite";

const collectionId = "68988680001a4d66863d"; // Keuangan collection
const databaseId = "6897a656003536fecb03";

export default function Laporan() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [summary, setSummary] = useState({
    pemasukan: 0,
    pengeluaran: 0,
    selisih: 0,
  });
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  const fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
  const thtdStyle = { padding: 12, textAlign: "left", borderBottom: "1px solid #eee", color: "#333" };
  const tableStyle = { width: "100%", borderCollapse: "collapse", marginTop: 20, fontFamily, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderRadius: 8, overflow: "hidden" };
  const thStyle = { backgroundColor: "#FF7F50", color: "white", fontWeight: "600", fontSize: 16 };
  const summaryCardStyle = {
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    color: 'white',
    textAlign: 'center',
  };

  useEffect(() => {
    async function fetchAndProcessTransactions() {
      setLoading(true);
      try {
        const response = await databases.listDocuments(databaseId, collectionId);
        setTransactions(response.documents);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAndProcessTransactions();
  }, []);

  useEffect(() => {
    const filtered = transactions.filter(t => {
      const tDate = new Date(t.datetime);
      return tDate.getMonth() + 1 === filter.month && tDate.getFullYear() === filter.year;
    });
    setFilteredTransactions(filtered);

    const pemasukan = filtered.filter(t => t.tipe === 'Pemasukan').reduce((acc, cur) => acc + cur.jumlah, 0);
    const pengeluaran = filtered.filter(t => t.tipe === 'Pengeluaran').reduce((acc, cur) => acc + cur.jumlah, 0);
    setSummary({ pemasukan, pengeluaran, selisih: pemasukan - pengeluaran });
  }, [transactions, filter]);

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: Number(e.target.value) });
  };

  const years = [2023, 2024, 2025];
  const months = [
    { value: 1, name: 'Januari' }, { value: 2, name: 'Februari' }, { value: 3, name: 'Maret' },
    { value: 4, name: 'April' }, { value: 5, name: 'Mei' }, { value: 6, name: 'Juni' },
    { value: 7, name: 'Juli' }, { value: 8, name: 'Agustus' }, { value: 9, name: 'September' },
    { value: 10, name: 'Oktober' }, { value: 11, name: 'November' }, { value: 12, name: 'Desember' },
  ];

  return (
    <div style={{ padding: 24, fontFamily }}>
     <h1 style={{ color: "#FF7F50", marginBottom: 20, fontWeight: "bold", fontSize: 28 }}>
      Laporan Keuangan
      </h1>
      
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'center' }}>
        <div>
          <label style={{ marginRight: 8 }}>Bulan:</label>
          <select name="month" value={filter.month} onChange={handleFilterChange}>
            {months.map(m => <option key={m.value} value={m.value}>{m.name}</option>)}
          </select>
        </div>
        <div>
          <label style={{ marginRight: 8 }}>Tahun:</label>
          <select name="year" value={filter.year} onChange={handleFilterChange}>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: 24 }}>
        <div style={{ ...summaryCardStyle, background: 'linear-gradient(135deg, #66BB6A, #43A047)' }}>
          <h3>Total Pemasukan</h3>
          <p style={{ fontSize: 24, fontWeight: 'bold' }}>
            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(summary.pemasukan)}
          </p>
        </div>
        <div style={{ ...summaryCardStyle, background: 'linear-gradient(135deg, #EF5350, #E53935)' }}>
          <h3>Total Pengeluaran</h3>
          <p style={{ fontSize: 24, fontWeight: 'bold' }}>
            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(summary.pengeluaran)}
          </p>
        </div>
        <div style={{ ...summaryCardStyle, background: 'linear-gradient(135deg, #42A5F5, #1E88E5)' }}>
          <h3>Selisih</h3>
          <p style={{ fontSize: 24, fontWeight: 'bold' }}>
            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(summary.selisih)}
          </p>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Tanggal</th>
              <th style={thStyle}>Tipe</th>
              <th style={thStyle}>Kategori</th>
              <th style={thStyle}>Jumlah</th>
              <th style={thStyle}>Akun</th>
              <th style={thStyle}>Metode</th>
              <th style={thStyle}>Deskripsi</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map(t => (
              <tr key={t.$id} style={{ backgroundColor: t.tipe === 'Pemasukan' ? '#e8f5e9' : '#ffebee' }}>
                <td style={thtdStyle}>{new Date(t.datetime).toLocaleDateString()}</td>
                <td style={thtdStyle}>{t.tipe}</td>
                <td style={thtdStyle}>{t.kategori}</td>
                <td style={{ ...thtdStyle, color: t.tipe === 'Pemasukan' ? 'green' : 'red' }}>
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(t.jumlah)}
                </td>
                <td style={thtdStyle}>{t.akun}</td>
                <td style={thtdStyle}>{t.metode_pembayaran}</td>
                <td style={thtdStyle}>{t.deskripsi}</td>
              </tr>
            ))}
            {filteredTransactions.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: 20 }}>
                  Tidak ada transaksi pada periode ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
