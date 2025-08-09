import { useState } from 'react'
import { 
  UserIcon, 
  BuildingOfficeIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PuzzlePieceIcon
} from '@heroicons/react/24/outline'

function App() {
  const [formData, setFormData] = useState({
    policyNumber: '',
    claimantName: '',
    dateOfIncident: '',
    incidentDescription: '',
    estimatedLoss: '',
    contactPhone: '',
    contactEmail: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    alert('Claim submitted successfully! We will process your application soon.')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <PuzzlePieceIcon className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">
              AutoFill Extension Demo
            </h1>
          </div>
          <p className="text-lg text-gray-600 mb-4">
            This is a demonstration of the AutoFill browser extension
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
            <h3 className="font-semibold text-blue-900 mb-2">How the extension works:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Install the AutoFill extension in your browser</li>
              <li>• Navigate to any form on any website</li>
              <li>• Drag and drop files containing your information</li>
              <li>• The extension will automatically detect and fill form fields</li>
            </ul>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Form Fields */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <UserIcon className="w-6 h-6 mr-2 text-blue-600" />
                Insurance Claim Form
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Policy Number *
                  </label>
                  <input
                    type="text"
                    name="policyNumber"
                    value={formData.policyNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your policy number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Claimant Name *
                  </label>
                  <input
                    type="text"
                    name="claimantName"
                    value={formData.claimantName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Incident Date *
                  </label>
                  <input
                    type="date"
                    name="dateOfIncident"
                    value={formData.dateOfIncident}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Loss Amount *
                  </label>
                  <div className="relative">
                    <CurrencyDollarIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      name="estimatedLoss"
                      value={formData.estimatedLoss}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Incident Description *
                </label>
                <textarea
                  name="incidentDescription"
                  value={formData.incidentDescription}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Please describe the incident in detail including time, location, circumstances, and damages..."
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                Submit Claim
              </button>
            </div>
          </form>
        </div>

        {/* Extension Info */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">About AutoFill Extension</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Features:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Works on any website with forms</li>
                <li>• Supports multiple file formats</li>
                <li>• Intelligent field detection</li>
                <li>• Secure local processing</li>
                <li>• No data sent to external servers</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Supported File Types:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• PDF documents</li>
                <li>• Images (JPG, PNG)</li>
                <li>• Word documents (DOC, DOCX)</li>
                <li>• Text files (TXT)</li>
                <li>• And more...</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Demo Instructions */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-900 mb-2">Demo Instructions:</h3>
          <p className="text-sm text-yellow-800">
            This is a demonstration page showing how the AutoFill extension would work. 
            In a real scenario, you would install the extension and then be able to drag files 
            onto any form on any website to automatically fill the fields.
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
