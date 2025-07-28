import React, { useState } from 'react'
import { Heart, MessageCircle, Share, MoreHorizontal, Play, Pause } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../services/supabase'

const PostCard = ({ post }) => {
  const { user } = useAuth()
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post?.likes?.length || 0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioRef, setAudioRef] = useState(null)

  const handleLike = async () => {
    try {
      if (liked) {
        // Unlike
        await supabase
          .from('likes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', user.id)
        setLikesCount(prev => prev - 1)
      } else {
        // Like
        await supabase
          .from('likes')
          .insert([{ post_id: post.id, user_id: user.id }])
        setLikesCount(prev => prev + 1)
      }
      setLiked(!liked)
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const toggleAudio = () => {
    if (audioRef) {
      if (isPlaying) {
        audioRef.pause()
      } else {
        audioRef.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <img
            className="h-10 w-10 rounded-full"
            src={post.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${post.profiles?.full_name || 'User'}&background=3b82f6&color=fff`}
            alt={post.profiles?.full_name || 'User'}
          />
          <div>
            <div className="flex items-center space-x-1">
              <h4 className="text-sm font-semibold text-gray-900">
                {post.profiles?.full_name || 'Unknown User'}
              </h4>
              {post.profiles?.verified && (
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500">
              @{post.profiles?.username || 'unknown'} • {formatDate(post.created_at)}
            </p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        {post.content && (
          <p className="text-gray-900 text-sm mb-3 whitespace-pre-wrap">
            {post.content}
          </p>
        )}

        {/* Media */}
        {post.image_url && (
          <div className="mb-3 rounded-lg overflow-hidden">
            <img
              src={post.image_url}
              alt="Post content"
              className="w-full h-auto max-h-96 object-cover"
            />
          </div>
        )}

        {post.audio_url && (
          <div className="mb-3 bg-gray-50 rounded-lg p-4 flex items-center space-x-3">
            <button
              onClick={toggleAudio}
              className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <div className="flex-1">
              <audio
                ref={setAudioRef}
                src={post.audio_url}
                onEnded={() => setIsPlaying(false)}
                className="w-full"
                controls
              />
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 text-sm ${
                liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
              <span>{likesCount}</span>
            </button>
            
            <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-blue-500">
              <MessageCircle size={18} />
              <span>{post.comments?.length || 0}</span>
            </button>
            
            <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-green-500">
              <Share size={18} />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostCard
