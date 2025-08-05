import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Header from './components/Header'
import Home from './pages/Home'
import Users from './pages/Users'
import CreatePost from './pages/CreatePost'
import Profile from './pages/Profile'
import './App.css'

function App() {
  return (
    <AppProvider>
      <Router basename="/thanh-social-network">
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/users" element={<Users />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  )
}

export default App