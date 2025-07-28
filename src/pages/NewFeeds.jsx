import React, { useState, useEffect } from 'react'
import { getPosts } from '../services/supabase'
import PostCard from '../components/Post/PostCard'
import Loading from '../components/Common/Loading'
import { RefreshCw } from 'lucide-react'

const NewFeeds = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const fetchPosts = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      
      const { data, error } = await getPosts(20, 0)
      if (error) throw error
      
      setPosts(data || [])
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleRefresh = () => {
    fetchPosts(true)
  }

  if (loading) return <Loading />

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">New Feeds</h1>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 disabled:opacity-50"
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No posts yet</div>
            <div className="text-gray-400 text-sm mt-2">
              Be the first to share something!
            </div>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  )
}

export default NewFeeds
