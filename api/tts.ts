// Vercel Serverless Function for Vietnamese Voice TTS (/api/tts)
// Allows Vercel deployments to serve authentic Vietnamese speech without CORS issues
export default async function handler(req: any, res: any) {
  try {
    const text = (req.query?.text as string) || '';
    if (!text) {
      return res.status(400).send('Missing text parameter');
    }

    const cleanText = text.slice(0, 200);
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=${encodeURIComponent(cleanText)}`;

    const upstreamRes = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'audio/mpeg,audio/*;q=0.9,*/*;q=0.8'
      }
    });

    if (!upstreamRes.ok) {
      return res.status(upstreamRes.status).send('TTS upstream error');
    }

    const buffer = await upstreamRes.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.status(200).send(Buffer.from(buffer));
  } catch (err) {
    console.error('Vercel TTS error:', err);
    return res.status(500).send('TTS service error');
  }
}
