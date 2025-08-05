import React, { useState, useEffect } from 'react'
import { Heart, MessageCircle, Trash2, User } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { database } from '../lib/supabase'
import { useApp } from '../context/AppContext'
import CommentSection from './CommentSection'

export default function PostCard({ post }) {
  const { currentUser, deletePost } = useApp()
  const [likes, setLikes] = useState([])
  const [showComments, setShowComments] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)

  useEffect(() => {
    loadLikes()
  }, [post.id])

  const loadLikes = async () => {
    const { data } = await database.getLikes(post.id)
    if (data) {
      setLikes(data)
      setLikesCount(data.length)
      setIsLiked(data.some(like => like.user_id === currentUser?.id))
    }
  }

  const handleLike = async () => {
    if (!currentUser) {
      alert('Vui lòng đăng nhập để thích bài viết!')
      return
    }

    const { action } = await database.toggleLike(currentUser.id, post.id)
    if (action === 'added') {
      setIsLiked(true)
      setLikesCount(prev => prev + 1)
    } else {
      setIsLiked(false)
      setLikesCount(prev => prev - 1)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      await deletePost(post.id)
    }
  }

  const canDelete = currentUser && (currentUser.id === post.user_id || currentUser.id === post.users?.id)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {post.users?.avatar_url ? (
            <img
              src={post.users.avatar_url}
              alt={post.users.username}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <User size={20} className="text-gray-600" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900">
              {post.users?.username || 'Người dùng ẩn danh'}
            </h3>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.created_at), { 
                addSuffix: true, 
                locale: vi 
              })}
            </p>
          </div>
        </div>

        {canDelete && (
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="Xóa bài viết"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
        {post.image_url && (
          <img
            src={post.image_url}
            alt="Post content"
            className="mt-3 rounded-lg max-w-full h-auto"
          />
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-6">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              isLiked
                ? 'text-red-500 bg-red-50 hover:bg-red-100'
                : 'text-gray-600 hover:text-red-500 hover:bg-gray-50'
            }`}
          >
            <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
            <span>{likesCount} thích</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-blue-500 hover:bg-gray-50 transition-colors"
          >
            <MessageCircle size={20} />
            <span>Bình luận</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <CommentSection postId={post.id} />
        </div>
      )}
    </div>
  )
}