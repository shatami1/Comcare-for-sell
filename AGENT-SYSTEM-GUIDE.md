# 🚀 ComfortCare Agent Network System

**Complete Medical Equipment Rental Platform with Agent Management & E-Commerce**

---

## 📋 System Overview

This is a professional medical equipment rental business platform with:

✅ **Full E-Commerce Capabilities**
- Shopping cart system
- Stripe payment integration
- Dynamic pricing (daily/weekly/monthly)
- Automated order management
- Email notifications

✅ **Agent Network Management**
- Agent dashboard for deliveries/pickups
- Commission tracking system
- Stripe Connect for automatic payouts
- Order assignment workflow
- Real-time status updates

✅ **Admin Control Center**
- Order management
- Agent assignments
- Inventory tracking
- Revenue analytics
- Customer service tools

---

## 🏗️ Architecture

### **Three-Tier System**

```
┌─────────────────────────────────────────┐
│     CUSTOMER WEBSITE (E-Commerce)      │
│  - Browse equipment                     │
│  - Add to cart                          │
│  - Checkout with Stripe                 │
│  - Track orders                         │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│      AGENT DASHBOARD (Fulfillment)     │
│  - View assigned orders                 │
│  - Delivery management                  │
│  - Pickup scheduling                    │
│  - Commission tracking                  │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│      ADMIN BACKEND (Management)        │
│  - Order processing                     │
│  - Agent assignment                     │
│  - Payment processing                   │
│  - Analytics & reporting                │
└─────────────────────────────────────────┘
```

---

## 💳 Payment Processing Flow

### **1. Customer Checkout**
```javascript
Customer adds items → Cart calculates total → Stripe Checkout
     ↓
Payment collected → Order created → Agent assigned
     ↓
Confirmation email sent → Delivery scheduled
```

### **2. Pricing Structure**
- **Daily Rate**: Equipment base price × days
- **Weekly Rate**: Discounted (save ~15%)
- **Monthly Rate**: Maximum discount (save ~30%)
- **Delivery Fee**: Flat rate per order
- **Pickup Fee**: Flat rate per return
- **Security Deposit**: Refundable hold

### **3. Stripe Integration**
```javascript
// One-time payments
stripe.checkout.sessions.create({
  line_items: [equipment, delivery, pickup],
  mode: 'payment'
})

// Recurring monthly rentals
stripe.subscriptions.create({
  customer: customerId,
  items: [{ price: monthlyPriceId }]
})

// Security deposit (authorization hold)
stripe.paymentIntents.create({
  amount: depositAmount,
  capture_method: 'manual' // Don't charge, just hold
})
```

---

## 🧑‍🤝‍🧑 Agent Commission System

### **Stripe Connect Integration**

Agents earn commissions automatically through Stripe Connect:

```javascript
Order Total: $400
├─ Business Revenue: $300 (75%)
└─ Agent Commission: $100 (25%)
```

**Payout Flow:**
1. Customer pays $400 to your Stripe account
2. System calculates 25% commission ($100)
3. Stripe automatically transfers $100 to agent's connected account
4. You keep $300

**Agent Onboarding:**
- Create Stripe Express account
- Verify identity
- Link bank account
- Start receiving payouts

---

## 📊 Order Management Workflow

### **Full Rental Lifecycle**

```
1. ORDER PLACED
   - Customer checks out
   - Payment confirmed
   - Order enters system
   
2. AGENT ASSIGNED
   - System assigns nearest agent
   - Agent receives notification
   - Delivery scheduled
   
3. DELIVERY
   - Agent picks up equipment
   - Delivers to customer
   - Sets up equipment
   - Status: "Active Rental"
   
4. RENTAL PERIOD
   - Customer uses equipment
   - Auto-reminders sent
   - Support available 24/7
   
5. PICKUP
   - Agent retrieves equipment
   - Inspects condition
   - Returns to warehouse
   
6. COMPLETION
   - Security deposit refunded
   - Agent commission paid
   - Customer feedback requested
```

---

## 🗄️ Database Schema

### **Orders Table**
```javascript
{
  orderId: "CC-1001",
  customerId: "cus_123456",
  items: [{
    equipmentId: "eq_001",
    name: "Hospital Bed",
    quantity: 1,
    rentalPeriod: "monthly",
    price: 100000 // cents
  }],
  pricing: {
    subtotal: 100000,
    deliveryFee: 5000,
    pickupFee: 5000,
    deposit: 10000,
    total: 120000
  },
  agent: {
    agentId: "ag_789",
    commission: 25000,
    stripeAccountId: "acct_xxx"
  },
  dates: {
    orderDate: "2026-02-21",
    deliveryDate: "2026-02-22",
    endDate: "2026-03-22"
  },
  status: "active"
}
```

