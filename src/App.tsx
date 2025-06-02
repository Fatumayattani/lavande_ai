import React, { useState, useRef, useCallback } from 'react'
import { Camera, Sparkles, Settings, Download, Play, Pause, RotateCcw, AlertCircle } from 'lucide-react'
import WebcamCapture, { WebcamCaptureRef } from './components/WebcamCapture'
import TransformationPanel from './components/TransformationPanel'
import OutputDisplay from './components/OutputDisplay'
import Header from './components/Header'
import { useLivepeer } from './hooks/useLivepeer'

function App() {
  // All useState hooks must be called first, in the same order every render
  const [isRecording, setIsRecording] = useState(false)
  const [selectedTransformation, setSelectedTransformation] = useState('elegant-hat')
  const [transformationIntensity, setTransformationIntensity] = useState(75)
  const [processedStream, setProcessedStream] = useState<MediaStream | null>(null)
  const [inputStream, setInputStream] = useState<MediaStream | null>(null)
  
  // All useRef hooks
  const webcamRef = useRef<WebcamCaptureRef>(null)
  
  // All custom hooks
  const { liveVideoToVideo, stopTransformation, isProcessing, error, streamId, isConfigured } = useLivepeer()

  // All useCallback hooks must be called in the same order every render
  const handleStreamReady = useCallback((stream: MediaStream) => {
    console.log('Stream ready in App:', stream)
    setInputStream(stream)
  }, [])

  const handleStartRecording = useCallback(async () => {
    console.log('Starting recording...', { inputStream, isConfigured })
    
    if (!inputStream) {
      console.error('No input stream available')
      return
    }

    if (!isConfigured) {
      console.error('Livepeer not configured')
      return
    }

    setIsRecording(true)
    
    try {
      console.log('Calling liveVideoToVideo with:', {
        style: selectedTransformation,
        intensity: transformationIntensity
      })
      
      const transformedStream = await liveVideoToVideo(inputStream, {
        style: selectedTransformation,
        intensity: transformationIntensity
      })
      
      if (transformedStream) {
        console.log('Transformation successful, setting processed stream')
        setProcessedStream(transformedStream)
      } else {
        throw new Error('Failed to create transformed stream')
      }
    } catch (err) {
      console.error('Failed to start transformation:', err)
      setIsRecording(false)
      setProcessedStream(null)
    }
  }, [inputStream, selectedTransformation, transformationIntensity, liveVideoToVideo, isConfigured])

  const handleStopRecording = useCallback(() => {
    console.log('Stopping recording...')
    setIsRecording(false)
    stopTransformation()
    setProcessedStream(null)
  }, [stopTransformation])

  const handleReset = useCallback(() => {
    console.log('Resetting...')
    setIsRecording(false)
    stopTransformation()
    setProcessedStream(null)
  }, [stopTransformation])

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Fashion Background with Overlay */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop" 
          alt="Fashion Background" 
          className="w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-orange-900/10 to-black/98"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* AI Transformation Controls - Left Column */}
            <div className="lg:col-span-1">
              <div className="bg-black/70 backdrop-blur-lg rounded-2xl p-6 border border-orange-500/30 shadow-2xl shadow-orange-500/10">
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="w-6 h-6 text-orange-400" />
                  <h2 className="text-xl font-semibold text-white">AI Transformations</h2>
                </div>
                <TransformationPanel
                  selectedTransformation={selectedTransformation}
                  onTransformationChange={setSelectedTransformation}
                  intensity={transformationIntensity}
                  onIntensityChange={setTransformationIntensity}
                  isProcessing={isProcessing}
                />
              </div>
            </div>

            {/* Live Webcam Input - Middle Column */}
            <div className="lg:col-span-1">
              <div className="bg-black/70 backdrop-blur-lg rounded-2xl p-6 border border-orange-500/30 shadow-2xl shadow-orange-500/10">
                <div className="flex items-center gap-3 mb-6">
                  <Camera className="w-6 h-6 text-orange-400" />
                  <h2 className="text-xl font-semibold text-white">Live Input</h2>
                  {streamId && (
                    <div className="ml-auto text-xs text-orange-400 bg-orange-400/20 border border-orange-500/30 px-2 py-1 rounded">
                      Stream: {streamId.slice(0, 8)}...
                    </div>
                  )}
                </div>
                <WebcamCapture 
                  ref={webcamRef}
                  isRecording={isRecording}
                  onStartRecording={handleStartRecording}
                  onStopRecording={handleStopRecording}
                  onStreamReady={handleStreamReady}
                />
                
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={isRecording ? handleStopRecording : handleStartRecording}
                    disabled={!inputStream || isProcessing}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                      isRecording 
                        ? 'bg-red-600 hover:bg-red-700 text-white border border-red-500/50' 
                        : 'bg-orange-600 hover:bg-orange-700 text-white border border-orange-500/50 disabled:bg-gray-700 disabled:border-gray-600 disabled:cursor-not-allowed disabled:opacity-50'
                    }`}
                  >
                    {isRecording ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    {isRecording ? 'Stop' : 'Start'} Live Transform
                  </button>
                  <button
                    onClick={handleReset}
                    disabled={isProcessing}
                    className="px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl border border-gray-600 transition-all disabled:bg-gray-800 disabled:cursor-not-allowed"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>

                {/* Debug Info */}
                <div className="mt-4 text-xs text-gray-400 space-y-1">
                  <div>Input Stream: {inputStream ? '✅ Connected' : '❌ Not Connected'}</div>
                  <div>Processing: {isProcessing ? '🔄 Active' : '⏸️ Idle'}</div>
                  <div>Output Stream: {processedStream ? '✅ Active' : '❌ None'}</div>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="mt-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-400 font-medium text-sm">Transformation Error</p>
                        <p className="text-red-300 text-xs mt-1">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AI Output Display - Right Column */}
            <div className="lg:col-span-1">
              <div className="bg-black/70 backdrop-blur-lg rounded-2xl p-6 border border-orange-500/30 shadow-2xl shadow-orange-500/10">
                <div className="flex items-center gap-3 mb-6">
                  <Settings className="w-6 h-6 text-orange-400" />
                  <h2 className="text-xl font-semibold text-white">Live AI Output</h2>
                </div>
                <OutputDisplay
                  processedStream={processedStream}
                  isProcessing={isProcessing}
                  transformation={selectedTransformation}
                  error={error}
                />
              </div>
            </div>
          </div>

          {/* Workflow Steps Indicator */}
          <div className="mt-12 flex items-center justify-center">
            <div className="flex items-center gap-4 bg-black/70 backdrop-blur-lg rounded-2xl p-6 border border-orange-500/30">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                <span className="text-white font-medium">Choose Style</span>
              </div>
              <div className="w-8 h-0.5 bg-orange-500/50"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                <span className="text-white font-medium">Live Input</span>
              </div>
              <div className="w-8 h-0.5 bg-orange-500/50"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                <span className="text-white font-medium">AI Output</span>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-orange-600/20 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-600/30 transition-all">
                <Sparkles className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">AI Fashion Filters</h3>
              <p className="text-gray-300">Multiple fashion transformation styles with real-time canvas-based visual effects.</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-orange-600/20 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-600/30 transition-all">
                <Camera className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Real-time Processing</h3>
              <p className="text-gray-300">Live webcam input with instant AI-powered transformations using canvas-based effects.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-orange-600/20 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-600/30 transition-all">
                <Download className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Live Streaming</h3>
              <p className="text-gray-300">Canvas-based live streaming with real-time transformation effects and visual filters.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
