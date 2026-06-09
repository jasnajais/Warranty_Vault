const cards = [
  { key: "total", label: "Total Items", color: "var(--primary)" },
  { key: "active", label: "Active", color: "var(--active)" },
  { key: "expiring", label: "Expiring Soon", color: "var(--expiring)" },
  { key: "expired", label: "Expired", color: "var(--expired)" },
];

export default function StatsCards({ stats }) {
  return (
    <div className="stats-grid">
      {cards.map(({ key, label, color }) => (
        <div key={key} className="stat-card">
          <span className="stat-value" style={{ color }}>
            {stats[key] ?? 0}
          </span>
          <span className="stat-label">{label}</span>
        </div>
      ))}
    </div>
  );
}
