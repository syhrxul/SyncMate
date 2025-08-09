import Dashboard from "./pages/Dashboard";
import InputData from "./pages/InputData";
import Laporan from "./pages/Laporan";
import Tugas from "./pages/Tugas";
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
    id: "tugas",
    path: "/tugas",
    label: "Tugas",
    Component: Tugas,
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
