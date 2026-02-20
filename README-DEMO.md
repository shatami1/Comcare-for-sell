# ComfortCare Demo Version

## ⚠️ Important Notice

This is a **sanitized demo version** of the ComfortCare medical equipment rental website. All personal and sensitive information has been removed or replaced with placeholder values.

## 🚀 Business For Sale Features

This demo includes a **built-in buyer contact system**:

- **buyer-contact.html** - Complete contact form for potential buyers
- **buyer-thank-you.html** - Thank you page after inquiry submission
- **Business for sale banner** - Prominent notification on index.html
- **Documentation links** - Easy access to business package info

### For Sellers:
1. Update the email in `buyer-contact.html` (line with FormSubmit action)
2. Replace `contact@comfortcare-demo.com` with YOUR email address
3. Buyer inquiries will come directly to you with their details

### For Buyers:
1. Visit `buyer-contact.html` to express interest
2. Review `BUSINESS_SALE_INFO.md` for complete package details
3. Check `CUSTOMIZATION_CHECKLIST.md` for setup instructions

## What Has Been Sanitized

All occurrences of the following have been replaced throughout all files:

- **Email addresses**: `accentgv@gmail.com` → `contact@comfortcare-demo.com`
- **Phone numbers**: `678-362-2345` → `(555) 123-4567`
- **Phone links**: `tel:678-362-2345` → `tel:5551234567`
- **Location**: `Atlanta, Georgia` → `Your City, State`
- **Stripe API keys**: Real keys removed, `.env.example` provided with placeholders

## Files Not Included

The following files were intentionally excluded for security and privacy:

- `.env` (actual environment file with real API keys)
- `SKY Key Secret.txt`
- `ComfortCare Settings.txt`
- `Comcare Built Info.txt`
- `Visual Studio Code.txt`
- `scalp_plan.py`
- `images/` folder (you should add your own product images)

## Customization Instructions

### 1. Contact Information

Search and replace the following placeholders with your actual information:

- `contact@comfortcare-demo.com` → Your business email
- `(555) 123-4567` → Your business phone number
- `tel:5551234567` → Your phone number in tel: format
- `Your City, State` → Your business location

### 2. Stripe Configuration

1. Copy `.env.example` to `.env`
2. Get your Stripe API keys from https://dashboard.stripe.com/apikeys
3. Replace `sk_live_YOUR_STRIPE_SECRET_KEY_HERE` with your actual Stripe secret key
4. **Important**: Never commit the `.env` file to version control

### 3. Images

Add your own images to an `images/` folder:
- Product images
- Logo images
- Service illustrations
- Any other visual assets

### 4. Branding

Update the following to match your business:

- **Logo**: Replace `logo.svg` with your company logo
- **Colors**: Update CSS color scheme in `styles.css`
- **Business Name**: Update all instances throughout the site
- **Services**: Customize the services offered in `services.html`
- **Pricing**: Update pricing information in `pricing.html`

### 5. Deployment

Follow the instructions in:
- `QUICK_START.md` - For local development
- `DEPLOYMENT.md` - For production deployment
- `TELEGRAM_SETUP.md` - For Telegram notifications
- `CHECKOUT_SETUP.md` - For Stripe checkout configuration

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy and configure environment variables:
   ```bash
   copy .env.example .env
   # Edit .env and add your Stripe secret key
   ```

3. Run locally:
   ```bash
   node server.js
   ```

4. Visit http://localhost:3000

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Payment Processing**: Stripe Checkout
- **Notifications**: Telegram Bot (optional)
- **Deployment**: Vercel

## Support

For questions about this demo or customization help, refer to the included documentation files:

- `README.md` - Main project documentation
- `QUICK_START.md` - Getting started guide
- `DEPLOYMENT.md` - Deployment instructions
- `PAYMENT_BUTTON_GUIDE.md` - Stripe payment button setup

## License

This is a demo version for evaluation and customization purposes.

---

**Remember**: This is a template. Make sure to customize all placeholder values before deploying to production!
