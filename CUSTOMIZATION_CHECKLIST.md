# Quick Customization Checklist

Use this checklist to customize your ComfortCare website for your business.

## 🎯 For Sellers: Update Buyer Contact Form

If you're selling this package:

- [ ] Open `buyer-contact.html`
- [ ] Find the form action: `action="https://formsubmit.co/contact@comfortcare-demo.com"`
- [ ] Replace `contact@comfortcare-demo.com` with YOUR email address
- [ ] This ensures buyer inquiries come directly to you

## ⚡ Quick Setup (30 minutes)

### 1. Replace Contact Information

Search and replace in **all HTML files**:

- [ ] **Email**: `contact@comfortcare-demo.com` → `your@email.com`
- [ ] **Phone**: `(555) 123-4567` → `(XXX) XXX-XXXX`
- [ ] **Phone Tel**: `tel:5551234567` → `tel:XXXXXXXXXX`
- [ ] **Location**: `Your City, State` → `Atlanta, GA` (or your city)

**Files to update:**
- index.html
- contact.html
- services.html
- order.html
- payment.html
- pricing.html
- thank-you.html
- how-it-works.html
- admin.html

### 2. Configure Stripe Payment

- [ ] Go to https://dashboard.stripe.com/register
- [ ] Create Stripe account (or login)
- [ ] Navigate to Developers → API Keys
- [ ] Copy your **Secret Key** (starts with `sk_live_` or `sk_test_`)
- [ ] Rename `.env.example` to `.env`
- [ ] Paste your secret key in `.env`:
  ```
  STRIPE_SECRET_KEY=sk_live_YOUR_ACTUAL_KEY_HERE
  ```
- [ ] Save the file

### 3. Add Product Images

- [ ] Create or gather images for your equipment
- [ ] Resize to 800x800px (recommended)
- [ ] Save as PNG or JPG in the `images/` folder
- [ ] Name them according to `images/README.md` specifications

**Required images:**
- Picture1.png through Picture19.png (see images/README.md for list)

### 4. Test Locally

- [ ] Open terminal in project folder
- [ ] Run: `node server.js`
- [ ] Visit: http://localhost:3000
- [ ] Test adding items to cart
- [ ] Test checkout process with Stripe test mode
- [ ] Verify email addresses are correct

## 🎨 Branding (1-2 hours)

### 5. Update Logo

- [ ] Create your logo (SVG format recommended)
- [ ] Replace `logo.svg` with your logo
- [ ] Or update `<img src="logo.svg">` in all HTML files to point to your logo

### 6. Customize Colors (Optional)

Edit `styles.css` - find the `:root` section at the top:

- [ ] `--primary-color` - Main brand color (buttons, links)
- [ ] `--secondary-color` - Secondary actions
- [ ] `--accent-color` - Highlights and CTAs
- [ ] `--success-color` - Success messages
- [ ] `--error-color` - Error messages

### 7. Update Business Name (Optional)

If not using "ComfortCare":
- [ ] Search and replace "ComfortCare" with "Your Business Name"
- [ ] Update page titles in `<title>` tags
- [ ] Update navigation brand name
- [ ] Update footer business description

## 💰 Pricing Updates (30 minutes)

### 8. Adjust Pricing

Edit `order.html` - find each `<tr class="pricing-item">`:

- [ ] Update `data-daily`, `data-weekly`, `data-monthly` attributes
- [ ] Update visible price text in `<td>` cells
- [ ] Ensure prices match your market research

**Current pricing:** 5% below competitors
**Adjust as needed** for your market

### 9. Update Services

Edit `services.html`:
- [ ] Add/remove service categories
- [ ] Update price ranges
- [ ] Modify equipment descriptions
- [ ] Add specialized services you offer

## 📝 Content Updates (1 hour)

### 10. Update Homepage

