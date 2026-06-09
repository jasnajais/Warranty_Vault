const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");

const dataDir = path.join(__dirname, "../data");
const dataFile = path.join(dataDir, "warranties.json");

function ensureStore() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, "[]", "utf-8");
}

function readAll() {
  ensureStore();
  return JSON.parse(fs.readFileSync(dataFile, "utf-8"));
}

function writeAll(items) {
  ensureStore();
  fs.writeFileSync(dataFile, JSON.stringify(items, null, 2), "utf-8");
}

function findAll() {
  return readAll().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function findById(id) {
  return readAll().find((item) => item._id === id) || null;
}

function create(data) {
  const items = readAll();
  const item = {
    _id: randomUUID(),
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  items.push(item);
  writeAll(items);
  return item;
}

function update(id, data) {
  const items = readAll();
  const index = items.findIndex((item) => item._id === id);
  if (index === -1) return null;
  items[index] = {
    ...items[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  writeAll(items);
  return items[index];
}

function remove(id) {
  const items = readAll();
  const filtered = items.filter((item) => item._id !== id);
  if (filtered.length === items.length) return null;
  writeAll(filtered);
  return true;
}

module.exports = { findAll, findById, create, update, remove };
