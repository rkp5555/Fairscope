import { AuditResult, Channel, ClientSensitivity, Currency, RequestItem, ScopeAddendum } from '../types';
import { runDeterministicDemoAudit } from './demoEngine';
import { generateId } from '../utils/formatters';

interface GeminiAuditRequest {
  apiKey: string;
  model?: string;
  contract: string;
  clientMessage: string;
  hourlyRate: number;
  currency: Currency;
  sensitivity: ClientSensitivity;
  channel: Channel;
  projectName?: string;
}

const AUDIT_RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    projectName: { type: 'STRING', description: 'Concise project name identified or inferred' },
    verdict: {
      type: 'STRING',
      enum: ['OUT_OF_SCOPE', 'PARTIAL_CREEP', 'IN_SCOPE'],
      description: 'The overall scope audit verdict'
    },
    riskScore: {
      type: 'INTEGER',
      description: 'Scope creep risk percentage from 0 to 100'
    },
    summary: {
      type: 'STRING',
      description: 'One executive sentence summarizing the scope boundary status'
    },
    extraHours: {
      type: 'NUMBER',
      description: 'Estimated additional uncontracted hours needed to fulfill this request'
    },
    items: {
      type: 'ARRAY',
      description: 'Itemized breakdown of every distinct ask in the client message',
      items: {
        type: 'OBJECT',
        properties: {
          ask: { type: 'STRING', description: 'Summary or exact quotation of the client request' },
          status: {
            type: 'STRING',
            enum: ['covered', 'exceeds_limit', 'excluded_new'],
            description: 'Whether this item is covered, exceeds limits, or is new out-of-scope work'
          },
          citation: {
            type: 'STRING',
            description: 'Contract clause or policy quotation that applies'
          },
          effortHours: {
            type: 'NUMBER',
            description: 'Hours estimated for this specific item'
          }
        },
        required: ['ask', 'status', 'citation', 'effortHours']
      }
    },
    responses: {
      type: 'OBJECT',
      properties: {
        warmCollaborative: {
          type: 'STRING',
          description: 'High rapport, collaborative diplomatic reply flagging boundaries gently'
        },
        firmBoundary: {
          type: 'STRING',
          description: 'Professional, assertive boundary response anchored strictly to signed contract'
        },
        paidUpsell: {
          type: 'STRING',
          description: 'Commercial change-order quote proposal with pricing, effort, and timeline extension'
        }
      },
      required: ['warmCollaborative', 'firmBoundary', 'paidUpsell']
    },
    addendum: {
      type: 'OBJECT',
      properties: {
        projectReference: { type: 'STRING', description: 'Project reference and addendum number' },
        clientName: { type: 'STRING', description: 'Client organization or contact' },
        date: { type: 'STRING', description: 'Current date YYYY-MM-DD' },
        addedDeliverables: {
          type: 'ARRAY',
          items: { type: 'STRING' },
          description: 'Bullet points of out-of-scope deliverables to add'
        },
        additionalCost: { type: 'NUMBER', description: 'Additional cost calculation' },
        revisedDeliveryDate: { type: 'STRING', description: 'Revised target delivery date YYYY-MM-DD' },
        termsNote: { type: 'STRING', description: 'Contractual terms confirmation' }
      },
      required: ['projectReference', 'clientName', 'date', 'addedDeliverables', 'additionalCost', 'revisedDeliveryDate', 'termsNote']
    }
  },
  required: ['projectName', 'verdict', 'riskScore', 'summary', 'extraHours', 'items', 'responses', 'addendum']
};

export async function runGeminiScopeAudit(req: GeminiAuditRequest): Promise<AuditResult> {
  const apiKey = req.apiKey?.trim();
  if (!apiKey) {
    // Fall back to deterministic demo engine
    return runDeterministicDemoAudit(req);
  }

  const primaryModel = req.model || 'gemini-4-hydrogen';
  const fallbackModel = 'gemini-3.8-flash';

  try {
    return await callGeminiApi(primaryModel, req);
  } catch (primaryErr: any) {
    console.warn(`Primary model ${primaryModel} failed (${primaryErr.message}). Retrying with fallback model ${fallbackModel}...`);
    try {
      return await callGeminiApi(fallbackModel, req);
    } catch (fallbackErr: any) {
      console.warn(`Fallback model ${fallbackModel} also failed (${fallbackErr.message}). Falling back to deterministic demo engine.`);
      return runDeterministicDemoAudit(req);
    }
  }
}

