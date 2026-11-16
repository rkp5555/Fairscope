import { PresetScenario } from '../types';

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'preset-ecommerce',
    title: 'E-Commerce Website Build',
    subtitle: 'High Scope Creep (Razorpay Integration + Extra B2B Page)',
    riskTag: 'High Scope Creep',
    projectName: 'Aura Luxe Retail Storefront',
    contract: `CONTRACT & SCOPE OF WORK: Aura Luxe Retail Storefront
Client: Apex Global Retail Ltd. | Provider: Studio Craft Freelance
Base Agreement Total: ₹1,20,000 | Standard Hourly Rate: ₹1,500/hr

1. DELIVERABLES & CORE SPECIFICATIONS:
- 5-page custom responsive e-commerce storefront: Home, Product Catalog, Product Detail, Cart, and Standard Checkout.
- Primary Payment Gateway: Standard Stripe Checkout (Credit/Debit cards).
- Content upload for up to 25 catalog products (images, descriptions, SKUs).
- Up to 2 rounds of design revisions on Figma mockups prior to frontend engineering.
- Handover period: 14 business days from kickoff.

2. REVISION & AMENDMENT POLICY:
- Scope is strictly bounded by the 5 agreed templates. Additional pages or custom routing require a formal Change Order.
- Third-party webhook setup is restricted to Stripe standard callbacks.

3. EXPLICIT EXCLUSIONS (Clause 4.2):
- Any domestic alternative payment gateways (e.g. Razorpay, Cashfree, PayU, UPI QR / NetBanking flow).
- Custom wholesale/B2B tier pricing forms with file uploads or KYC validation.
- Multi-currency dynamic rate converters and international tax engine calculators.
- Unscheduled expedited 24-hour turnaround or weekend engineering sprints.`,
    hourlyRate: 1500,
    currency: 'INR',
    sensitivity: 'repeat_creeper',
    channel: 'whatsapp',
    clientMessage: `Hey team! Quick update from our Friday sync: Our finance director insists we MUST offer Razorpay with UPI auto-collect at checkout instead of Stripe for the launch. Also, our wholesale partners need a dedicated B2B Inquiry Page with bulk CSV file uploads and tiered quote calculators before we go live. 

Should only take a couple of hours right? We really need this finished by tomorrow evening so we can demo it to our angel investors! Thanks a ton! 🙏`
  },
  {
    id: 'preset-branding',
    title: 'Brand Identity & Logo Package',
    subtitle: 'Partial Creep (Extra 3D Mockups & Urgent Rush Turnaround)',
    riskTag: 'Partial Creep',
    projectName: 'Kinetics AI Brand System',
    contract: `STATEMENT OF WORK: Kinetics AI Visual Identity
Client: Kinetics Robotics Inc. | Total Contract: ₹65,000
Effective Hourly Rate: ₹1,500/hr

1. AGREED DELIVERABLES:
- Primary brand logo, secondary icon mark, and responsive favicons (SVG, PNG, EPS).
- Comprehensive Typography & Color Palette design system (16-page Brand Book PDF).
- 3 standard flat mockup assets (Business card, Letterhead, and Twitter/LinkedIn social banners).
- Revision Limit: Up to 3 iterations on the selected concept (Round 2 already approved).

2. TIMELINE & DELIVERY SCHEDULE:
- Delivery phase completed over 10 working days.
- Rush work under 48 hours requires a 35% priority scheduling retainer.

3. EXPLICIT EXCLUSIONS:
- 3D photorealistic packaging renders, glassmorphism bottle simulations, or physical trade-show stall CAD mockups.
- Unlimited rounds of alterations after Stage 2 approval.`,
    hourlyRate: 1500,
    currency: 'INR',
    sensitivity: 'partner',
    channel: 'email',
    clientMessage: `Hi there! We are completely in love with the Round 2 logo direction — huge kudos! 

Quick ask: our marketing lead is heading to an international tech expo this Thursday morning. Could you render 6 photorealistic 3D matte glass bottle mockups with embossed foil foil stamps of the new icon? Also, since time is super tight, can we have the final print files by tonight around 9 PM? Really appreciate your flexibility on this!`
  },
  {
    id: 'preset-retainer',
    title: 'Monthly Social Media Retainer',
    subtitle: 'In-Scope Request (Minor Copy Tweak & Image Replacement)',
    riskTag: 'In-Scope',
    projectName: 'Solace Wellness Digital Retainer',
    contract: `MONTHLY SERVICE RETAINER: Solace Wellness Studio
Tier: Growth Retainer (₹45,000/month) | Billing Rate: ₹1,500/hr

1. MONTHLY ALLOTTED SCOPE:
- 12 curated carousel posts (up to 6 slides per carousel) for Instagram & LinkedIn.
- 4 short-form promotional Reels (editing & caption copywriting).
- Scheduling and queue management via client's Buffer dashboard.
- Monthly performance reporting and hashtag optimization.

2. INCLUDED REVISIONS & SUPPORT:
- Up to 2 minor text updates or replacement image swaps per asset if requested at least 24 hours prior to scheduled publishing.
- Regular Slack communication during standard business hours (10 AM - 6 PM IST).

3. EXCLUSIONS:
- Paid ad campaign management and daily community DM answering.`,
    hourlyRate: 1500,
    currency: 'INR',
    sensitivity: 'new',
    channel: 'slack',
    clientMessage: `Hey! Hope you are having a productive week! For Friday's carousel post (#07 on mindful breathing), could we swap slide 3's stock photo for our founder's new portrait (attached)? Also, could you please adjust the second bullet point in the caption to mention our early-bird promo code 'SOLACE20'? Everything else is looking fantastic!`
  }
];
