import React from 'react'

interface LLMResponsePanelProps {
  maskedText: string
  maskMeta: string
  response: string
  restoredResponse: string
  isLoading: boolean
  error: string
  onSendToLLM: () => void
}

export const LLMResponsePanel: React.FC<LLMResponsePanelProps> = ({
  maskedText,
  response,
  restoredResponse,
  isLoading,
  error,
  onSendToLLM,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        LLM 交互
      </h2>

      {/* Send Button */}
      <div className="mb-6">
        <button
          onClick={onSendToLLM}
          disabled={isLoading || !maskedText.trim()}
          className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all flex items-center justify-center ${
            isLoading || !maskedText.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              正在请求 LLM...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              发送到 LLM
            </>
          )}
        </button>
        <p className="mt-2 text-xs text-gray-500 text-center">
          将脱敏后的文本发送给 LLM，响应会自动还原敏感信息
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 flex items-start">
            <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </p>
        </div>
      )}

      {/* Response Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Raw LLM Response */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              LLM 原始响应
            </label>
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
              脱敏状态
            </span>
          </div>
          <div className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono overflow-auto whitespace-pre-wrap">
            {response || (
              <span className="text-gray-400 italic">LLM 响应将显示在这里...</span>
            )}
          </div>
        </div>

        {/* Restored Response */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              还原后响应
            </label>
            <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded">
              已还原
            </span>
          </div>
          <div className="w-full h-48 px-4 py-3 border border-green-300 rounded-lg bg-green-50 text-sm font-mono overflow-auto whitespace-pre-wrap">
            {restoredResponse || (
              <span className="text-gray-400 italic">还原后的响应将显示在这里...</span>
            )}
          </div>
        </div>
      </div>

      {/* Workflow Explanation */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 mb-2">工作流程说明</h3>
        <ol className="text-sm text-blue-700 space-y-1">
          <li className="flex items-start">
            <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-blue-200 rounded-full text-xs mr-2">1</span>
            <span>您的原始文本被自动脱敏（替换敏感信息为占位符）</span>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-blue-200 rounded-full text-xs mr-2">2</span>
            <span>您可以查看和编辑脱敏后的文本</span>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-blue-200 rounded-full text-xs mr-2">3</span>
            <span>点击"发送到 LLM"将脱敏文本发送给 AI</span>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-blue-200 rounded-full text-xs mr-2">4</span>
            <span>LLM 响应会自动还原，恢复您的敏感信息</span>
          </li>
        </ol>
      </div>
    </div>
  )
}
