import { useEffect, useState, type FormEvent } from "react";
import { ASSET_TYPES, type AssetType, type InvestmentRow } from "../types/index.js";

type Mode = "add" | "edit";

const empty = {
  assetName: "",
  symbol: "",
  assetType: "STOCK" as AssetType,
  quantity: "" as string | number,
  purchasePrice: "" as string | number,
  currentPrice: "" as string | number,
  purchaseDate: "",
  notes: "",
};

export function InvestmentForm({
  mode,
  initial,
  onClose,
  onSubmit,
}: {
  mode: Mode;
  initial: InvestmentRow | null;
  onClose: () => void;
  onSubmit: (payload: Record<string, unknown>) => Promise<void>;
}) {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode === "edit" && initial) {
      setForm({
        assetName: initial.assetName,
        symbol: initial.symbol,
        assetType: initial.assetType,
        quantity: initial.quantity,
        purchasePrice: initial.purchasePrice,
        currentPrice: initial.currentPrice,
        purchaseDate: initial.purchaseDate,
        notes: initial.notes ?? "",
      });
    } else {
      setForm({
        ...empty,
        purchaseDate: new Date().toISOString().slice(0, 10),
      });
    }
  }, [mode, initial]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const qty = Number(form.quantity);
    const pp = Number(form.purchasePrice);
    const cp = Number(form.currentPrice);
    if (!(qty > 0)) {
      setError("Quantity must be greater than 0.");
      return;
    }
    if (pp < 0 || cp < 0) {
      setError("Prices cannot be negative.");
      return;
    }
    setSaving(true);
    try {
      await onSubmit({
        assetName: form.assetName.trim(),
        symbol: form.symbol.trim(),
        assetType: form.assetType,
        quantity: qty,
        purchasePrice: pp,
        currentPrice: cp,
        purchaseDate: form.purchaseDate,
        notes: form.notes.trim() || null,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="inv-form-title"
        onMouseDown={(ev) => ev.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="inv-form-title">{mode === "add" ? "Add investment" : "Edit investment"}</h2>
          <button type="button" className="btn icon" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Asset name
            <input
              required
              value={form.assetName}
              onChange={(e) => setForm((f) => ({ ...f, assetName: e.target.value }))}
            />
          </label>
          <label>
            Symbol
            <input
              required
              maxLength={20}
              value={form.symbol}
              onChange={(e) => setForm((f) => ({ ...f, symbol: e.target.value }))}
            />
          </label>
          <label>
            Asset type
            <select
              value={form.assetType}
              onChange={(e) => setForm((f) => ({ ...f, assetType: e.target.value as AssetType }))}
            >
              {ASSET_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label>
            Quantity
            <input
              required
              type="number"
              step="any"
              min="0.0000001"
              value={form.quantity}
              onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
            />
          </label>
          <label>
            Purchase price
            <input
              required
              type="number"
              step="any"
              min="0"
              value={form.purchasePrice}
              onChange={(e) => setForm((f) => ({ ...f, purchasePrice: e.target.value }))}
            />
          </label>
          <label>
            Current price
            <input
              required
              type="number"
              step="any"
              min="0"
              value={form.currentPrice}
              onChange={(e) => setForm((f) => ({ ...f, currentPrice: e.target.value }))}
            />
          </label>
          <label>
            Purchase date
            <input
              required
              type="date"
              value={form.purchaseDate}
              onChange={(e) => setForm((f) => ({ ...f, purchaseDate: e.target.value }))}
            />
          </label>
          <label className="full">
            Notes
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            />
          </label>
          {error && <p className="error full">{error}</p>}
          <div className="modal-actions full">
            <button type="button" className="btn ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn primary" disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
