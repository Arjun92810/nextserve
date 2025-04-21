'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { supabase } from '@/lib/supabase-client';

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
  const router = useRouter();

  // Fetch groups and posts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch groups
        const { data: groupsData, error: groupsError } = await supabase
          .from('groups')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (groupsError) throw groupsError;
        
        // For demo purposes, if no groups exist, create some sample groups
        if (!groupsData || groupsData.length === 0) {
          const sampleGroups = [
            {
              id: '1',
              name: 'NextServe',
              description: 'The main group for all NextServe members',
              created_at: new Date().toISOString(),
              member_count: 4,
              is_member: true
            },
            {
              id: '2',
              name: 'Jersey City Tennis',
              description: 'Tennis enthusiasts in Jersey City',
              created_at: new Date().toISOString(),
              member_count: 12,
              is_member: false
            },
            {
              id: '3',
              name: 'Beginner Players',
              description: 'A group for tennis beginners to connect',
              created_at: new Date().toISOString(),
              member_count: 8,
              is_member: true
            }
          ];
          
          setGroups(sampleGroups);
        } else {
          setGroups(groupsData);
        }
        
        // Fetch posts for the first group
        if (groupsData && groupsData.length > 0) {
          const firstGroup = groupsData[0];
          setSelectedGroup(firstGroup);
          
          const { data: postsData, error: postsError } = await supabase
            .from('posts')
            .select('*, profiles:user_id(name, avatar_url)')
            .eq('group_id', firstGroup.id)
            .order('created_at', { ascending: false });
          
          if (postsError) throw postsError;
          
          // For demo purposes, if no posts exist, create some sample posts
          if (!postsData || postsData.length === 0) {
            const samplePosts = [
              {
                id: '1',
                group_id: firstGroup.id,
                user_id: 'user1',
                content: 'Welcome to our group **NextServe Group**! A space for us to connect and share with each other. Start by posting your thoughts, sharing media, or creating a poll.',
                created_at: new Date(Date.now() - 86400000 * 30).toISOString(), // 30 days ago
                user_name: 'Arjun Dhavle'
              },
              {
                id: '2',
                group_id: firstGroup.id,
                user_id: 'user2',
                content: 'Hello everyone! Welcome to Nextserve!',
                created_at: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
                user_name: 'arjundhavle'
              },
              {
                id: '3',
                group_id: firstGroup.id,
                user_id: 'user3',
                content: 'Thank you! Excited to be here!',
                created_at: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
                user_name: '2028jbansal'
              }
            ];
            
            setPosts(samplePosts);
          } else {
            // Transform the data to match our Post interface
            const transformedPosts = postsData.map(post => ({
              id: post.id,
              group_id: post.group_id,
              user_id: post.user_id,
              content: post.content,
              created_at: post.created_at,
              user_name: post.profiles?.name || 'Anonymous',
              user_avatar: post.profiles?.avatar_url
            }));
            
            setPosts(transformedPosts);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load groups and posts');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []); // Remove supabase from dependencies

  // Handle group selection
  const handleGroupSelect = async (group: Group) => {
    setSelectedGroup(group);
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*, profiles:user_id(name, avatar_url)')
        .eq('group_id', group.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // For demo purposes, if no posts exist, create some sample posts
      if (!data || data.length === 0) {
        const samplePosts = [
          {
            id: '1',
            group_id: group.id,
            user_id: 'user1',
            content: `Welcome to the ${group.name} group!`,
            created_at: new Date().toISOString(),
            user_name: 'Admin'
          }
        ];
        
        setPosts(samplePosts);
      } else {
        // Transform the data to match our Post interface
        const transformedPosts = data.map(post => ({
          id: post.id,
          group_id: post.group_id,
          user_id: post.user_id,
          content: post.content,
          created_at: post.created_at,
          user_name: post.profiles?.name || 'Anonymous',
          user_avatar: post.profiles?.avatar_url
        }));
        
        setPosts(transformedPosts);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts');
      setLoading(false);
    }
  };

  // Handle creating a new post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPostContent.trim() || !selectedGroup) return;
    
    try {
      // In a real app, you would save this to the database
      // For demo purposes, we'll just add it to the state
      const newPost: Post = {
        id: Date.now().toString(),
        group_id: selectedGroup.id,
        user_id: 'current-user',
        content: newPostContent,
        created_at: new Date().toISOString(),
        user_name: 'You'
      };
      
      setPosts([newPost, ...posts]);
      setNewPostContent('');
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post');
    }
  };

  // Filter groups based on search query
  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Groups</h1>
      
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
          
          <h2 className="text-xl font-semibold mb-3">Suggested Groups</h2>
          
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
                  <button 
                    className={`mt-2 px-3 py-1 text-sm rounded-full ${
                      group.is_member 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {group.is_member ? 'Joined' : 'Join'}
                  </button>
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
              
              {/* Create Post Form */}
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
                      <div className="mt-2 flex space-x-4">
                        <button className="text-sm text-gray-500 hover:text-blue-600">
                          Like
                        </button>
                        <button className="text-sm text-gray-500 hover:text-blue-600">
                          Comment
                        </button>
                      </div>
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