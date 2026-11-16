import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const CHAT_RATE_LIMIT_PER_MINUTE = 10;
const CHAT_RATE_WINDOW_MS = 60_000;
const chatRequestWindows = new Map<string, { count: number; resetAt: number }>();

interface ChatHistoryItem {
  role: 'user' | 'model';
  text: string;
}

function getOpenRouterApiKey(): string {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured in the backend environment.');
  }
  return apiKey;
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function getOpenRouterReply(payload: unknown): string | undefined {
  const choices = asRecord(payload)?.choices;
  if (!Array.isArray(choices)) return undefined;

  const message = asRecord(asRecord(choices[0])?.message);
  const content = message?.content;

  if (typeof content === 'string') return content.trim() || undefined;
  if (!Array.isArray(content)) return undefined;

  const text = content
    .map((part) => asRecord(part)?.text)
    .filter((part): part is string => typeof part === 'string')
    .join('')
    .trim();

  return text || undefined;
}

function getOpenRouterError(
  payload: unknown,
  status: number,
  statusText: string
): string {
  const error = asRecord(payload)?.error;
  const message =
    typeof error === 'string'
      ? error
      : asRecord(error)?.message;
  return `OpenRouter request failed (${status}): ${
    typeof message === 'string' && message.trim() ? message : statusText
  }`;
}

function enforceChatRateLimit(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const now = Date.now();
  for (const [ip, window] of chatRequestWindows) {
    if (window.resetAt <= now) chatRequestWindows.delete(ip);
  }

  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const window = chatRequestWindows.get(ip);
  if (!window || window.resetAt <= now) {
    chatRequestWindows.set(ip, {
      count: 1,
      resetAt: now + CHAT_RATE_WINDOW_MS,
    });
    next();
    return;
  }

  if (window.count >= CHAT_RATE_LIMIT_PER_MINUTE) {
    res.setHeader(
      'Retry-After',
      String(Math.ceil((window.resetAt - now) / 1000))
    );
    res.status(429).json({
      error: 'EduGuide is receiving too many messages. Please try again shortly.',
    });
    return;
  }

  window.count += 1;
  next();
}

async function startServer() {
  const app = express();
  app.set('trust proxy', 1);

  const allowedOrigins = new Set(
    (
      process.env.ALLOWED_ORIGINS ||
      'http://localhost:3000,http://127.0.0.1:3000'
    )
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean)
  );

  app.use('/api', (req, res, next) => {
    const origin = req.get('Origin');
    if (origin && !allowedOrigins.has(origin)) {
      res.status(403).json({ error: 'This origin is not allowed to use EduGuide.' });
      return;
    }

    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.setHeader('Access-Control-Max-Age', '600');
    }

    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }

    next();
  });

  app.use(express.json({ limit: '32kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.post('/api/eduguide/chat', enforceChatRateLimit, async (req, res) => {
    try {
      const { message, currentRoom, history } = req.body as {
        message?: string;
        currentRoom?: string;
        history?: ChatHistoryItem[];
      };

      if (!message || typeof message !== 'string' || !message.trim()) {
        res.status(400).json({ error: 'Please enter a message for EduGuide.' });
        return;
      }
      if (message.length > 2000) {
        res.status(413).json({
          error: 'Please keep your question under 2,000 characters.',
        });
        return;
      }

      const apiKey = getOpenRouterApiKey();

      const safeHistory = Array.isArray(history)
        ? history
            .slice(-10)
            .filter(
              (item) =>
                item &&
                (item.role === 'user' || item.role === 'model') &&
                typeof item.text === 'string' &&
                item.text.trim().length > 0
            )
            .map((item) => ({
              role: item.role === 'model' ? 'assistant' : 'user',
              content: item.text,
            }))
        : [];

      const systemInstruction = `You are EduGuide, the friendly, knowledgeable personal museum guide for the Virtual Network Museum (Class IX — Digital Technology and Innovation, Chapter 5: Computer Networks).
The museum has four main exhibit rooms, the Museum Lobby ('lobby'), and Back to Explore ('explore'):
1. Packets Room: What a packet is (small chunk of data), how data is split, numbered, routed independently via routers, and reassembled; Packet Anatomy (Header with source/destination IP & sequence number, Payload with actual data, Trailer with error-checking CRC); Packet Journey simulation; 19-slide Teacher Presentation and Packets Quiz.
2. Transmission Media Room: Wired/Bounded Media (Twisted-Pair Cable — UTP & STP, Coaxial Cable — copper core, insulation, braided metallic shield, outer jacket, and Fibre-Optic Cable — Single-mode 8-10 µm core, Multimode 50-62.5 µm core, and Plastic Optical Fibre ~980 µm core carrying pulses of light) and Wireless/Unbounded Media (Radio Waves, Microwaves, Infrared, and Satellite).
3. Netiquette Room: Six Rules of Netiquette (respectful communication, avoiding offensive language, respecting privacy, checking facts before sharing, thinking before posting, matching language to context), Scenario Gallery, and Classroom Roleplay Scripts.
4. Mobile Communication Room: Wireless mobile devices, radio waves, cell towers, SIM cards across 2G/3G/4G/5G networks, everyday mobile uses, and the 60-mark Presentation Rubric.
5. Back to Explore ('explore'): Review key ideas across all 4 rooms (Packets/Efficiency, Transmission Media/Connection, Netiquette/Respect, Mobile Communication/Mobility), Video Theatre, and the 4-question Reflection Wall.

The visitor is currently viewing room: "${currentRoom || 'lobby'}".
Keep answers clear, encouraging, accurate for Class IX students, and concise (2 to 5 short sentences or clean bullet points). Use relatable analogies when helpful.`;

      const response = await fetch(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://namgay2005.github.io/Virtual_Network-Museum/',
            'X-OpenRouter-Title': 'Virtual Network Museum',
          },
          body: JSON.stringify({
            model: 'openrouter/free',
            messages: [
              { role: 'system', content: systemInstruction },
              ...safeHistory,
              { role: 'user', content: message.trim() },
            ],
            max_tokens: 400,
          }),
        },
      );

      const payload: unknown = await response.json();
      if (!response.ok) {
        throw new Error(
          getOpenRouterError(payload, response.status, response.statusText)
        );
      }

      const replyText = getOpenRouterReply(payload);
      if (!replyText) {
        throw new Error('OpenRouter returned an empty response.');
      }

      res.json({ reply: replyText });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unable to reach EduGuide right now.';
      console.error('EduGuide chat error:', errorMessage);
      res.status(500).json({ error: errorMessage });
    }
  });

  if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Virtual Network Museum server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
