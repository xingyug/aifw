import React from 'react'
import type { LLMConfig } from '../types'
import { POPULAR_MODELS } from '../types'

interface LLMConfigPanelProps {
  config: LLMConfig
  onChange: (config: LLMConfig) => void
}

export const LLMConfigPanel: React.FC<LLMConfigPanelProps> = ({ config, onChange }) => {
  const handleChange = (field: keyof LLMConfig, value: string | number) => {
    onChange({ ...config, [field]: value })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        LLM 配置
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            API Base URL
          </label>
          <input
            type="text"
            value={config.apiBaseUrl}
            onChange={(e) => handleChange('apiBaseUrl', e.target.value)}
            placeholder="https://api.openai.com/v1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">留空使用默认配置</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            API Key
          </label>
          <input
            type="password"
            value={config.apiKey}
            onChange={(e) => handleChange('apiKey', e.target.value)}
            placeholder="sk-..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">您的 API 密钥（安全存储在本地）</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            模型
          </label>
          <div className="relative">
            <input
              type="text"
              list="model-list"
              value={config.model}
              onChange={(e) => handleChange('model', e.target.value)}
              placeholder="选择或输入模型名称"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <datalist id="model-list">
              {POPULAR_MODELS.map((model) => (
                <option key={model} value={model} />
              ))}
            </datalist>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Temperature: {config.temperature}
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={config.temperature}
            onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>精确 (0)</span>
            <span>创意 (2)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
