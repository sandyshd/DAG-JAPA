# Stripe Hosted Checkout Implementation - Complete Guide

## Overview
Full Stripe Checkout integration with comprehensive data capture from Stripe's prebuilt hosted checkout. All payment data returned from Stripe Checkout is systematically saved to the Payment table for audit trail, analytics, and customer service purposes.

## Database Schema - Enhanced Payment Model

### Updated Payment Table Fields

```prisma
model Payment {
  id                     String   @id @default(cuid())
  
  // Transaction IDs
  transactionId          String   @unique  // Stripe payment intent ID
  stripePaymentIntentId  String?  // Backup reference to payment intent
  stripeSessionId        String?  @unique // Stripe checkout session ID
  
  // User relationship
  userId                 String
  user                   User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Payment amount and currency
  amount                 Int      // Amount in cents ($150 USD = 15000)
  currency               String   @default("USD")
  
  // Payment method information
  paymentMethod          String?  // "card", "ach_transfer", etc.
  paymentMethodId        String?  // Stripe payment method ID
  paymentStatus          PaymentStatus @default(PENDING)
  
  // Customer details from Stripe Checkout
  stripeCustomerId       String?  // Stripe customer ID
  customerName           String?  // Customer name (from billing)
  customerEmail          String?  // Customer email
  
  // Billing address from payment method
  billingDetails         Json?    // {
                                   //   name: string
                                   //   email: string
                                   //   phone: string
                                   //   address: {
                                   //     line1, line2, city, state
                                   //     postal_code, country
                                   //   }
                                   // }
  
  // Shipping address collected in checkout
  customerAddress        Json?    // {
                                   //   line1, line2, city, state
                                   //   postal_code, country
                                   // }
  
  // Receipt information
  receiptUrl             String?  // Stripe receipt URL
  receiptEmail           String?  // Email receipt sent to
  receiptNumber          String?  // Receipt reference number
  
  // Refund information
  refundAmount           Int?     // Refund amount in cents
  refundReason           String?  // Reason for refund
  refundStatus           String?  // "succeeded", "failed", "pending"
  refundedAt             DateTime? // When refund occurred
  
  // Additional metadata
  description            String?  // "JAPA Registration Fee"
  metadata               Json?    // {
                                   //   sessionId: string
                                   //   paymentIntentId: string
                                   //   chargeId: string
                                   //   receiptNumber: string
                                   //   last4: string (card last 4 digits)
                                   //   brand: string (Visa, Mastercard, etc)
                                   //   expMonth: number
                                   //   expYear: number
                                   //   paymentMethodType: string
                                   // }
  
  // Timestamps
  createdAt              DateTime @default(now())
  succeededAt            DateTime? // When payment actually succeeded
  failedAt               DateTime? // When payment failed

  @@index([userId])
  @@index([transactionId])
  @@index([paymentStatus])
  @@index([createdAt])
  @@index([customerEmail])
}

enum PaymentStatus {
  PENDING
  SUCCEEDED
  FAILED
  CANCELED
}
```

## API Endpoints Overview

### 1. Create Checkout Session
**Endpoint:** `POST /api/payments/create-checkout-session`

**Purpose:** Generate Stripe Checkout session for user registration payment

**Key Features:**
- Uses Stripe's prebuilt hosted checkout (no custom form needed)
- Collects billing address (`billing_address_collection: 'required'`)
- Pre-populates customer email
- Requires authentication (NextAuth session)
- Prevents duplicate payments (users can only pay once)
- Creates/retrieves Stripe customer with metadata
- Stores pending payment record with initial data

**Response:**
```json
{
  "sessionId": "cs_test_...",
  "paymentId": "clxyz123...",
  "url": "https://checkout.stripe.com/...",
  "clientSecret": "pi_test_..."
}
```

**Stored Data on Session Creation:**
- Stripe session ID
- Stripe customer ID
- Payment status (PENDING)
- Customer email
- Customer name
- Amount and currency
- Metadata with session details

### 2. Verify Payment Session
**Endpoint:** `POST /api/payments/verify-session`

**Purpose:** Verify payment was completed and capture comprehensive Stripe data

