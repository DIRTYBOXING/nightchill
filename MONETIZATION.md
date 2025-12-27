# NightChill Monetization Strategy

## Overview

NightChill's monetization is designed to be ethical, non-exploitative, and aligned with our mission of helping people rebuild through wellness. We prioritize user wellbeing over profit extraction.

---

## Revenue Streams

### 1. Freemium Subscription Model

#### Free Tier (NightChill Basic)
**Available to everyone, forever free:**
- ✅ Full map access to gyms, mentors, sponsors
- ✅ Basic journey tracking (5 levels)
- ✅ Daily check-ins and streak tracking
- ✅ Receive coffee QR codes from sponsors
- ✅ Connect with 1 mentor at a time
- ✅ Basic rewards and badges
- ✅ Community support features

#### Premium Tier (NightChill Pro) - $9.99/month or $79.99/year
**Enhanced features for committed users:**
- ✅ Everything in Free tier
- ✅ Unlimited mentor connections
- ✅ Advanced analytics dashboard
- ✅ Mood trend analysis
- ✅ Custom journey milestones
- ✅ Priority support
- ✅ Early access to new features
- ✅ Ad-free experience
- ✅ Export your data
- ✅ Family sharing (up to 3 people)

#### Mentor Tier (NightChill Mentor) - $4.99/month
**For verified mentors:**
- ✅ Mentor profile and verification badge
- ✅ Connect with unlimited mentees
- ✅ Mentor dashboard and analytics
- ✅ Schedule management tools
- ✅ Impact tracking (lives helped)
- ✅ Mentor community access

### 2. Coffee Sponsorship System

#### How It Works
1. Sponsors purchase "Coffee Credits" ($5, $10, $25, $50 packages)
2. Credits are converted to QR codes
3. Users redeem QR codes at partner cafés
4. NightChill facilitates the transaction

#### Pricing Structure
| Package | Credits | QR Codes | Price | Platform Fee |
|---------|---------|----------|-------|--------------|
| Single | 1 | 1 coffee | $5 | $0.50 (10%) |
| Bundle | 5 | 5 coffees | $22 | $2.00 (9%) |
| Generous | 10 | 10 coffees | $40 | $3.50 (8.75%) |
| Hero | 25 | 25 coffees | $90 | $7.50 (8.3%) |

#### Revenue Split
- **Coffee Shop:** $3.50 per coffee (average)
- **NightChill Platform:** $0.50 - $1.00 per coffee
- **Payment Processing:** $0.30 + 2.9% (Stripe)

### 3. Gym Partnership Program

#### Partner Gym Tiers

**Basic Partner (Free)**
- Listed on NightChill map
- Basic profile and contact info
- Check-in tracking for their location
- Access to NightChill user community

**Verified Partner ($49/month)**
- "Anxiety-Friendly Verified" badge
- Featured placement in search results
- Detailed analytics on check-ins
- Promotional tools and templates
- Priority support
- Co-branded marketing materials

**Premium Partner ($149/month)**
- Everything in Verified tier
- Sponsored map placement
- In-app promotions to nearby users
- Integration with gym management software
- Dedicated account manager
- Quarterly strategy calls

#### Revenue Potential
| Partners | Tier | Monthly Revenue |
|----------|------|-----------------|
| 50 | Basic | $0 |
| 100 | Verified | $4,900 |
| 20 | Premium | $2,980 |
| **Total** | | **$7,880/month** |

### 4. Corporate Wellness Programs

#### Enterprise Offering
Companies can purchase NightChill access for employees:

**Team Plan (10-50 employees):** $7/user/month
- Full Pro features for all employees
- Team wellness dashboard
- Anonymous aggregate reporting
- Dedicated support

**Enterprise Plan (50+ employees):** $5/user/month
- Everything in Team Plan
- Custom branding options
- SSO integration
- API access
- Dedicated account manager
- Quarterly wellness reports

#### B2B Revenue Potential
| Company Size | Users | Price/User | Monthly Revenue |
|--------------|-------|------------|-----------------|
| Small (10) | 10 | $7 | $70 |
| Medium (50) | 50 | $7 | $350 |
| Large (200) | 200 | $5 | $1,000 |
| Enterprise (1000) | 1000 | $5 | $5,000 |

### 5. Grants and Philanthropy

#### Target Funding Sources
- Mental health foundations
- Government wellness initiatives
- Corporate social responsibility programs
- Impact investors focused on mental health

#### Grant-Eligible Programs
- Concession access for low-income users
- Rural and remote area expansion
- Research partnerships with universities
- Youth mental health initiatives

---

## Pricing Philosophy

### What We Will NEVER Do

❌ **Sell user data** - Your wellness journey is private
❌ **Show ads for unhealthy products** - No junk food, alcohol, gambling
❌ **Create artificial urgency** - No manipulative countdown timers
❌ **Paywall crisis features** - Help is always free
❌ **Shame non-payers** - Free users are valued community members
❌ **Use dark patterns** - Clear, honest pricing always

### Concession Program

For users experiencing financial hardship:

**Eligibility:**
- Healthcare card holders
- Students
- Unemployed (actively seeking work)
- Domestic violence survivors
- Veterans

**Benefits:**
- Pro features at 50% discount ($4.99/month)
- Free access available on application
- No documentation required (trust-based)
- Confidential status

---

## Revenue Projections

### Year 1 Targets