### **Agents Table**
```javascript
{
  agentId: "ag_789",
  name: "John Agent",
  email: "agent@example.com",
  phone: "(555) 123-4567",
  zone: "Atlanta Metro",
  stripeConnectId: "acct_xxx",
  commissionRate: 0.25,
  stats: {
    totalDeliveries: 150,
    activeOrders: 12,
    monthlyEarnings: 2450,
    rating: 4.9
  },
  status: "active"
}
```

---

## 🛠️ Tech Stack

### **Frontend**
- HTML5/CSS3/JavaScript
- Responsive design
- Stripe.js for checkout
- Real-time cart updates

### **Backend**
- Node.js + Express
- Stripe API
- SendGrid (email)
- Firebase/Supabase (database)

### **Payments**
- Stripe Checkout
- Stripe Connect (agent payouts)
- Payment Intents API (deposits)
- Subscriptions API (recurring)

### **Infrastructure**
- Vercel/Netlify (hosting)
- Firebase Cloud Functions
- Stripe Webhooks
- SSL/HTTPS

---

## 📧 Email Automation

### **Customer Emails**
- ✅ Order confirmation
- 📅 Delivery scheduled
- 🚚 Out for delivery
- ✓ Delivery completed
- ⏰ Pickup reminder
- 💰 Deposit refunded

### **Agent Emails**
- 📋 New order assigned
- 📍 Delivery details
- ⏰ Pickup scheduled
- 💵 Commission earned

### **Admin Emails**
- 🔔 New order alert
- ⚠️ Late pickup warning
- 📊 Daily summary
- 💰 Revenue report

---

## 🚀 Getting Started

### **1. Setup Stripe**
```bash
# Get API keys from dashboard.stripe.com
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### **2. Configure Pricing**
```javascript
// Edit stripe-config.js
rates = {
  'hospital-bed': {
    daily: 5000,   // $50/day
    weekly: 30000, // $300/week
    monthly: 100000 // $1000/month
  }
}
```

### **3. Set Commission Rate**
```javascript
agentCommissionPercentage: 25 // 25%
```

### **4. Launch**
- Deploy website
- Onboard agents
- Start accepting orders
- Monitor from admin dashboard

---

## 💰 Revenue Model

### **Example Monthly Revenue:**

```
50 orders/month × $400 average order = $20,000 gross revenue

Revenue Split:
├─ Agent Commissions (25%): $5,000
└─ Business Revenue (75%): $15,000

Expenses:
├─ Equipment maintenance: $2,000
├─ Insurance: $1,000
├─ Marketing: $1,500
└─ Operations: $1,500

Net Profit: $9,000/month
```

---

## 🔐 Security & Compliance

✅ **PCI Compliance**: Stripe handles all card data
✅ **HIPAA Considerations**: Medical equipment requires proper handling
✅ **Insurance**: General liability + equipment coverage
✅ **Background Checks**: All agents must be vetted
✅ **Contract Terms**: Clear rental agreements
✅ **Privacy Policy**: GDPR/CCPA compliant

---

## 📞 Support & Setup

### **Agent Onboarding**
1. Application review
2. Background check
3. Stripe Connect setup
4. Training & certification
5. First delivery assignment

### **Customer Support**
- Live chat
- Email support
- Phone hotline
- FAQ/Help center
- Video tutorials

---

## 🎯 Next Steps

1. ✅ Review the system architecture
2. ✅ Test the agent dashboard (agent-dashboard.html)
3. ✅ Configure Stripe keys (stripe-config.js)
4. ✅ Customize pricing
5. ✅ Set up email notifications
6. ✅ Deploy to production
7. ✅ Recruit agents
8. ✅ Launch marketing campaign

---

## 📁 Key Files

- **agent-dashboard.html** - Agent portal for order management
- **stripe-config.js** - Complete Stripe integration code
- **admin.html** - Admin dashboard (existing, needs enhancement)
- **order.html** - Customer cart & checkout
- **pricing.html** - Cart review before payment
- **payment.html** - Stripe Checkout integration

---

**Ready to launch your medical equipment rental business with a professional agent network!** 🚀

For questions or custom development, contact your development team.
