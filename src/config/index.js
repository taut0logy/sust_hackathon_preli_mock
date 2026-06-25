require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini'
  }
};

module.exports = config;
