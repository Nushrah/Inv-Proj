import type { InvestmentRow } from "../types/index.js";

function fmtMoney(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

function fmtPct(n: number) {
  return `${n.toFixed(2)}%`;
}

export function InvestmentTable({
  rows,
  onEdit,
}: {
  rows: InvestmentRow[];
  onEdit: (row: InvestmentRow) => void;
}) {
  if (rows.length === 0) {
    return (
      <div className="empty-state card">
        <p>No investments yet. Add your first investment.</p>
      </div>
    );
  }

  return (
    <div className="table-wrap card">
      <table className="data-table">
        <thead>
          <tr>
            <th>Asset name</th>
            <th>Symbol</th>
            <th>Asset type</th>
            <th className="num">Quantity</th>
            <th className="num">Purchase price</th>
            <th className="num">Current price</th>
            <th className="num">Purchase cost</th>
            <th className="num">Current value</th>
            <th className="num">Gain/loss</th>
            <th className="num">Gain/loss %</th>
            <th>Last updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const glc = r.gainLoss > 0 ? "pos" : r.gainLoss < 0 ? "neg" : "";
            return (
              <tr key={r.id}>
                <td>{r.assetName}</td>
                <td>{r.symbol}</td>
                <td>{r.assetType}</td>
                <td className="num">{r.quantity}</td>
                <td className="num">{fmtMoney(r.purchasePrice)}</td>
                <td className="num">{fmtMoney(r.currentPrice)}</td>
                <td className="num">{fmtMoney(r.purchaseCost)}</td>
                <td className="num">{fmtMoney(r.currentValue)}</td>
                <td className={`num ${glc}`}>{fmtMoney(r.gainLoss)}</td>
                <td className={`num ${glc}`}>{fmtPct(r.gainLossPercent)}</td>
                <td className="small">{new Date(r.updatedAt).toLocaleString()}</td>
                <td>
                  <button type="button" className="btn small" onClick={() => onEdit(r)}>
                    Edit
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
