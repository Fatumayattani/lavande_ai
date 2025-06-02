import { useState, useCallback, useRef, useEffect } from 'react'

interface TransformationOptions {
  style: string
  intensity: number
}

export const useLivepeer = () => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [streamId, setStreamId] = useState<string | null>(null)
  const [isConfigured] = useState<boolean>(true) // Simulating configured state
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // Cleanup function
  const cleanup = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      }
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
      videoRef.current = null
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return cleanup
  }, [cleanup])

  const createCanvasEffect = useCallback((
    sourceVideo: HTMLVideoElement,
    style: string,
    intensity: number
  ): MediaStream | null => {
    try {
      // Create canvas if it doesn't exist
      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas')
      }
      
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        throw new Error('Could not get canvas context')
      }

      // Set canvas dimensions to match video
      canvas.width = sourceVideo.videoWidth || 640
      canvas.height = sourceVideo.videoHeight || 480

      const processFrame = () => {
        if (!sourceVideo.paused && !sourceVideo.ended) {
          // Draw the original video frame
          ctx.drawImage(sourceVideo, 0, 0, canvas.width, canvas.height)
          
          // Get image data for manipulation
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data
          
          // Apply transformation based on style and intensity
          const intensityFactor = intensity / 100
          
          switch (style) {
            case 'elegant-hat':
              // Add a subtle vintage effect for hat styling
              for (let i = 0; i < data.length; i += 4) {
                const r = data[i]
                const g = data[i + 1]
                const b = data[i + 2]
                
                data[i] = Math.min(255, r + 10 * intensityFactor)
                data[i + 1] = Math.min(255, g + 5 * intensityFactor)
                data[i + 2] = Math.min(255, b - 5 * intensityFactor)
              }
              break
              
            case 'luxury-lipstick':
              // Enhance reds for lipstick effect
              for (let i = 0; i < data.length; i += 4) {
                const r = data[i]
                const g = data[i + 1]
                const b = data[i + 2]
                
                // Enhance red tones
                data[i] = Math.min(255, r + 20 * intensityFactor)
                data[i + 1] = Math.max(0, g - 5 * intensityFactor)
                data[i + 2] = Math.max(0, b - 10 * intensityFactor)
              }
              break
              
            case 'diamond-necklace':
              // Add sparkle/shimmer effect
              for (let i = 0; i < data.length; i += 4) {
                const r = data[i]
                const g = data[i + 1]
                const b = data[i + 2]
                
                const brightness = (r + g + b) / 3
                const sparkle = brightness * 0.2 * intensityFactor
                
                data[i] = Math.min(255, r + sparkle)
                data[i + 1] = Math.min(255, g + sparkle)
                data[i + 2] = Math.min(255, b + sparkle + 15 * intensityFactor)
              }
              break
              
            case 'designer-glasses':
              // Cool tone effect for glasses
              for (let i = 0; i < data.length; i += 4) {
                const r = data[i]
                const g = data[i + 1]
                const b = data[i + 2]
                
                data[i] = Math.max(0, r - 10 * intensityFactor)
                data[i + 1] = Math.min(255, g + 5 * intensityFactor)
                data[i + 2] = Math.min(255, b + 20 * intensityFactor)
              }
              break
              
            case 'luxury-watch':
              // Metallic/golden effect
              for (let i = 0; i < data.length; i += 4) {
                const r = data[i]
                const g = data[i + 1]
                const b = data[i + 2]
                
                data[i] = Math.min(255, r + 15 * intensityFactor)
                data[i + 1] = Math.min(255, g + 10 * intensityFactor)
                data[i + 2] = Math.max(0, b - 5 * intensityFactor)
              }
              break
              
            case 'glam-makeup':
              // Full glam with enhanced contrast
              for (let i = 0; i < data.length; i += 4) {
                const r = data[i]
                const g = data[i + 1]
                const b = data[i + 2]
                
                // Increase contrast and add warmth
                const contrast = 1.1 * intensityFactor + 1 * (1 - intensityFactor)
                data[i] = Math.min(255, Math.max(0, (r - 128) * contrast + 128 + 10 * intensityFactor))
                data[i + 1] = Math.min(255, Math.max(0, (g - 128) * contrast + 128 + 5 * intensityFactor))
                data[i + 2] = Math.min(255, Math.max(0, (b - 128) * contrast + 128))
              }
              break

            default:
              // No transformation
              break
          }
          
          // Put the modified image data back
          ctx.putImageData(imageData, 0, 0)
          
          // Continue processing
          animationFrameRef.current = requestAnimationFrame(processFrame)
        }
      }
      
      // Start processing
      processFrame()
      
      // Return canvas stream
      return canvas.captureStream(30)
      
    } catch (error) {
      console.error('Canvas effect error:', error)
      return null
    }
  }, [])

  const liveVideoToVideo = useCallback(async (
    inputStream: MediaStream,
    options: TransformationOptions
  ): Promise<MediaStream | null> => {
    try {
      setIsProcessing(true)
      setError(null)
      
      console.log('Starting canvas-based transformation:', options)
      
      // Create a video element to process the input stream
      const video = document.createElement('video')
      video.srcObject = inputStream
      video.muted = true
      video.playsInline = true
      videoRef.current = video
      
      // Generate a mock stream ID
      const mockStreamId = `stream_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      setStreamId(mockStreamId)
      
      return new Promise((resolve, reject) => {
        video.onloadedmetadata = () => {
          video.play().then(() => {
            // Wait a bit for video to start playing
            setTimeout(() => {
              const transformedStream = createCanvasEffect(video, options.style, options.intensity)
              
              if (transformedStream) {
                console.log('Canvas transformation successful')
                resolve(transformedStream)
              } else {
                reject(new Error('Failed to create canvas transformation'))
              }
            }, 100)
          }).catch(reject)
        }
        
        video.onerror = () => {
          reject(new Error('Failed to load video for transformation'))
        }
      })
      
    } catch (error) {
      console.error('Transformation error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown transformation error'
      setError(errorMessage)
      return null
    } finally {
      setIsProcessing(false)
    }
  }, [createCanvasEffect])

  const stopTransformation = useCallback(() => {
    console.log('Stopping transformation')
    setIsProcessing(false)
    setStreamId(null)
    cleanup()
  }, [cleanup])

  return {
    liveVideoToVideo,
    stopTransformation,
    isProcessing,
    error,
    streamId,
    isConfigured
  }
}
