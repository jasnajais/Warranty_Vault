const express = require("express");
const store = require("../store");
const upload = require("../middleware/upload");
const { getWarrantyStatus } = require("../utils/status");

const router = express.Router();

function enrichWarranty(item) {
  const { status, daysLeft, expiryDate } = getWarrantyStatus(
    item.purchaseDate,
    item.warrantyMonths
  );
  return { ...item, status, daysLeft, expiryDate };
}

router.get("/stats", (_req, res) => {
  const stats = { total: 0, active: 0, expiring: 0, expired: 0 };
  store.findAll().forEach((item) => {
    const { status } = getWarrantyStatus(item.purchaseDate, item.warrantyMonths);
    stats.total += 1;
    stats[status] += 1;
  });
  res.json(stats);
});

router.get("/", (req, res) => {
  const { search = "", status = "all" } = req.query;
  let items = store.findAll().map(enrichWarranty);

  if (search) {
    const q = search.toLowerCase();
    items = items.filter(
      (item) =>
        item.productName.toLowerCase().includes(q) ||
        item.store.toLowerCase().includes(q) ||
        item.notes.toLowerCase().includes(q)
    );
  }

  if (status !== "all") {
    items = items.filter((item) => item.status === status);
  }

  res.json(items);
});

router.get("/:id", (req, res) => {
  const item = store.findById(req.params.id);
  if (!item) return res.status(404).json({ error: "Warranty not found" });
  res.json(enrichWarranty(item));
});

router.post("/", upload.single("receipt"), (req, res) => {
  const { productName, store: storeName, purchaseDate, warrantyMonths, notes } = req.body;

  if (!productName || !purchaseDate || !warrantyMonths) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const warranty = store.create({
    productName,
    store: storeName || "",
    purchaseDate: new Date(purchaseDate).toISOString(),
    warrantyMonths: Number(warrantyMonths),
    notes: notes || "",
    receiptImage: req.file ? `/uploads/${req.file.filename}` : "",
  });

  res.status(201).json(enrichWarranty(warranty));
});

router.put("/:id", upload.single("receipt"), (req, res) => {
  const updates = { ...req.body };

  if (updates.purchaseDate) {
    updates.purchaseDate = new Date(updates.purchaseDate).toISOString();
  }
  if (updates.warrantyMonths) {
    updates.warrantyMonths = Number(updates.warrantyMonths);
  }
  if (req.file) {
    updates.receiptImage = `/uploads/${req.file.filename}`;
  }

  const warranty = store.update(req.params.id, updates);
  if (!warranty) return res.status(404).json({ error: "Warranty not found" });
  res.json(enrichWarranty(warranty));
});

router.delete("/:id", (req, res) => {
  const deleted = store.remove(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Warranty not found" });
  res.json({ message: "Warranty deleted" });
});

module.exports = router;
