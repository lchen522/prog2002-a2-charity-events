// =============================================================
// event.js - Event details page
// PROG2002 A2 - Charity Events client-side website
//
// The event ID is passed from the Home / Search pages through the
// URL query string (?id=5). We read it with URLSearchParams, fetch
// the full event from GET /api/events/:id and render the details.
// =============================================================
document.addEventListener('DOMContentLoaded', async () => {

    const detailBox = document.getElementById('event-detail');

    // ---------------------------------------------------------
    // 1) Read the event ID from the URL query string
    // ---------------------------------------------------------
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id || !/^\d+$/.test(id)) {
        detailBox.innerHTML = '';
        showError('No event selected. Please choose an event from the Home or Search page.');
        return;
    }

    try {
        // -----------------------------------------------------
        // 2) Fetch the full event details from the API
        // -----------------------------------------------------
        const response = await fetch(`${API_BASE}/events/${id}`);

        if (response.status === 404) {
            detailBox.innerHTML = '';
            showError('Event not found. It may have been removed or suspended.');
            return;
        }
        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }

        const event = await response.json();

        // -----------------------------------------------------
        // 3) Render the full details into the DOM
        // -----------------------------------------------------
        const banners = {
            'Fun Run':          { cls: 'banner-1', icon: '&#127939;' },
            'Gala Dinner':      { cls: 'banner-2', icon: '&#127864;' },
            'Silent Auction':   { cls: 'banner-3', icon: '&#128444;' },
            'Concert':          { cls: 'banner-4', icon: '&#127926;' },
            'Community Day':    { cls: 'banner-5', icon: '&#127979;' },
            'Sports Challenge': { cls: 'banner-6', icon: '&#128657;' }
        };
        const banner = banners[event.category_name] || { cls: 'banner-5', icon: '&#10084;' };

        const percent = Math.min(
            100, Math.round((Number(event.raised_amount) / Number(event.goal_amount)) * 100)
        );

        const isPast = new Date(event.event_date) < new Date();

        detailBox.innerHTML = `
            <article class="card detail-card">
                <div class="detail-banner ${banner.cls}">${banner.icon}</div>
                <div class="detail-body">
                    <div class="card-top">
                        ${isPast
                            ? '<span class="chip status-past">Past event</span>'
                            : '<span class="chip">Upcoming event</span>'}
                        <span class="chip price">${formatPrice(event.ticket_price)}</span>
                    </div>
                    <h1>${escapeHtml(event.event_name)}</h1>
                    <p class="detail-sub">
                        A ${escapeHtml(event.category_name.toLowerCase())} hosted by
                        ${escapeHtml(event.org_name)} &mdash; every ticket supports the cause below.
                    </p>

                    <div class="detail-grid">
                        <div class="detail-box">
                            <span class="label">Date &amp; time</span>
                            ${formatDateTime(event.event_date)}
                            ${event.end_date ? ' &ndash; ' + new Date(event.end_date)
                                .toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit' }) : ''}
                        </div>
                        <div class="detail-box">
                            <span class="label">Location</span>
                            ${escapeHtml(event.location)}
                        </div>
                        <div class="detail-box">
                            <span class="label">Venue</span>
                            ${escapeHtml(event.venue || 'To be confirmed')}
                        </div>
                        <div class="detail-box">
                            <span class="label">Category</span>
                            ${escapeHtml(event.category_name)}
                        </div>
                        <div class="detail-box">
                            <span class="label">Ticket price</span>
                            ${formatPrice(event.ticket_price)}
                        </div>
                        <div class="detail-box">
                            <span class="label">Organiser</span>
                            ${escapeHtml(event.org_name)}<br>
                            <small>${escapeHtml(event.org_email)} &middot; ${escapeHtml(event.org_phone)}</small>
                        </div>
                    </div>

                    <div class="detail-box detail-desc">
                        <span class="label">About this event</span>
                        ${escapeHtml(event.event_description)}
                    </div>

                    <div class="goal-section">
                        <h3>Fundraising goal vs. progress</h3>
                        <div class="goal-bar">
                            <div class="goal-fill" style="width:${percent}%"></div>
                        </div>
                        <p class="goal-nums">
                            <strong>$${Number(event.raised_amount).toLocaleString('en-AU')}</strong>
                            raised of
                            <strong>$${Number(event.goal_amount).toLocaleString('en-AU')}</strong>
                            goal &nbsp;(${percent}%)
                        </p>
                    </div>

                    <div class="register-section">
                        <p>Ready to make a difference? Register your participation below.</p>
                        <button type="button" class="btn btn-register" id="register-btn">
                            Register for this event
                        </button>
                    </div>
                </div>
            </article>`;

        // -----------------------------------------------------
        // 4) Register button - under construction in A2
        // -----------------------------------------------------
        document.getElementById('register-btn').addEventListener('click', () => {
            alert('This feature is currently under construction.');
        });

    } catch (err) {
        detailBox.innerHTML = '';
        showError('Could not load the event details. Please make sure the API server is running.');
        console.error('[event.js] Failed to load event:', err);
    }
});
