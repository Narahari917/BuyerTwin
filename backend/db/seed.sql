INSERT INTO buyers (id, name, email, phone, budget_min, budget_max, desired_locations, timeline, must_have_features, inquiry_text, created_at)
VALUES
('buyer_001', 'Sarah Johnson', 'sarah@example.com', '555-111-2222', 350000, 450000, '["Tempe","Mesa"]', '2-3 months', '["3 bedrooms","good schools","backyard"]', 'We are looking for a family-friendly home with good schools and a backyard.', '2026-04-18 10:00:00'),
('buyer_002', 'David Lee', 'david@example.com', '555-333-4444', 280000, 380000, '["Phoenix"]', '1 month', '["close commute","modern kitchen"]', 'I want a first home with a reasonable commute and updated interiors.', '2026-04-18 10:05:00'),
('buyer_003', 'Priya Patel', 'priya@example.com', '555-555-6666', 500000, 650000, '["Scottsdale","Chandler"]', 'ASAP', '["top school district","4 bedrooms","tour soon"]', 'We want a move-in ready home in a top school district and would like to tour soon.', '2026-04-18 10:10:00')
ON CONFLICT (id) DO NOTHING;

INSERT INTO listings (id, address_label, city, price, bedrooms, bathrooms, sqft, neighborhood, school_score, commute_score, tags, description, image_url)
VALUES
('listing_001', '123 Maple Ave', 'Tempe', 420000, 3, 2, 1850, 'Maple Grove', 9, 7, '["family","backyard","schools"]', 'Family-friendly home near parks and top-rated schools.', NULL),
('listing_002', '456 Oak Street', 'Phoenix', 340000, 2, 2, 1300, 'Central Phoenix', 6, 9, '["commute","modern","starter"]', 'Modern starter home with quick freeway access.', NULL),
('listing_003', '789 Desert Lane', 'Scottsdale', 615000, 4, 3, 2600, 'Desert Ridge', 10, 8, '["schools","move-in ready","family"]', 'Spacious move-in ready home in a premium school district.', NULL),
('listing_004', '321 Cedar Court', 'Mesa', 395000, 3, 2, 1750, 'Cedar Park', 8, 6, '["family","backyard","value"]', 'Comfortable family home with outdoor space and solid schools.', NULL),
('listing_005', '654 Skyline Dr', 'Phoenix', 365000, 3, 2, 1450, 'Skyline Village', 7, 10, '["commute","updated","value"]', 'Updated home with excellent commute access and practical layout.', NULL),
('listing_006', '987 Willow Bend', 'Chandler', 590000, 4, 3, 2450, 'Willow Estates', 9, 7, '["schools","family","tour-ready"]', 'Well-kept larger home in a strong school area with flexible family space.', NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO buyer_events (id, buyer_id, listing_id, event_type, timestamp, duration_seconds, source_channel, metadata)
VALUES
('event_001', 'buyer_001', 'listing_001', 'listing_viewed', '2026-04-18 11:00:00', 95, 'email', '{"note":"Viewed family listing carefully"}'),
('event_002', 'buyer_001', 'listing_001', 'listing_saved', '2026-04-18 11:08:00', 40, 'email', '{"note":"Saved school-focused listing"}'),
('event_003', 'buyer_001', 'listing_002', 'listing_skipped', '2026-04-18 11:15:00', 12, 'sms', '{"note":"Skipped commute-focused home"}'),
('event_004', 'buyer_002', 'listing_002', 'listing_viewed', '2026-04-18 11:10:00', 70, 'sms', '{"note":"Viewed commute-friendly starter home"}'),
('event_005', 'buyer_002', 'listing_002', 'message_clicked', '2026-04-18 11:17:00', 15, 'sms', '{"note":"Clicked listing from text message"}'),
('event_006', 'buyer_002', 'listing_002', 'listing_saved', '2026-04-18 11:20:00', 35, 'sms', '{"note":"Saved modern starter home"}'),
('event_007', 'buyer_003', 'listing_003', 'listing_viewed', '2026-04-18 11:05:00', 110, 'email', '{"note":"Spent long time on school district details"}'),
('event_008', 'buyer_003', 'listing_003', 'listing_saved', '2026-04-18 11:12:00', 30, 'email', '{"note":"Saved high school score home"}'),
('event_009', 'buyer_003', 'listing_003', 'message_replied', '2026-04-18 11:20:00', 20, 'email', '{"note":"Asked about touring this weekend"}')
ON CONFLICT (id) DO NOTHING;