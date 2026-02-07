"use client";

type StatusType = "success" | "pending" | "failed" | "active" | "inactive";

const statusStyles: Record<StatusType, string> = {
  success: "border-green-500/30 bg-green-500/10 text-green-400",
  pending: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
  failed: "border-red-500/30 bg-red-500/10 text-red-400",
  active: "border-green-500/30 bg-green-500/10 text-green-400",
  inactive: "border-white/20 bg-white/5 text-white/50",
};

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label ?? status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
