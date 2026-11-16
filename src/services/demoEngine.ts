import { AuditResult, Channel, ClientSensitivity, Currency, RequestItem, ScopeAddendum } from '../types';
import { generateId, formatCurrency } from '../utils/formatters';

interface AnalyzeParams {
  contract: string;
  clientMessage: string;
  hourlyRate: number;
  currency: Currency;
  sensitivity: ClientSensitivity;
  channel: Channel;
  projectName?: string;
}

export async function runDeterministicDemoAudit(params: AnalyzeParams): Promise<AuditResult> {
  // Simulate 0.9s realistic analysis time for snappiness
  await new Promise((resolve) => setTimeout(resolve, 900));

  const contractLower = params.contract.toLowerCase();
  const messageLower = params.clientMessage.toLowerCase();
  const rate = params.hourlyRate || 1500;
  const currency = params.currency || 'INR';
  const projectName = params.projectName || detectProjectName(params.contract, params.clientMessage);

  // Check for Preset 1 (E-commerce / Razorpay / B2B)
  const isEcommerce =
    messageLower.includes('razorpay') ||
    (messageLower.includes('b2b') && contractLower.includes('aura luxe')) ||
    contractLower.includes('aura luxe retail');

  // Check for Preset 2 (3D mockups / Branding / Rush)
  const isBranding =
    (messageLower.includes('bottle') && messageLower.includes('3d')) ||
    contractLower.includes('kinetics ai visual identity') ||
    (messageLower.includes('expo') && contractLower.includes('kinetics'));

  // Check for Preset 3 (Retainer / In-scope / Minor tweak)
  const isRetainer =
    contractLower.includes('solace wellness') ||
    (messageLower.includes('solace20') && messageLower.includes('carousel'));

  let items: RequestItem[] = [];
  let verdict: 'OUT_OF_SCOPE' | 'PARTIAL_CREEP' | 'IN_SCOPE' = 'OUT_OF_SCOPE';
  let riskScore = 88;
  let summary = '';

  if (isEcommerce) {
    verdict = 'OUT_OF_SCOPE';
    riskScore = 88;
    summary = 'Client requested an uncontracted payment gateway (Razorpay UPI Checkout) and a dedicated Wholesale B2B Inquiry Page, both explicitly excluded under Clause 4.2.';
    items = [
      {
        id: generateId(),
        ask: 'Razorpay UPI Checkout integration & webhook handling',
        status: 'excluded_new',
        citation: 'Clause 4.2 Explicit Exclusions: Domestic alternative payment gateways (Razorpay, Cashfree, UPI QR) strictly excluded. Standard agreement includes Stripe only.',
        effortHours: 6.5,
        estimatedCost: Math.round(6.5 * rate),
      },
      {
        id: generateId(),
        ask: 'Wholesale B2B Inquiry Page with bulk CSV file uploads & tiered pricing',
        status: 'excluded_new',
        citation: 'Clause 2.1 Scope: Strictly bounded to 5 core storefront templates (Home, Catalog, Product, Cart, Standard Checkout). Extra custom pages require Change Order.',
        effortHours: 4.5,
        estimatedCost: Math.round(4.5 * rate),
      }
    ];
  } else if (isBranding) {
    verdict = 'PARTIAL_CREEP';
    riskScore = 64;
    summary = 'Client requested 6 photorealistic 3D bottle renders and a high-priority 9-hour turnaround, exceeding agreed flat mockup assets and violating the 48-hour rush delivery policy.';
    items = [
      {
        id: generateId(),
        ask: '6 photorealistic 3D matte glass bottle packaging renders with embossed foil stamps',
        status: 'excluded_new',
        citation: 'Section 3 Explicit Exclusions: 3D photorealistic packaging renders and CAD bottle simulations excluded. Scope includes 3 standard flat mockup assets only.',
        effortHours: 4.0,
        estimatedCost: Math.round(4.0 * rate),
      },
      {
        id: generateId(),
        ask: 'Urgent same-day delivery by 9 PM tonight for upcoming tech expo',
        status: 'exceeds_limit',
        citation: 'Clause 2.2 Timeline: Rush turnaround under 48 hours requires a 35% priority scheduling surcharge.',
        effortHours: 1.5,
        estimatedCost: Math.round(1.5 * rate),
      }
    ];
  } else if (isRetainer) {
    verdict = 'IN_SCOPE';
    riskScore = 8;
    summary = 'Request involves swapping one slide image and updating a bullet point with a promo code, which are 100% permitted under the monthly retainer revision guidelines.';
    items = [
      {
        id: generateId(),
        ask: "Swap slide 3 stock image for founder's new portrait headshot",
        status: 'covered',
        citation: 'Clause 2.1 Included Support: Up to 2 minor text updates or replacement image swaps per asset permitted if requested at least 24 hours prior to publishing.',
        effortHours: 0,
        estimatedCost: 0,
      },
      {
        id: generateId(),
        ask: "Add early-bird promo code 'SOLACE20' to second bullet point in caption copy",
        status: 'covered',
        citation: 'Clause 2.1 Included Support: Caption copy tweaks and hashtag optimization included within active billing cycle.',
        effortHours: 0,
        estimatedCost: 0,
      }
    ];
  } else {
    // Dynamic sentence and clause extractor for custom contracts & messages
    items = parseDynamicCustomInputs(params.contract, params.clientMessage, rate);

    const nonCoveredCount = items.filter(i => i.status !== 'covered').length;
    const totalDetectedHours = items.reduce((sum, item) => sum + item.effortHours, 0);

    if (nonCoveredCount === 0) {
      verdict = 'IN_SCOPE';
      riskScore = 12;
      summary = `The incoming request aligns with your contract deliverables and active revision limits.`;
    } else if (totalDetectedHours > 8 || nonCoveredCount >= 2) {
      verdict = 'OUT_OF_SCOPE';
      riskScore = Math.min(94, 70 + Math.round(totalDetectedHours * 2.5));
      const firstAsk = items[0]?.ask || 'new uncontracted deliverables';
      summary = `Client request introduces uncontracted scope ("${firstAsk}") totaling ${totalDetectedHours.toFixed(1)} unbilled hours outside your signed agreement.`;
    } else {
      verdict = 'PARTIAL_CREEP';
      riskScore = Math.min(68, 38 + Math.round(totalDetectedHours * 4));
      summary = `The request contains scope creep introducing ${totalDetectedHours.toFixed(1)} unbilled hours that warrant a formal change-order adjustment.`;
    }
  }

  const extraHours = items.reduce((sum, item) => sum + item.effortHours, 0);
  const unbilledRevenue = items.reduce((sum, item) => sum + item.estimatedCost, 0);
  const quotedAmount = unbilledRevenue;

  // Generate Tone-Calibrated Responses
  const responses = generateCalibratedResponses({
    verdict,
    items,
    extraHours,
    quotedAmount,
    currency,
    sensitivity: params.sensitivity,
    projectName,
  });

  // Generate Formal Scope Addendum
  const addendum: ScopeAddendum = {
    projectReference: `${projectName} — Change Order #${Math.floor(10 + Math.random() * 89)}`,
    clientName: extractClientName(params.contract),
    date: new Date().toISOString().split('T')[0],
    addedDeliverables: items.filter(i => i.status !== 'covered').map(i => i.ask),
    additionalCost: quotedAmount,
    revisedDeliveryDate: getFutureDate(extraHours > 8 ? 5 : extraHours > 0 ? 3 : 1),
    termsNote: 'Terms and conditions of the principal contract remain fully effective. Work commences upon signed authorization.',
  };

  if (addendum.addedDeliverables.length === 0) {
    addendum.addedDeliverables = ['In-scope minor adjustments (no additional fee)'];
  }

  return {
    id: generateId(),
    timestamp: new Date().toISOString(),
    projectName,
    clientChannel: params.channel,
    verdict,
    riskScore,
    summary,
    extraHours,
    unbilledRevenue,
    quotedAmount,
    items,
    responses,
    addendum,
    contractSnippet: params.contract.slice(0, 300) + '...',
    clientMessage: params.clientMessage,
    hourlyRate: rate,
    currency,
    syncedToWebhook: false,
  };
}

