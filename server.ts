import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { offlineEduGuideReply } from './src/offlineEduGuide';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const CHAT_RATE_LIMIT_PER_MINUTE = 10;
const CHAT_RATE_WINDOW_MS = 60_000;
const chatRequestWindows = new Map<string, { count: number; resetAt: number }>();

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

  app.post('/api/eduguide/chat', enforceChatRateLimit, (req, res) => {
    const { message, currentRoom } = req.body as {
      message?: string;
      currentRoom?: string;
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

    res.json({
      reply: offlineEduGuideReply(
        message.trim(),
        typeof currentRoom === 'string' ? currentRoom : 'lobby'
      ),
      mode: 'offline',
    });
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
