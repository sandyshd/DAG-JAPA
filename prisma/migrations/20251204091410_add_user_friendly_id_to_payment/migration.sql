-- Add userFriendlyId column to Payment table to store the plain format user ID (e.g., USR-670329)
ALTER TABLE "Payment" ADD COLUMN "userFriendlyId" TEXT;

-- Create an index for faster lookups
CREATE INDEX "Payment_userFriendlyId_idx" ON "Payment"("userFriendlyId");
