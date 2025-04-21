-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view groups" ON groups;
DROP POLICY IF EXISTS "Group members can view posts" ON posts;

-- Create new policies for public access
CREATE POLICY "Public can view groups"
    ON groups FOR SELECT
    USING (true);

CREATE POLICY "Public can view posts"
    ON posts FOR SELECT
    USING (true); 