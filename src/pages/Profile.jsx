import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getUserProfile, supabase } from '../services/supabase'
import { Calendar, MapPin, Link as LinkIcon, UserPlus, UserMinus, MessageCircle } from 'lucide-react'
import PostCard from '../components/Post/PostCard'
import Loading from '../components/Common/Loading'

const Profile = () => {
  const { userId } = useParams()
  const { user: currentUser, profile: currentProfile } = useAuth()
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followersCount, setFollowersCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [activeTab, setActiveTab] = useState('posts')

  const targetUserId = userId || currentUser?.id
  const isOwnProfile = targetUserId === currentUser?.id

  useEffect(() => {
    if (targetUserId) {
      fetchProfile()
      fetchPosts()
      if (!isOwnProfile) {
        checkFollowStatus()
      }
    }
  }, [targetUserId])

  const fetchProfile = async () => {
    try {
      const { data, error } = await getUserProfile(targetUserId)
      if (error) throw error
      setProfile(data)
      setFollowersCount(data?.followers_count || 0)
      setFollowingCount(data?.following_count || 0)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (
            username,
            full_name,
            avatar_url,
            verified
          ),
          likes (count),
          comments (count)
        `)
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkFollowStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', currentUser.id)
        .eq('following_id', targetUserId)
        .single()

      setIsFollowing(!!data)
    } catch (error) {
      // Not following if no record found
      setIsFollowing(false)
    }
  }

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        // Unfollow
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', currentUser.id)
          .eq('following_id', targetUserId)
        
        setFollowersCount(prev => prev - 1)
      } else {
        // Follow
        await supabase
          .from('follows')
          .insert([{
            follower_id: currentUser.id,
            following_id: targetUserId
          }])
        
        setFollowersCount(prev => prev + 1)
      }
      setIsFollowing(!isFollowing)
    } catch (error) {
      console.error('Error toggling follow:', error)
    }
  }

  const tabs = [
    { id: 'posts', name: 'Posts', count: posts.length },
    { id: 'media', name: 'Media', count: posts.filter(p => p.image_url || p.audio_url).length },
    { id: 'likes', name: 'Likes', count: profile?.likes_count || 0 }
  ]

  const getFilteredPosts = () => {
    switch (activeTab) {
      case 'media':
        return posts.filter(post => post.image_url || post.audio_url)
      case 'likes':
        // This would need to be implemented based on your database structure
        return []
      default:
        return posts
    }
  }

  if (loading) return <Loading />
  if (!profile) return <div className="text-center py-12">Profile not found</div>

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden mb-6">
        {/* Cover Photo */}
        <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        
        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
            {/* Avatar */}
            <div className="-mt-16 mb-4 sm:mb-0">
              <img
                className="h-32 w-32 rounded-full border-4 border-white shadow-lg"
                src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.full_name || 'User'}&background=3b82f6&color=fff&size=128`}
                alt={profile.full_name || 'User'}
              />
            </div>

            {/* Actions */}
            <div className="flex-1 sm:pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-4 sm:mb-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {profile.full_name || 'Unknown User'}
                    </h1>
                    {profile.verified && (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-500">@{profile.username || 'unknown'}</p>
                </div>

                {/* Action Buttons */}
                {!isOwnProfile && (
                  <div className="flex space-x-3">
                    <button
                      onClick={handleFollow}
                      className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center space-x-2 ${
                        isFollowing
                          ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isFollowing ? <UserMinus size={16} /> : <UserPlus size={16} />}
                      <span>{isFollowing ? 'Unfollow' : 'Follow'}</span>
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                      <MessageCircle size={16} />
                      <span>Message</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="mt-4">
              <p className="text-gray-900">{profile.bio}</p>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center space-x-6 mt-4 text-sm">
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-gray-900">{followingCount}</span>
              <span className="text-gray-500">Following</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-gray-900">{followersCount}</span>
              <span className="text-gray-500">Followers</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-gray-900">{posts.length}</span>
              <span className="text-gray-500">Posts</span>
            </div>
          </div>

          {/* Additional Info */}
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar size={16} />
              <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
            </div>
            {profile.location && (
              <div className="flex items-center space-x-1">
                <MapPin size={16} />
                <span>{profile.location}</span>
              </div>
            )}
            {profile.website && (
              <div className="flex items-center space-x-1">
                <LinkIcon size={16} />
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {profile.website}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-6 border-b-2 font-medium text-sm flex-1 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {getFilteredPosts().length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500">
                {activeTab === 'posts' ? 'No posts yet' : 
                 activeTab === 'media' ? 'No media posts' : 'No liked posts'}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {getFilteredPosts().map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
