import React from 'react'
import { Sparkles, Video, Zap } from 'lucide-react'

const Header: React.FC = () => {
  return (
    <header className="border-b border-orange-500/20 bg-black/80 backdrop-blur-lg relative">
      {/* Fashion accent background */}
      <div className="absolute inset-0 opacity-10">
        <img 
          src="https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=1920&h=200&fit=crop" 
          alt="Fashion Header" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-orange-900/20 to-black"></div>
      </div>
      
      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Lavande AI</h1>
              <p className="text-gray-400 text-sm">Powered by Livepeer liveVideoToVideo</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-orange-400">
              <Video className="w-4 h-4" />
              <span className="text-sm font-medium">Live Streaming</span>
            </div>
            <div className="flex items-center gap-2 text-orange-400">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Real-time AI</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
            <span>Livepeer Connected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
            <span>WebRTC Enabled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
            <span>AI Models Ready</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
