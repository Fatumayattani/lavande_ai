import React, { useRef, useEffect } from 'react'
import { Download, Share2, Eye, AlertCircle, Sparkles } from 'lucide-react'

interface OutputDisplayProps {
  processedStream: MediaStream | null
  isProcessing: boolean
  transformation: string
  error?: string | null
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({
  processedStream,
  isProcessing,
  transformation,
  error
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current && processedStream) {
      console.log('Setting processed stream to output video')
      videoRef.current.srcObject = processedStream
      videoRef.current.play().catch(console.error)
    }
  }, [processedStream])

  const handleDownload = () => {
    // Placeholder for download functionality
    console.log('Download functionality would be implemented here')
  }

  const handleShare = () => {
    // Placeholder for share functionality
    console.log('Share functionality would be implemented here')
  }

  const renderContent = () => {
    if (error) {
      return (
        <div className="aspect-video bg-black/60 border border-red-500/20 rounded-xl flex flex-col items-center justify-center text-center p-6">
          <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
          <h3 className="text-white font-medium mb-2">Transformation Error</h3>
          <p className="text-gray-400 text-sm mb-4">Failed to process the video stream</p>
          <p className="text-red-400 text-xs">{error}</p>
        </div>
      )
    }

    if (!processedStream && !isProcessing) {
      return (
        <div className="aspect-video bg-black/60 border border-orange-500/20 rounded-xl flex flex-col items-center justify-center text-center p-6">
          <Eye className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-white font-medium mb-2">AI Output Preview</h3>
          <p className="text-gray-400 text-sm">Start live transformation to see Lavande AI in action</p>
          <div className="mt-4 flex items-center gap-2 text-orange-400 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Ready for AI magic</span>
          </div>
        </div>
      )
    }

    if (isProcessing && !processedStream) {
      return (
        <div className="aspect-video bg-black/60 border border-orange-500/20 rounded-xl flex flex-col items-center justify-center text-center p-6">
          <div className="w-12 h-12 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <h3 className="text-white font-medium mb-2">AI Processing</h3>
          <p className="text-gray-400 text-sm">Lavande AI is transforming your video...</p>
          <div className="mt-4 bg-orange-500/10 border border-orange-500/30 rounded-lg px-3 py-2">
            <p className="text-orange-400 text-xs">Applying {transformation} transformation</p>
          </div>
        </div>
      )
    }

    return (
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full aspect-video bg-black rounded-xl object-cover border border-orange-500 ring-4 ring-orange-500/30"
        />
        
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium border border-orange-500">
          <Sparkles className="w-3 h-3" />
          AI TRANSFORMED
        </div>
        
        <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm border border-orange-500/30 rounded-lg px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
            <span className="text-white text-xs">LIVE</span>
          </div>
        </div>

        {/* Quality Indicator */}
        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm border border-orange-500/30 rounded-lg px-2 py-1">
          <span className="text-orange-400 text-xs font-medium">AI ENHANCED</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {renderContent()}
      
      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleDownload}
          disabled={!processedStream}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all border border-orange-500/50 disabled:border-gray-600"
        >
          <Download className="w-5 h-5" />
          Download
        </button>
        <button
          onClick={handleShare}
          disabled={!processedStream}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all border border-gray-600"
        >
          <Share2 className="w-5 h-5" />
          Share
        </button>
      </div>

      {/* Stream Info */}
      {processedStream && (
        <div className="bg-black/40 border border-gray-700 rounded-xl p-4">
          <h4 className="text-white font-medium mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-400" />
            Transformation Details
          </h4>
          <div className="text-sm text-gray-300 space-y-1">
            <div className="flex justify-between">
              <span>Style:</span>
              <span className="text-orange-400 capitalize">{transformation.replace('-', ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-green-400">Active</span>
            </div>
            <div className="flex justify-between">
              <span>Quality:</span>
              <span className="text-orange-400">AI Enhanced</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OutputDisplay
