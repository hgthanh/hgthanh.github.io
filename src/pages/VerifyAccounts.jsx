import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../services/supabase'
import { Shield, Link as LinkIcon, FileText, Send } from 'lucide-react'

const VerifyAccounts = () => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    email: user?.email || '',
    socialLinks: '',
    reason: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase
        .from('verify_requests')
        .insert([{
          user_id: user.id,
          email: formData.email,
          social_links: formData.socialLinks,
          reason: formData.reason,
          status: 'pending'
        }])

      if (error) throw error

      setSuccess(true)
      setFormData({
        email: user?.email || '',
        socialLinks: '',
        reason: ''
      })
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Your verification request has been submitted successfully. Our team will review your application and get back to you within 3-5 business days.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">What happens next?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Our team will review your credentials</li>
                <li>• We may contact you for additional information</li>
                <li>• You'll receive an email with the decision</li>
                <li>• If approved, the blue checkmark will appear on your profile</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Request Verification</h1>
              <p className="text-sm text-gray-600">Get the blue checkmark on your profile</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Info Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Verification Criteria</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Public figure, celebrity, or brand</li>
              <li>• Journalist, government official, or activist</li>
              <li>• Business owner or content creator</li>
              <li>• Have significant media coverage or public presence</li>
              <li>• Authentic and unique account</li>
            </ul>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your contact email"
                value={formData.email}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500 mt-1">
                We'll use this email to contact you about your verification status
              </p>
            </div>

            {/* Social Links */}
            <div>
              <label htmlFor="socialLinks" className="block text-sm font-medium text-gray-700 mb-2">
                <LinkIcon className="inline w-4 h-4 mr-1" />
                Social Media Links or Media Coverage *
              </label>
              <textarea
                id="socialLinks"
                name="socialLinks"
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Please provide links to:&#10;• Your official website&#10;• Other verified social media accounts&#10;• News articles or media coverage about you&#10;• Wikipedia page (if applicable)"
                value={formData.socialLinks}
                onChange={handleChange}
              />
            </div>

            {/* Reason */}
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="inline w-4 h-4 mr-1" />
                Why should you be verified? *
              </label>
              <textarea
                id="reason"
                name="reason"
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Explain why your account should be verified. Include:&#10;• Your public role or profession&#10;• Notable achievements or recognition&#10;• Why verification would benefit the community&#10;• Any other relevant information"
                value={formData.reason}
                onChange={handleChange}
                maxLength={1000}
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {formData.reason.length}/1000
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Guidelines</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Provide accurate and truthful information</li>
                <li>• Include relevant links and documentation</li>
                <li>• Verification is for notable public figures only</li>
                <li>• Fake or misleading information will result in rejection</li>
                <li>• Review process takes 3-5 business days</li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Request
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default VerifyAccounts
