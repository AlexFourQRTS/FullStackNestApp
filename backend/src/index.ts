import express from 'express';
import cors from 'cors';

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

app.get('/api/stats', (req, res) => {
  res.json({
    totalUsers: 150,
    pendingRequests: 8,
    activeTasks: 42
  });
});

app.listen(port, () => {
  console.log(`🚀 Backend server running at http://localhost:${port}`);
});