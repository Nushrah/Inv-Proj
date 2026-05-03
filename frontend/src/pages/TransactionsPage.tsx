import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/client.js";
import { Navbar } from "../components/Navbar.js";
import { useAuth } from "../context/AuthContext.js";
import type { TransactionRow } from "../types/index.js";

function fmtMoney(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

export default function TransactionsPage() {
  const { token } = useAuth();
  const [rows, setRows] = useState<TransactionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<TransactionRow[]>("/transactions", { method: "GET", token });
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load transactions.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="layout">
      <Navbar />
      <main className="main">
        <div className="page-header">
          <h1>Transaction history</h1>
          <Link to="/dashboard" className="btn ghost">
            Back to dashboard
          </Link>
        </div>

        {loading && <p className="muted">Loading transactions…</p>}
        {error && !loading && <p className="error">{error}</p>}

        {!loading && !error && rows.length === 0 && (
          <div className="empty-state card">
            <p>No transactions yet.</p>
          </div>
        )}

        {!loading && !error && rows.length > 0 && (
          <div className="table-wrap card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Asset name</th>
                  <th>Symbol</th>
                  <th>Transaction type</th>
                  <th className="num">Quantity</th>
                  <th className="num">Price</th>
                  <th className="num">Total amount</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((t) => (
                  <tr key={t.id}>
                    <td>{t.transactionDate}</td>
                    <td>{t.assetName}</td>
                    <td>{t.symbol}</td>
                    <td>{t.transactionType}</td>
                    <td className="num">{t.quantity}</td>
                    <td className="num">{fmtMoney(t.price)}</td>
                    <td className="num">{fmtMoney(t.totalAmount)}</td>
                    <td className="small">{t.notes ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