/**
 * Dynamically parse custom client messages and contracts entered by the user
 */
function parseDynamicCustomInputs(contract: string, clientMessage: string, rate: number): RequestItem[] {
  // 1. Break client message into candidate ask statements
  const rawLines = clientMessage
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0);

  let rawAsks: string[] = [];

  // Check if user formatted with bullet points or numbered lists
  const bulletLines = rawLines.filter(l => /^[-*•\d.]+\s+/.test(l));
  if (bulletLines.length > 0) {
    rawAsks = bulletLines.map(l => l.replace(/^[-*•\d.]+\s+/, '').trim());
  } else {
    // Split message into sentences by punctuation
    const sentences = clientMessage
      .split(/(?<=[.?!])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 12);

    // Filter out common greetings & pleasantries
    const filtered = sentences.filter(s => {
      const lower = s.toLowerCase();
      if (/^(hey|hi|hello|good\s+morning|good\s+afternoon|hope\s+you|hope\s+all|thanks|thank\s+you|best|cheers|regards)/i.test(lower) && s.length < 45) {
        return false;
      }
      return true;
    });

    rawAsks = filtered.length > 0 ? filtered : sentences;
  }

  if (rawAsks.length === 0) {
    rawAsks = [clientMessage.trim().slice(0, 100)];
  }

  // Take top 1 to 3 distinct request statements
  const targetAsks = rawAsks.slice(0, 3);

  // 2. Extract potential contract clauses / exclusions from the contract text
  const contractLines = contract
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 8);

  const exclusionLines = contractLines.filter(l =>
    /exclusion|excluded|not included|out of scope|change order|additional fee|surcharge|extra/i.test(l)
  );

  const deliverableLines = contractLines.filter(l =>
    /deliverable|scope|specification|agreed|included|package|features/i.test(l)
  );

  return targetAsks.map((askText, idx) => {
    const askLower = askText.toLowerCase();

    // Extract significant keywords
    const keywords = askLower
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3 && !['could', 'would', 'should', 'please', 'really', 'there', 'about', 'before', 'after', 'right'].includes(w));

    // Find best matching exclusion line in contract
    let matchedCitation = '';
    for (const exLine of exclusionLines) {
      if (keywords.some(w => exLine.toLowerCase().includes(w))) {
        matchedCitation = exLine;
        break;
      }
    }

    // If not in exclusions, search deliverables / general lines
    if (!matchedCitation) {
      for (const line of contractLines) {
        if (keywords.some(w => line.toLowerCase().includes(w))) {
          matchedCitation = line;
          break;
        }
      }
    }

    // Determine status & effort hours
    let status: 'excluded_new' | 'exceeds_limit' | 'covered' = 'excluded_new';
    let hours = 4.5 + (idx * 1.5);

    if (/urgent|rush|asap|tonight|tomorrow|24\s*hour|immediately|fast|expedite/i.test(askLower)) {
      status = 'exceeds_limit';
      hours = 2.0;
      if (!matchedCitation) {
        const timelineMatch = contractLines.find(l => /timeline|schedule|delivery|turnaround|rush/i.test(l));
        matchedCitation = timelineMatch || 'Contract Timeline Policy: Expedited sprints outside the agreed project velocity require priority scheduling approval.';
      }
    } else if (/minor|tweak|small|typo|color|swap|replace\s+text|photo\s+swap/i.test(askLower)) {
      status = 'covered';
      hours = 0;
      if (!matchedCitation) {
        const revMatch = contractLines.find(l => /revision|support|included|minor/i.test(l));
        matchedCitation = revMatch || 'Included Revisions Clause: Routine editorial tweaks and minor asset replacements covered under agreed allowance.';
      }
    } else {
      if (!matchedCitation) {
        if (exclusionLines.length > 0) {
          matchedCitation = exclusionLines[idx % exclusionLines.length];
        } else if (deliverableLines.length > 0) {
          matchedCitation = `Scope Deliverables: Requests outside the agreed baseline (${deliverableLines[0]}) require a formal Change Order addendum.`;
        } else {
          matchedCitation = 'Contract Terms: Deliverables are strictly bounded to the signed specifications. Additional feature requests require a written Change Order.';
        }
      }
    }

    let cleanAsk = askText.replace(/^[-*•\d.]+\s+/, '').trim();
    if (cleanAsk.length > 105) {
      cleanAsk = cleanAsk.slice(0, 102) + '...';
    }

    return {
      id: generateId(),
      ask: cleanAsk,
      status,
      citation: matchedCitation.replace(/^[-*•\d.]+\s+/, '').trim(),
      effortHours: hours,
      estimatedCost: Math.round(hours * rate),
    };
  });
}

