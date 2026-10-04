-- =============================================================
-- PROG2002 A2 - Charity Events Database (charityevents_db)
-- Import this file into MySQL Workbench to create the database:
--   Server > Data Import > Import from Self-Contained File
-- =============================================================

CREATE DATABASE IF NOT EXISTS charityevents_db;
USE charityevents_db;

-- -------------------------------------------------------------
-- Table 1: organisations (charitable organisations that host events)
-- -------------------------------------------------------------
CREATE TABLE organisations (
    org_id      INT AUTO_INCREMENT PRIMARY KEY,
    org_name    VARCHAR(100) NOT NULL,
    org_email   VARCHAR(100) NOT NULL,
    org_phone   VARCHAR(20),
    org_address VARCHAR(200),
    org_mission TEXT
);

-- -------------------------------------------------------------
-- Table 2: categories (event categories: fun run, gala, auction, ...)
-- -------------------------------------------------------------
CREATE TABLE categories (
    category_id   INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL UNIQUE
);

-- -------------------------------------------------------------
-- Table 3: events (charity events shown on the website)
--   FK: category_id -> categories, org_id -> organisations
--   status 'suspended' events are hidden from the website
-- -------------------------------------------------------------
CREATE TABLE events (
    event_id        INT AUTO_INCREMENT PRIMARY KEY,
    event_name      VARCHAR(150) NOT NULL,
    event_description TEXT,
    event_date      DATETIME NOT NULL,          -- start date/time
    end_date        DATETIME,                   -- optional end date/time
    location        VARCHAR(100) NOT NULL,       -- city / suburb
    venue           VARCHAR(150),                -- full venue name
    category_id     INT NOT NULL,
    org_id          INT NOT NULL,
    ticket_price    DECIMAL(8,2) NOT NULL DEFAULT 0.00,  -- 0.00 = free
    goal_amount     DECIMAL(10,2) NOT NULL,      -- fundraising goal (AUD)
    raised_amount   DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    status          ENUM('active','suspended') NOT NULL DEFAULT 'active',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_event_category FOREIGN KEY (category_id)
        REFERENCES categories(category_id),
    CONSTRAINT fk_event_org FOREIGN KEY (org_id)
        REFERENCES organisations(org_id)
);

-- =============================================================
-- Seed data
-- =============================================================

-- Organisations
INSERT INTO organisations (org_name, org_email, org_phone, org_address, org_mission) VALUES
('HeartsUnited Foundation', 'hello@heartsunited.org.au', '(07) 5555 0100', '12 Hope Street, Gold Coast QLD 4215',
 'Connecting kindness with community needs. We organise fundraising events that support education, health and environmental projects across Australia.'),
('Bright Futures Australia', 'info@brightfutures.org.au', '(07) 5555 0120', '88 Education Rd, Brisbane QLD 4000',
 'Every child deserves a bright future. We raise funds for scholarships, school supplies and literacy programs.'),
('Coastal Care Network', 'contact@coastalcare.org.au', '(02) 6666 0140', '5 Marine Parade, Byron Bay NSW 2481',
 'Protecting our coastline and wildlife through community action and fundraising events.');

-- Categories
INSERT INTO categories (category_name) VALUES
('Fun Run'),
('Gala Dinner'),
('Silent Auction'),
('Concert'),
('Community Day'),
('Sports Challenge');

-- Events (10 sample events: mix of past / upcoming / one suspended)
INSERT INTO events (event_name, event_description, event_date, end_date, location, venue, category_id, org_id, ticket_price, goal_amount, raised_amount, status) VALUES
('Riverside Fun Run for Clean Water',
 'A 5km / 10km charity fun run along the riverside parklands. All entry fees are donated to clean-water projects in regional communities. Includes finisher medals, water stations and a family warm-up zone.',
 '2026-08-15 07:00:00', '2026-08-15 11:00:00', 'Gold Coast', 'Riverside Parklands, Southport', 1, 1, 35.00, 50000.00, 48250.00, 'active'),

('Photography Art Silent Auction',
 'An evening silent auction featuring limited-edition prints from 30 local photographers. Funds support art supplies for public schools in the Northern Rivers.',
 '2026-09-12 18:00:00', '2026-09-12 21:30:00', 'Lismore', 'Lismore Regional Gallery', 3, 2, 0.00, 15000.00, 14100.00, 'active'),

('Art for Education Silent Auction',
 'Bid on donated artworks, crafts and experiences in our biggest silent auction of the year. Every dollar raised funds scholarships for students in need.',
 '2026-10-25 17:30:00', '2026-10-25 21:00:00', 'Brisbane', 'City Hall Auditorium, Brisbane CBD', 3, 2, 25.00, 30000.00, 18600.00, 'active'),

('Halloween Family Bake-Off Marathon',
 'A family-friendly community day of baking, games and a charity cake auction. Costumes encouraged! Free entry with optional donations.',
 '2026-10-31 10:00:00', '2026-10-31 15:00:00', 'Gold Coast', 'Community Centre, Burleigh Heads', 5, 1, 0.00, 8000.00, 3050.00, 'active'),

('Hope Under the Stars Gala Dinner',
 'Our flagship black-tie gala evening with a three-course dinner, live entertainment and a charity auction. Tables of 10 available. Proceeds fund youth mental-health programs.',
 '2026-11-14 18:30:00', '2026-11-14 23:00:00', 'Gold Coast', 'Star Ballroom, Surfers Paradise', 2, 1, 150.00, 120000.00, 86500.00, 'active'),

('Beach Cleanup & Fun Run',
 'Run 5km, then join the beach cleanup! Entry includes gloves, bags and a BBQ lunch. Funds support coastal wildlife rescue teams.',
 '2026-12-05 06:30:00', '2026-12-05 12:00:00', 'Byron Bay', 'Main Beach, Byron Bay', 1, 3, 20.00, 10000.00, 6100.00, 'active'),

('Christmas Toy Drive Gala',
 'A festive charity gala with dinner, carols and Santa photos. Every ticket buys two toys for children in need this Christmas.',
 '2026-12-19 17:00:00', '2026-12-19 21:30:00', 'Lismore', 'Lismore Workers Club', 2, 2, 95.00, 40000.00, 22800.00, 'active'),

('Coast to Hinterland Charity Ride',
 'A 60km supported cycling challenge from the coast to the hinterland with rest stops, mechanics and a celebration lunch. Raises funds for rural health services.',
 '2027-03-20 06:00:00', '2027-03-20 16:00:00', 'Gold Coast', 'Start: Broadwater Parklands', 6, 3, 60.00, 35000.00, 9200.00, 'active'),

('Winter Melodies Charity Concert',
 'An indoor winter concert featuring local orchestras and choirs. Warm drinks included. Proceeds fund music education in primary schools.',
 '2027-06-12 19:00:00', '2027-06-12 22:00:00', 'Brisbane', 'Conservatorium Theatre', 4, 2, 45.00, 25000.00, 5400.00, 'active'),

('Community Picnic Fundraiser (Unlisted)',
 'Internal test event that violates our content policy and is suspended from public display.',
 '2026-11-01 11:00:00', '2026-11-01 15:00:00', 'Gold Coast', 'Evandale Park', 5, 1, 10.00, 5000.00, 0.00, 'suspended');

-- Quick sanity check
SELECT COUNT(*) AS total_events FROM events;
