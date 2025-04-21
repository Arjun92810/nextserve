BEGIN;

-- Update RLS policies
DO $$ 
BEGIN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Anyone can view groups" ON groups;
    DROP POLICY IF EXISTS "Group members can view posts" ON posts;
    
    -- Create new policies
    CREATE POLICY "Public can view groups"
        ON groups FOR SELECT
        USING (true);
    
    CREATE POLICY "Public can view posts"
        ON posts FOR SELECT
        USING (true);
EXCEPTION WHEN OTHERS THEN 
    NULL;
END $$;

-- Clean up any existing sample data
DELETE FROM posts WHERE id IN (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'
);

DELETE FROM groups WHERE id IN (
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    '33333333-3333-3333-3333-333333333333'
);

-- Insert sample groups
INSERT INTO groups (id, name, description, created_at, member_count) VALUES
('11111111-1111-1111-1111-111111111111', 'Jersey City Tennis Club', 'The main hub for tennis enthusiasts in Jersey City! All levels welcome.', NOW(), 45),
('22222222-2222-2222-2222-222222222222', 'Newport Tennis Group', 'Tennis players in Newport area. Regular meetups and friendly matches.', NOW(), 28),
('33333333-3333-3333-3333-333333333333', 'Liberty State Park Tennis', 'Group for coordinating games at Liberty State Park courts.', NOW(), 35);

-- Insert sample posts
INSERT INTO posts (id, group_id, content, created_at) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Welcome to Jersey City Tennis Club! 🎾 Our mission is to build a vibrant tennis community. Check out our weekly schedule and join the fun!', NOW() - INTERVAL '7 days'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'Weekend tournament update: Congratulations to all participants! Special thanks to our sponsors and volunteers. See photos in the comments! 🏆', NOW() - INTERVAL '2 days'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'Newport courts have been resurfaced! 🎉 They''re looking amazing. Book your court time through the new online system.', NOW() - INTERVAL '3 days'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '33333333-3333-3333-3333-333333333333', 'Liberty State Park Tennis Update: Courts 1-4 available this weekend. Perfect weather forecast! Who''s up for some doubles? ☀️', NOW() - INTERVAL '1 day'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '22222222-2222-2222-2222-222222222222', 'Pro Tip Tuesday: Improve your serve with these 3 simple drills! Video demonstration coming this evening. 🎾 #TennisTips', NOW() - INTERVAL '6 hours');

COMMIT; 