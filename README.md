# QueueStorm API

Customer support ticket classification API using LLM.

## Quick Start

1. Clone the repository
2. Copy `.env.example` to `.env` and add your OpenAI API key
3. Install dependencies: `npm install`
4. Start server: `npm start`

## API Endpoints

### GET /health

Returns service health status.

### POST /sort-ticket

Classifies a customer support ticket.

**Request:**
```json
{
  "ticket_id": "T-001",
  "channel": "app",
  "locale": "en",
  "message": "I sent 5000 taka to a wrong number"
}
```

**Response:**
```json
{
  "ticket_id": "T-001",
  "case_type": "wrong_transfer",
  "severity": "high",
  "department": "dispute_resolution",
  "agent_summary": "Customer reports sending 5000 BDT to a wrong number and requests recovery.",
  "human_review_required": true,
  "confidence": 0.85
}
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `OPENAI_API_KEY` | - | OpenAI API key (required) |
| `OPENAI_BASE_URL` | `https://api.openai.com/v1` | OpenAI API base URL |
| `OPENAI_MODEL` | `gpt-4o-mini` | Model to use |
| `PORT` | `3000` | Server port |

## Deployment

### Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Docker

```bash
docker build -t queuestorm-api .
docker run -p 3000:3000 -e OPENAI_API_KEY=sk-... queuestorm-api
```

## License

MIT
