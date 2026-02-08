"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type UserRole = "employer" | "employee" | "verifier" | null;

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole>(null);

  // Load role from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("veilpay_user_role");
    if (stored === "employer" || stored === "employee" || stored === "verifier") {
      setRoleState(stored);
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole) {
      localStorage.setItem("veilpay_user_role", newRole);
    } else {
      localStorage.removeItem("veilpay_user_role");
    }
  };

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
