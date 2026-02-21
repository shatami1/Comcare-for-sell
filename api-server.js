/**
 * COMFORTCARE BACKEND API SERVER
 * 
 * Node.js/Express server with authentication and role-based access control
 * Handles:
 * - Agent login
 * - Admin login  
 * - Protected API endpoints for orders, agents, customers
 * - Stripe payment integration
 * - Order management
 */

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// ============================================================================
// MIDDLEWARE
// ============================================================================

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// ============================================================================
// IN-MEMORY DATA STORES (Replace with real database)
// ============================================================================

// Admin credentials (in production, store hashed in database)
const ADMINS = [
    {
        adminId: 'admin001',
        username: 'admin',
        password: '$2a$10$rKZqGUvqZjVaGxJqHBjVYeL.qW7qYq2jYGzQFqFYvqYzQFqFYvqY2', // 'admin123'
        name: 'Business Owner',
        email: 'owner@comcare.store'
    }
];

// Agent database (in production, use real database)
const AGENTS = [
    {
        agentId: 'AG-001',
        pin: '1234', // In production, hash this
        name: 'John Delivery',
        email: 'john@comcare.store',
        phone: '(555) 123-4567',
        zone: 'Atlanta Metro',
        commissionRate: 0.25,
        stripeConnectId: 'acct_test123',
        status: 'active',
        stats: {
            totalDeliveries: 45,
            activeOrders: 5,
            completedToday: 2,
            pendingPickup: 3,
            monthlyEarnings: 245000, // in cents
            rating: 4.8
        }
    },
    {
        agentId: 'AG-002',
        pin: '5678',
        name: 'Sarah Transport',
        email: 'sarah@comcare.store',
        phone: '(555) 234-5678',
        zone: 'North Atlanta',
        commissionRate: 0.25,
        stripeConnectId: 'acct_test456',
        status: 'active',
        stats: {
            totalDeliveries: 62,
            activeOrders: 8,
            completedToday: 1,
            pendingPickup: 4,
            monthlyEarnings: 310000,
            rating: 4.9
        }
    }
];

// Orders database
const ORDERS = [
    {
        orderId: 'CC-1001',
        customerId: 'cus_123',
        customerName: 'Mary Johnson',
        email: 'mary@email.com',
        phone: '(555) 555-1234',
        address: '123 Main St, Atlanta, GA 30303',
        agentId: 'AG-001',
        agentName: 'John Delivery',
        equipment: 'Hospital Bed - Standard',
        rentalPeriod: 'Monthly',
        pricing: {
            subtotal: 100000,
            deliveryFee: 5000,
            pickupFee: 5000,
            deposit: 10000,
            total: 120000,
            commission: 30000
        },
        dates: {
            orderDate: '2026-02-15',
            deliveryDate: '2026-02-16',
            endDate: '2026-03-16'
        },
        status: 'Active',
        stripePaymentId: 'pi_test123'
    },
    {
        orderId: 'CC-1002',
        customerId: 'cus_456',
        customerName: 'Robert Smith',
        email: 'robert@email.com',
        phone: '(555) 555-5678',
        address: '456 Oak Ave, Atlanta, GA 30305',
        agentId: 'AG-002',
        agentName: 'Sarah Transport',
        equipment: 'Wheelchair - Electric',
        rentalPeriod: 'Weekly',
        pricing: {
            subtotal: 40000,
            deliveryFee: 5000,
            pickupFee: 5000,
            deposit: 5000,
            total: 55000,
            commission: 13750
        },
        dates: {
            orderDate: '2026-02-18',
            deliveryDate: '2026-02-19',
            endDate: '2026-02-26'
        },
        status: 'Pending',
        stripePaymentId: 'pi_test456'
    }
];

// Customers database
const CUSTOMERS = [
    {
        customerId: 'cus_123',
        name: 'Mary Johnson',
        email: 'mary@email.com',
        phone: '(555) 555-1234',
        address: '123 Main St, Atlanta, GA 30303',
        totalOrders: 3,
        lifetimeValue: 360000,
        lastOrder: '2026-02-15',
        status: 'active'
    },
    {
        customerId: 'cus_456',
        name: 'Robert Smith',
        email: 'robert@email.com',
        phone: '(555) 555-5678',
        address: '456 Oak Ave, Atlanta, GA 30305',
        totalOrders: 1,
        lifetimeValue: 55000,
        lastOrder: '2026-02-18',
        status: 'active'
    }
];

