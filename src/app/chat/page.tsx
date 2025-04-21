'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

// Define types for our data
interface Group {
  id: string;
  name: string;
  description: string;
  created_at: string;
  member_count: number;
  is_member: boolean;
}

interface Post {
  id: string;
  group_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user_name: string;
  user_avatar?: string;
}

export default function ChatPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [newPostContent, setNewPostContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', description: '' });
  const router = useRouter();
  const { user } = useAuth();

  // Fetch groups and posts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all groups
        const { data: groupsData, error: groupsError } = await supabase
          .from('groups')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (groupsError) {
          console.error('Error fetching groups:', groupsError);
          throw groupsError;
        }

        // If user is logged in, fetch their memberships to mark groups they're part of
        let memberGroupIds: string[] = [];
        if (user) {
          const { data: membershipData, error: membershipError } = await supabase
            .from('group_memberships')
            .select('group_id')
            .eq('user_id', user.id);

          if (membershipError) {
            console.error('Error fetching memberships:', membershipError);
            throw membershipError;
          }
          memberGroupIds = membershipData?.map(m => m.group_id) || [];
        }

        // Mark groups where user is a member (if logged in)
        const groupsWithMembership = (groupsData || []).map(group => ({
          ...group,
          is_member: memberGroupIds.includes(group.id)
        }));
        
        setGroups(groupsWithMembership);
        
        // If there are groups, fetch posts for the first group
        if (groupsWithMembership.length > 0) {
          const firstGroup = groupsWithMembership[0];
          setSelectedGroup(firstGroup);
          
          // First fetch posts
          const { data: postsData, error: postsError } = await supabase
            .from('posts')
            .select('*')
            .eq('group_id', firstGroup.id)
            .order('created_at', { ascending: false });
          
          if (postsError) {
            console.error('Error fetching posts:', postsError);
            throw postsError;
          }

          if (postsData && postsData.length > 0) {
            // Get unique user IDs from posts
            const userIds = Array.from(new Set<string>(postsData.map(post => post.user_id)));
            
            // Fetch profiles for these users
            const { data: profilesData, error: profilesError } = await supabase
              .from('profiles')
              .select('id, full_name, avatar_url')
              .in('id', userIds);

            if (profilesError) {
              console.error('Error fetching profiles:', profilesError);
            }

            // Create a map of user profiles
            const profileMap = (profilesData || []).reduce((acc, profile) => {
              acc[profile.id] = profile;
              return acc;
            }, {} as Record<string, any>);

            // Transform posts with user data
            const transformedPosts = postsData.map(post => ({
              id: post.id,
              group_id: post.group_id,
              user_id: post.user_id,
              content: post.content,
              created_at: post.created_at,
              user_name: profileMap[post.user_id]?.full_name || 'Anonymous',
              user_avatar: profileMap[post.user_id]?.avatar_url
            }));
            
            setPosts(transformedPosts);
          } else {
            setPosts([]);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Detailed error:', err);
        setError('Failed to load groups and posts');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  // Handle group selection
  const handleGroupSelect = async (group: Group) => {
    setSelectedGroup(group);
    setLoading(true);
    setError(null);
    
    try {
      // First fetch posts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .eq('group_id', group.id)
        .order('created_at', { ascending: false });
      
      if (postsError) {
        console.error('Error fetching posts:', postsError);
        throw postsError;
      }

      if (postsData && postsData.length > 0) {
        // Get unique user IDs from posts
        const userIds = Array.from(new Set<string>(postsData.map(post => post.user_id)));
        
        // Fetch profiles for these users
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .in('id', userIds);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
        }

        // Create a map of user profiles
        const profileMap = (profilesData || []).reduce((acc, profile) => {
          acc[profile.id] = profile;
          return acc;
        }, {} as Record<string, any>);

        // Transform posts with user data
        const transformedPosts = postsData.map(post => ({
          id: post.id,
          group_id: post.group_id,
          user_id: post.user_id,
          content: post.content,
          created_at: post.created_at,
          user_name: profileMap[post.user_id]?.full_name || 'Anonymous',
          user_avatar: profileMap[post.user_id]?.avatar_url
        }));
        
        setPosts(transformedPosts);
      } else {
        setPosts([]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts');
      setLoading(false);
    }
  };

  // Handle joining a group
  const handleJoinGroup = async (group: Group) => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      const { error: joinError } = await supabase
        .from('group_memberships')
        .insert({
          group_id: group.id,
          user_id: user.id,
          role: 'member'
        });

      if (joinError) throw joinError;

      // Update local state to reflect membership
      setGroups(prevGroups =>
        prevGroups.map(g =>
          g.id === group.id ? { ...g, is_member: true } : g
        )
      );
      if (selectedGroup?.id === group.id) {
        setSelectedGroup({ ...group, is_member: true });
      }
    } catch (err) {
      console.error('Error joining group:', err);
      setError('Failed to join group');
    }
  };

  // Handle creating a new post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (!newPostContent.trim() || !selectedGroup) return;
    
    try {
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .insert([{
          group_id: selectedGroup.id,
          user_id: user.id,
          content: newPostContent.trim()
        }])
        .select('*, profiles:user_id(full_name, avatar_url)')
        .single();

      if (postError) throw postError;

      if (postData) {
        const newPost: Post = {
          id: postData.id,
          group_id: postData.group_id,
          user_id: postData.user_id,
          content: postData.content,
          created_at: postData.created_at,
          user_name: postData.profiles?.full_name || 'Anonymous',
          user_avatar: postData.profiles?.avatar_url
        };
        
        setPosts([newPost, ...posts]);
        setNewPostContent('');
      }
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post');
    }
  };

  // Handle creating a new group
  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (!newGroup.name.trim()) return;
    
    try {
      setLoading(true);
      setError(null);

      // Create new group
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .insert([{
          name: newGroup.name.trim(),
          description: newGroup.description.trim(),
          created_by: user.id,
          member_count: 1
        }])
        .select()
        .single();

      if (groupError) throw groupError;

      if (!groupData) {
        throw new Error('No data returned from group creation');
      }

      // Add creator as member with admin role
      const { error: membershipError } = await supabase
        .from('group_memberships')
        .insert([{
          group_id: groupData.id,
          user_id: user.id,
          role: 'admin'
        }]);

      if (membershipError) throw membershipError;

      // Add new group to state
      const newGroupWithMembership = {
        ...groupData,
        is_member: true
      };

      setGroups(prevGroups => [newGroupWithMembership, ...prevGroups]);
      setSelectedGroup(newGroupWithMembership);
      setPosts([]);

      // Reset form and close modal
      setNewGroup({ name: '', description: '' });
      setIsCreatingGroup(false);
      
    } catch (err) {
      console.error('Error creating group:', err);
      setError(err instanceof Error ? err.message : 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  // Filter groups based on search query
  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Groups</h1>
        {user ? (
          <button
            onClick={() => setIsCreatingGroup(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Group
          </button>
        ) : (
          <Link
            href="/login"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Sign in to create groups
          </Link>
        )}
      </div>

      {/* Create Group Modal */}
      {isCreatingGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Create New Group</h2>
            <form onSubmit={handleCreateGroup}>
              <div className="mb-4">
                <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-1">
                  Group Name
                </label>
                <input
                  type="text"
                  id="groupName"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter group name"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="groupDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="groupDescription"
                  value={newGroup.description}
                  onChange={(e) => setNewGroup(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter group description"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCreatingGroup(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newGroup.name.trim() || loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Group'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Groups Sidebar */}
        <div className="md:col-span-1 bg-white rounded-lg shadow-md p-4">
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search groups..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <h2 className="text-xl font-semibold mb-3">Groups</h2>
          
          {loading ? (
            <div className="text-center py-4">Loading groups...</div>
          ) : error ? (
            <div className="text-red-500 py-4">{error}</div>
          ) : (
            <div className="space-y-3">
              {filteredGroups.map(group => (
                <div 
                  key={group.id}
                  className={`p-3 rounded-lg cursor-pointer transition ${
                    selectedGroup?.id === group.id 
                      ? 'bg-blue-50 border border-blue-200' 
                      : 'hover:bg-gray-50 border border-gray-200'
                  }`}
                  onClick={() => handleGroupSelect(group)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{group.name}</h3>
                    <span className="text-sm text-gray-500">{group.member_count} members</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{group.description}</p>
                  {user && !group.is_member && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJoinGroup(group);
                      }}
                      className="mt-2 px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200"
                    >
                      Join
                    </button>
                  )}
                  {group.is_member && (
                    <span className="mt-2 px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 inline-block">
                      Joined
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Posts Feed */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-md p-4">
          {selectedGroup ? (
            <>
              <div className="mb-4 pb-4 border-b">
                <h2 className="text-2xl font-bold">{selectedGroup.name}</h2>
                <p className="text-gray-600">{selectedGroup.description}</p>
              </div>
              
              {/* Create Post Form - Only show if user is logged in and is a member */}
              {user && selectedGroup.is_member && (
                <form onSubmit={handleCreatePost} className="mb-6">
                  <textarea
                    placeholder="Write a post..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      disabled={!newPostContent.trim()}
                    >
                      Post
                    </button>
                  </div>
                </form>
              )}
              
              {/* Sign in prompt for non-logged in users */}
              {!user && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-gray-600">
                    <Link href="/login" className="text-blue-600 hover:text-blue-700">
                      Sign in
                    </Link>
                    {' '}to join the conversation and post messages
                  </p>
                </div>
              )}
              
              {/* Posts List */}
              {loading ? (
                <div className="text-center py-4">Loading posts...</div>
              ) : error ? (
                <div className="text-red-500 py-4">{error}</div>
              ) : (
                <div className="space-y-4">
                  {posts.map(post => (
                    <div key={post.id} className="border-b pb-4">
                      <div className="flex items-center mb-2">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                          {post.user_avatar ? (
                            <img 
                              src={post.user_avatar} 
                              alt={post.user_name} 
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <span className="text-gray-500 font-medium">
                              {post.user_name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{post.user_name}</h3>
                          <p className="text-xs text-gray-500">
                            {new Date(post.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
                      {user && (
                        <div className="mt-2 flex space-x-4">
                          <button className="text-sm text-gray-500 hover:text-blue-600">
                            Like
                          </button>
                          <button className="text-sm text-gray-500 hover:text-blue-600">
                            Comment
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Select a group to view posts
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 