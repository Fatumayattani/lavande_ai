import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { Camera, CameraOff, AlertCircle } from 'lucide-react'

interface WebcamCaptureProps {
  isRecording: boolean
  onStartRecording: () => void
  onStopRecording: () => void
  onStreamReady?: (stream: MediaStream) => void
}

export interface WebcamCaptureRef {
  getStream: () => MediaStream | null
}

const WebcamCapture = forwardRef<WebcamCaptureRef, WebcamCaptureProps>(
  ({ isRecording, onStartRecording, onStopRecording, onStreamReady }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [hasPermission, setHasPermission] = useState<boolean | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isInitializing, setIsInitializing] = useState(false)

    useImperativeHandle(ref, () => ({
      getStream: () => stream
    }))

    useEffect(() => {
      let isMounted = true

      const startWebcam = async () => {
        // Prevent multiple simultaneous initialization attempts
        if (isInitializing || stream) {
          return
        }

        setIsInitializing(true)
        setError(null)
        setHasPermission(null)

        try {
          console.log('Requesting webcam access...')
          
          // Check if getUserMedia is available
          if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('Camera access is not supported in this browser')
          }

          // Request camera access with fallback constraints
          let mediaStream: MediaStream

          try {
            // Try with ideal constraints first
            mediaStream = await navigator.mediaDevices.getUserMedia({
              video: {
                width: { ideal: 640, max: 1280 },
                height: { ideal: 480, max: 720 },
                frameRate: { ideal: 30 }
              },
              audio: false
            })
            console.log('Webcam access granted with ideal constraints')
          } catch (idealError) {
            console.warn('Failed with ideal constraints, trying minimal constraints:', idealError)
            // Fallback to minimal constraints
            mediaStream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: false
            })
            console.log('Webcam access granted with minimal constraints')
          }

          // Only proceed if component is still mounted
          if (!isMounted) {
            mediaStream.getTracks().forEach(track => track.stop())
            return
          }

          // Set the stream
          setStream(mediaStream)
          setHasPermission(true)
          
          // Set video source and play
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream
            
            const handleLoadedMetadata = () => {
              if (videoRef.current && isMounted) {
                videoRef.current.play()
                  .then(() => {
                    console.log('Video playback started successfully')
                    if (onStreamReady && isMounted) {
                      onStreamReady(mediaStream)
                    }
                  })
                  .catch(playError => {
                    console.warn('Video autoplay failed:', playError)
                    if (onStreamReady && isMounted) {
                      onStreamReady(mediaStream)
                    }
                  })
              }
            }

            const handleVideoError = (videoError: Event) => {
              console.error('Video element error:', videoError)
              if (isMounted) {
                setError('Video playback failed')
              }
            }

            videoRef.current.onloadedmetadata = handleLoadedMetadata
            videoRef.current.onerror = handleVideoError
          }

        } catch (error) {
          console.error('Error accessing webcam:', error)
          
          if (!isMounted) return

          setHasPermission(false)
          
          // Provide more specific error messages
          let errorMessage = 'Failed to access camera'
          
          if (error instanceof Error) {
            if (error.name === 'NotAllowedError') {
              errorMessage = 'Camera access was denied. Please allow camera permissions and refresh the page.'
            } else if (error.name === 'NotFoundError') {
              errorMessage = 'No camera found. Please connect a camera and refresh the page.'
            } else if (error.name === 'NotReadableError') {
              errorMessage = 'Camera is already in use by another application.'
            } else if (error.name === 'OverconstrainedError') {
              errorMessage = 'Camera does not support the required settings.'
            } else {
              errorMessage = error.message
            }
          }
          
          setError(errorMessage)
        } finally {
          if (isMounted) {
            setIsInitializing(false)
          }
        }
      }

      // Start webcam initialization
      startWebcam()

      // Cleanup function
      return () => {
        isMounted = false
        
        if (stream) {
          console.log('Cleaning up webcam stream')
          stream.getTracks().forEach(track => {
            track.stop()
          })
        }
        
        if (videoRef.current) {
          videoRef.current.srcObject = null
          videoRef.current.onloadedmetadata = null
          videoRef.current.onerror = null
        }
      }
    }, []) // Empty dependency array - only run on mount

    const handleRetry = () => {
      setHasPermission(null)
      setError(null)
      setStream(null)
      setIsInitializing(false)
      // Force re-initialization by reloading the page
      window.location.reload()
    }

    // Render different states based on permission status
    if (hasPermission === false) {
      return (
        <div className="aspect-video bg-black/60 border border-orange-500/20 rounded-xl flex flex-col items-center justify-center text-center p-6">
          <CameraOff className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-white font-medium mb-2">Camera Access Required</h3>
          <p className="text-gray-400 text-sm mb-4">Please allow camera access to use Lavande AI</p>
          {error && (
            <div className="flex items-start gap-2 text-orange-400 text-xs max-w-sm mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="text-left">{error}</span>
            </div>
          )}
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      )
    }

    // Handle loading state
    if (hasPermission === null || isInitializing) {
      return (
        <div className="aspect-video bg-black/60 border border-orange-500/20 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">
              {isInitializing ? 'Initializing camera...' : 'Requesting camera access...'}
            </p>
          </div>
        </div>
      )
    }

    // Main video display
    return (
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full aspect-video bg-black rounded-xl object-cover border ${
            isRecording ? 'border-orange-500 ring-4 ring-orange-500/30' : 'border-orange-500/20'
          }`}
        />
        
        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium border border-orange-500">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            LIVE TRANSFORM
          </div>
        )}
        
        <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm border border-orange-500/30 rounded-lg px-3 py-2">
          <Camera className="w-5 h-5 text-orange-400" />
        </div>

        {/* Stream Quality Indicator */}
        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm border border-orange-500/30 rounded-lg px-2 py-1">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-white text-xs">LIVE</span>
          </div>
        </div>
      </div>
    )
  }
)

WebcamCapture.displayName = 'WebcamCapture'

export default WebcamCapture
