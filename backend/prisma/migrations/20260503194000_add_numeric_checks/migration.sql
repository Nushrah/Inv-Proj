-- PRD: enforce numeric integrity at database layer
ALTER TABLE "investments"
  ADD CONSTRAINT "investments_quantity_positive" CHECK (quantity > 0),
  ADD CONSTRAINT "investments_purchase_price_nonneg" CHECK (purchase_price >= 0),
  ADD CONSTRAINT "investments_current_price_nonneg" CHECK (current_price >= 0);

ALTER TABLE "transactions"
  ADD CONSTRAINT "transactions_quantity_positive" CHECK (quantity > 0),
  ADD CONSTRAINT "transactions_price_nonneg" CHECK (price >= 0);
