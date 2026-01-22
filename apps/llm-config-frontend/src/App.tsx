import React, { useState, useEffect, useCallback } from 'react'
import { LLMConfigPanel, MaskConfigPanel, TextEditor, LLMResponsePanel } from './components'
import { useLocalStorage } from './hooks/useLocalStorage'
import { configMask, callLLM, restoreText } from './api/client'
import type { LLMConfig, MaskConfig } from './types'
import { DEFAULT_MASK_CONFIG } from './types'

const DEFAULT_LLM_CONFIG: LLMConfig = {
  apiBaseUrl: '',
  apiKey: '',
  model: 'gpt-4o-mini',
  temperature: 0.7,
}

function App() {
  // Persisted configurations
  const [llmConfig, setLLMConfig] = useLocalStorage<LLMConfig>('aifw-llm-config', DEFAULT_LLM_CONFIG)
  const [maskConfig, setMaskConfig] = useLocalStorage<MaskConfig>('aifw-mask-config', DEFAULT_MASK_CONFIG)

  // UI state
  const [maskConfigCollapsed, setMaskConfigCollapsed] = useState(true)
  const [inputText, setInputText] = useState('')
  const [maskedText, setMaskedText] = useState('')
  const [maskMeta, setMaskMeta] = useState('')
  const [isMasking, setIsMasking] = useState(false)
  const [isLLMLoading, setIsLLMLoading] = useState(false)
  const [llmResponse, setLLMResponse] = useState('')
  const [restoredResponse, setRestoredResponse] = useState('')
  const [llmError, setLLMError] = useState('')
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking')

  // Check server health on mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/health')
        if (response.ok) {
          setServerStatus('online')
        } else {
          setServerStatus('offline')
        }
      } catch {
        setServerStatus('offline')
      }
    }
    checkHealth()
    const interval = setInterval(checkHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  // Update mask config on server when it changes
  useEffect(() => {
    const updateServerConfig = async () => {
      try {
        await configMask(maskConfig, llmConfig.apiKey || undefined)
      } catch (err) {
        console.error('Failed to update mask config:', err)
      }
    }
    if (serverStatus === 'online') {
      updateServerConfig()
    }
  }, [maskConfig, serverStatus, llmConfig.apiKey])

  const handleSendToLLM = useCallback(async () => {
    if (!maskedText.trim()) return

    setIsLLMLoading(true)
    setLLMError('')
    setLLMResponse('')
    setRestoredResponse('')

    try {
      // Call LLM with masked text
      const response = await callLLM(
        maskedText,
        undefined, // apiKeyFile - let server use default or env
        llmConfig.model || undefined,
        llmConfig.temperature,
        llmConfig.apiKey || undefined
      )

      if (response.error) {
        setLLMError(response.error.message)
        return
      }

      if (response.output) {
        const rawResponse = response.output.text
        setLLMResponse(rawResponse)

        // Restore the response using the mask meta
        if (maskMeta) {
          try {
            const restoreResponse = await restoreText(rawResponse, maskMeta, llmConfig.apiKey || undefined)
            if (restoreResponse.output) {
              setRestoredResponse(restoreResponse.output.text)
            } else {
              setRestoredResponse(rawResponse)
            }
          } catch {
            // If restore fails, just show raw response
            setRestoredResponse(rawResponse)
          }
        } else {
          setRestoredResponse(rawResponse)
        }
      }
    } catch (err) {
      setLLMError(err instanceof Error ? err.message : 'LLM 请求失败')
    } finally {
      setIsLLMLoading(false)
    }
  }, [maskedText, maskMeta, llmConfig])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h1 className="ml-3 text-2xl font-bold text-gray-900">
                AIFW
              </h1>
              <span className="ml-2 text-sm text-gray-500">
                隐私保护 LLM 网关
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center text-sm ${
                serverStatus === 'online' ? 'text-green-600' :
                serverStatus === 'offline' ? 'text-red-600' : 'text-yellow-600'
              }`}>
                <span className={`w-2 h-2 rounded-full mr-2 ${
                  serverStatus === 'online' ? 'bg-green-500' :
                  serverStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
                }`} />
                {serverStatus === 'online' ? '服务在线' :
                 serverStatus === 'offline' ? '服务离线' : '检查中...'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {serverStatus === 'offline' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-800">后端服务未连接</h3>
                <p className="mt-1 text-sm text-red-700">
                  请确保 AIFW 后端服务正在运行。运行命令：<code className="bg-red-100 px-1 rounded">cd py-origin && python -m uvicorn services.app.main:app --host 127.0.0.1 --port 8844</code>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* LLM Configuration */}
        <LLMConfigPanel config={llmConfig} onChange={setLLMConfig} />

        {/* Mask Configuration */}
        <MaskConfigPanel
          config={maskConfig}
          onChange={setMaskConfig}
          collapsed={maskConfigCollapsed}
          onToggleCollapse={() => setMaskConfigCollapsed(!maskConfigCollapsed)}
        />

        {/* Text Editor */}
        <TextEditor
          inputText={inputText}
          onInputChange={setInputText}
          maskedText={maskedText}
          onMaskedTextChange={setMaskedText}
          maskMeta={maskMeta}
          onMaskMetaChange={setMaskMeta}
          apiKey={llmConfig.apiKey || undefined}
          isLoading={isMasking}
          onLoadingChange={setIsMasking}
        />

        {/* LLM Response */}
        <LLMResponsePanel
          maskedText={maskedText}
          maskMeta={maskMeta}
          response={llmResponse}
          restoredResponse={restoredResponse}
          isLoading={isLLMLoading}
          error={llmError}
          onSendToLLM={handleSendToLLM}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            AIFW - 保护您的隐私，安全使用 AI
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
