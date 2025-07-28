// Utility functions for the application

// Format date to relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date) => {
  const now = new Date()
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000)
  
  if (diffInSeconds < 60) {
    return 'just now'
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}h ago`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays}d ago`
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`
  }
  
  return new Date(date).toLocaleDateString()
}

// Format number with K, M suffixes
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate username format (alphanumeric and underscores only)
export const isValidUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]+$/
  return usernameRegex.test(username) && username.length >= 3 && username.length <= 20
}

// Truncate text to specified length
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Generate avatar URL from name
export const generateAvatarUrl = (name, size = 40) => {
  const encodedName = encodeURIComponent(name || 'User')
  return `https://ui-avatars.com/api/?name=${encodedName}&background=3b82f6&color=fff&size=${size}`
}

// Check if URL is valid
export const isValidUrl = (string) => {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

// Debounce function for search inputs
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Copy text to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand('copy')
      document.body.removeChild(textArea)
      return true
    } catch (err) {
      document.body.removeChild(textArea)
      return false
    }
  }
}

// Get file extension from filename
export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

// Check if file is image
export const isImageFile = (file) => {
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
  const extension = getFileExtension(file.name).toLowerCase()
  return imageTypes.includes(extension)
}

// Check if file is audio
export const isAudioFile = (file) => {
  const audioTypes = ['mp3', 'wav', 'ogg', 'm4a', 'aac']
  const extension = getFileExtension(file.name).toLowerCase()
  return audioTypes.includes(extension)
}

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Generate random ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9)
}

// Sanitize HTML content
export const sanitizeHtml = (html) => {
  const div = document.createElement('div')
  div.textContent = html
  return div.innerHTML
}

// Extract hashtags from text
export const extractHashtags = (text) => {
  const hashtagRegex = /#[a-zA-Z0-9_]+/g
  return text.match(hashtagRegex) || []
}

// Extract mentions from text
export const extractMentions = (text) => {
  const mentionRegex = /@[a-zA-Z0-9_]+/g
  return text.match(mentionRegex) || []
}

// Convert text with hashtags and mentions to JSX
export const formatTextWithLinks = (text) => {
  const hashtagRegex = /#([a-zA-Z0-9_]+)/g
  const mentionRegex = /@([a-zA-Z0-9_]+)/g
  
  let formattedText = text
  
  // Replace hashtags
  formattedText = formattedText.replace(hashtagRegex, '<span class="text-blue-600 hover:underline cursor-pointer">#$1</span>')
  
  // Replace mentions
  formattedText = formattedText.replace(mentionRegex, '<span class="text-blue-600 hover:underline cursor-pointer">@$1</span>')
  
  return formattedText
}

// Check if user is online (based on last activity)
export const isUserOnline = (lastActivity) => {
  const now = new Date()
  const lastActiveTime = new Date(lastActivity)
  const diffInMinutes = Math.floor((now - lastActiveTime) / (1000 * 60))
  
  return diffInMinutes < 5 // Consider online if active within 5 minutes
}

// Get greeting based on time of day
export const getGreeting = () => {
  const hour = new Date().getHours()
  
  if (hour < 12) {
    return 'Good morning'
  } else if (hour < 18) {
    return 'Good afternoon'
  } else {
    return 'Good evening'
  }
}

// Calculate reading time for text
export const calculateReadingTime = (text) => {
  const wordsPerMinute = 200
  const words = text.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  
  return minutes === 1 ? '1 min read' : `${minutes} min read`
}

