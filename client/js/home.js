// =============================================================
// home.js - Home page dynamic event listing
// PROG2002 A2 - Charity Events client-side website
//
// Data flow:
//   1. fetch() sends a GET request to the API  (GET /api/events)
//   2. the Promise resolves with the server response
//   3. the JSON data is split into upcoming / past events by
//      comparing each event date with the current date
//   4. cards are rendered into the DOM with createEventCard()
// =============================================================
document.addEventListener('DOMContentLoaded', async () => {

    const upcomingGrid = document.getElementById('upcoming-events');
    const pastGrid     = document.getElementById('past-events');

    try {
        // --- 1) Call the API (Promise-based fetch + await) ---
        const response = await fetch(`${API_BASE}/events`);

        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }

        // --- 2) Parse the JSON response ---
        const events = await response.json();

        // --- 3) Mark each event as past or upcoming using the current date ---
        const now = new Date();
        const upcoming = [];
        const past = [];

        events.forEach(event => {
            if (new Date(event.event_date) >= now) {
                upcoming.push(event);
            } else {
                past.push(event);
            }
        });

        // --- 4) Render the cards into the DOM ---
        if (upcoming.length === 0) {
            upcomingGrid.innerHTML =
                '<p class="loading">No upcoming events at the moment. Please check back soon!</p>';
        } else {
            upcomingGrid.innerHTML = upcoming.map(createEventCard).join('');
        }

        if (past.length > 0) {
            pastGrid.innerHTML = past.map(createEventCard).join('');
        } else {
            // Hide the "past events" section entirely if there are none
            document.getElementById('past').style.display = 'none';
        }

    } catch (err) {
        // Basic DOM manipulation to show an error message to the user
        showError('Sorry, we could not load the events right now. ' +
                  'Please make sure the API server is running (npm start in the api folder).');
        console.error('[home.js] Failed to load events:', err);
    }
});
