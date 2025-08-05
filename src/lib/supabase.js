import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper functions for database operations
export const database = {
  // Users
  async getUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async createUser(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
    return { data, error }
  },

  async getUserById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    return { data, error }
  },

  // Posts
  async getPosts() {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        users (
          id,
          username,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async createPost(postData) {
    const { data, error } = await supabase
      .from('posts')
      .insert([postData])
      .select()
    return { data, error }
  },

  async deletePost(postId) {
    const { data, error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)
    return { data, error }
  },

  // Likes
  async getLikes(postId) {
    const { data, error } = await supabase
      .from('likes')
      .select('*')
      .eq('post_id', postId)
    return { data, error }
  },

  async toggleLike(userId, postId) {
    // Check if like exists
    const { data: existingLike } = await supabase
      .from('likes')
      .select('*')
      .eq('user_id', userId)
      .eq('post_id', postId)
      .single()

    if (existingLike) {
      // Remove like
      const { data, error } = await supabase
        .from('likes')
        .delete()
        .eq('user_id', userId)
        .eq('post_id', postId)
      return { data, error, action: 'removed' }
    } else {
      // Add like
      const { data, error } = await supabase
        .from('likes')
        .insert([{ user_id: userId, post_id: postId }])
        .select()
      return { data, error, action: 'added' }
    }
  },

  // Comments
  async getComments(postId) {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        users (
          id,
          username,
          avatar_url
        )
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
    return { data, error }
  },

  async createComment(commentData) {
    const { data, error } = await supabase
      .from('comments')
      .insert([commentData])
      .select(`
        *,
        users (
          id,
          username,
          avatar_url
        )
      `)
    return { data, error }
  }
}