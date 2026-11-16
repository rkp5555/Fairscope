import { AuditResult } from '../types';

export interface WebhookPayload {
  timestamp: string;
  projectName: string;
  clientChannel: string;
  verdict: string;
  riskScore: number;
  extraHours: number;
  quotedAmount: number;
  currency: string;
  summary: string;
  source: string;
}

export interface WebhookResult {
  success: boolean;
  message: string;
  status?: number;
}

export async function sendAuditWebhook(url: string, audit: AuditResult): Promise<WebhookResult> {
  if (!url || !url.trim()) {
    return { success: false, message: 'No webhook URL configured' };
  }

  const payload: WebhookPayload = {
    timestamp: audit.timestamp,
    projectName: audit.projectName,
    clientChannel: audit.clientChannel,
    verdict: audit.verdict,
    riskScore: audit.riskScore,
    extraHours: audit.extraHours,
    quotedAmount: audit.quotedAmount,
    currency: audit.currency,
    summary: audit.summary,
    source: '[FairScope] Enterprise',
  };

  try {
    const response = await fetch(url.trim(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Synced to Google Sheets via Webhook ✓',
        status: response.status,
      };
    } else {
      return {
        success: false,
        message: `Webhook returned HTTP ${response.status}`,
        status: response.status,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error?.message ? `Webhook network error: ${error.message}` : 'Webhook dispatch failed',
    };
  }
}
