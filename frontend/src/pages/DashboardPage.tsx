import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../api/client.js";
import { InvestmentForm } from "../components/InvestmentForm.js";
import { InvestmentTable } from "../components/InvestmentTable.js";
import { Navbar } from "../components/Navbar.js";
import { RiskExposureCard } from "../components/RiskExposureCard.js";
import { SummaryCards } from "../components/SummaryCards.js";
import { useAuth } from "../context/AuthContext.js";
import type { InvestmentRow, PortfolioSummary } from "../types/index.js";

export default function DashboardPage() {
  const { token } = useAuth();
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [rows, setRows] = useState<InvestmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<{ mode: "add" | "edit"; row: InvestmentRow | null } | null>(null);
  const [saveOk, setSaveOk] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [s, inv] = await Promise.all([
        apiFetch<PortfolioSummary>("/portfolio/summary", { method: "GET", token }),
        apiFetch<InvestmentRow[]>("/investments", { method: "GET", token }),
      ]);
      setSummary(s);
      setRows(Array.isArray(inv) ? inv : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load portfolio. Please try again.");
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
          <h1>Portfolio overview</h1>
          <button
            type="button"
            className="btn primary"
            onClick={() => {
              setSaveOk(null);
              setModal({ mode: "add", row: null });
            }}
          >
            Add investment
          </button>
        </div>

        {saveOk && (
          <p className="success banner" role="status">
            {saveOk}
          </p>
        )}

        {loading && <p className="muted">Loading portfolio…</p>}
        {error && !loading && <p className="error">{error}</p>}

        {!loading && !error && (
          <>
            <SummaryCards summary={summary} />
            <RiskExposureCard summary={summary} />
            <section className="section">
              <h2>Investments</h2>
              <InvestmentTable
                rows={rows}
                onEdit={(row) => {
                  setSaveOk(null);
                  setModal({ mode: "edit", row });
                }}
              />
            </section>
          </>
        )}
      </main>

      {modal && (
        <InvestmentForm
          mode={modal.mode}
          initial={modal.row}
          onClose={() => setModal(null)}
          onSubmit={async (payload) => {
            if (!token) return;
            if (modal.mode === "add") {
              await apiFetch<{ message: string }>("/investments", {
                method: "POST",
                token,
                body: JSON.stringify(payload),
              });
              setSaveOk("Investment saved successfully.");
            } else if (modal.row) {
              await apiFetch<{ message: string }>(`/investments/${modal.row.id}`, {
                method: "PUT",
                token,
                body: JSON.stringify(payload),
              });
              setSaveOk("Investment saved successfully.");
            }
            await load();
            window.setTimeout(() => setSaveOk(null), 5000);
          }}
        />
      )}
    </div>
  );
}
