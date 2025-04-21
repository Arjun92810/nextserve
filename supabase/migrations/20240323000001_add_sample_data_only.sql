-- Delete existing sample data if it exists
DELETE FROM posts WHERE id IN (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    'gggggggg-gggg-gggg-gggg-gggggggggggg',
    'hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh',
    'iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii',
    'jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj'
);

DELETE FROM groups WHERE id IN (
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    '33333333-3333-3333-3333-333333333333',
    '44444444-4444-4444-4444-444444444444',
    '55555555-5555-5555-5555-555555555555'
);

-- Insert sample groups with realistic tennis-focused content
INSERT INTO groups (id, name, description, created_at, member_count) VALUES
('11111111-1111-1111-1111-111111111111', 'Jersey City Tennis Club', 'The main hub for tennis enthusiasts in Jersey City! All levels welcome.', NOW(), 45),
('22222222-2222-2222-2222-222222222222', 'Newport Tennis Group', 'Tennis players in Newport area. Regular meetups and friendly matches.', NOW(), 28),
('33333333-3333-3333-3333-333333333333', 'Liberty State Park Tennis', 'Group for coordinating games at Liberty State Park courts.', NOW(), 35),
('44444444-4444-4444-4444-444444444444', 'JC Tennis Beginners', 'New to tennis? Join us! Regular clinics and practice sessions.', NOW(), 20),
('55555555-5555-5555-5555-555555555555', 'Advanced Tennis League', 'NTRP 4.0+ players in Jersey City area. Competitive matches and drills.', NOW(), 15);

-- Insert sample posts with engaging tennis-related content
INSERT INTO posts (id, group_id, content, created_at) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Welcome to Jersey City Tennis Club! 🎾 Our mission is to build a vibrant tennis community. Check out our weekly schedule and join the fun!', NOW() - INTERVAL '7 days'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'Weekend tournament update: Congratulations to all participants! Special thanks to our sponsors and volunteers. See photos in the comments! 🏆', NOW() - INTERVAL '2 days'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'Newport courts have been resurfaced! 🎉 They''re looking amazing. Book your court time through the new online system.', NOW() - INTERVAL '3 days'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '33333333-3333-3333-3333-333333333333', 'Liberty State Park Tennis Update: Courts 1-4 available this weekend. Perfect weather forecast! Who''s up for some doubles? ☀️', NOW() - INTERVAL '1 day'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '44444444-4444-4444-4444-444444444444', 'Beginner''s Clinic this Saturday! 🎾 Learn proper form, basic strokes, and meet fellow tennis enthusiasts. Equipment provided for first-timers!', NOW() - INTERVAL '12 hours'),
('ffffffff-ffff-ffff-ffff-ffffffffffff', '55555555-5555-5555-5555-555555555555', 'Advanced League Ladder Update: New rankings posted! Challenge matches available this week. Contact your potential opponents through the app. 🎯', NOW() - INTERVAL '5 hours'),
('gggggggg-gggg-gggg-gggg-gggggggggggg', '11111111-1111-1111-1111-111111111111', 'Tennis Social Night 🌙 this Friday! Mixed doubles, refreshments, and great company. Sign up sheet in the comments.', NOW() - INTERVAL '8 hours'),
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', '22222222-2222-2222-2222-222222222222', 'Pro Tip Tuesday: Improve your serve with these 3 simple drills! Video demonstration coming this evening. 🎾 #TennisTips', NOW() - INTERVAL '6 hours'),
('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', '33333333-3333-3333-3333-333333333333', 'Court maintenance schedule for next week. Please note: Courts 2 & 3 will be closed on Monday morning for resurfacing. 🚧', NOW() - INTERVAL '4 hours'),
('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', '44444444-4444-4444-4444-444444444444', 'Success story! 🌟 Shoutout to Mike who started in our beginner''s program 6 months ago and just won his first friendly tournament! #TennisProgress', NOW() - INTERVAL '2 hours'); 