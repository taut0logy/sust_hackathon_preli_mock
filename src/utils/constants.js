const CASE_TYPES = [
  'wrong_transfer',
  'payment_failed',
  'refund_request',
  'phishing_or_social_engineering',
  'other'
];

const SEVERITY_LEVELS = ['low', 'medium', 'high', 'critical'];

const DEPARTMENTS = [
  'customer_support',
  'dispute_resolution',
  'payments_ops',
  'fraud_risk'
];

const CHANNELS = ['app', 'sms', 'call_center', 'merchant_portal'];

const LOCALES = ['bn', 'en', 'mixed'];

const FORBIDDEN_PATTERNS = [
  /\bPIN\b/i,
  /\bOTP\b/i,
  /\bpassword\b/i,
  /\bcard\s*number\b/i,
  /share\s+your/i,
  /provide\s+your/i,
  /send\s+me\s+your/i,
  /tell\s+me\s+your/i
];

module.exports = {
  CASE_TYPES,
  SEVERITY_LEVELS,
  DEPARTMENTS,
  CHANNELS,
  LOCALES,
  FORBIDDEN_PATTERNS
};
