const { validateTicketRequest } = require('../validators/requestValidator');
const llmService = require('../services/llmService');

async function classifyTicket(req, res, next) {
  try {
    const { error: validationError, value: ticket } = validateTicketRequest(req.body);
    
    if (validationError) {
      return res.status(400).json({
        error: validationError,
        code: 'VALIDATION_ERROR'
      });
    }
    
    const result = await llmService.classifyTicket(ticket);
    
    res.json(result);
    
  } catch (err) {
    if (err.message.includes('OPENAI_API_KEY')) {
      return res.status(503).json({
        error: 'LLM service not configured',
        code: 'LLM_SERVICE_UNAVAILABLE'
      });
    }
    
    if (err.message.includes('validation failed')) {
      return res.status(500).json({
        error: 'Failed to classify ticket',
        code: 'LLM_CLASSIFICATION_FAILED'
      });
    }
    
    next(err);
  }
}

module.exports = { classifyTicket };
