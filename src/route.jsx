import Dashboard from "./pages/Dashboard";
import InputData from "./pages/InputData";
import Laporan from "./pages/Laporan";
import TugasTerdekat from "./pages/TugasTerdekat";
import RiwayatTugas from "./pages/RiwayatTugas";
import Nilai from "./pages/Nilai";
import Jadwal from "./pages/Jadwal";
import Kegiatan from "./pages/Kegiatan";
import Kontrol from "./pages/Kontrol";

const routes = [
  {
    id: "dashboard",
    path: "/",
    label: "Dashboard",
    Component: Dashboard,
  },
  {
    id: "input",
    path: "/input",
    label: "Input Data",
    Component: InputData,
  },
  {
    id: "laporan",
    path: "/laporan",
    label: "Laporan",
    Component: Laporan,
  },
  {
    id: "tugas_terdekat",
    path: "/tugas-terdekat",
    label: "Tugas Terdekat",
    Component: TugasTerdekat,
  },
  {
    id: "riwayat_tugas",
    path: "/riwayat-tugas",
    label: "Riwayat Tugas",
    Component: RiwayatTugas,
  },
  {
    id: "nilai",
    path: "/nilai",
    label: "Nilai",
    Component: Nilai,
  },
  {
    id: "jadwal",
    path: "/jadwal",
    label: "Jadwal",
    Component: Jadwal,
  },
  {
    id: "kegiatan",
    path: "/kegiatan",
    label: "Kegiatan",
    Component: Kegiatan,
  },
  {
    id: "kontrol",
    path: "/kontrol",
    label: "Kontrol",
    Component: Kontrol,
  },
];

export default routes;
