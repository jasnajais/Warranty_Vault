import { useCallback, useEffect, useState } from "react";
import StatsCards from "./components/StatsCards";
import WarrantyCard from "./components/WarrantyCard";
import WarrantyForm from "./components/WarrantyForm";
import {
  createWarranty,
  deleteWarranty,
  fetchStats,
  fetchWarranties,
  updateWarranty,
} from "./services/api";

import "./App.css";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "expiring", label: "Expiring Soon" },
  { value: "expired", label: "Expired" },
];

export default function App() {
  const [stats, setStats] = useState({ total: 0, active: 0, expiring: 0, expired: 0 });
  const [warranties, setWarranties] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");



  const loadData = useCallback(async () => {
    try {
      setError("");
      const [statsData, listData] = await Promise.all([
        fetchStats(),
        fetchWarranties({ search, status: filter }),
      ]);
      setStats(statsData);
      setWarranties(listData);
    } catch {
      setError("Could not connect to server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }, [search, filter]);

  useEffect(() => {
    const timer = setTimeout(loadData, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [loadData, search]);

  const handleCreate = async (formData) => {

    setSaving(true);
    try {
      await createWarranty(formData);
      setShowForm(false);
      await loadData();
    } catch {
      setError("Failed to save warranty. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this warranty item?")) return;
    try {
      await deleteWarranty(id);
      await loadData();
    } catch {
      setError("Failed to delete warranty.");
    }
  };

  const handleEditStart = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleUpdate = async (id, formData) => {
    setSaving(true);
    try {
      await updateWarranty(id, formData);
      setShowForm(false);
      setEditingItem(null);
      await loadData();
    } catch {
      setError("Failed to update warranty. Please try again.");
    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div>
            <h1>Warranty Vault</h1>
            <p>Track receipts and never miss a warranty expiry again.</p>
          </div>
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            + Add Warranty
          </button>
        </div>
      </header>

      <main className="main">
        {error && <div className="error-banner">{error}</div>}

        <StatsCards stats={stats} />

        <div className="toolbar">
          <input
            className="search-input"
            type="search"
            placeholder="Search products, stores, notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="filters">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                className={`filter-btn ${filter === f.value ? "active" : ""}`}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="empty-state">Loading...</p>
        ) : warranties.length === 0 ? (
          <div className="empty-state">
            <h3>No warranties yet</h3>
            <p>Add your first product to start tracking expiry dates.</p>
            <button className="btn-primary" onClick={() => setShowForm(true)}>
              Add Warranty
            </button>
          </div>
        ) : (
          <div className="warranty-grid">
            {warranties.map((item) => (
              <WarrantyCard
                key={item._id}
                item={item}
                onDelete={handleDelete}
                onUpdate={handleEditStart}
              />
            ))}

          </div>
        )}
      </main>

      {showForm && (
        <WarrantyForm
          onSubmit={(formData) =>
            editingItem ? handleUpdate(editingItem._id, formData) : handleCreate(formData)
          }

          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
          loading={saving}
          initialData={editingItem}
          title={editingItem ? "Update Warranty" : "Add Warranty"}
          submitLabel={editingItem ? "Update Warranty" : "Save Warranty"}
        />
      )}

    </div>
  );
}