Edit `index.html`:
- [ ] Hero section heading and description
- [ ] Features/benefits section
- [ ] Service area description
- [ ] Call-to-action buttons

### 11. Update About/Contact

Edit `contact.html`:
- [ ] Business hours
- [ ] Service area coverage
- [ ] Team information
- [ ] Support options

### 12. Terms & Policies (Important!)

- [ ] Create Privacy Policy page
- [ ] Create Terms of Service page
- [ ] Create Rental Agreement page
- [ ] Add links to footer

## 🚀 Deployment (30 minutes)

### 13. Deploy to Vercel

- [ ] Create account at https://vercel.com
- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Run: `vercel` in project folder
- [ ] Follow prompts to deploy
- [ ] Add environment variable in Vercel dashboard:
  - Name: `STRIPE_SECRET_KEY`
  - Value: Your Stripe secret key

### 14. Configure Domain (Optional)

- [ ] Purchase domain (GoDaddy, Namecheap, etc.)
- [ ] In Vercel dashboard, add custom domain
- [ ] Update DNS records as instructed
- [ ] Wait for SSL certificate (automatic)

### 15. Update URLs in Code

After deployment, update these in your code:
- [ ] `script.js` - Update Vercel URL in `getCheckoutSessionEndpoint()`
- [ ] Change from `https://comcare-de78.vercel.app` to your Vercel URL

## ✅ Pre-Launch Testing

### 16. Test All Features

- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Cart adds items properly
- [ ] Cart calculations are accurate
- [ ] Customer information form validates
- [ ] Payment redirects to Stripe
- [ ] Test successful payment (use Stripe test card)
- [ ] Verify confirmation email sends
- [ ] Test on mobile devices
- [ ] Test on different browsers

### 17. Test Contact Form

- [ ] Fill out contact form
- [ ] Verify email arrives at your address
- [ ] Check FormSubmit activation (first submission)
- [ ] Test form validation

### 18. Security Check

- [ ] Verify `.env` file is NOT in version control
- [ ] Ensure `.gitignore` includes `.env`
- [ ] Check no API keys visible in browser source
- [ ] Test error messages don't leak sensitive info

## 📊 Post-Launch

### 19. Analytics Setup (Recommended)

- [ ] Create Google Analytics account
- [ ] Add tracking code to all HTML pages
- [ ] Set up conversion goals
- [ ] Monitor traffic and conversions

### 20. Marketing Setup

- [ ] Create Google My Business listing
- [ ] List on medical equipment directories
- [ ] Create social media profiles
- [ ] Set up email marketing (Mailchimp, etc.)

## 🆘 Troubleshooting

### Common Issues:

**Cart not working?**
- Check browser console for JavaScript errors
- Verify `script.js` is loading correctly

**Stripe checkout failing?**
- Verify API key is correct in `.env`
- Check Stripe dashboard for test mode vs live mode
- Ensure Vercel environment variable is set

**Emails not sending?**
- Check spam folder
- Verify email address in FormSubmit action
- Confirm FormSubmit activation email was clicked

**Images not loading?**
- Verify image files exist in `images/` folder
- Check image file names match HTML exactly
- Ensure images are web-optimized (not too large)

## 📞 Need Help?

Review these files for detailed information:
- `README-DEMO.md` - Complete setup guide
- `QUICK_START.md` - Quick start instructions
- `DEPLOYMENT.md` - Deployment guide
- `CHECKOUT_SETUP.md` - Stripe setup details

---

## Estimated Time Breakdown

| Task | Time |
|------|------|
| Contact Information | 15 min |
| Stripe Setup | 15 min |
| Add Images | 30 min |
| Branding | 1-2 hours |
| Pricing Updates | 30 min |
| Content Updates | 1 hour |
| Deployment | 30 min |
| Testing | 30 min |
| **Total** | **4-5 hours** |

**You can launch with basic customization in as little as 1 hour!**

Good luck with your medical equipment rental business! 🎉
