import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout/Layout'
import SignIn from './components/Auth/SignIn'
import SignUp from './components/Auth/SignUp'
import NewFeeds from './pages/NewFeeds'
import Search from './pages/Search'
import NewPost from './components/Post/NewPost'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import VerifyAccounts from './pages/VerifyAccounts'
import AdminDashboard from './pages/AdminDashboard'
import Loading from './components/Common/Loading'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) return <Loading />
  if (!user) return <Navigate to="/signin" />
  
  return children
}

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) return <Loading />
  if (user) return <Navigate to="/" />
  
  return children
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/signin" element={
              <PublicRoute>
                <SignIn />
              </PublicRoute>
            } />
            <Route path="/signup" element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            } />
            <Route path="/*" element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<NewFeeds />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/new-post" element={<NewPost />} />
                    <Route path="/profile/:userId?" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/verify" element={<VerifyAccounts />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
