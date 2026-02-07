const statusMap: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  success: { bg: "#00d6bd20", text: "#008a7a", dot: "#00d6bd", label: "Success" },
  active: { bg: "#00d6bd20", text: "#008a7a", dot: "#00d6bd", label: "Active" },
  pending: { bg: "#ffaa0020", text: "#996600", dot: "#ffaa00", label: "Pending" },
  failed: { bg: "#ff444420", text: "#cc0000", dot: "#ff4444", label: "Failed" },
  inactive: { bg: "#00000010", text: "#666666", dot: "#999999", label: "Inactive" },
};

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusMap[status] ?? statusMap.pending!;

  return (
    <span
      className="neo-pill"
      style={{
        borderColor: config.dot,
        backgroundColor: config.bg,
        color: config.text,
      }}
    >
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ backgroundColor: config.dot }}
      />
      {config.label}
    </span>
  );
}