async function callGeminiApi(model: string, req: GeminiAuditRequest): Promise<AuditResult> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(req.apiKey.trim())}`;

  const systemPrompt = `You are [FairScope] Enterprise, a Principal Legal-Fintech Contract Auditor and Senior Freelance Boundary Protection Specialist.
Your job is to rigorously audit client incoming messages against the provided Contract / Statement of Work.
Evaluate whether the client's request is in-scope, partial scope creep, or out-of-scope.
Protect the freelancer's unbilled revenue and time boundaries while maintaining appropriate relationship calibration:
- Sensitivity setting: "${req.sensitivity}" (options: new client, long-term partner, repeat scope-creeper).
- Hourly Rate: ${req.hourlyRate} ${req.currency}.
- Channel: ${req.channel}.

Rules:
1. Always calculate effortHours realistically.
2. Cross-reference specific contract clauses, revision policies, or explicit exclusions.
3. For response drafts, craft 3 distinct options:
   - Warm & Collaborative: Friendly rapport, positive frame, polite boundary.
   - Firm Professional Boundary: Unambiguous, contractual, objective.
   - Paid Change-Order Upsell: Clear pricing itemization, timeline impact, ready to approve.
4. Output strict JSON matching the schema.`;

  const userContent = `Analyze the following freelance contract and client message:

=== CONTRACT / SCOPE OF WORK ===
${req.contract}

=== COMMERCIAL PARAMETERS ===
Hourly Rate: ${req.hourlyRate} ${req.currency}
Client Relationship Sensitivity: ${req.sensitivity}
Communication Channel: ${req.channel}

=== INCOMING CLIENT MESSAGE ===
${req.clientMessage}

Perform an exhaustive clause-by-clause scope audit now. Return pure JSON.`;

  const body = {
    contents: [
      {
        parts: [
          { text: userContent }
        ]
      }
    ],
    systemInstruction: {
      parts: [
        { text: systemPrompt }
      ]
    },
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: AUDIT_RESPONSE_SCHEMA,
      temperature: 0.2,
    }
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API HTTP ${response.status}: ${errorText}`);
  }

  const json = await response.json();
  const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    throw new Error('Gemini API returned empty candidate content');
  }

  const parsed = JSON.parse(rawText);
  const rate = req.hourlyRate || 1500;

  // Transform items with estimatedCost
  const items: RequestItem[] = (parsed.items || []).map((it: any) => ({
    id: generateId(),
    ask: it.ask,
    status: it.status,
    citation: it.citation,
    effortHours: Number(it.effortHours) || 0,
    estimatedCost: Math.round((Number(it.effortHours) || 0) * rate),
  }));

  const totalExtraHours = items.reduce((acc, curr) => acc + curr.effortHours, 0);
  const totalCost = items.reduce((acc, curr) => acc + curr.estimatedCost, 0);

  const addendum: ScopeAddendum = {
    projectReference: parsed.addendum?.projectReference || `${parsed.projectName || 'Project'} — Scope Addendum`,
    clientName: parsed.addendum?.clientName || 'Client Organization',
    date: parsed.addendum?.date || new Date().toISOString().split('T')[0],
    addedDeliverables: parsed.addendum?.addedDeliverables || items.filter(i => i.status !== 'covered').map(i => i.ask),
    additionalCost: totalCost,
    revisedDeliveryDate: parsed.addendum?.revisedDeliveryDate || new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    termsNote: parsed.addendum?.termsNote || 'Governed by principal agreement terms. Work begins upon written sign-off.',
  };

  return {
    id: generateId(),
    timestamp: new Date().toISOString(),
    projectName: parsed.projectName || 'Audited Project',
    clientChannel: req.channel,
    verdict: parsed.verdict || 'OUT_OF_SCOPE',
    riskScore: Math.min(100, Math.max(0, Number(parsed.riskScore) || 50)),
    summary: parsed.summary || 'Audit completed.',
    extraHours: totalExtraHours,
    unbilledRevenue: totalCost,
    quotedAmount: totalCost,
    items,
    responses: parsed.responses || {
      warmCollaborative: '',
      firmBoundary: '',
      paidUpsell: '',
    },
    addendum,
    contractSnippet: req.contract.slice(0, 300) + '...',
    clientMessage: req.clientMessage,
    hourlyRate: rate,
    currency: req.currency,
    syncedToWebhook: false,
  };
}
