import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { database } from '../lib/supabase'

const AppContext = createContext()

const initialState = {
  users: [],
  posts: [],
  currentUser: null,
  loading: false,
  error: null
}

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    
    case 'SET_USERS':
      return { ...state, users: action.payload, loading: false }
    
    case 'SET_POSTS':
      return { ...state, posts: action.payload, loading: false }
    
    case 'ADD_POST':
      return { 
        ...state, 
        posts: [action.payload, ...state.posts],
        loading: false 
      }
    
    case 'DELETE_POST':
      return {
        ...state,
        posts: state.posts.filter(post => post.id !== action.payload),
        loading: false
      }
    
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload }
    
    case 'ADD_USER':
      return {
        ...state,
        users: [action.payload, ...state.users],
        loading: false
      }
    
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Load initial data
  useEffect(() => {
    loadUsers()
    loadPosts()
  }, [])

  const loadUsers = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    const { data, error } = await database.getUsers()
    
    if (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
    } else {
      dispatch({ type: 'SET_USERS', payload: data || [] })
    }
  }

  const loadPosts = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    const { data, error } = await database.getPosts()
    
    if (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
    } else {
      dispatch({ type: 'SET_POSTS', payload: data || [] })
    }
  }

  const createUser = async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    const { data, error } = await database.createUser(userData)
    
    if (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      return { success: false, error: error.message }
    } else {
      dispatch({ type: 'ADD_USER', payload: data[0] })
      return { success: true, data: data[0] }
    }
  }

  const createPost = async (postData) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    const { data, error } = await database.createPost(postData)
    
    if (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      return { success: false, error: error.message }
    } else {
      // Add user info to the post
      const postWithUser = {
        ...data[0],
        users: state.currentUser
      }
      dispatch({ type: 'ADD_POST', payload: postWithUser })
      return { success: true, data: data[0] }
    }
  }

  const deletePost = async (postId) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    const { error } = await database.deletePost(postId)
    
    if (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      return { success: false, error: error.message }
    } else {
      dispatch({ type: 'DELETE_POST', payload: postId })
      return { success: true }
    }
  }

  const setCurrentUser = (user) => {
    dispatch({ type: 'SET_CURRENT_USER', payload: user })
  }

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null })
  }

  const value = {
    ...state,
    loadUsers,
    loadPosts,
    createUser,
    createPost,
    deletePost,
    setCurrentUser,
    clearError
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}