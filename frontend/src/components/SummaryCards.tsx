import type { PortfolioSummary } from "../types/index.js";

function fmtMoney(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

function fmtPct(n: number) {
  return `${n.toFixed(2)}%`;
}

export function SummaryCards({ summary }: { summary: PortfolioSummary | null }) {
  if (!summary) return null;

  const gl = summary.totalGainLoss;
  const glClass = gl > 0 ? "pos" : gl < 0 ? "neg" : "";

  return (
    <section className="card-grid">
      <article className="card">
        <h3>Total portfolio value</h3>
        <p className="metric">{fmtMoney(summary.totalPortfolioValue)}</p>
      </article>
      <article className="card">
        <h3>Total purchase cost</h3>
        <p className="metric">{fmtMoney(summary.totalPurchaseCost)}</p>
      </article>
      <article className="card">
        <h3>Total gain/loss</h3>
        <p className={`metric ${glClass}`}>{fmtMoney(summary.totalGainLoss)}</p>
      </article>
      <article className="card">
        <h3>Total gain/loss %</h3>
        <p className={`metric ${glClass}`}>{fmtPct(summary.totalGainLossPercent)}</p>
      </article>
      <article className="card">
        <h3>Number of investments</h3>
        <p className="metric">{summary.investmentCount}</p>
      </article>
      <article className="card">
        <h3>Calculated at</h3>
        <p className="metric small">{new Date(summary.calculatedAt).toLocaleString()}</p>
      </article>
    </section>
  );
}
