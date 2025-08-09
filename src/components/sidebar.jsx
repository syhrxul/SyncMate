import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaMoneyBillWave,
  FaBook,
  FaCalendarAlt,
  FaChevronDown,
  FaChevronUp,
  FaHome,
} from "react-icons/fa";
import { CgController } from "react-icons/cg";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: <FaHome />, path: "/" },
  {
    id: "keuangan",
    label: "Keuangan",
    icon: <FaMoneyBillWave />,
    submenu: [
      { id: "input", label: "Input Data", path: "/input" },
      { id: "laporan", label: "Laporan", path: "/laporan" },
    ],
  },
  {
    id: "kuliah",
    label: "Kuliah",
    icon: <FaBook />,
    submenu: [
      { id: "tugas", label: "Tugas", path: "/tugas" },
      { id: "nilai", label: "Nilai", path: "/nilai" },
      { id: "jadwal", label: "Jadwal", path: "/jadwal" },
    ],
  },
  { id: "kegiatan", label: "Kegiatan", icon: <FaCalendarAlt />, path: "/kegiatan" },
  { id: "kontrol", label: "Kontrol", icon: <CgController />, path: "/kontrol" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [openDropdown, setOpenDropdown] = useState(null);

  // Buka dropdown jika submenu aktif berdasarkan URL
  useEffect(() => {
    const menuWithActiveSubmenu = menuItems.find((menu) =>
      menu.submenu?.some((sub) => sub.path === location.pathname)
    );
    if (menuWithActiveSubmenu) {
      setOpenDropdown(menuWithActiveSubmenu.id);
    } else {
      setOpenDropdown(null);
    }
  }, [location.pathname]);

  const handleMenuClick = (item) => {
    if (item.submenu) {
      setOpenDropdown(openDropdown === item.id ? null : item.id);
    } else {
      navigate(item.path);
    }
  };

  const handleSubmenuClick = (sub) => {
    navigate(sub.path);
  };

  return (
    <aside style={styles.sidebar}>
      <h2 style={styles.logo}>SyncMate</h2>
      <nav style={styles.nav}>
        {menuItems.map(({ id, label, icon, submenu, path }) => {
          const isActive = location.pathname === path;
          const isOpen = openDropdown === id;

          return (
            <div key={id}>
              <motion.button
                onClick={() => handleMenuClick({ id, submenu, path })}
                initial={false}
                animate={isActive ? "active" : "inactive"}
                variants={menuItemVariants}
                style={{ ...styles.menuItem, justifyContent: "space-between" }}
                aria-expanded={isOpen}
                aria-controls={submenu ? `${id}-submenu` : undefined}
              >
                <span style={styles.menuLeft}>
                  <span style={styles.icon}>{icon}</span>
                  <span>{label}</span>
                </span>
                {submenu && (
                  <span style={styles.chevron}>
                    {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                  </span>
                )}
              </motion.button>

              <AnimatePresence>
                {submenu && isOpen && (
                  <motion.div
                    key="submenu"
                    id={`${id}-submenu`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={styles.submenuWrapper}
                  >
                    {submenu.map((sub) => {
                      const subIsActive = location.pathname === sub.path;
                      return (
                        <motion.button
                          key={sub.id}
                          onClick={() => handleSubmenuClick(sub)}
                          initial={false}
                          animate={subIsActive ? "active" : "inactive"}
                          variants={submenuItemVariants}
                          style={styles.submenuItem}
                        >
                          {sub.label}
                        </motion.button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

const menuItemVariants = {
  active: {
    background: "rgba(255, 127, 80, 0.3)",
    color: "#FF5722",
    boxShadow: "0 8px 24px rgba(255, 87, 34, 0.3)",
    backdropFilter: "blur(8px)",
    transition: { duration: 0.4, ease: "easeInOut" },
  },
  inactive: {
    background: "transparent",
    color: "#4b5563",
    boxShadow: "none",
    backdropFilter: "none",
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

const submenuItemVariants = {
  active: {
    background: "rgba(255, 160, 122, 0.4)",
    color: "#E64A19",
    boxShadow: "0 4px 16px rgba(230, 74, 25, 0.3)",
    backdropFilter: "blur(6px)",
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  inactive: {
    background: "transparent",
    color: "#6b7280",
    boxShadow: "none",
    backdropFilter: "none",
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

const styles = {
  sidebar: {
    width: 180,
    height: "100vh",
    backgroundColor: "#fff",
    color: "#1f2937",
    display: "flex",
    flexDirection: "column",
    padding: 0,
    margin: 0,
    boxSizing: "border-box",
    fontFamily: "'Montserrat', sans-serif",
    borderRight: "1px solid #e5e7eb",
  },
  logo: {
    fontSize: 26,
    fontWeight: "700",
    margin: 0,
    padding: "24px 20px",
    letterSpacing: 1.2,
    borderBottom: "1px solid #e5e7eb",
    color: "#111827",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 0,
    margin: 0,
    padding: 0,
    flexGrow: 1,
  },
  menuItem: {
    background: "none",
    border: "none",
    fontSize: 16,
    padding: "14px 16px 14px 20px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    borderRadius: "12px",
    userSelect: "none",
    outline: "none",
  },
  menuLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  icon: {
    fontSize: 20,
    minWidth: 24,
  },
  chevron: {
    fontSize: 14,
  },
  submenuWrapper: {
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    marginLeft: 36,
    marginTop: 4,
  },
  submenuItem: {
    background: "none",
    border: "none",
    fontSize: 15,
    padding: "10px 12px 10px 20px",
    textAlign: "left",
    cursor: "pointer",
    borderRadius: "10px",
    userSelect: "none",
    outline: "none",
  },
};