| Revenue Stream | Monthly Target | Annual Target |
|----------------|----------------|---------------|
| Pro Subscriptions (500 users) | $4,000 | $48,000 |
| Coffee Sponsorships | $1,500 | $18,000 |
| Gym Partnerships (30) | $2,000 | $24,000 |
| Corporate (2 companies) | $1,000 | $12,000 |
| **Total** | **$8,500** | **$102,000** |

### Year 3 Targets

| Revenue Stream | Monthly Target | Annual Target |
|----------------|----------------|---------------|
| Pro Subscriptions (5,000 users) | $40,000 | $480,000 |
| Coffee Sponsorships | $15,000 | $180,000 |
| Gym Partnerships (200) | $15,000 | $180,000 |
| Corporate (20 companies) | $20,000 | $240,000 |
| Grants | $5,000 | $60,000 |
| **Total** | **$95,000** | **$1,140,000** |

---

## Implementation Roadmap

### Phase 1: Foundation (Months 1-3)
- [ ] Launch free tier with full features
- [ ] Implement Stripe payment integration
- [ ] Create subscription management UI
- [ ] Set up gym partnership onboarding

### Phase 2: Premium Launch (Months 4-6)
- [ ] Launch Pro subscription tier
- [ ] Implement coffee sponsorship system
- [ ] Onboard first 10 partner gyms
- [ ] Launch mentor subscription tier

### Phase 3: Scale (Months 7-12)
- [ ] Launch corporate wellness program
- [ ] Expand gym partnerships to 50+
- [ ] Apply for mental health grants
- [ ] Introduce family sharing

### Phase 4: Expansion (Year 2+)
- [ ] International expansion
- [ ] Additional language support
- [ ] API for third-party integrations
- [ ] White-label solutions

---

## Payment Integration

### Stripe Configuration

```javascript
// stripe-config.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const products = {
  pro_monthly: {
    priceId: 'price_nightchill_pro_monthly',
    amount: 999, // $9.99
    interval: 'month'
  },
  pro_yearly: {
    priceId: 'price_nightchill_pro_yearly',
    amount: 7999, // $79.99
    interval: 'year'
  },
  mentor_monthly: {
    priceId: 'price_nightchill_mentor_monthly',
    amount: 499, // $4.99
    interval: 'month'
  },
  coffee_single: {
    priceId: 'price_coffee_single',
    amount: 500, // $5.00
    type: 'one_time'
  },
  coffee_bundle: {
    priceId: 'price_coffee_bundle',
    amount: 2200, // $22.00
    type: 'one_time'
  }
};

async function createSubscription(userId, priceId) {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.APP_URL}/subscription/success`,
    cancel_url: `${process.env.APP_URL}/subscription/cancel`,
    client_reference_id: userId,
    metadata: { userId }
  });
  return session;
}
```

### In-App Purchase (Flutter)

```dart
// lib/services/purchase_service.dart
import 'package:in_app_purchase/in_app_purchase.dart';

class PurchaseService {
  static const Set<String> _productIds = {
    'nightchill_pro_monthly',
    'nightchill_pro_yearly',
    'nightchill_mentor_monthly',
    'coffee_credits_5',
    'coffee_credits_10',
    'coffee_credits_25',
  };

  final InAppPurchase _inAppPurchase = InAppPurchase.instance;

  Future<void> initializePurchases() async {
    final available = await _inAppPurchase.isAvailable();
    if (!available) return;

    final response = await _inAppPurchase.queryProductDetails(_productIds);
    // Handle products...
  }

  Future<void> buySubscription(String productId) async {
    final productDetails = await _getProductDetails(productId);
    final purchaseParam = PurchaseParam(productDetails: productDetails);
    await _inAppPurchase.buyNonConsumable(purchaseParam: purchaseParam);
  }
}
```

---

## Analytics & Metrics

### Key Performance Indicators (KPIs)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Monthly Active Users (MAU) | 10,000 | Firebase Analytics |
| Free to Paid Conversion | 5% | Stripe + Firebase |
| Monthly Recurring Revenue (MRR) | $10,000 | Stripe Dashboard |
| Churn Rate | < 5% | Stripe |
| Lifetime Value (LTV) | $120 | Calculated |
| Customer Acquisition Cost (CAC) | < $20 | Marketing spend / new users |
| Net Promoter Score (NPS) | > 50 | In-app surveys |

### Tracking Implementation

```javascript
// Analytics events for monetization
analytics.logEvent('subscription_started', {
  plan: 'pro_monthly',
  price: 9.99,
  source: 'upgrade_prompt'
});

analytics.logEvent('coffee_sponsored', {
  quantity: 5,
  amount: 22.00,
  anonymous: true
});

analytics.logEvent('gym_partnership_signup', {
  tier: 'verified',
  gym_id: 'gym_123'
});
```

---

## Ethical Considerations

### Accessibility Commitment

1. **Core features remain free** - Journey tracking, map access, basic support
2. **No paywall for safety** - Crisis resources always accessible
3. **Concession pricing** - Reduced rates for those in need
4. **Transparent pricing** - No hidden fees or surprises

### Revenue Reinvestment

We commit to reinvesting a portion of revenue into:
- 10% - Mental health research partnerships
- 5% - Concession program funding
- 5% - Community grants for new gym partners

---

**Small steps. Lasting strength. Real belonging.**

*Last Updated: December 2024*
