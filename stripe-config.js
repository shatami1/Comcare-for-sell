// ============================================
// STRIPE INTEGRATION FOR RENTAL BUSINESS
// Medical Equipment Rental with Agent Network
// ============================================

// Configuration
const STRIPE_CONFIG = {
    // GET YOUR KEYS FROM: https://dashboard.stripe.com/apikeys
    publishableKey: 'pk_test_YOUR_PUBLISHABLE_KEY_HERE',
    secretKey: 'sk_test_YOUR_SECRET_KEY_HERE', // Keep this server-side only!
    
    // Stripe Connect for Agent Payouts
    connectEnabled: true,
    agentCommissionPercentage: 25, // Agents get 25% of rental fee
    
    // Currency
    currency: 'usd',
    
    // Payment Methods
    paymentMethods: ['card', 'us_bank_account'] // Can add more
};

// ============================================
// RENTAL PRICING CALCULATOR
// ============================================

class RentalPricingCalculator {
    constructor() {
        // Base rates (in cents for Stripe)
        this.rates = {
            'hospital-bed': {
                daily: 5000,    // $50/day
                weekly: 30000,  // $300/week ($42.86/day)
                monthly: 100000 // $1000/month ($33.33/day)
            },
            'wheelchair': {
                daily: 3000,
                weekly: 18000,
                monthly: 60000
            },
            'walker': {
                daily: 2000,
                weekly: 12000,
                monthly: 40000
            },
            // Add more equipment types
        };
        
        this.deliveryFee = 5000;  // $50
        this.pickupFee = 5000;     // $50
        this.securityDeposit = 10000; // $100 (refundable)
    }
    
    calculateRental(equipmentType, rentalType, quantity = 1) {
        const baseRate = this.rates[equipmentType][rentalType];
        return baseRate * quantity;
    }
    
    calculateTotal(items, includeDelivery = true, includePickup = true, includeDeposit = true) {
        let total = 0;
        
        // Calculate rental fees
        items.forEach(item => {
            total += this.calculateRental(item.type, item.rentalPeriod, item.quantity);
        });
        
        // Add fees
        if (includeDelivery) total += this.deliveryFee;
        if (includePickup) total += this.pickupFee;
        if (includeDeposit) total += this.securityDeposit;
        
        return total;
    }
    
    formatPrice(cents) {
        return `$${(cents / 100).toFixed(2)}`;
    }
}

// ============================================
// STRIPE CHECKOUT SESSION CREATOR
// ============================================

async function createCheckoutSession(items, customerEmail) {
    const calculator = new RentalPricingCalculator();
    
    // Calculate line items
    const lineItems = items.map(item => ({
        price_data: {
            currency: STRIPE_CONFIG.currency,
            product_data: {
                name: item.name,
                description: `${item.model} - ${item.rentalPeriod} rental`,
                images: [item.imageUrl]
            },
            unit_amount: calculator.calculateRental(item.type, item.rentalPeriod)
        },
        quantity: item.quantity
    }));
    
    // Add delivery fee
    lineItems.push({
        price_data: {
            currency: STRIPE_CONFIG.currency,
            product_data: {
                name: 'Delivery & Setup',
                description: 'Professional delivery and equipment setup'
            },
            unit_amount: calculator.deliveryFee
        },
        quantity: 1
    });
    
    // Add pickup fee
    lineItems.push({
        price_data: {
            currency: STRIPE_CONFIG.currency,
            product_data: {
                name: 'Pickup Service',
                description: 'Equipment pickup at end of rental'
            },
            unit_amount: calculator.pickupFee
        },
        quantity: 1
    });
    
    // Create session
    const session = {
        payment_method_types: STRIPE_CONFIG.paymentMethods,
        line_items: lineItems,
        mode: 'payment',
        customer_email: customerEmail,
        success_url: `${window.location.origin}/thank-you.html?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/pricing.html`,
        metadata: {
            rental_type: 'medical_equipment',
            delivery_required: 'true',
            pickup_required: 'true'
        }
    };
    
    return session;
}

// ============================================
// STRIPE CONNECT - AGENT COMMISSION SYSTEM
// ============================================

class AgentCommissionManager {
    constructor() {
        this.commissionRate = STRIPE_CONFIG.agentCommissionPercentage / 100;
    }
    
    calculateAgentPayout(orderTotal, agentId) {
        const commission = Math.round(orderTotal * this.commissionRate);
        
        return {
            agentId: agentId,
            orderTotal: orderTotal,
            commission: commission,
            businessRevenue: orderTotal - commission
        };
    }
    
    async createConnectedAccount(agentData) {
        // This creates a Stripe Connect account for an agent
        const account = {
            type: 'express', // or 'standard'
            country: 'US',
            email: agentData.email,
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true }
            },
            business_profile: {
                name: agentData.businessName,
                product_description: 'Medical Equipment Delivery & Setup Agent'
            }
        };
        
        return account;
    }
    
    async payAgent(agentStripeAccountId, amount, orderId) {
        // Transfer funds to agent using Stripe Connect
        const transfer = {
            amount: amount,
            currency: STRIPE_CONFIG.currency,
            destination: agentStripeAccountId,
            transfer_group: orderId,
            description: `Commission for order ${orderId}`
        };
        
        return transfer;
    }
}

