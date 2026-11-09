import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { db } from './src/server/db';
import { askAiTutor } from './src/server/aiService';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// ----------------------------------------------------------------------------
// API ROUTES
// ----------------------------------------------------------------------------

// 1. Vocabulary & Lexical Relations
app.get('/api/vocabulary', (req: Request, res: Response) => {
  try {
    const { topic, toeicPart, priority, search, state } = req.query;
    const items = db.getVocabulary({
      topic: topic as string,
      toeicPart: toeicPart as string,
      priority: priority as string,
      search: search as string,
      state: state as string,
    });
    const reviews = db.getReviews();

    // Attach review state to each item
    const withReviews = items.map((v) => ({
      ...v,
      review: reviews[v.id] || {
        repetitionCount: 0,
        lapseCount: 0,
        intervalDays: 0,
        state: 'new',
        isBookmarked: false,
      },
    }));

    res.json({ success: true, count: withReviews.length, data: withReviews });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/vocabulary/:id', (req: Request, res: Response) => {
  const item = db.getVocabularyById(req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, error: 'Vocabulary item not found' });
  }
  const reviews = db.getReviews();
  res.json({ success: true, data: { ...item, review: reviews[item.id] } });
});

app.post('/api/vocabulary', (req: Request, res: Response) => {
  try {
    const created = db.addVocabularyItem(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 2. Flashcard Reviews & Spaced Repetition (FSRS / SM-2)
app.get('/api/flashcards/reviews', (_req: Request, res: Response) => {
  res.json({ success: true, data: db.getReviews() });
});

app.post('/api/flashcards/review', (req: Request, res: Response) => {
  const { vocabId, rating } = req.body;
  if (!vocabId || !rating) {
    return res.status(400).json({ success: false, error: 'vocabId and rating are required' });
  }
  if (!['again', 'hard', 'good', 'easy'].includes(rating)) {
    return res.status(400).json({ success: false, error: 'Invalid rating. Use again, hard, good, or easy' });
  }

  const updated = db.submitReviewRating(vocabId, rating);
  res.json({ success: true, data: updated });
});

app.post('/api/flashcards/bookmark', (req: Request, res: Response) => {
  const { vocabId } = req.body;
  if (!vocabId) {
    return res.status(400).json({ success: false, error: 'vocabId is required' });
  }
  const isBookmarked = db.toggleBookmark(vocabId);
  res.json({ success: true, isBookmarked });
});

// 3. Source Documents Library (TOEIC-001 to TOEIC-005)
app.get('/api/documents', (_req: Request, res: Response) => {
  res.json({ success: true, data: db.getDocuments() });
});

// 4. AI Tutor & Explanation Endpoints
app.post('/api/gemini/tutor', async (req: Request, res: Response) => {
  try {
    const { message, context } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }
    const reply = await askAiTutor({ message, context });
    res.json({ success: true, reply });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------------------------------------------------------------------
// SERVER & VITE INTEGRATION
// ----------------------------------------------------------------------------
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TOEIC MASTER AI Server running on port ${PORT} [production: ${isProduction}]`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
