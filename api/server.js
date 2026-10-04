// =============================================================
// server.js - Express application entry point
// PROG2002 A2 - Charity Events API
// Run: npm install && npm start
// =============================================================
const express = require('express');
const cors = require('cors');
const path = require('path');

const { testConnection } = require('./event_db');
const eventsRouter = require('./routes/events');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Middleware ----------
app.use(cors());             // allow the client-side pages to call this API
app.use(express.json());     // parse JSON request bodies

// Serve the client-side website so everything can be previewed from
// one server: open http://localhost:3000/index.html after npm start
app.use(express.static(path.join(__dirname, '..', 'client')));

// Simple request logger for debugging / demonstrating in the video
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
    next();
});

// ---------- Routes ----------
app.get('/', (req, res) => {
    res.json({
        message: 'Charity Events API is running',
        endpoints: [
            'GET /api/events          - all active events (Home page)',
            'GET /api/categories      - all event categories',
            'GET /api/events/search   - filter events by date, location, category',
            'GET /api/events/:id      - full details of one event'
        ]
    });
});

// All /api/* endpoints live in routes/events.js
app.use('/api', eventsRouter);

// 404 for unknown API routes
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('[server] Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// ---------- Start ----------
testConnection().then(() => {
    app.listen(PORT, () => {
        console.log(`[server] Charity Events API listening on http://localhost:${PORT}`);
    });
});
