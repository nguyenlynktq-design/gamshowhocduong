import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Vietnamese TTS Audio proxy route - PURE NATIVE VIETNAMESE FEMALE VOICE
  // Bypasses all client-side iframe restrictions & provides 100% authentic Vietnamese speech
  app.get('/api/tts', async (req, res) => {
    try {
      const text = (req.query.text as string) || '';
      if (!text) {
        return res.status(400).send('Missing text parameter');
      }

      // Safe length for TTS chunk
      const cleanText = text.slice(0, 200);
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=${encodeURIComponent(cleanText)}`;
      
      const upstreamRes = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'audio/mpeg,audio/*;q=0.9,*/*;q=0.8'
        }
      });

      if (!upstreamRes.ok) {
        return res.status(upstreamRes.status).send('TTS upstream error');
      }

      const buffer = await upstreamRes.arrayBuffer();
      res.set({
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400',
        'Accept-Ranges': 'bytes'
      });
      res.send(Buffer.from(buffer));
    } catch (err) {
      console.error('Error in /api/tts:', err);
      res.status(500).send('TTS service error');
    }
  });

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
