import { useState } from "react";

const empty = {
  productName: "",
  store: "",
  purchaseDate: "",
  warrantyMonths: "12",
  notes: "",
  receipt: null,
};

export default function WarrantyForm({ onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(empty);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "receipt" && files?.[0]) {
      setForm((f) => ({ ...f, receipt: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
      return;
    }
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("productName", form.productName);
    data.append("store", form.store);
    data.append("purchaseDate", form.purchaseDate);
    data.append("warrantyMonths", form.warrantyMonths);
    data.append("notes", form.notes);
    if (form.receipt) data.append("receipt", form.receipt);
    onSubmit(data);
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Add Warranty</h2>
        <p className="modal-sub">Store receipt details and track expiry dates.</p>

        <form onSubmit={handleSubmit} className="form">
          <label>
            Product name *
            <input
              name="productName"
              value={form.productName}
              onChange={handleChange}
              placeholder="e.g. iPhone 15, Samsung TV"
              required
            />
          </label>

          <label>
            Store / Seller
            <input
              name="store"
              value={form.store}
              onChange={handleChange}
              placeholder="e.g. Amazon, Croma"
            />
          </label>

          <div className="form-row">
            <label>
              Purchase date *
              <input
                type="date"
                name="purchaseDate"
                value={form.purchaseDate}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Warranty (months) *
              <select
                name="warrantyMonths"
                value={form.warrantyMonths}
                onChange={handleChange}
                required
              >
                {[6, 12, 18, 24, 36, 60].map((m) => (
                  <option key={m} value={m}>
                    {m} months
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label>
            Notes
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Serial number, invoice number, etc."
            />
          </label>

          <label>
            Receipt (image or PDF)
            <input
              type="file"
              name="receipt"
              accept="image/*,.pdf"
              onChange={handleChange}
            />
          </label>

          {preview && (
            <div className="receipt-preview">
              <img src={preview} alt="Receipt preview" />
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Save Warranty"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