**Key Features:**
- Retrieves full checkout session from Stripe
- Expands payment intent for detailed info
- Retrieves payment method details (card brand, last 4 digits, expiry)
- Gets charge information (receipt URL, receipt number)
- Extracts billing details from payment method
- Updates payment record with all captured data

**Captured Data from Stripe Checkout:**
- Payment intent ID
- Payment method ID and type
- Card details: last 4 digits, brand (Visa, Mastercard, etc), expiry month/year
- Charge ID
- Receipt URL and receipt number
- Billing name, email, phone
- Billing address (line1, line2, city, state, postal code, country)
- Timestamp of successful payment

**Response:**
```json
{
  "success": true,
  "paymentStatus": "paid",
  "amount": 15000,
  "currency": "usd",
  "customerEmail": "user@example.com",
  "paymentMethod": "card",
  "receiptUrl": "https://receipts.stripe.com/..."
}
```

### 3. Webhook Handler
**Endpoint:** `POST /api/payments/webhook`

**Purpose:** Handle real-time Stripe events (backup to verify-session)

**Events Handled:**
1. **checkout.session.completed** - Session completed, payment ready
   - Updates payment with all available Stripe data
   - Captures payment method details
   - Stores receipt information
   - Records metadata for tracking

2. **payment_intent.succeeded** - Payment intent confirmed
   - Confirms payment status
   - Captures final receipt URL
   - Stores card last 4 digits and brand

3. **payment_intent.payment_failed** - Payment processing failed
   - Updates status to FAILED
   - Stores failure code, message, and type
   - Records failure timestamp

4. **charge.refunded** - Charge was refunded
   - Updates status to CANCELED
   - Stores refund amount
   - Records refund timestamp
   - Marks refund status as succeeded

**Data Captured from Webhooks:**
- Payment method details (type, brand, last 4, expiry)
- Card billing address
- Charge ID and receipt number
- Refund information (amount, status)
- Error details if payment failed

### 4. Complete Application
**Endpoint:** `POST /api/payments/complete-application`

**Purpose:** Create application record after successful payment

**Key Features:**
- Verifies payment is SUCCEEDED before proceeding
- Prevents duplicate applications for same payment
- Creates application record with module-specific fields
- Generates password reset token
- Sends welcome email with password setup link
- Stores payment metadata in application formData

**Linked Data:**
- Payment ID
- Payment method type
- Card last 4 digits
- Payment amount and currency
- Stripe session ID

## Stripe Checkout Configuration

### Checkout Session Settings
```typescript
stripe.checkout.sessions.create({
  // Customer
  customer: stripeCustomerId,
  customer_email: user.email,
  customer_creation: 'always',
  
  // Billing
  billing_address_collection: 'required', // Collect full address
  
  // Payment
  payment_method_types: ['card'],
  mode: 'payment', // One-time payment
  
  // Product
  line_items: [{
    price_data: {
      currency: 'usd',
      unit_amount: 15000, // $150 in cents
      product_data: {
        name: 'JAPA Registration Fee',
        description: 'Non-refundable eligibility test fee',
      }
    },
    quantity: 1
  }],
  
  // Redirects
  success_url: '.../payment/success?session_id={CHECKOUT_SESSION_ID}',
  cancel_url: '.../payment/cancel',
  
  // Metadata
  metadata: {
    userId: user.id,
    email: user.email,
    fullName: user.fullName
  }
})
```

## Payment Flow Diagram

```
Registration Form Complete
    ↓
User clicks "Submit Application"
    ↓
POST /api/payments/create-checkout-session
    ├─ Validate user session
    ├─ Check for existing successful payments
    ├─ Get/create Stripe customer
    ├─ Create Stripe checkout session
    │  └─ Collects: billing address, email, card
    ├─ Create PENDING payment record
    └─ Return checkout URL
    ↓
Client redirects to Stripe Checkout URL
    ↓
User enters payment details & address on Stripe
    ├─ Card information (never touches your server)
    ├─ Billing address
    └─ Email for receipt
    ↓
User completes payment on Stripe
    ↓
[Stripe processes payment]
    ├─ Validates card
    ├─ Creates charge
    ├─ Generates receipt
    └─ Sends webhooks
    ↓
Stripe redirects to success URL
    ↓
/auth/register/payment/success?session_id=...
    ↓
POST /api/payments/verify-session
    ├─ Retrieve checkout session from Stripe
    ├─ Get payment intent details
    ├─ Get charge & receipt info
    ├─ Get payment method details
    │  └─ Card brand, last 4, expiry
    ├─ Get billing address
    └─ Update payment record with all data
    ↓
POST /api/payments/complete-application
    ├─ Verify payment is SUCCEEDED
    ├─ Create application record
    ├─ Generate password reset token
    └─ Send welcome email
    ↓
Auto-redirect to thank-you page
    ↓
User sees success confirmation
User receives welcome email with password setup link

[Webhook Events - Running in parallel]
Stripe → POST /api/payments/webhook
├─ checkout.session.completed
├─ payment_intent.succeeded
├─ payment_intent.payment_failed
└─ charge.refunded
  └─ Updates payment with additional data
```

