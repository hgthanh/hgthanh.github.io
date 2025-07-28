import React, { useState, useEffect } from 'react'
import { Search as SearchIcon, TrendingUp, Users, Hash } from 'lucide-react'
import { searchUsers, supabase } from '../services/supabase'
import { Link } from 'react-router-dom'

const Search = () => {
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState({
    users: [],
    posts: [],
    hashtags: []
  })
  const [hotSearches, setHotSearches] = useState([
    '#ThanhXuan', '#TechTalk', '#Music', '#Travel', '#Food'
  ])
  const [activeTab, setActiveTab] = useState('all')
  const [loading, setLoading] = useState(false)

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSearchResults({ users: [], posts: [], hashtags: [] })
      return
    }

    setLoading(true)
    try {
      // Search users
      const { data: users, error: usersError } = await searchUsers(searchQuery)
      if (usersError) throw usersError

      // Search posts
      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (
            username,
            full_name,
            avatar_url,
            verified
          )
        `)
        .ilike('content', `%${searchQuery}%`)
        .order('created_at', { ascending: false })
        .limit(10)

      if (postsError) throw postsError

      // Search hashtags (simulate)
      const hashtags = hotSearches.filter(tag => 
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )

      setSearchResults({
        users: users || [],
        posts: posts || [],
        hashtags
      })
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(query)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  const tabs = [
    { id: 'all', name: 'All', icon: SearchIcon },
    { id: 'users', name: 'People', icon: Users },
    { id: 'hashtags', name: 'Hashtags', icon: Hash }
  ]

  const filteredResults = () => {
    switch (activeTab) {
      case 'users':
        return { users: searchResults.users, posts: [], hashtags: [] }
      case 'hashtags':
        return { users: [], posts: [], hashtags: searchResults.hashtags }
      default:
        return searchResults
    }
  }

  const results = filteredResults()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Search</h1>
        
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            placeholder="Search for people, posts, hashtags..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Search Tabs */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.name}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Hot Searches */}
      {!query && (
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="text-red-500" size={20} />
            <h2 className="text-xl font-semibold text-gray-900">Trending</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {hotSearches.map((tag, index) => (
              <button
                key={index}
                onClick={() => setQuery(tag)}
                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {query && (
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Users */}
              {results.users.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Users size={20} />
                    <span>People</span>
                  </h3>
                  <div className="space-y-3">
                    {results.users.map((user) => (
                      <Link
                        key={user.id}
                        to={`/profile/${user.id}`}
                        className="block bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            className="h-12 w-12 rounded-full"
                            src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.full_name || 'User'}&background=3b82f6&color=fff`}
                            alt={user.full_name || 'User'}
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-1">
                              <h4 className="text-sm font-semibold text-gray-900">
                                {user.full_name || 'Unknown User'}
                              </h4>
                              {user.verified && (
                                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">@{user.username || 'unknown'}</p>
                            {user.bio && (
                              <p className="text-sm text-gray-600 mt-1">{user.bio}</p>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Posts */}
              {results.posts.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Posts</h3>
                  <div className="space-y-4">
                    {results.posts.map((post) => (
                      <div key={post.id} className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center space-x-3 mb-3">
                          <img
                            className="h-8 w-8 rounded-full"
                            src={post.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${post.profiles?.full_name || 'User'}&background=3b82f6&color=fff`}
                            alt={post.profiles?.full_name || 'User'}
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {post.profiles?.full_name || 'Unknown User'}
                            </p>
                            <p className="text-xs text-gray-500">
                              @{post.profiles?.username || 'unknown'}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-900">{post.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hashtags */}
              {results.hashtags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Hash size={20} />
                    <span>Hashtags</span>
                  </h3>
                  <div className="space-y-2">
                    {results.hashtags.map((hashtag, index) => (
                      <button
                        key={index}
                        className="block w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                      >
                        <p className="text-blue-600 font-medium">{hashtag}</p>
                        <p className="text-sm text-gray-500">Trending in Technology</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {results.users.length === 0 && results.posts.length === 0 && results.hashtags.length === 0 && (
                <div className="text-center py-12">
                  <SearchIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try searching for something else.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default Search
