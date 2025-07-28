import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../services/supabase'
import { 
  Shield, 
  Users, 
  FileText, 
  TrendingUp, 
  Check, 
  X, 
  Eye, 
  Trash2,
  Calendar,
  BarChart3
} from 'lucide-react'

const AdminDashboard = () => {
  const { profile } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    verifyRequests: 0,
    todayPosts: 0
  })
  const [verifyRequests, setVerifyRequests] = useState([])
  const [posts, setPosts] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  // Check if user is admin (you might want to add an is_admin field to profiles table)
  const isAdmin = profile?.email === 'admin@thazh.social' || profile?.username === 'admin'

  useEffect(() => {
    if (isAdmin) {
      fetchStats()
      fetchVerifyRequests()
      fetchRecentPosts()
      fetchUsers()
    }
  }, [isAdmin])

  const fetchStats = async () => {
    try {
      // Get total users
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      // Get total posts
      const { count: postsCount } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })

      // Get pending verify requests
      const { count: verifyCount } = await supabase
        .from('verify_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      // Get today's posts
      const today = new Date().toISOString().split('T')[0]
      const { count: todayCount } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today)

      setStats({
        totalUsers: usersCount || 0,
        totalPosts: postsCount || 0,
        verifyRequests: verifyCount || 0,
        todayPosts: todayCount || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchVerifyRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('verify_requests')
        .select(`
          *,
          profiles:user_id (
            username,
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setVerifyRequests(data || [])
    } catch (error) {
      console.error('Error fetching verify requests:', error)
    }
  }

  const fetchRecentPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (
            username,
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyRequest = async (requestId, status) => {
    try {
      const { error } = await supabase
        .from('verify_requests')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId)

      if (error) throw error

      // If approved, update user's verified status
      if (status === 'approved') {
        const request = verifyRequests.find(r => r.id === requestId)
        if (request) {
          await supabase
            .from('profiles')
            .update({ verified: true })
            .eq('id', request.user_id)
        }
      }

      fetchVerifyRequests()
      fetchStats()
    } catch (error) {
      console.error('Error updating verify request:', error)
    }
  }

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const { error } = await supabase
          .from('posts')
          .delete()
          .eq('id', postId)

        if (error) throw error
        fetchRecentPosts()
        fetchStats()
      } catch (error) {
        console.error('Error deleting post:', error)
      }
    }
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user account?')) {
      try {
        // This would need a proper delete function that handles cascading deletes
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId)

        if (error) throw error
        fetchUsers()
        fetchStats()
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }
  }

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'verify', name: 'Verification', icon: Shield },
    { id: 'posts', name: 'Posts', icon: FileText },
    { id: 'users', name: 'Users', icon: Users }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your platform</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Posts</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalPosts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Verify Requests</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.verifyRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Today's Posts</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.todayPosts}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-6 border-b-2 font-medium text-sm flex items-center space-x-2 ${
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

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Platform Overview</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-3">Recent Activity</h3>
                  <div className="space-y-3">
                    {posts.slice(0, 5).map((post) => (
                      <div key={post.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <img
                          className="h-8 w-8 rounded-full"
                          src={post.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${post.profiles?.full_name}&background=3b82f6&color=fff`}
                          alt=""
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {post.profiles?.full_name} posted
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {post.content?.substring(0, 50)}...
                          </p>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pending Verifications */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-3">Pending Verifications</h3>
                  <div className="space-y-3">
                    {verifyRequests.filter(r => r.status === 'pending').slice(0, 5).map((request) => (
                      <div key={request.id} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                        <img
                          className="h-8 w-8 rounded-full"
                          src={request.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${request.profiles?.full_name}&background=3b82f6&color=fff`}
                          alt=""
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {request.profiles?.full_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Verification request
                          </p>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(request.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Verification Tab */}
          {activeTab === 'verify' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Verification Requests</h2>
              <div className="space-y-4">
                {verifyRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          className="h-12 w-12 rounded-full"
                          src={request.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${request.profiles?.full_name}&background=3b82f6&color=fff`}
                          alt=""
                        />
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">
                            {request.profiles?.full_name}
                          </h3>
                          <p className="text-sm text-gray-500">@{request.profiles?.username}</p>
                          <p className="text-sm text-gray-500">{request.email}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {request.status}
                      </span>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900">Reason:</h4>
                      <p className="text-sm text-gray-600 mt-1">{request.reason}</p>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900">Social Links:</h4>
                      <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{request.social_links}</p>
                    </div>

                    {request.status === 'pending' && (
                      <div className="mt-4 flex space-x-3">
                        <button
                          onClick={() => handleVerifyRequest(request.id, 'approved')}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                        >
                          <Check size={16} className="mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleVerifyRequest(request.id, 'rejected')}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <X size={16} className="mr-1" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Posts Tab */}
          {activeTab === 'posts' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Posts</h2>
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={post.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${post.profiles?.full_name}&background=3b82f6&color=fff`}
                          alt=""
                        />
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">
                            {post.profiles?.full_name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {new Date(post.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm text-gray-900">{post.content}</p>
                      {post.image_url && (
                        <img
                          src={post.image_url}
                          alt="Post"
                          className="mt-2 max-w-xs rounded-lg"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">User Management</h2>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.full_name}&background=3b82f6&color=fff`}
                          alt=""
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-sm font-semibold text-gray-900">
                              {user.full_name}
                            </h3>
                            {user.verified && (
                              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">@{user.username}</p>
                          <p className="text-sm text-gray-500">
                            Joined {new Date(user.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-700">
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
