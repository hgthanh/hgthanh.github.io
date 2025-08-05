import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Image, Send } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function CreatePost() {
  const { currentUser, createPost, loading } = useApp()
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!currentUser) {
      setError('Vui lòng đăng nhập để tạo bài viết!')
      return
    }

    if (!content.trim()) {
      setError('Vui lòng nhập nội dung bài viết!')
      return
    }

    setError('')

    const postData = {
      user_id: currentUser.id,
      content: content.trim(),
      image_url: imageUrl.trim() || null,
      created_at: new Date().toISOString()
    }

    const result = await createPost(postData)
    
    if (result.success) {
      navigate('/')
    } else {
      setError(result.error || 'Có lỗi xảy ra khi tạo bài viết!')
    }
  }

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">
            Cần đăng nhập
          </h2>
          <p className="text-yellow-700 mb-4">
            Bạn cần đăng nhập để có thể tạo bài viết mới.
          </p>
          <button
            onClick={() => navigate('/profile')}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Tạo bài viết mới
        </h1>
        <p className="text-gray-600">
          Chia sẻ những suy nghĩ, hình ảnh của bạn với cộng đồng
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Content Input */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Nội dung bài viết *
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Bạn đang nghĩ gì?"
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              disabled={loading}
            />
            <div className="mt-1 text-sm text-gray-500">
              {content.length}/1000 ký tự
            </div>
          </div>

          {/* Image URL Input */}
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
              URL hình ảnh (tùy chọn)
            </label>
            <div className="relative">
              <Image size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="url"
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
          </div>

          {/* Image Preview */}
          {imageUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xem trước hình ảnh
              </label>
              <img
                src={imageUrl}
                alt="Preview"
                className="max-w-full h-auto rounded-lg border border-gray-200"
                onError={() => setError('URL hình ảnh không hợp lệ')}
                onLoad={() => setError('')}
              />
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <Send size={16} />
              )}
              <span>{loading ? 'Đang đăng...' : 'Đăng bài'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}