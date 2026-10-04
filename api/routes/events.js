// =============================================================
// routes/events.js - RESTful API endpoints (GET only in A2)
// PROG2002 A2 - Charity Events API
//
// RESTful design notes:
//  - Resource-based URLs:          /api/events, /api/categories
//  - Plural nouns for collections: /api/events (not /getEvents)
//  - Path parameter identifies one resource: /api/events/5
//  - Filtering uses query strings: /api/events/search?location=Gold%20Coast
//  - Only GET is implemented; POST/PUT/DELETE come in Assessment 3.
// =============================================================
const express = require('express');
const router = express.Router();
const { pool } = require('../event_db');

// SQL used by several endpoints: event joined with its category & organisation
const BASE_SELECT = `
    SELECT
        e.event_id,
        e.event_name,
        e.event_description,
        e.event_date,
        e.end_date,
        e.location,
        e.venue,
        e.ticket_price,
        e.goal_amount,
        e.raised_amount,
        e.status,
        e.category_id,
        c.category_name,
        e.org_id,
        o.org_name,
        o.org_email,
        o.org_phone
    FROM events e
    INNER JOIN categories c     ON e.category_id = c.category_id
    INNER JOIN organisations o  ON e.org_id = o.org_id
`;

// -------------------------------------------------------------
// 1) GET /api/events
//    Home page data: every ACTIVE event, newest order by date.
//    (Suspended events are hidden; the client marks past/upcoming.)
// -------------------------------------------------------------
router.get('/events', async (req, res) => {
    try {
        const sql = BASE_SELECT +
            ` WHERE e.status = 'active' ORDER BY e.event_date ASC`;
        const [rows] = await pool.query(sql);
        res.json(rows);
    } catch (err) {
        console.error('[api] GET /events failed:', err.message);
        res.status(500).json({ error: 'Failed to retrieve events' });
    }
});

// -------------------------------------------------------------
// 2) GET /api/categories
//    Used by the Search page to build its category filter.
// -------------------------------------------------------------
router.get('/categories', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT category_id, category_name FROM categories ORDER BY category_name ASC'
        );
        res.json(rows);
    } catch (err) {
        console.error('[api] GET /categories failed:', err.message);
        res.status(500).json({ error: 'Failed to retrieve categories' });
    }
});

// -------------------------------------------------------------
// 3) GET /api/events/search?date=YYYY-MM-DD&location=text&category=id
//    Search page data. Criteria are combined with AND and all
//    optional, but at least one must be provided.
//    NOTE: must be declared BEFORE /events/:id, otherwise
//    "search" would be captured as an :id parameter.
// -------------------------------------------------------------
router.get('/events/search', async (req, res) => {
    const { date, location, category } = req.query;

    // --- Server-side validation ---
    if (!date && !location && !category) {
        return res.status(400).json({
            error: 'Please provide at least one search criterion (date, location or category).'
        });
    }
    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({ error: 'Invalid date format. Expected YYYY-MM-DD.' });
    }
    if (category && !/^\d+$/.test(category)) {
        return res.status(400).json({ error: 'Invalid category.' });
    }

    // --- Build the WHERE clause dynamically from supplied criteria ---
    const conditions = ["e.status = 'active'"];
    const params = [];

    if (date) {
        conditions.push('DATE(e.event_date) = ?');   // match events on that day
        params.push(date);
    }
    if (location) {
        conditions.push('e.location LIKE ?');       // partial, case-insensitive match
        params.push(`%${location}%`);
    }
    if (category) {
        conditions.push('e.category_id = ?');
        params.push(category);
    }

    const sql = BASE_SELECT +
        ` WHERE ${conditions.join(' AND ')} ORDER BY e.event_date ASC`;

    try {
        const [rows] = await pool.query(sql, params);
        res.json(rows);
    } catch (err) {
        console.error('[api] GET /events/search failed:', err.message);
        res.status(500).json({ error: 'Search failed' });
    }
});

// -------------------------------------------------------------
// 4) GET /api/events/:id
//    Event details page data: full information for ONE event.
// -------------------------------------------------------------
router.get('/events/:id', async (req, res) => {
    const id = Number.parseInt(req.params.id, 10);

    // --- Server-side validation ---
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'Invalid event ID.' });
    }

    try {
        const sql = BASE_SELECT + ` WHERE e.event_id = ? AND e.status = 'active'`;
        const [rows] = await pool.query(sql, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Event not found.' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error('[api] GET /events/:id failed:', err.message);
        res.status(500).json({ error: 'Failed to retrieve event details' });
    }
});

module.exports = router;
