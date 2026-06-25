const Joi = require('joi');
const { CHANNELS, LOCALES } = require('../utils/constants');

const ticketSchema = Joi.object({
  ticket_id: Joi.string().required().messages({
    'string.empty': 'ticket_id is required',
    'any.required': 'ticket_id is required'
  }),
  message: Joi.string().min(1).required().messages({
    'string.empty': 'message is required',
    'string.min': 'message cannot be empty',
    'any.required': 'message is required'
  }),
  channel: Joi.string().valid(...CHANNELS).optional().messages({
    'any.only': `channel must be one of: ${CHANNELS.join(', ')}`
  }),
  locale: Joi.string().valid(...LOCALES).optional().messages({
    'any.only': `locale must be one of: ${LOCALES.join(', ')}`
  })
});

function validateTicketRequest(data) {
  const { error, value } = ticketSchema.validate(data, { abortEarly: false });
  
  if (error) {
    const messages = error.details.map(d => d.message);
    return { error: messages.join(', '), value: null };
  }
  
  return { error: null, value };
}

module.exports = { validateTicketRequest };
