import React, { useCallback, useEffect, useState } from 'react'
import { useDebounce } from '../hooks/useDebounce'
import { maskText } from '../api/client'

interface TextEditorProps {
  inputText: string
  onInputChange: (text: string) => void
  maskedText: string
  onMaskedTextChange: (text: string) => void
  maskMeta: string
  onMaskMetaChange: (meta: string) => void
  apiKey?: string
  isLoading: boolean
  onLoadingChange: (loading: boolean) => void
}

export const TextEditor: React.FC<TextEditorProps> = ({
  inputText,
  onInputChange,
  maskedText,
  onMaskedTextChange,
  maskMeta,
  onMaskMetaChange,
  apiKey,
  isLoading,
  onLoadingChange,
}) => {
  const [error, setError] = useState<string>('')
  const debouncedInput = useDebounce(inputText, 500)

  const performMasking = useCallback(async (text: string) => {
    if (!text.trim()) {
      onMaskedTextChange('')
      onMaskMetaChange('')
      return
    }

    onLoadingChange(true)
    setError('')

    try {
      const response = await maskText(text, undefined, apiKey)
      if (response.error) {
        setError(response.error.message)
      } else if (response.output) {
        onMaskedTextChange(response.output.text)
        onMaskMetaChange(response.output.maskMeta)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '脱敏请求失败')
    } finally {
      onLoadingChange(false)
    }
  }, [apiKey, onMaskedTextChange, onMaskMetaChange, onLoadingChange])

  useEffect(() => {
    performMasking(debouncedInput)
  }, [debouncedInput, performMasking])

  const highlightDifferences = (_original: string, masked: string): React.ReactNode => {
    // Simple highlighting: find PII placeholders like __PII_*__
    const piiPattern = /__PII_[A-Z_]+_\d+__/g
    const parts: React.ReactNode[] = []
    let lastIndex = 0
    let match

    while ((match = piiPattern.exec(masked)) !== null) {
      if (match.index > lastIndex) {
        parts.push(masked.slice(lastIndex, match.index))
      }
      parts.push(
        <span key={match.index} className="bg-yellow-200 text-yellow-800 px-1 rounded font-mono text-sm">
          {match[0]}
        </span>
      )
      lastIndex = match.index + match[0].length
    }

    if (lastIndex < masked.length) {
      parts.push(masked.slice(lastIndex))
    }

    return parts.length > 0 ? parts : masked
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        文本处理
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Text Area */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              原始文本
            </label>
            <span className="text-xs text-gray-500">
              {inputText.length} 字符
            </span>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="请输入包含敏感信息的文本...&#10;&#10;例如：&#10;我的邮箱是 test@example.com&#10;我的电话是 13800138000&#10;我的名字是张三"
            className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm font-mono resize-none"
          />
        </div>

        {/* Masked Text Area */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              脱敏后文本
              {isLoading && (
                <span className="ml-2 inline-flex items-center">
                  <svg className="animate-spin h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </span>
              )}
            </label>
            <span className="text-xs text-gray-500">
              可编辑 - 修改后发送给 LLM
            </span>
          </div>
          <textarea
            value={maskedText}
            onChange={(e) => onMaskedTextChange(e.target.value)}
            placeholder="脱敏后的文本将显示在这里...&#10;&#10;您可以手动编辑此文本，然后再决定是否发送给 LLM"
            className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm font-mono resize-none bg-gray-50"
          />
        </div>
      </div>

      {/* Preview with highlights */}
      {maskedText && maskedText !== inputText && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-800 mb-2 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            检测到的敏感信息（已高亮）
          </h3>
          <div className="text-sm text-gray-700 whitespace-pre-wrap break-words">
            {highlightDifferences(inputText, maskedText)}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        </div>
      )}

      {maskMeta && (
        <details className="mt-4">
          <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
            显示脱敏元数据（高级）
          </summary>
          <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-x-auto">
            {maskMeta}
          </pre>
        </details>
      )}
    </div>
  )
}
