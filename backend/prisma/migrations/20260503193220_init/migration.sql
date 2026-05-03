-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('STOCK', 'BOND', 'MUTUAL_FUND', 'ETF', 'CASH', 'OTHER');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('BUY', 'SELL');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "asset_name" VARCHAR(100) NOT NULL,
    "symbol" VARCHAR(20) NOT NULL,
    "asset_type" "AssetType" NOT NULL,
    "quantity" DECIMAL(18,4) NOT NULL,
    "purchase_price" DECIMAL(18,4) NOT NULL,
    "current_price" DECIMAL(18,4) NOT NULL,
    "purchase_date" DATE NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "investments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "investment_id" UUID,
    "transaction_type" "TransactionType" NOT NULL,
    "quantity" DECIMAL(18,4) NOT NULL,
    "price" DECIMAL(18,4) NOT NULL,
    "transaction_date" DATE NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_investments_user_id" ON "investments"("user_id");

-- CreateIndex
CREATE INDEX "idx_investments_symbol" ON "investments"("symbol");

-- CreateIndex
CREATE INDEX "idx_transactions_user_id" ON "transactions"("user_id");

-- CreateIndex
CREATE INDEX "idx_transactions_date" ON "transactions"("transaction_date" DESC);

-- AddForeignKey
ALTER TABLE "investments" ADD CONSTRAINT "investments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_investment_id_fkey" FOREIGN KEY ("investment_id") REFERENCES "investments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
