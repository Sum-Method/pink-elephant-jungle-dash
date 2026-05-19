import React from "react";

export function Icon({ label, size = 14 }) {
  return <span aria-hidden="true" style={{ fontSize: size, lineHeight: 1 }}>{label}</span>;
}
