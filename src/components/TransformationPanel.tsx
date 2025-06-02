import React from 'react'
import { Crown, Sparkles, Gem, Glasses, Watch, Heart } from 'lucide-react'

interface TransformationPanelProps {
  selectedTransformation: string
  onTransformationChange: (transformation: string) => void
  intensity: number
  onIntensityChange: (intensity: number) => void
  isProcessing: boolean
}

const transformations = [
  {
    id: 'elegant-hat',
    name: 'Elegant Hat',
    description: 'Stylish fedoras, berets, and fashion hats',
    icon: Crown,
    gradient: 'from-purple-500 to-pink-600',
    category: 'Headwear'
  },
  {
    id: 'luxury-lipstick',
    name: 'Luxury Lipstick',
    description: 'Bold reds, nudes, and glossy finishes',
    icon: Heart,
    gradient: 'from-red-500 to-rose-600',
    category: 'Makeup'
  },
  {
    id: 'diamond-necklace',
    name: 'Diamond Necklace',
    description: 'Elegant chains, pendants, and chokers',
    icon: Gem,
    gradient: 'from-blue-500 to-cyan-600',
    category: 'Jewelry'
  },
  {
    id: 'designer-glasses',
    name: 'Designer Glasses',
    description: 'Sunglasses, frames, and luxury eyewear',
    icon: Glasses,
    gradient: 'from-amber-500 to-orange-600',
    category: 'Eyewear'
  },
  {
    id: 'luxury-watch',
    name: 'Luxury Watch',
    description: 'Premium timepieces and smart watches',
    icon: Watch,
    gradient: 'from-green-500 to-teal-600',
    category: 'Accessories'
  },
  {
    id: 'glam-makeup',
    name: 'Glam Makeup',
    description: 'Full makeup with eyeshadow and highlights',
    icon: Sparkles,
    gradient: 'from-indigo-500 to-purple-600',
    category: 'Makeup'
  }
]

const TransformationPanel: React.FC<TransformationPanelProps> = ({
  selectedTransformation,
  onTransformationChange,
  intensity,
  onIntensityChange,
  isProcessing
}) => {
  return (
    <div className="space-y-6">
      {/* Transformation Styles */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Fashion Accessories</h3>
        <div className="grid grid-cols-1 gap-3">
          {transformations.map((transformation) => {
            const Icon = transformation.icon
            const isSelected = selectedTransformation === transformation.id
            
            return (
              <button
                key={transformation.id}
                onClick={() => onTransformationChange(transformation.id)}
                disabled={isProcessing}
                className={`relative p-4 rounded-xl border transition-all text-left group ${
                  isSelected
                    ? 'border-orange-500 bg-orange-500/10 ring-2 ring-orange-500/30'
                    : 'border-gray-700 bg-gray-800/50 hover:border-orange-500/50 hover:bg-orange-500/5'
                } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${transformation.gradient} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-white group-hover:text-orange-300 transition-colors">
                        {transformation.name}
                      </h4>
                      <span className="text-xs text-orange-400 bg-orange-400/20 px-2 py-0.5 rounded-full">
                        {transformation.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">
                      {transformation.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Intensity Control */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Accessory Intensity</h3>
          <span className="text-orange-400 font-medium">{intensity}%</span>
        </div>
        
        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="100"
            value={intensity}
            onChange={(e) => onIntensityChange(Number(e.target.value))}
            disabled={isProcessing}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider disabled:cursor-not-allowed disabled:opacity-50"
          />
          
          <div className="flex justify-between text-xs text-gray-400">
            <span>Subtle</span>
            <span>Natural</span>
            <span>Bold</span>
          </div>
        </div>
      </div>

      {/* Processing Status */}
      {isProcessing && (
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <div>
              <p className="text-orange-400 font-medium text-sm">AI Processing Active</p>
              <p className="text-orange-300 text-xs">Applying {transformations.find(t => t.id === selectedTransformation)?.name} accessory...</p>
            </div>
          </div>
        </div>
      )}

      {/* Fashion Categories */}
      <div className="bg-black/40 border border-gray-700 rounded-xl p-4">
        <h4 className="text-white font-medium mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-orange-400" />
          Available Categories
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="text-purple-300">👑 Headwear</div>
          <div className="text-red-300">💄 Makeup</div>
          <div className="text-blue-300">💎 Jewelry</div>
          <div className="text-amber-300">👓 Eyewear</div>
          <div className="text-green-300">⌚ Accessories</div>
          <div className="text-indigo-300">✨ Full Glam</div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-black/40 border border-gray-700 rounded-xl p-4">
        <h4 className="text-white font-medium mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-orange-400" />
          Styling Tips
        </h4>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Face the camera directly for best accessory placement</li>
          <li>• Good lighting enhances jewelry and makeup effects</li>
          <li>• Try different intensities for realistic looks</li>
          <li>• Mix accessories for complete fashion makeovers</li>
        </ul>
      </div>
    </div>
  )
}

export default TransformationPanel
