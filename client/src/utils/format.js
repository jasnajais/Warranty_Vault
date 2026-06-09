export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function statusLabel(status) {
  const labels = {
    active: "Active",
    expiring: "Expiring Soon",
    expired: "Expired",
  };
  return labels[status] || status;
}

export function daysLeftText(daysLeft, status) {
  if (status === "expired") return `Expired ${Math.abs(daysLeft)} days ago`;
  if (daysLeft === 0) return "Expires today";
  if (daysLeft === 1) return "1 day left";
  return `${daysLeft} days left`;
}