## Stored Payment Data Examples

### Successful Payment Record
```json
{
  "id": "clxyz123456",
  "transactionId": "pi_1234567890",
  "stripePaymentIntentId": "pi_1234567890",
  "stripeSessionId": "cs_test_abcdef123456",
  "userId": "user123",
  "amount": 15000,
  "currency": "USD",
  "paymentMethod": "card",
  "paymentMethodId": "pm_1234567890",
  "paymentStatus": "SUCCEEDED",
  "stripeCustomerId": "cus_1234567890",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "billingDetails": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": {
      "line1": "123 Main St",
      "line2": "Apt 4",
      "city": "New York",
      "state": "NY",
      "postal_code": "10001",
      "country": "US"
    }
  },
  "receiptUrl": "https://receipts.stripe.com/...",
  "receiptNumber": "rcpt_1234567890",
  "receiptEmail": "john@example.com",
  "description": "JAPA Registration Fee",
  "metadata": {
    "sessionId": "cs_test_abcdef123456",
    "paymentIntentId": "pi_1234567890",
    "chargeId": "ch_1234567890",
    "receiptNumber": "rcpt_1234567890",
    "last4": "4242",
    "brand": "Visa",
    "expMonth": 12,
    "expYear": 2026,
    "paymentMethodType": "card"
  },
  "succeededAt": "2025-12-03T19:30:00Z",
  "createdAt": "2025-12-03T19:25:00Z"
}
```

### Refunded Payment Record
```json
{
  "paymentStatus": "CANCELED",
  "refundAmount": 15000,
  "refundStatus": "succeeded",
  "refundedAt": "2025-12-04T10:15:00Z",
  "metadata": {
    "...": "...previous fields...",
    "refundChargeId": "re_1234567890",
    "refundedAt": "2025-12-04T10:15:00Z",
    "refundAmount": 15000,
    "balanceTransaction": "txn_1234567890"
  }
}
```

## Data Captured Per Stage

### Stage 1: Checkout Session Creation
✓ Stripe session ID  
✓ Stripe customer ID  
✓ Customer email  
✓ Customer name  
✓ Amount (1500 cents = $150)  
✓ Currency (USD)  
✓ Payment status (PENDING)  

### Stage 2: Payment Processing (on Stripe)
✓ Card details (Stripe handles, never on your server)  
✓ Billing address  
✓ Receipt generation  

### Stage 3: Webhook Events
✓ Payment intent ID  
✓ Charge ID  
✓ Payment method details (brand, last 4, expiry)  
✓ Charge receipt URL  
✓ Payment status update (SUCCEEDED/FAILED)  
✓ Billing address (from payment method)  
✓ Receipt number  

### Stage 4: Payment Verification
✓ Final confirmation of payment status  
✓ Updated receipt URL if needed  
✓ Full payment method details  
✓ All billing information  
✓ Payment timestamp  

## Security & Compliance

### PCI Compliance
- ✅ No credit card data stored locally
- ✅ No card data processed by your server
- ✅ Stripe Checkout (Level 1 PCI-DSS certified)
- ✅ All sensitive data stays within Stripe's secure environment

### Data Protection
- ✅ HTTPS encryption for all API calls
- ✅ Webhook signature verification
- ✅ Database indexes for fast queries
- ✅ User authentication required for payment endpoints
- ✅ Duplicate payment prevention
- ✅ Audit trail of all payment changes

### Stripe Configuration
- ✅ API key verification for webhooks
- ✅ Sandbox testing before production
- ✅ Webhook event verification with signing secret
- ✅ Idempotency keys for request safety

