const EXPIRING_SOON_DAYS = 30;

function addMonths(date, months) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function getExpiryDate(purchaseDate, warrantyMonths) {
  return addMonths(new Date(purchaseDate), warrantyMonths);
}

function getWarrantyStatus(purchaseDate, warrantyMonths) {
  const expiry = getExpiryDate(purchaseDate, warrantyMonths);
  const now = new Date();
  const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) return { status: "expired", daysLeft, expiryDate: expiry };
  if (daysLeft <= EXPIRING_SOON_DAYS) {
    return { status: "expiring", daysLeft, expiryDate: expiry };
  }
  return { status: "active", daysLeft, expiryDate: expiry };
}

module.exports = { getExpiryDate, getWarrantyStatus, EXPIRING_SOON_DAYS };
