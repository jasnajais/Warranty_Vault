import { formatDate, statusLabel, daysLeftText } from "../utils/format";

export default function WarrantyCard({ item, onDelete }) {
  const isPdf = item.receiptImage?.endsWith(".pdf");

  return (
    <article className={`warranty-card status-${item.status}`}>
      <div className="card-header">
        <div>
          <h3>{item.productName}</h3>
          {item.store && <p className="store">{item.store}</p>}
        </div>
        <span className={`badge badge-${item.status}`}>{statusLabel(item.status)}</span>
      </div>

      <div className="card-body">
        {item.receiptImage && (
          <div className="receipt-thumb">
            {isPdf ? (
              <a href={item.receiptImage} target="_blank" rel="noreferrer" className="pdf-link">
                View PDF
              </a>
            ) : (
              <a href={item.receiptImage} target="_blank" rel="noreferrer">
                <img src={item.receiptImage} alt="Receipt" />
              </a>
            )}
          </div>
        )}

        <div className="card-details">
          <div className="detail">
            <span className="detail-label">Purchased</span>
            <span>{formatDate(item.purchaseDate)}</span>
          </div>
          <div className="detail">
            <span className="detail-label">Expires</span>
            <span>{formatDate(item.expiryDate)}</span>
          </div>
          <div className="detail">
            <span className="detail-label">Warranty</span>
            <span>{item.warrantyMonths} months</span>
          </div>
          <div className="detail highlight">
            <span className="detail-label">Status</span>
            <span>{daysLeftText(item.daysLeft, item.status)}</span>
          </div>
          {item.notes && (
            <div className="detail notes">
              <span className="detail-label">Notes</span>
              <span>{item.notes}</span>
            </div>
          )}
        </div>
      </div>

      <div className="card-footer">
        <button className="btn-danger" onClick={() => onDelete(item._id)}>
          Delete
        </button>
      </div>
    </article>
  );
}