// Inventory database
const INVENTORY = [
    {
        equipmentId: 'eq_001',
        name: 'Hospital Bed',
        category: 'Beds',
        totalUnits: 20,
        inStock: 12,
        rentedOut: 8,
        dailyRate: 5000,
        status: 'Available'
    },
    {
        equipmentId: 'eq_002',
        name: 'Wheelchair - Manual',
        category: 'Mobility',
        totalUnits: 30,
        inStock: 18,
        rentedOut: 12,
        dailyRate: 2000,
        status: 'Available'
    },
    {
        equipmentId: 'eq_003',
        name: 'Wheelchair - Electric',
        category: 'Mobility',
        totalUnits: 15,
        inStock: 8,
        rentedOut: 7,
        dailyRate: 6000,
        status: 'Available'
    }
];

// ============================================================================
// AUTHENTICATION MIDDLEWARE
// ============================================================================

/**
 * Verify JWT token
 */
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
}

/**
 * Require specific role
 */
function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
        }
        next();
    };
}

// ============================================================================
// AUTHENTICATION ROUTES
// ============================================================================

/**
 * AGENT LOGIN
 * POST /api/auth/agent-login
 */
app.post('/api/auth/agent-login', async (req, res) => {
    try {
        const { agentId, pin } = req.body;

        // Find agent
        const agent = AGENTS.find(a => a.agentId === agentId && a.pin === pin);

        if (!agent) {
            return res.status(401).json({ error: 'Invalid Agent ID or PIN' });
        }

        if (agent.status !== 'active') {
            return res.status(403).json({ error: 'Agent account is inactive' });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: agent.agentId,
                role: 'agent',
                name: agent.name
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Return agent data (without sensitive info)
        res.json({
            success: true,
            token,
            agent: {
                agentId: agent.agentId,
                name: agent.name,
                email: agent.email,
                zone: agent.zone,
                commissionRate: agent.commissionRate
            }
        });

    } catch (error) {
        console.error('Agent login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

/**
 * ADMIN LOGIN
 * POST /api/auth/admin-login
 */
app.post('/api/auth/admin-login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find admin
        const admin = ADMINS.find(a => a.username === username);

        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password (in production, use bcrypt.compare)
        const isValidPassword = password === 'admin123'; // CHANGE IN PRODUCTION!

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: admin.adminId,
                role: 'admin',
                name: admin.name
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            admin: {
                adminId: admin.adminId,
                name: admin.name,
                email: admin.email
            }
        });

    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// ============================================================================
// AGENT ROUTES (Agents can only see THEIR data)
// ============================================================================

/**
 * Get agent's orders
 * GET /api/agent/:agentId/orders
 */
app.get('/api/agent/:agentId/orders', authenticateToken, requireRole('agent'), (req, res) => {
    const { agentId } = req.params;

    // Verify agent can only access their own data
    if (req.user.userId !== agentId) {
        return res.status(403).json({ error: 'Access denied' });
    }

    const agentOrders = ORDERS.filter(order => order.agentId === agentId);
    res.json(agentOrders);
});

/**
 * Get agent's stats
 * GET /api/agent/:agentId/stats
 */
app.get('/api/agent/:agentId/stats', authenticateToken, requireRole('agent'), (req, res) => {
    const { agentId } = req.params;

    // Verify agent can only access their own data
    if (req.user.userId !== agentId) {
        return res.status(403).json({ error: 'Access denied' });
    }

    const agent = AGENTS.find(a => a.agentId === agentId);
    if (!agent) {
        return res.status(404).json({ error: 'Agent not found' });
    }

    res.json(agent.stats);
});

/**
 * Update order status (agent action)
 * POST /api/agent/order/:orderId/action
 */
app.post('/api/agent/order/:orderId/action', authenticateToken, requireRole('agent'), (req, res) => {
    const { orderId } = req.params;
    const { action } = req.body;

    const order = ORDERS.find(o => o.orderId === orderId);

    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }

    // Verify agent owns this order
    if (order.agentId !== req.user.userId) {
        return res.status(403).json({ error: 'Not your order' });
    }

    // Update order status based on action
    switch(action) {
        case 'deliver':
            order.status = 'Delivering';
            break;
        case 'complete_delivery':
            order.status = 'Active';
            break;
        case 'schedule_pickup':
            order.status = 'Pickup';
            break;
        case 'complete_pickup':
            order.status = 'Completed';
            break;
    }

    res.json({ success: true, order });
});

// ============================================================================
// ADMIN ROUTES (Admin can see ALL data)
// ============================================================================

/**
 * Get business statistics
 * GET /api/admin/stats
 */
app.get('/api/admin/stats', authenticateToken, requireRole('admin'), (req, res) => {
    const stats = {
        totalRevenue: ORDERS.reduce((sum, order) => sum + order.pricing.total, 0),
        totalOrders: ORDERS.length,
        activeAgents: AGENTS.filter(a => a.status === 'active').length,
        activeRentals: ORDERS.filter(o => o.status === 'Active').length,
        totalCommissions: ORDERS.reduce((sum, order) => sum + order.pricing.commission, 0),
        netProfit: 0, // Calculate: revenue - commissions - expenses
        revenueGrowth: 15,
        newOrdersThisMonth: 12,
        availableAgents: AGENTS.filter(a => a.status === 'active').length,
        newRentalsToday: 2,
        profitMargin: 65
    };

    stats.netProfit = stats.totalRevenue - stats.totalCommissions;

    res.json(stats);
});

/**
 * Get all orders
 * GET /api/admin/orders
 */
app.get('/api/admin/orders', authenticateToken, requireRole('admin'), (req, res) => {
    res.json(ORDERS);
});

/**
 * Get all agents
 * GET /api/admin/agents
 */
app.get('/api/admin/agents', authenticateToken, requireRole('admin'), (req, res) => {
    const agentsData = AGENTS.map(agent => ({
        agentId: agent.agentId,
        name: agent.name,
        email: agent.email,
        zone: agent.zone,
        completedOrders: agent.stats.totalDeliveries,
        totalEarnings: agent.stats.monthlyEarnings * 6, // Estimate 6 months
        status: agent.status
    }));

    res.json(agentsData);
});

/**
 * Get all customers
 * GET /api/admin/customers
 */
app.get('/api/admin/customers', authenticateToken, requireRole('admin'), (req, res) => {
    res.json(CUSTOMERS);
});

/**
 * Get inventory
 * GET /api/admin/inventory
 */
app.get('/api/admin/inventory', authenticateToken, requireRole('admin'), (req, res) => {
    res.json(INVENTORY);
});

/**
 * Create new order (admin)
 * POST /api/admin/orders
 */
app.post('/api/admin/orders', authenticateToken, requireRole('admin'), (req, res) => {
    const newOrder = req.body;
    newOrder.orderId = `CC-${1000 + ORDERS.length + 1}`;
    ORDERS.push(newOrder);
    res.json({ success: true, order: newOrder });
});

/**
 * Assign order to agent (admin)
 * PUT /api/admin/order/:orderId/assign
 */
app.put('/api/admin/order/:orderId/assign', authenticateToken, requireRole('admin'), (req, res) => {
    const { orderId } = req.params;
    const { agentId } = req.body;

    const order = ORDERS.find(o => o.orderId === orderId);
    const agent = AGENTS.find(a => a.agentId === agentId);

    if (!order || !agent) {
        return res.status(404).json({ error: 'Order or agent not found' });
    }

    order.agentId = agentId;
    order.agentName = agent.name;

    res.json({ success: true, order });
});

// ============================================================================
// STRIPE PAYMENT ROUTES (Public - no auth required for checkout)
// ============================================================================

/**
 * Create Stripe checkout session
 * POST /api/create-checkout-session
 */
app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const { items, customerInfo } = req.body;

        // Calculate totals
        const lineItems = items.map(item => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                    description: `${item.rentalPeriod} rental`
                },
                unit_amount: item.price
            },
            quantity: item.quantity
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${req.headers.origin}/thank-you.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/order.html`,
            customer_email: customerInfo?.email,
            metadata: {
                customerName: customerInfo?.name,
                phone: customerInfo?.phone,
                address: customerInfo?.address
            }
        });

        res.json({ url: session.url });

    } catch (error) {
        console.error('Stripe checkout error:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
});

// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================================================
// START SERVER
// ============================================================================

app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║        🚀 ComfortCare API Server Running                     ║
║                                                              ║
║        Port: ${PORT}                                        ║
║        Environment: ${process.env.NODE_ENV || 'development'}              ║
║                                                              ║
║        📱 Agent Login: http://localhost:${PORT}/agent-login.html     ║
║        👑 Admin Login: http://localhost:${PORT}/admin-login.html     ║
║                                                              ║
║        🔐 Default Credentials:                               ║
║           Agent: AG-001 / PIN: 1234                          ║
║           Admin: admin / admin123                            ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
    `);
});

module.exports = app;
