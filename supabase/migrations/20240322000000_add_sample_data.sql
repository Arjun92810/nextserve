-- First, modify the RLS policies to allow public read access
ALTER POLICY "Anyone can view groups" ON groups
USING (true);

CREATE POLICY "Anyone can view posts"
    ON posts FOR SELECT
    USING (true);

-- Insert sample groups
INSERT INTO groups (id, name, description, created_at, member_count) VALUES
('11111111-1111-1111-1111-111111111111', 'Weekend Warriors', 'Join our weekend tennis group! All skill levels welcome. We meet every Saturday and Sunday morning.', NOW(), 15),
('22222222-2222-2222-2222-222222222222', 'Advanced Singles Club', 'NTRP 4.0+ players looking for competitive singles matches and drills.', NOW(), 8),
('33333333-3333-3333-3333-333333333333', 'Tennis & Social', 'Mix tennis with socializing! Regular meetups, friendly doubles, and post-game refreshments.', NOW(), 25),
('44444444-4444-4444-4444-444444444444', 'Junior Development Squad', 'Young players aged 12-18 focusing on tournament preparation and skill development.', NOW(), 12),
('55555555-5555-5555-5555-555555555555', 'Morning Tennis League', 'Early bird gets the court! Weekday morning tennis from 6-9 AM.', NOW(), 20);

-- Insert sample posts
INSERT INTO posts (id, group_id, content, created_at) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Great session this weekend! Thanks to everyone who joined our doubles tournament. Special shoutout to Mike and Sarah for organizing the post-game BBQ! 🎾🏆', NOW() - INTERVAL '2 days'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'Looking for singles partners this Wednesday evening. NTRP 4.0-4.5 preferred. Court is already booked from 6-8 PM. 🎾', NOW() - INTERVAL '1 day'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 'Monthly social mixer coming up this Friday! Bring your racquet and your best game face. Snacks and refreshments will be provided. 🎾🎉', NOW() - INTERVAL '12 hours'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '44444444-4444-4444-4444-444444444444', 'Congratulations to our juniors who competed in the regional tournament this weekend! Three semifinals appearances and one championship! 🏆👏', NOW() - INTERVAL '3 days'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '55555555-5555-5555-5555-555555555555', 'Weather forecast looks perfect for tomorrow morning''s session. All courts booked from 6-9 AM. Don''t forget to bring water! ☀️🎾', NOW() - INTERVAL '6 hours');

-- Insert additional engaging posts
INSERT INTO posts (id, group_id, content, created_at) VALUES
('ffffffff-ffff-ffff-ffff-ffffffffffff', '11111111-1111-1111-1111-111111111111', 'New player clinic this Saturday! Bring a friend and introduce them to tennis. We''ll cover basics and have fun matches. 🎾 Equipment available to borrow.', NOW() - INTERVAL '1 day'),
('gggggggg-gggg-gggg-gggg-gggggggggggg', '33333333-3333-3333-3333-333333333333', 'Photos from last week''s charity tournament are up! We raised $2,000 for local youth tennis programs. Thanks to all participants! 📸🎾❤️', NOW() - INTERVAL '5 days'),
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', '22222222-2222-2222-2222-222222222222', 'Strategy session recap: Thanks to Coach Mike for the amazing tips on serve placement and return positioning. Video analysis coming soon! 📊🎾', NOW() - INTERVAL '4 days'),
('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', '44444444-4444-4444-4444-444444444444', 'Summer camp registration now open! Six weeks of intensive training, match play, and fitness. Early bird discount available until May 1st! 🌞🎾', NOW() - INTERVAL '2 days'),
('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', '55555555-5555-5555-5555-555555555555', 'New ball machine arrived! Morning practice just got even better. Sign up for machine time through the app. First-timers get a free 30-min session! 🤖🎾', NOW() - INTERVAL '8 hours'); 