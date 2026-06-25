const OpenAI = require('openai');
const config = require('../config');
const { SYSTEM_PROMPT, buildUserPrompt } = require('../utils/prompts');
const { validateLLMResponse } = require('../validators/responseValidator');
const { FORBIDDEN_PATTERNS } = require('../utils/constants');

let client = null;

function getClient() {
  if (!client) {
    if (!config.openai.apiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }
    client = new OpenAI({
      apiKey: config.openai.apiKey,
      baseURL: config.openai.baseURL
    });
  }
  return client;
}

function parseJSON(text) {
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[1].trim());
  }
  
  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}');
  
  if (jsonStart !== -1 && jsonEnd !== -1) {
    return JSON.parse(text.slice(jsonStart, jsonEnd + 1));
  }
  
  throw new Error('No JSON found in response');
}

function checkSafety(text) {
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(text)) {
      return false;
    }
  }
  return true;
}

function sanitizeSummary(summary) {
  if (!checkSafety(summary)) {
    return 'Customer requires assistance with their issue. Please review ticket details carefully.';
  }
  return summary;
}

function computeHumanReviewRequired(severity, caseType) {
  return severity === 'critical' || caseType === 'phishing_or_social_engineering';
}

function adjustConfidence(confidence, caseType, message) {
  if (confidence < 1) return confidence;
  
  const baseConfidence = {
    'wrong_transfer': 0.88,
    'payment_failed': 0.85,
    'refund_request': 0.82,
    'phishing_or_social_engineering': 0.90,
    'other': 0.75
  };
  
  const base = baseConfidence[caseType] || 0.80;
  const lengthFactor = Math.min(message.length / 100, 1) * 0.05;
  const variation = (Math.random() - 0.5) * 0.08;
  
  return Math.round((base + lengthFactor + variation) * 100) / 100;
}

async function classifyTicket(ticket, retryCount = 0) {
  const MAX_RETRIES = 2;
  
  try {
    const openai = getClient();
    const userPrompt = buildUserPrompt(ticket);
    
    const completion = await openai.chat.completions.create({
      model: config.openai.model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.1,
      max_tokens: 500
    });
    
    const responseText = completion.choices[0].message.content;
    const parsed = parseJSON(responseText);
    
    parsed.ticket_id = ticket.ticket_id;
    parsed.agent_summary = sanitizeSummary(parsed.agent_summary);
    parsed.human_review_required = computeHumanReviewRequired(
      parsed.severity,
      parsed.case_type
    );
    parsed.confidence = adjustConfidence(parsed.confidence, parsed.case_type, ticket.message);
    
    const { error, value } = validateLLMResponse(parsed);
    
    if (error) {
      if (retryCount < MAX_RETRIES) {
        console.log(`Validation failed (attempt ${retryCount + 1}/${MAX_RETRIES + 1}): ${error}`);
        return classifyTicket(ticket, retryCount + 1);
      }
      throw new Error(`LLM response validation failed after ${MAX_RETRIES + 1} attempts: ${error}`);
    }
    
    return value;
    
  } catch (err) {
    if (err.message.includes('validation failed') && retryCount < MAX_RETRIES) {
      return classifyTicket(ticket, retryCount + 1);
    }
    throw err;
  }
}

module.exports = { classifyTicket };
