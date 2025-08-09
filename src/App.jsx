import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import InputData from "./pages/InputData";
import Laporan from "./pages/Laporan";
import TugasTerdekat from "./pages/TugasTerdekat";
import RiwayatTugas from "./pages/RiwayatTugas";
import Nilai from "./pages/Nilai";
import Jadwal from "./pages/Jadwal";
import Kegiatan from "./pages/Kegiatan";
import Kontrol from "./pages/Kontrol";

export default function App() {
  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Montserrat', sans-serif" }}>
      <Sidebar />
      <main style={{ flexGrow: 1, padding: 24, overflowY: "auto" }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/input" element={<InputData />} />
          <Route path="/laporan" element={<Laporan />} />
          <Route path="/tugas-terdekat" element={<TugasTerdekat />} />
          <Route path="/riwayat-tugas" element={<RiwayatTugas />} />
          <Route path="/nilai" element={<Nilai />} />
          <Route path="/jadwal" element={<Jadwal />} />
          <Route path="/kegiatan" element={<Kegiatan />} />
          <Route path="/kontrol" element={<Kontrol />} />
        </Routes>
      </main>
    </div>
  );
}
