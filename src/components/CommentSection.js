import React, { useState, useEffect } from 'react'
import { Send, User } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { database } from '../lib/supabase'
import { useApp } from '../context/AppContext'

export default function CommentSection({ postId }) {
  const { currentUser } = useApp()
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadComments()
  }, [postId])

  const loadComments = async () => {
    const { data, error } = await database.getComments(postId)
    if (!error && data) {
      setComments(data)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim() || !currentUser) return

    setLoading(true)
    const commentData = {
      post_id: postId,
      user_id: currentUser.id,
      content: newComment.trim(),
      created_at: new Date().toISOString()
    }

    const { data, error } = await database.createComment(commentData)
    
    if (!error && data) {
      setComments(prev => [...prev, data[0]])
      setNewComment('')
    }
    
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      {/* Comment Form */}
      {currentUser ? (
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <div className="flex-shrink-0">
            {currentUser.avatar_url ? (
              <img
                src={currentUser.avatar_url}
                alt={currentUser.username}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User size={14} className="text-gray-600" />
              </div>
            )}
          </div>
          <div className="flex-1 flex space-x-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Viết bình luận..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!newComment.trim() || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      ) : (
        <p className="text-gray-500 text-center py-2">
          Đăng nhập để bình luận
        </p>
      )}

      {/* Comments List */}
      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-3">
            <div className="flex-shrink-0">
              {comment.users?.avatar_url ? (
                <img
                  src={comment.users.avatar_url}
                  alt={comment.users.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User size={14} className="text-gray-600" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="bg-gray-50 rounded-lg px-3 py-2">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-semibold text-sm text-gray-900">
                    {comment.users?.username || 'Người dùng ẩn danh'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(comment.created_at), { 
                      addSuffix: true, 
                      locale: vi 
                    })}
                  </span>
                </div>
                <p className="text-gray-800 text-sm">{comment.content}</p>
              </div>
            </div>
          </div>
        ))}
        
        {comments.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            Chưa có bình luận nào
          </p>
        )}
      </div>
    </div>
  )
}