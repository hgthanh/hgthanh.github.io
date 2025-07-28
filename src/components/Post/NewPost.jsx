import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { createPost, uploadFile } from '../../services/supabase'
import { Image, Mic, X, Upload } from 'lucide-react'

const NewPost = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [audioFile, setAudioFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size must be less than 5MB')
        return
      }
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleAudioChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('Audio size must be less than 10MB')
        return
      }
      setAudioFile(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const removeAudio = () => {
    setAudioFile(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim() && !imageFile && !audioFile) {
      setError('Please add some content, image, or audio')
      return
    }

    setLoading(true)
    setError('')

    try {
      let imageUrl = null
      let audioUrl = null

      // Upload image if exists
      if (imageFile) {
        const imageFileName = `${user.id}/${Date.now()}_${imageFile.name}`
        const { data: imageUpload, error: imageError } = await uploadFile('images', imageFile, imageFileName)
        if (imageError) throw imageError
        imageUrl = `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/images/${imageFileName}`
      }

      // Upload audio if exists
      if (audioFile) {
        const audioFileName = `${user.id}/${Date.now()}_${audioFile.name}`
        const { data: audioUpload, error: audioError } = await uploadFile('audio', audioFile, audioFileName)
        if (audioError) throw audioError
        audioUrl = `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/audio/${audioFileName}`
      }

      // Create post
      const postData = {
        user_id: user.id,
        content: content.trim(),
        image_url: imageUrl,
        audio_url: audioUrl
      }

      const { error: postError } = await createPost(postData)
      if (postError) throw postError

      navigate('/')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Post</h1>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                What's on your mind?
              </label>
              <textarea
                id="content"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Share your thoughts..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={1000}
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {content.length}/1000
              </div>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X size={20} />
                </button>
              </div>
            )}

            {/* Audio Preview */}
            {audioFile && (
              <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mic className="text-blue-500" size={20} />
                  <span className="text-sm text-gray-700">{audioFile.name}</span>
                </div>
                <button
                  type="button"
                  onClick={removeAudio}
                  className="text-red-500 hover:text-red-600"
                >
                  <X size={20} />
                </button>
              </div>
            )}

            {/* Media Upload Buttons */}
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                <Image size={20} className="text-blue-500" />
                <span className="text-sm text-gray-700">Add Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              <label className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                <Mic size={20} className="text-green-500" />
                <span className="text-sm text-gray-700">Add Audio</span>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || (!content.trim() && !imageFile && !audioFile)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading && <Upload className="animate-spin" size={16} />}
                <span>{loading ? 'Posting...' : 'Post'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default NewPost
