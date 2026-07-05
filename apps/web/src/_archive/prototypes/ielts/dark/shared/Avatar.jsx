import React from "react";

export function Avatar({ name, src, size = 10 }) {
  return src ? (
    <img src={src} className={`w-${size} h-${size} rounded-full object-cover`} alt={name} />
  ) : (
    <div
      className={`w-${size} h-${size} rounded-full flex items-center justify-center font-bold text-white text-sm`}
      style={{ background: "linear-gradient(135deg,#e05,#f90)" }}
    >
      {name?.[0]?.toUpperCase()}
    </div>
  );
}
