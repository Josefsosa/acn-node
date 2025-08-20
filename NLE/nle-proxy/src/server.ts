import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';

// Dynamic import for node-fetch (ESM module)
let fetch: any;

const app = express();
const PORT = Number(process.env.PORT || 8787);

// CORS allow-list (comma-separated origins or *)
const allowList = (process.env.ALLOW_ORIGINS || '*')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowList.includes('*') || allowList.includes(origin)) return cb(null, true);
    return cb(new Error('CORS: origin not allowed'), false as any);
  }
}));

app.use(helmet({ contentSecurityPolicy: false as any }));
app.use(express.json({ limit: '2mb' }));
app.use(rateLimit({ windowMs: 60_000, max: 60 }));

function passthrough(res: Response, upstream: Response) {
  res.status((upstream as any).status);
  res.setHeader('Access-Control-Allow-Origin', '*');
  // @ts-ignore
  (upstream as any).headers.forEach((v: string, k: string) => {
    if (!['content-encoding','transfer-encoding','connection'].includes(k.toLowerCase())) {
      res.setHeader(k, v);
    }
  });
}

const AnthropicSchema = z.object({
  model: z.string(),
  max_tokens: z.number().int().positive().optional(),
  messages: z.array(z.object({ role: z.string(), content: z.any() }))
});

const OpenAISchema = z.object({
  model: z.string(),
  messages: z.array(z.object({ role: z.string(), content: z.any() })),
  temperature: z.number().optional(),
  max_tokens: z.number().int().positive().optional()
});

app.get('/health', (_req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({ ok: true, providerKeys: {
    anthropic: Boolean(process.env.ANTHROPIC_API_KEY),
    openai: Boolean(process.env.OPENAI_API_KEY)
  }});
});

app.post('/anthropic/messages', async (req: Request, res: Response) => {
  if (!process.env.ANTHROPIC_API_KEY) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({ error: 'Server missing ANTHROPIC_API_KEY' });
  }
  const parsed = AnthropicSchema.safeParse(req.body);
  if (!parsed.success) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(400).json({ error: 'Invalid body', details: parsed.error.format() });
  }
  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY as string,
        'anthropic-version': '2023-06-01',
        'accept': 'application/json'
      },
      body: JSON.stringify(parsed.data)
    });
    const text = await (upstream as any).text();
    passthrough(res, upstream as any);
    res.send(text);
  } catch (err: any) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(502).json({ error: 'Upstream error', detail: String(err?.message || err) });
  }
});

app.post('/openai/chat/completions', async (req: Request, res: Response) => {
  if (!process.env.OPENAI_API_KEY) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({ error: 'Server missing OPENAI_API_KEY' });
  }
  const parsed = OpenAISchema.safeParse(req.body);
  if (!parsed.success) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(400).json({ error: 'Invalid body', details: parsed.error.format() });
  }
  try {
    const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(parsed.data)
    });
    const text = await (upstream as any).text();
    passthrough(res, upstream as any);
    res.send(text);
  } catch (err: any) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(502).json({ error: 'Upstream error', detail: String(err?.message || err) });
  }
});

app.use((_req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(404).json({ error: 'Not found' });
});

// Initialize server after loading fetch
(async () => {
  const nodeFetch = await import('node-fetch');
  fetch = nodeFetch.default;
  
  app.listen(PORT, () => {
    console.log(`NLE proxy listening on http://localhost:${PORT}`);
  });
})();