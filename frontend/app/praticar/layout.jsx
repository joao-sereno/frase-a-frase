
"use client";

import ProtectedRoute from "../../components/ProtectedRoute";

export default function PraticarLayout({ children }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}
