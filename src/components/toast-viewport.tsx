"use client";

import { Toaster } from "sonner";

export function ToastViewport() {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        style: {
          background: "var(--surface)",
          color: "var(--ink)",
          border: "1px solid var(--line-strong)",
          borderRadius: "12px",
          fontFamily: "var(--font-geist), system-ui, sans-serif",
        },
      }}
    />
  );
}