function detectProjectName(contract: string, message: string): string {
  const firstLine = contract.split('\n')[0].replace(/CONTRACT|SCOPE|OF|WORK|STATEMENT|SOW|:|#/gi, '').trim();
  if (firstLine.length > 4 && firstLine.length < 50) return firstLine;
  if (message.toLowerCase().includes('website') || message.toLowerCase().includes('store')) return 'Digital Commerce Platform';
  if (message.toLowerCase().includes('logo') || message.toLowerCase().includes('brand')) return 'Brand Identity & Visual System';
  return 'Client Project Deliverables';
}

function extractClientName(contract: string): string {
  const match = contract.match(/Client:\s*([^|\n]+)/i);
  if (match && match[1]) return match[1].trim();
  return 'Client Organization';
}

function getFutureDate(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
}

interface ResponseGenParams {
  verdict: 'OUT_OF_SCOPE' | 'PARTIAL_CREEP' | 'IN_SCOPE';
  items: RequestItem[];
  extraHours: number;
  quotedAmount: number;
  currency: Currency;
  sensitivity: ClientSensitivity;
  projectName: string;
}

function generateCalibratedResponses(p: ResponseGenParams) {
  const formattedCost = formatCurrency(p.quotedAmount, p.currency);
  const nonCovered = p.items.filter(i => i.status !== 'covered');

  if (p.verdict === 'IN_SCOPE') {
    return {
      warmCollaborative: `Hey team! Thanks for sending this over. Good news—all these refinements fall right within our agreed revision scope. I've noted the tweaks and will have the updated versions ready for you by tomorrow afternoon!`,
      firmBoundary: `Hi there, confirming receipt of your message. These adjustments are fully covered under our current milestone scope. No additional hours or costs are incurred, and delivery remains on schedule.`,
      paidUpsell: `Everything requested here is 100% in-scope at ${formattedCost} additional cost! Looking forward to delivering these revisions.`,
    };
  }

  // OUT OF SCOPE or PARTIAL CREEP
  const asksList = nonCovered.map(i => `• ${i.ask} (${i.effortHours} hrs)`).join('\n');

  if (p.sensitivity === 'new') {
    return {
      warmCollaborative: `Hey! Thanks for sharing this vision—these new additions will definitely elevate the project! 

To make sure we hit our original launch deadline smoothly, I wanted to mention that these requests (${nonCovered.map(i => i.ask).join(' & ')}) fall outside our initial baseline contract. 

I'd love to build these for you! I've put together a lightweight addendum for ${p.extraHours} hours at ${formattedCost}. Shall I add this to our sprint and adjust the handover timeline?`,
      firmBoundary: `Hi, thank you for the detailed request. 

Reviewing against our signed Statement of Work, the following items are not included in our baseline agreement:
${asksList}

To execute these without impacting the primary milestone delivery, a formal Change Order of ${formattedCost} (${p.extraHours} hrs) is required. Please confirm approval so we can schedule the work.`,
      paidUpsell: `Hi team! We can certainly implement these additions:
${asksList}

Investment required: ${formattedCost} (${p.extraHours} hours).
Estimated delivery extension: +3 business days.
Ready to proceed immediately upon approval!`
    };
  } else if (p.sensitivity === 'partner') {
    return {
      warmCollaborative: `Hi there! Really appreciate the update—these enhancements look great.

Because our current agreement is scoped specifically for the core milestones, tackling ${nonCovered.map(i => `"${i.ask}"`).join(' and ')} falls under an additional scope block. 

Given our great partnership, I can package this up at our preferred rate for ${formattedCost} (${p.extraHours} hrs). Let me know if that works for you and we'll dive right in!`,
      firmBoundary: `Hi team, thanks for sending these requirements.

As we want to keep our existing delivery commitments locked in, these additions (${nonCovered.map(i => i.ask).join(', ')}) represent ${p.extraHours} hours outside the current SOW. 

I've documented Change Order #${Math.floor(10 + Math.random() * 89)} for ${formattedCost}. Once signed, we will begin development right away.`,
      paidUpsell: `Hi! We'd love to build these new features into the project. For the ${p.extraHours} hours of development, the change order consideration is ${formattedCost}. Let's get this authorized so we can build them alongside current deliverables.`
    };
  } else {
    // Repeat Creeper: zero tolerance, crisp contractual fence
    return {
      warmCollaborative: `Hi, thank you for reaching out. 

To maintain transparency and project boundaries, please note that the requested items (${nonCovered.map(i => `"${i.ask}"`).join(' & ')}) are explicitly beyond our contracted deliverables. 

I have created Exhibit B Change Order for ${formattedCost} (${p.extraHours} hrs). Upon formal authorization and payment confirmation, we can queue this into engineering.`,
      firmBoundary: `Hello. Per our signed Agreement, the deliverables requested in your message are outside the contractual scope of work:
${asksList}

Work cannot commence on these features without an approved and funded Change Order of ${formattedCost} (${p.extraHours} hours). Please execute the attached addendum to proceed.`,
      paidUpsell: `Formal Change Order Notice: The requests represent ${p.extraHours} unbilled hours of technical work (${formattedCost}). Per contract policy, uncontracted feature requests require upfront Change Order authorization before scheduling.`
    };
  }
}
