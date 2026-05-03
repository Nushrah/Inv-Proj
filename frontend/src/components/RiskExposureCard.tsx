import type { PortfolioSummary } from "../types/index.js";

export function RiskExposureCard({ summary }: { summary: PortfolioSummary | null }) {
  if (!summary) return null;
  const r = summary.riskExposure;

  return (
    <section className="card risk-card">
      <h2>Portfolio Risk Exposure</h2>
      <p className={`risk-badge risk-${r.riskLevel.toLowerCase()}`}>Risk level: {r.riskLevel}</p>
      {r.highestExposureAssetType !== null && (
        <p className="risk-line">
          <strong>Highest exposure:</strong> {r.highestExposureAssetType} — {r.highestExposurePercent.toFixed(1)}%
        </p>
      )}
      <p className="risk-message">
        <strong>Insight:</strong> {r.message}
      </p>
      {summary.allocationByType.length > 0 && (
        <ul className="alloc-list">
          {summary.allocationByType.map((a) => (
            <li key={a.assetType}>
              <span>{a.assetType}</span>
              <span>
                {a.percentage.toFixed(1)}% ({a.value.toLocaleString(undefined, { style: "currency", currency: "USD" })})
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
