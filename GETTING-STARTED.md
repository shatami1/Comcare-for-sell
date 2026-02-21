# 🚀 GETTING STARTED - ComfortCare Agent System

**You now have a complete rental business platform with three access levels!**

---

## 📋 What You Have

### ✅ Three-Tier Access System

1. **Customer Website** (Public - No login)
   - Browse equipment
   - Add to cart
   - Checkout with Stripe
   - Track orders

2. **Agent Portal** (Login with Agent ID)
   - View assigned orders
   - Manage deliveries
   - Track personal earnings
   - Update order status

3. **Admin Portal** (Owner - Full access)
   - View ALL business transactions
   - Total revenue dashboard
   - Manage all agents
   - Assign orders
   - Financial analytics

---

## 🎯 Quick Setup (5 Minutes)

### Step 1: Install Dependencies

Open PowerShell and run:

```powershell
cd C:\Users\ushsa\Desktop\comcare-agent
npm install
```

### Step 2: Configure Stripe API Keys

1. Go to https://dashboard.stripe.com/apikeys
2. Copy your **Publishable Key** and **Secret Key**
3. Create a `.env` file:

```powershell
copy .env.example .env
notepad .env
```

4. Add your Stripe keys:

```env
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
```

### Step 3: Start the Server

```powershell
npm start
```

**Server will run on:** http://localhost:3001

---

## 🔐 Login & Test

### Test as Customer (No login)
1. Go to: http://localhost:3001/index.html
2. Browse equipment
3. Add items to cart
4. Checkout (use test card: 4242 4242 4242 4242)

### Test as Agent
1. Go to: http://localhost:3001/agent-login.html
2. Login:
   - **Agent ID:** AG-001
   - **PIN:** 1234
3. View your assigned orders
4. See your earnings

### Test as Admin (Owner)
1. Go to: http://localhost:3001/admin-login.html
2. Login:
   - **Username:** admin
   - **Password:** admin123
3. View ALL business data
4. See total revenue
5. Manage agents

---

## 💡 How Each Portal Works

### 👥 Customer Experience (No Login)
```
Customer → Browse → Add to Cart → Checkout → Done
```
- ✅ No login required
- ✅ Stripe handles payment
- ✅ Order created automatically
- ✅ Agent assigned automatically

### 🚚 Agent Experience
```
Agent Login → See Orders → Deliver → Update Status → Earn Commission
```
- ✅ Agents only see THEIR orders
- ✅ Can't see other agents' data
- ✅ Track personal earnings
- ✅ Commission paid automatically (25% default)

### 👑 Admin Experience (You as Owner)
```
Admin Login → Full Dashboard → See Everything
```
- ✅ View ALL orders
- ✅ See total business revenue
- ✅ Track all agent activity
- ✅ View each agent's earnings
- ✅ Manage assignments
- ✅ Export reports

---

## 📊 What You'll See as Admin

### Business Stats Dashboard
- **Total Revenue**: All money coming in
- **Total Orders**: Number of rentals
- **Active Agents**: Your delivery team
- **Agent Commissions**: Total paid to agents
- **Net Profit**: Your profit after commissions

### All Orders View
See every order with:
- Customer name
- Agent assigned
- Equipment rented
- Total amount
- Agent commission
- Order status

### Agent Management
- View all agents
- See each agent's earnings
- Track delivery performance
- Assign orders

### Financial Reports
- Total income
- Commissions paid out
- Operating expenses
- Net business profit

---

## 🔄 Complete Business Workflow

### Example Order Flow:

**1. Customer Orders** (No login)
```
Mary orders a Hospital Bed for $400/month
```

**2. System Processes**
```
- Charge $400 via Stripe
- Create order CC-1001
- Assign to Agent John (AG-001)
- Calculate commission: $100 (25%)
```

**3. Agent Delivers** (Agent login)
```
John logs in → Sees order CC-1001
→ Delivers bed → Marks "Delivered"
→ Earns $100 commission
```

**4. You (Admin) Monitor** (Admin login)
```
Login → Dashboard shows:
- Revenue: $400
- Agent Commission: $100
- Your Profit: $300
```

**Everyone stays in their lane!**
- Customer never sees agent system
- Agent only sees their orders
- You see everything

---

## 🎨 Customization

### Change Commission Rate

Edit `.env`:
```env
AGENT_COMMISSION_RATE=0.30  # 30% instead of 25%
```

### Add More Agents

Edit `api-server.js` and add to AGENTS array:
```javascript
{
  agentId: 'AG-003',
  pin: '9999',
  name: 'New Agent Name',
  zone: 'Atlanta',
  commissionRate: 0.25
}
```

### Change Admin Password

Edit `api-server.js` in ADMINS array:
```javascript
{
  username: 'yourusername',
  password: 'yourpassword'
}
```

---

## 🚀 Going Live

### 1. Deploy Backend (API Server)

**Option A: Heroku**
```bash
heroku create comfortcare-api
git push heroku main
```

**Option B: Vercel**
```bash
vercel deploy
```

### 2. Deploy Frontend (Website)

**GitHub Pages:**
```bash
git push origin main
# Enable GitHub Pages in repo settings
```

### 3. Update URLs

Change API endpoint in all HTML files from:
```javascript
const API_URL = 'http://localhost:3001';
```

To:
```javascript
const API_URL = 'https://your-api.herokuapp.com';
```

---

## 🔒 Security Before Launch

**MUST DO:**

- [ ] Change admin password
- [ ] Change JWT_SECRET in .env
- [ ] Use bcrypt to hash agent PINs
- [ ] Enable HTTPS
- [ ] Set up proper CORS
- [ ] Add rate limiting
- [ ] Enable Stripe webhooks
- [ ] Use real database (not in-memory)
- [ ] Set up email notifications

---

## 🆘 Troubleshooting

### Port Already in Use
```powershell
Get-NetTCPConnection -LocalPort 3001 -State Listen | Select-Object OwningProcess
Stop-Process -Id <PID> -Force
```

### Can't Login
- Check credentials are correct
- Clear browser cache
- Check browser console for errors
- Verify .env file has JWT_SECRET

### Stripe Errors
- Verify API keys in .env
- Check you're using test keys (pk_test_...)
- Review Stripe dashboard logs

### Server Won't Start
```powershell
# Reinstall dependencies
Remove-Item node_modules -Recurse -Force
npm install
npm start
```

---

## 📞 Support & Documentation

**Full Guides:**
- 📘 [AGENT-SYSTEM-GUIDE.md](./AGENT-SYSTEM-GUIDE.md) - Complete architecture
- 📗 [README.md](./README.md) - Detailed setup
- 📙 [QUICK_START.md](./QUICK_START.md) - Fast reference

**Test System:**
1. Start server: `npm start`
2. Customer: http://localhost:3001/index.html
3. Agent: http://localhost:3001/agent-login.html (AG-001 / 1234)
4. Admin: http://localhost:3001/admin-login.html (admin / admin123)

---

## ✅ You're All Set!

You now have:
- ✅ Customer website (no login required)
- ✅ Agent portal (agents see only their data)
- ✅ Admin portal (you see everything)
- ✅ Stripe payment processing
- ✅ Commission tracking
- ✅ Order management
- ✅ Complete business platform

**Ready to launch your medical equipment rental business!** 🚀

---

**Questions?** Check the full documentation or test each portal to see how it works!
