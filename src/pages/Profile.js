import React, { useState } from 'react'
import { User, Mail, Camera, LogOut } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Profile() {
  const { currentUser, setCurrentUser, createUser, loading } = useApp()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    avatar_url: ''
  })
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.username.trim() || !formData.email.trim()) {
      setError('Vui lòng điền đầy đủ thông tin!')
      return
    }

    if (isLogin) {
      // Simple login simulation - find user by email
      const mockUser = {
        id: Date.now(),
        username: formData.username,
        email: formData.email,
        bio: formData.bio,
        avatar_url: formData.avatar_url,
        created_at: new Date().toISOString()
      }
      setCurrentUser(mockUser)
    } else {
      // Create new user
      const userData = {
        ...formData,
        created_at: new Date().toISOString()
      }

      const result = await createUser(userData)
      
      if (result.success) {
        setCurrentUser(result.data)
      } else {
        setError(result.error || 'Có lỗi xảy ra khi tạo tài khoản!')
      }
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setFormData({
      username: '',
      email: '',
      bio: '',
      avatar_url: ''
    })
  }

  if (currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={16} />
              <span>Đăng xuất</span>
            </button>
          </div>

          <div className="flex items-center space-x-6 mb-6">
            {currentUser.avatar_url ? (
              <img
                src={currentUser.avatar_url}
                alt={currentUser.username}
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center border-4 border-gray-200">
                <User size={32} className="text-gray-600" />
              </div>
            )}
            
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {currentUser.username}
              </h2>
              <p className="text-gray-600">{currentUser.email}</p>
              {currentUser.bio && (
                <p className="text-gray-700 mt-2">{currentUser.bio}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-sm text-gray-600">Bài viết</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-600">Lượt thích</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={32} className="text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}
          </h1>
          <p className="text-gray-600">
            {isLogin 
              ? 'Chào mừng bạn quay trở lại!' 
              : 'Tham gia cộng đồng của chúng tôi!'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Tên người dùng *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Nhập tên người dùng"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="example@email.com"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={loading}
              />
            </div>
          </div>

          {!isLogin && (
            <>
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Giới thiệu bản thân
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Chia sẻ về bản thân..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="avatar_url" className="block text-sm font-medium text-gray-700 mb-1">
                  URL ảnh đại diện
                </label>
                <div className="relative">
                  <Camera size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="url"
                    id="avatar_url"
                    name="avatar_url"
                    value={formData.avatar_url}
                    onChange={handleInputChange}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                Đang xử lý...
              </div>
            ) : (
              isLogin ? 'Đăng nhập' : 'Tạo tài khoản'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:text-blue-800 text-sm"
            disabled={loading}
          >
            {isLogin 
              ? 'Chưa có tài khoản? Tạo tài khoản mới' 
              : 'Đã có tài khoản? Đăng nhập ngay'
            }
          </button>
        </div>
      </div>
    </div>
  )
}