// ============================================
// SUBSCRIPTION/RECURRING BILLING
// ============================================

async function createRecurringRental(customerId, productId, priceId) {
    // For monthly recurring rentals
    const subscription = {
        customer: customerId,
        items: [{
            price: priceId, // Pre-created price ID in Stripe
        }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
        metadata: {
            rental_type: 'recurring',
            auto_renew: 'true'
        }
    };
    
    return subscription;
}

// ============================================
// REFUNDABLE SECURITY DEPOSIT
// ============================================

async function captureDeposit(amount, customerId, orderId) {
    // Create a payment intent for deposit
    // Use authorization hold (not immediate capture)
    const paymentIntent = {
        amount: amount,
        currency: STRIPE_CONFIG.currency,
        customer: customerId,
        capture_method: 'manual', // Hold funds, don't capture yet
        metadata: {
            type: 'security_deposit',
            order_id: orderId
        }
    };
    
    return paymentIntent;
}

async function releaseDeposit(paymentIntentId) {
    // Cancel the hold to release funds back to customer
    // Call Stripe API: stripe.paymentIntents.cancel(paymentIntentId)
    return { status: 'deposit_released' };
}

// ============================================
// ORDER MANAGEMENT DATABASE SCHEMA
// ============================================

const ORDER_SCHEMA = {
    orderId: 'CC-1001',
    customerId: 'cus_123456',
    customerEmail: 'customer@example.com',
    customerName: 'John Smith',
    customerAddress: {
        street: '123 Main St',
        city: 'Atlanta',
        state: 'GA',
        zip: '30301'
    },
    items: [
        {
            equipmentId: 'eq_001',
            name: 'Hospital Bed - Standard',
            type: 'hospital-bed',
            rentalPeriod: 'monthly',
            quantity: 1,
            price: 100000 // cents
        }
    ],
    pricing: {
        subtotal: 100000,
        deliveryFee: 5000,
        pickupFee: 5000,
        deposit: 10000,
        total: 120000
    },
    agent: {
        agentId: 'ag_789',
        name: 'Agent Name',
        commission: 30000, // 25% of subtotal
        stripeConnectId: 'acct_connected_account_id'
    },
    dates: {
        orderDate: '2026-02-21',
        deliveryDate: '2026-02-22',
        startDate: '2026-02-22',
        endDate: '2026-03-22',
        pickupDate: '2026-03-23'
    },
    status: 'pending', // pending, delivering, active, pickup_scheduled, completed, cancelled
    stripePaymentId: 'pi_123456',
    stripeSessionId: 'cs_123456',
    notes: 'Delivery instructions: Call before arrival'
};

// ============================================
// WEBHOOK HANDLER
// ============================================

function handleStripeWebhook(event) {
    switch (event.type) {
        case 'checkout.session.completed':
            // Order paid successfully
            // 1. Create order in database
            // 2. Assign to agent
            // 3. Send confirmation email
            // 4. Schedule delivery
            break;
            
        case 'payment_intent.succeeded':
            // Payment collected
            // Update order status
            break;
            
        case 'charge.refunded':
            // Refund processed (for deposit)
            break;
            
        case 'transfer.created':
            // Agent payout completed
            break;
            
        default:
            console.log(`Unhandled event type: ${event.type}`);
    }
}

// ============================================
// EMAIL NOTIFICATIONS
// ============================================

const EMAIL_TEMPLATES = {
    orderConfirmation: {
        subject: 'Order Confirmation - ComfortCare Medical Equipment',
        body: (order) => `
            <h2>Thank you for your order!</h2>
            <p>Order #: ${order.orderId}</p>
            <p>Equipment: ${order.items.map(i => i.name).join(', ')}</p>
            <p>Delivery Date: ${order.dates.deliveryDate}</p>
            <p>Your assigned agent will contact you shortly.</p>
        `
    },
    deliveryScheduled: {
        subject: 'Delivery Scheduled - ComfortCare',
        body: (order) => `
            <h2>Your delivery is scheduled!</h2>
            <p>Date: ${order.dates.deliveryDate}</p>
            <p>Agent: ${order.agent.name}</p>
        `
    },
    pickupReminder: {
        subject: 'Pickup Reminder - ComfortCare',
        body: (order) => `
            <h2>Pickup Scheduled</h2>
            <p>Your rental period ends on ${order.dates.endDate}</p>
            <p>Pickup scheduled for ${order.dates.pickupDate}</p>
        `
    }
};

// ============================================
// EXPORT FOR USE
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        STRIPE_CONFIG,
        RentalPricingCalculator,
        AgentCommissionManager,
        createCheckoutSession,
        createRecurringRental,
        captureDeposit,
        releaseDeposit,
        handleStripeWebhook
    };
}
