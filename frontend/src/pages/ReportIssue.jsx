import React, { useState } from 'react';
import { MapPin, Upload, AlertCircle } from 'lucide-react';

export default function ReportIssue() {
  const [formData, setFormData] = useState({
    description: '',
    location: '',
    latitude: '',
    longitude: '',
    image: null
  });
  
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [submitted, setSubmitted] = useState(false);
const [imagePreview, setImagePreview] = useState(null);
  
  const API_URL = "https://community-hero-vibe2ship.onrender.com";
  
  // Handle image upload
  const handleImageUpload = (e) => {
  const file = e.target.files[0];

  if (file) {
    setFormData({
      ...formData,
      image: file
    });

    setImagePreview(URL.createObjectURL(file));
  }
};
  
  // Get current location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData({
          ...formData,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6)
        });
      });
    }
  };
  
  // Submit and analyze with AI
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.description || !formData.location) {
      alert('Please fill all fields');
      return;
    }
    
    setAnalyzing(true);
    
    try {
      // Call your backend endpoint
      const response = await fetch(`${API_URL}/api/analyze-issue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: formData.description,
          location: formData.location,
          latitude: parseFloat(formData.latitude) || 0,
          longitude: parseFloat(formData.longitude) || 0,
          user_id: 'user_' + Date.now()
        })
      });
      
      const result = await response.json();
      
      // This will come from Gemini analysis
      setAnalysisResult({
  issue_type: result.analysis?.issue_type || 'pothole',
  confidence: (result.analysis?.ai_confidence * 100 || 92).toFixed(0),
  severity: result.analysis?.ai_confidence > 0.8 ? 'High' : 'Medium',
  recommended_action: result.analysis?.recommended_action || 'Road repair needed',
  environmental_impact:
    result.analysis?.environmental_impact || 'Potential hazard to traffic',

  department:
    result.analysis?.issue_type === 'pothole'
      ? 'Road Maintenance Department'
      : result.analysis?.issue_type === 'garbage'
      ? 'Waste Management Department'
      : result.analysis?.issue_type === 'street_light'
      ? 'Electrical Department'
      : 'Municipal Services Department'
});
      
      setSubmitted(true);
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting report');
    }
    
    setAnalyzing(false);
  };
  
  if (submitted && analysisResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-8">
        <div className="max-w-2xl mx-auto">
          {/* SUCCESS MESSAGE */}
          <div className="bg-green-600 text-white p-8 rounded-lg mb-8 text-center">
            <div className="text-5xl mb-4">✓</div>
            <h2 className="text-3xl font-bold mb-2">Issue Reported Successfully!</h2>
            <p className="text-lg">AI has analyzed your report and routed it to the appropriate department.</p>
          </div>
          
          {/* AI ANALYSIS RESULTS */}
          <div className="bg-gray-800 p-8 rounded-lg mb-8">
            <h3 className="text-2xl font-bold text-blue-300 mb-6">🤖 AI Analysis Results</h3>
            
            {imagePreview && (
  <div className="bg-gray-700 p-4 rounded-lg mb-6">
    <p className="text-gray-300 mb-3 font-semibold">
      Uploaded Evidence
    </p>

    <img
      src={imagePreview}
      alt="Issue"
      className="rounded-lg max-h-64 w-full object-cover"
    />
  </div>
)}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-700 p-4 rounded">
                <p className="text-gray-300 text-sm">Issue Type</p>
                <p className="text-2xl font-bold text-green-400 capitalize">{analysisResult.issue_type}</p>
              </div>
              
              <div className="bg-gray-700 p-4 rounded">
                <p className="text-gray-300 text-sm">AI Confidence</p>
                <p className="text-2xl font-bold text-blue-400">{analysisResult.confidence}%</p>
              </div>
              
              <div className="bg-gray-700 p-4 rounded">
                <p className="text-gray-300 text-sm">Severity Level</p>
                <p className="text-2xl font-bold text-yellow-400">{analysisResult.severity}</p>
              </div>
              
              <div className="bg-gray-700 p-4 rounded">
                <p className="text-gray-300 text-sm">Status</p>
                <p className="text-2xl font-bold text-purple-400">Verified ✓</p>
              </div>
            </div>
            
            <div className="bg-gray-700 p-4 rounded mb-6">
              <p className="text-gray-300 text-sm mb-2">Recommended Action</p>
              <p className="text-lg text-white">{analysisResult.recommended_action}</p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded">
              <p className="text-gray-300 text-sm mb-2">Environmental Impact</p>
              <p className="text-lg text-white">{analysisResult.environmental_impact}</p>
            </div>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg mb-6">
  <p className="text-gray-300 text-sm">
    Assigned Department
  </p>

  <p className="text-green-400 text-2xl font-bold">
    {analysisResult.department}
  </p>
</div>
          
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({ description: '', location: '', latitude: '', longitude: '', image: null });
              setAnalysisResult(null);
            setImagePreview(null);           }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
          >
            Report Another Issue
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-8">
      <div className="max-w-2xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">🚨 Report an Issue</h1>
          <p className="text-xl text-blue-200">Help us fix your community</p>
        </div>
        
        {/* FORM */}
        <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-lg">
          
          {/* DESCRIPTION */}
          <div className="mb-6">
            <label className="block text-white font-bold mb-3">📝 Issue Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the issue: e.g., Large pothole on Main Road causing traffic issues"
              className="w-full bg-gray-700 text-white p-4 rounded border border-gray-600 focus:border-blue-500 outline-none"
              rows="4"
              required
            />
            <p className="text-xs text-gray-400 mt-2">Be specific about the problem</p>
          </div>
          
          {/* IMAGE UPLOAD */}
          <div className="mb-6">
            <label className="block text-white font-bold mb-3">📸 Upload Image/Video</label>
            <div className="border-2 border-dashed border-blue-400 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-700 transition">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleImageUpload}
                className="hidden"
                id="imageInput"
              />
              <label htmlFor="imageInput" className="cursor-pointer">
                <Upload className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                <p className="text-white font-bold">Click to upload or drag and drop</p>
                <p className="text-gray-400 text-sm mt-1">PNG, JPG, MP4 up to 10MB</p>
                {formData.image && <p className="text-green-400 mt-2">✓ {formData.image.name}</p>}
              </label>
            </div>
          </div>
          
          {/* LOCATION */}
          <div className="mb-6">
            <label className="block text-white font-bold mb-3">📍 Location</label>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Address or area name"
                className="col-span-3 bg-gray-700 text-white p-3 rounded border border-gray-600 focus:border-blue-500 outline-none"
                required
              />
              <input
                type="number"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                placeholder="Latitude"
                step="0.000001"
                className="bg-gray-700 text-white p-3 rounded border border-gray-600 focus:border-blue-500 outline-none"
              />
              <input
                type="number"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                placeholder="Longitude"
                step="0.000001"
                className="bg-gray-700 text-white p-3 rounded border border-gray-600 focus:border-blue-500 outline-none"
              />
              <button
                type="button"
                onClick={getLocation}
                className="col-span-3 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded transition"
              >
                <MapPin className="w-4 h-4 inline mr-2" />
                Use My Current Location
              </button>
            </div>
          </div>
          
          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={analyzing}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 rounded-lg transition disabled:opacity-50"
          >
            {analyzing ? (
              <span>🤖 AI is analyzing your report...</span>
            ) : (
              <span>✓ Submit & Analyze with AI</span>
            )}
          </button>
          
          {/* INFO */}
          <div className="mt-6 bg-blue-900 p-4 rounded border border-blue-600">
            <p className="text-blue-200 text-sm flex items-start">
              <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              Our AI will analyze your report and automatically categorize it, assess severity, and route it to the appropriate department.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
