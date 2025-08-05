import React, { useEffect } from 'react'
import { User, Calendar } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useApp } from '../context/AppContext'
import Loading from '../components/Loading'

export default function Users() {
  const { users, loading, error, loadUsers } = useApp()

  useEffect(() => {
    if (users.length === 0) {
      loadUsers()
    }
  }, [])

  if (loading && users.length === 0) {
    return <Loading text="Đang tải danh sách người dùng..." />
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Người dùng
        </h1>
        <p className="text-gray-600">
          Danh sách các thành viên trong cộng đồng
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">Lỗi: {error}</p>
          <button
            onClick={loadUsers}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Thử lại
          </button>
        </div>
      )}

      {users.length === 0 && !loading ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <User size={64} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có người dùng nào
          </h3>
          <p className="text-gray-600">
            Hãy là người đầu tiên tham gia cộng đồng!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4 mb-4">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.username}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                    <User size={32} className="text-gray-600" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {user.username}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {user.email}
                  </p>
                </div>
              </div>

              {user.bio && (
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                  {user.bio}
                </p>
              )}

              <div className="flex items-center text-gray-500 text-sm">
                <Calendar size={16} className="mr-2" />
                <span>
                  Tham gia {formatDistanceToNow(new Date(user.created_at), { 
                    addSuffix: true, 
                    locale: vi 
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && users.length > 0 && (
        <div className="text-center py-4">
          <Loading size="sm" text="Đang tải thêm..." />
        </div>
      )}
    </div>
  )
}