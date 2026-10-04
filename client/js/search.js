// =============================================================
// search.js - Search Events page
// PROG2002 A2 - Charity Events client-side website
//
// - The category dropdown is populated from GET /api/categories
// - Submitting the form builds a query string and calls
//   GET /api/events/search?date=&location=&category=
// - The "Clear Filters" button resets every field and clears the
//   results (basic DOM manipulation)
// - All error feedback is inserted into the DOM (no alert() spam)
// =============================================================
document.addEventListener('DOMContentLoaded', () => {

    const form        = document.getElementById('search-form');
    const dateInput   = document.getElementById('date');
    const locInput    = document.getElementById('location');
    const catSelect   = document.getElementById('category');
    const clearBtn    = document.getElementById('clear-filters');
    const resultsGrid = document.getElementById('search-results');
    const resultsHead = document.getElementById('results-head');
    const resultCount = document.getElementById('result-count');

    // ---------------------------------------------------------
    // Load categories from the API into the dropdown
    // (Promise .then() chaining is used here to demonstrate
    //  working directly with Promises)
    // ---------------------------------------------------------
    fetch(`${API_BASE}/categories`)
        .then(response => {
            if (!response.ok) throw new Error('Failed to load categories');
            return response.json();
        })
        .then(categories => {
            categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.category_id;
                option.textContent = cat.category_name;
                catSelect.appendChild(option);
            });
        })
        .catch(err => {
            console.error('[search.js] Category load failed:', err);
            showError('Could not load categories. Please make sure the API server is running.');
        });

    // ---------------------------------------------------------
    // Form submission -> validate -> call the search API
    // ---------------------------------------------------------
    form.addEventListener('submit', async (event) => {
        event.preventDefault();   // stop the browser reloading the page
        clearError();
        resultsGrid.innerHTML = '';
        resultsHead.classList.add('hidden');

        const date     = dateInput.value.trim();
        const location = locInput.value.trim();
        const category = catSelect.value;

        // --- Client-side validation: at least one criterion is required ---
        if (!date && !location && !category) {
            showError('Please select at least one search criterion: a date, a location or a category.');
            return;
        }
        // Optional: warn if a past date is searched (still allowed)
        if (date && new Date(date + 'T00:00:00') < new Date(new Date().toDateString())) {
            showError('Note: you are searching for a date in the past. Results may be limited.');
            setTimeout(clearError, 3500);
        }

        // --- Build the query string from the supplied criteria ---
        const params = new URLSearchParams();
        if (date)     params.append('date', date);
        if (location) params.append('location', location);
        if (category) params.append('category', category);

        try {
            const response = await fetch(`${API_BASE}/events/search?${params.toString()}`);

            // The API returns an error object for invalid/empty searches
            if (!response.ok) {
                const errData = await response.json().catch(() => null);
                throw new Error(errData && errData.error
                    ? errData.error
                    : `Search failed (status ${response.status})`);
            }

            const events = await response.json();

            if (events.length === 0) {
                showError('No events match your search. Try a different date, location or category.');
                return;
            }

            // --- Render the matching events ---
            resultCount.textContent = events.length;
            resultsHead.classList.remove('hidden');
            resultsGrid.innerHTML = events.map(createEventCard).join('');

        } catch (err) {
            showError(err.message || 'Something went wrong while searching. Please try again.');
            console.error('[search.js] Search failed:', err);
        }
    });

    // ---------------------------------------------------------
    // "Clear Filters" button - resets all form fields and results
    // ---------------------------------------------------------
    clearBtn.addEventListener('click', () => {
        form.reset();                       // clears date, location, category
        resultsGrid.innerHTML = '';         // remove the result cards
        resultsHead.classList.add('hidden');
        clearError();                       // hide any error message
    });
});
