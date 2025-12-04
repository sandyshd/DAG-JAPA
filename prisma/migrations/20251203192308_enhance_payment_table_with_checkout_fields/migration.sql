-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "billingDetails" JSONB,
ADD COLUMN     "customerAddress" JSONB,
ADD COLUMN     "customerEmail" TEXT,
ADD COLUMN     "customerName" TEXT,
ADD COLUMN     "paymentMethodId" TEXT,
ADD COLUMN     "receiptNumber" TEXT,
ADD COLUMN     "refundAmount" INTEGER,
ADD COLUMN     "refundReason" TEXT,
ADD COLUMN     "refundStatus" TEXT,
ADD COLUMN     "refundedAt" TIMESTAMP(3),
ADD COLUMN     "stripePaymentIntentId" TEXT,
ALTER COLUMN "paymentMethod" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Payment_customerEmail_idx" ON "Payment"("customerEmail");
