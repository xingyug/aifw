import React from 'react'
import type { MaskConfig } from '../types'
import { MASK_CONFIG_LABELS } from '../types'

interface MaskConfigPanelProps {
  config: MaskConfig
  onChange: (config: MaskConfig) => void
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export const MaskConfigPanel: React.FC<MaskConfigPanelProps> = ({
  config,
  onChange,
  collapsed = false,
  onToggleCollapse,
}) => {
  const handleToggle = (field: keyof MaskConfig) => {
    onChange({ ...config, [field]: !config[field] })
  }

  const handleSelectAll = (selectAll: boolean) => {
    const newConfig = { ...config }
    Object.keys(config).forEach((key) => {
      newConfig[key as keyof MaskConfig] = selectAll
    })
    onChange(newConfig)
  }

  const enabledCount = Object.values(config).filter(Boolean).length
  const totalCount = Object.keys(config).length

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={onToggleCollapse}
      >
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          隐私保护配置
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({enabledCount}/{totalCount} 已启用)
          </span>
        </h2>
        {onToggleCollapse && (
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${collapsed ? '' : 'rotate-180'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </div>

      {!collapsed && (
        <>
          <div className="mt-4 mb-3 flex gap-2">
            <button
              onClick={() => handleSelectAll(true)}
              className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
            >
              全选
            </button>
            <button
              onClick={() => handleSelectAll(false)}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              全不选
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {(Object.keys(MASK_CONFIG_LABELS) as Array<keyof MaskConfig>).map((key) => (
              <label
                key={key}
                className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                  config[key]
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <input
                  type="checkbox"
                  checked={config[key]}
                  onChange={() => handleToggle(key)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className={`ml-2 text-sm ${config[key] ? 'text-green-800' : 'text-gray-600'}`}>
                  {MASK_CONFIG_LABELS[key]}
                </span>
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
