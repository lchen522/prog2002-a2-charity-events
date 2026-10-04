# PROG2002 A2 — Charity Events Dynamic Website

A dynamic website for managing charity events: public users can view the
organisation's information, browse current/upcoming events, search events by
date, location and category, and view full event details (goal vs. progress,
ticket info) with a registration button.

## Tech stack
- **Database:** MySQL (`charityevents_db`)
- **Server:** Node.js + Express (RESTful API, GET endpoints only for A2)
- **Client:** HTML, CSS, JavaScript, DOM manipulation, Fetch + Promises

## Project structure
```
PROG2002-A2/
├── charityevents_db.sql     # database export for the marker (Part 1)
├── api/                     # zips to: usernameA2-api.zip
│   ├── package.json
│   ├── server.js            # Express app entry point
│   ├── event_db.js          # MySQL connection module (required name)
│   └── routes/events.js     # RESTful endpoints
└── client/                  # zips to: usernameA2-clientside.zip
    ├── index.html           # Home page
    ├── search.html          # Search events page
    ├── event.html           # Event details page
    ├── css/style.css
    └── js/ (common.js, home.js, search.js, event.js)
```

## Setup instructions

### 1) Import the database
1. Open **MySQL Workbench**
2. Server → Data Import → Import from Self-Contained File → select `charityevents_db.sql`
3. Import. This creates the `charityevents_db` database with 3 organisations,
   6 categories and 10 sample events (including 1 suspended event to demonstrate hiding).

### 2) Run the API
```bash
cd api
# FIRST: edit event_db.js and set your MySQL password
npm install
npm start
```
The API runs on http://localhost:3000

### 3) Run the client
Open the `client` folder in VS Code and use **Live Server** (or any static
server) to open `index.html`. (Opening via a static server is preferred over
double-clicking the file so fetch() calls behave consistently.)

## API endpoints (Part 2)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/events` | All active events for the Home page (suspended hidden) |
| GET | `/api/categories` | All event categories (for the Search filter) |
| GET | `/api/events/search?date=YYYY-MM-DD&location=Gold&category=1` | Search by one or multiple criteria (AND) |
| GET | `/api/events/:id` | Full details of one event |

Test with Postman or a browser, e.g.:
- `http://localhost:3000/api/events`
- `http://localhost:3000/api/events/search?location=Gold%20Coast&category=1`
- `http://localhost:3000/api/events/5`

## Feature checklist (from the brief)
- [x] Home page: static organisation info + dynamic event list via API
- [x] Events marked **Past / Upcoming** by comparing event date with current date
- [x] Suspended events hidden (filtered by the API)
- [x] Search page: filter form (date picker, location text, category dropdown)
- [x] One or multiple criteria; **Clear Filters** button
- [x] Error messages via DOM manipulation (no matches, no criteria, API down)
- [x] Event details page: ID passed by **URL query string** (`event.html?id=5`)
- [x] Full details: name, time, place, purpose/description, ticket info
- [x] **Goal vs. progress** bar
- [x] **Register** button → "This feature is currently under construction."
- [x] Navigation menu on all pages
- [x] `event_db.js` connection file + SQL export for the marker

## Submission
1. Create a **GitHub repository** and commit regularly with clear messages
2. Zip: `api/` → `usernameA2-api.zip`, `client/` → `usernameA2-clientside.zip`
3. Complete the project report (docx, Arial 12pt, 1.5 line spacing)
4. Record a ≤15 min demo video (DB schema, API walkthrough, data flow, live demo)
5. Add your GenAI use declaration

## GenAI use declaration (required in submission)
> I acknowledge that I have used GenAI tools to complete this assessment.
> I used <GenAI tool(s)> to <specific purpose(s)> within the parameters
> outlined in the Assessment Brief and by the Unit Assessor.

Complete this honestly — you may be asked to demonstrate your understanding
of every part of this code in an interview.
