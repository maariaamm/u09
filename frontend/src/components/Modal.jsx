// src/components/Modal.jsx
import React from "react";

/**
 * Enkel modal / overlay component.
 * Props:
 * - open: boolean
 * - onClose: function
 * - children
 */
export default function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        className="modal-content"
        style={{
          background: "#fff",
          padding: "1.5rem",
          borderRadius: 8,
          maxWidth: "90vw",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          aria-label="Close"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 16,
            fontSize: 20,
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}