## Testing Checklist

### Test Cards
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155
Expiry: Any future date (12/26)
CVC: Any 3 digits (123)
```

### Test Scenarios
- [ ] Complete payment flow with test card
- [ ] Verify all payment data saved to database
- [ ] Test payment decline scenario
- [ ] Verify webhook events received
- [ ] Test refund process
- [ ] Check email notifications sent
- [ ] Verify application created after payment
- [ ] Test duplicate payment prevention
- [ ] Check receipt URL functionality

### Verification Queries
```sql
-- Find payment by email
SELECT * FROM "Payment" 
WHERE "customerEmail" = 'test@example.com'
ORDER BY "createdAt" DESC;

-- Check all successful payments
SELECT "id", "customerEmail", "amount", "succeededAt" 
FROM "Payment"
WHERE "paymentStatus" = 'SUCCEEDED'
ORDER BY "succeededAt" DESC;

-- Find payments with refunds
SELECT "id", "customerEmail", "amount", "refundAmount", "refundStatus"
FROM "Payment"
WHERE "paymentStatus" = 'CANCELED'
AND "refundStatus" = 'succeeded';
```

## Monitoring & Debugging

### Key Logs to Monitor
- Checkout session creation
- Payment verification calls
- Webhook event processing
- Application creation after payment
- Email send confirmations

### Common Issues & Solutions

**Issue:** Payment status stuck on PENDING
- **Cause:** Webhook not received or processed
- **Solution:** Manually verify session using `/api/payments/verify-session` endpoint

**Issue:** Missing billing details
- **Cause:** User didn't complete checkout or Stripe API limit
- **Solution:** Check Stripe dashboard for payment method details

**Issue:** Duplicate charges
- **Cause:** Webhook retry or multiple form submissions
- **Solution:** Duplicate payment prevention check blocks this

**Issue:** Email not sent
- **Cause:** SMTP configuration issue
- **Solution:** Check `EMAIL_ENABLED` flag and SMTP credentials

## Environment Variables Required

```bash
# Stripe API Keys
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_STRIPE_PRODUCT_IMAGE=https://...

# Auth
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secret-key

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Email (existing config)
EMAIL_ENABLED=true
SMTP_HOST=mail.domain.com
SMTP_PORT=465
SMTP_USER=info@domain.com
SMTP_PASS=password
EMAIL_FROM="Company <info@domain.com>"
```

## Deployment Notes

1. **Create Stripe Account:** https://dashboard.stripe.com
2. **Get API Keys:** Get Secret Key and Publishable Key from Stripe Dashboard
3. **Set Webhook:** Configure webhook endpoint in Stripe Dashboard to your domain `/api/payments/webhook`
4. **Copy Webhook Secret:** Get the signing secret from Stripe and set as `STRIPE_WEBHOOK_SECRET`
5. **Run Migration:** `npx prisma migrate deploy`
6. **Set Environment Variables:** Add all required `.env.local` variables
7. **Test with Test Keys:** Test full flow with test card before going live
8. **Switch to Live Keys:** Update to live keys in production

## API Response Examples

### Successful Payment Response
```json
{
  "sessionId": "cs_test_a1b2c3d4e5f6g7h8",
  "paymentId": "cly1234567890abcdef",
  "url": "https://checkout.stripe.com/pay/cs_test_a1b2c3d4e5f6g7h8",
  "clientSecret": "pi_1234567890_secret_abcdef123456"
}
```

### Verify Session Response
```json
{
  "success": true,
  "paymentStatus": "paid",
  "amount": 15000,
  "currency": "usd",
  "customerEmail": "user@example.com",
  "paymentMethod": "card",
  "receiptUrl": "https://receipts.stripe.com/..."
}
```

### Complete Application Response
```json
{
  "success": true,
  "applicationId": "APP-603756",
  "message": "Application submitted successfully"
}
```

## Summary

The Stripe Checkout integration captures comprehensive payment data at every stage:
- **Session Creation:** Basic customer and payment info
- **Webhooks:** Real-time payment events and charge details
- **Verification:** Complete payment method and billing details
- **Database:** All data persisted for audit, analytics, and customer service

This ensures complete payment tracking, PCI compliance, and excellent customer support capabilities.
