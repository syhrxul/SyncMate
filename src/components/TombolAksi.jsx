import React from "react";

const btnStyle = {
  padding: "8px 16px",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: "600",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  transition: "all 0.3s ease",
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

const TombolAksi = ({ onEdit, onDelete, disabled }) => {
  return (
    <>
      <button style={editBtnStyle} onClick={onEdit} disabled={disabled}>
        Edit
      </button>
      <button style={delBtnStyle} onClick={onDelete} disabled={disabled}>
        Hapus
      </button>
    </>
  );
};

export default TombolAksi;
