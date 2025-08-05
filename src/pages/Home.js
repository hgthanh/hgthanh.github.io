import React, { useEffect } from 'react'
import { useApp } from '../context/AppContext'
import PostCard from '../components/PostCard'
import Loading from '../components/Loading'

export default function Home() {
  const { posts, loading, error, loadPosts } = useApp()

  useEffect(() => {
    if (posts.length === 0) {
      loadPosts()
    }
  }, [])

  if (loading && posts.length === 0) {
    return <Loading text="Đang tải bài viết..." />
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Trang chủ
        </h1>
        <p className="text-gray-600">
          Khám phá những bài viết mới nhất từ cộng đồng
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">Lỗi: {error}</p>
          <button
            onClick={loadPosts}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Thử lại
          </button>
        </div>
      )}

      {posts.length === 0 && !loading ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có bài viết nào
          </h3>
          <p className="text-gray-600 mb-4">
            Hãy là người đầu tiên chia sẻ điều gì đó thú vị!
          </p>
          <a
            href="/create-post"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tạo bài viết đầu tiên
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {loading && posts.length > 0 && (
        <div className="text-center py-4">
          <Loading size="sm" text="Đang tải thêm..." />
        </div>
      )}
    </div>
  )
}