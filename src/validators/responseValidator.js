const { z } = require('zod');
const { CASE_TYPES, SEVERITY_LEVELS, DEPARTMENTS } = require('../utils/constants');

const responseSchema = z.object({
  ticket_id: z.string(),
  case_type: z.enum(CASE_TYPES),
  severity: z.enum(SEVERITY_LEVELS),
  department: z.enum(DEPARTMENTS),
  agent_summary: z.string().min(1),
  human_review_required: z.boolean(),
  confidence: z.number().min(0).max(1)
});

function validateLLMResponse(data) {
  try {
    const validated = responseSchema.parse(data);
    return { error: null, value: validated };
  } catch (err) {
    const messages = err.errors.map(e => `${e.path.join('.')}: ${e.message}`);
    return { error: messages.join(', '), value: null };
  }
}

module.exports = { validateLLMResponse };
