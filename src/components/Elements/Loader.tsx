"use client";

import React from "react";

interface LoaderProps {
  fullPage?: boolean;
  text?: string;
  minHeight?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  fullPage = false,
  text,
  minHeight = "350px",
}) => {
  const spinner = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        padding: "24px",
      }}
    >
      <style>{`
        @keyframes jspSpinAnimation {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          border: "4px solid rgba(90, 170, 70, 0.15)",
          borderTopColor: "#5aaa46",
          borderRightColor: "#f5821e",
          animation: "jspSpinAnimation 0.85s cubic-bezier(0.6, 0.2, 0.4, 0.8) infinite",
        }}
      />
      {text && (
        <p
          style={{
            fontSize: "15px",
            fontWeight: 500,
            color: "#434343",
            margin: 0,
            letterSpacing: "0.3px",
            fontFamily: "var(--font-primary), sans-serif",
          }}
        >
          {text}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          zIndex: 99999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-live="polite"
        role="status"
      >
        {spinner}
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        minHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-live="polite"
      role="status"
    >
      {spinner}
    </div>
  );
};

export default Loader;
