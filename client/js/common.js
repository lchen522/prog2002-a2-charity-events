// =============================================================
// common.js - shared helpers for all pages
// PROG2002 A2 - Charity Events client-side website
// =============================================================

// Base URL of the RESTful API (server.js must be running)
const API_BASE = 'http://localhost:3000/api';

/**
 * Format an ISO date-time string as "Sat, 14 Nov 2026 · 6:30 PM".
 */
function formatDateTime(isoString) {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-AU', {
        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
    }) + ' · ' + d.toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit' });
}

/**
 * Format a ticket price; 0 means the event is free.
 */
function formatPrice(price) {
    return (price === 0 || price === '0.00')
        ? 'Free entry'
        : '$' + Number(price).toFixed(2) + ' per ticket';
}

/**
 * Escape user/API text before injecting it into HTML (basic XSS safety).
 */
function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    return String(text)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

/**
 * Show or hide an error message inside the page's #error-message element.
 * This is the basic DOM manipulation used for user feedback.
 */
function showError(message) {
    const box = document.getElementById('error-message');
    if (!box) return;
    box.textContent = message;
    box.classList.remove('hidden');
}
function clearError() {
    const box = document.getElementById('error-message');
    if (box) {
        box.textContent = '';
        box.classList.add('hidden');
    }
}

/**
 * Build the HTML for one event summary card (used on Home and Search pages).
 * Each category gets a coloured banner with an emoji icon.
 */
function createEventCard(event) {
    // Category banner styles are defined in style.css (.banner-1 ... .banner-6)
    const banners = {
        'Fun Run':          { cls: 'banner-1', icon: '&#127939;' },
        'Gala Dinner':      { cls: 'banner-2', icon: '&#127864;' },
        'Silent Auction':   { cls: 'banner-3', icon: '&#128444;' },
        'Concert':          { cls: 'banner-4', icon: '&#127926;' },
        'Community Day':    { cls: 'banner-5', icon: '&#127979;' },
        'Sports Challenge': { cls: 'banner-6', icon: '&#128657;' }
    };
    const banner = banners[event.category_name] || { cls: 'banner-5', icon: '&#10084;' };

    // Mark the event as Past or Upcoming by comparing its date with the current date
    const isPast = new Date(event.event_date) < new Date();
    const statusChip = isPast
        ? '<span class="chip status-past">Past event</span>'
        : '<span class="chip">Upcoming</span>';

    // Goal vs progress mini-bar
    const percent = Math.min(
        100, Math.round((Number(event.raised_amount) / Number(event.goal_amount)) * 100)
    );

    return `
        <article class="card">
            <div class="card-banner ${banner.cls}">${banner.icon}</div>
            <div class="card-body">
                <div class="card-top">
                    ${statusChip}
                    <span class="chip price">${formatPrice(event.ticket_price)}</span>
                </div>
                <h3 class="card-title">${escapeHtml(event.event_name)}</h3>
                <div class="card-meta">
                    <span>&#128197; ${formatDateTime(event.event_date)}</span>
                    <span>&#128205; ${escapeHtml(event.location)}</span>
                </div>
                <div class="card-meta">
                    <span class="chip">${escapeHtml(event.category_name)}</span>
                </div>
                <div class="card-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width:${percent}%"></div>
                    </div>
                    <small>${percent}% of $${Number(event.goal_amount).toLocaleString('en-AU')} raised</small>
                </div>
                <a class="card-link" href="event.html?id=${event.event_id}">
                    View details &amp; register &rarr;
                </a>
            </div>
        </article>`;
}

// Footer year (tiny DOM touch, used on every page)
document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
});
