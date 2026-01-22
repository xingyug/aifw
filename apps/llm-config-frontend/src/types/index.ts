export interface LLMConfig {
  apiBaseUrl: string
  apiKey: string
  model: string
  temperature: number
}

export interface MaskConfig {
  maskAddress: boolean
  maskEmail: boolean
  maskOrganization: boolean
  maskUserName: boolean
  maskPhoneNumber: boolean
  maskBankNumber: boolean
  maskPayment: boolean
  maskVerificationCode: boolean
  maskPassword: boolean
  maskRandomSeed: boolean
  maskPrivateKey: boolean
  maskUrl: boolean
}

export interface MaskResult {
  text: string
  maskMeta: string
}

export interface ApiResponse<T> {
  output: T | null
  error: { message: string; code: string | null } | null
}

export interface CallResult {
  text: string
}

export const DEFAULT_MASK_CONFIG: MaskConfig = {
  maskAddress: false,
  maskEmail: true,
  maskOrganization: true,
  maskUserName: true,
  maskPhoneNumber: true,
  maskBankNumber: true,
  maskPayment: true,
  maskVerificationCode: true,
  maskPassword: true,
  maskRandomSeed: true,
  maskPrivateKey: true,
  maskUrl: true,
}

export const MASK_CONFIG_LABELS: Record<keyof MaskConfig, string> = {
  maskAddress: '物理地址',
  maskEmail: '邮箱地址',
  maskOrganization: '公司/组织',
  maskUserName: '姓名/用户名',
  maskPhoneNumber: '电话号码',
  maskBankNumber: '银行账户',
  maskPayment: '支付信息',
  maskVerificationCode: '验证码',
  maskPassword: '密码',
  maskRandomSeed: '随机种子',
  maskPrivateKey: '私钥',
  maskUrl: 'URL地址',
}

export const POPULAR_MODELS = [
  'gpt-4o',
  'gpt-4o-mini',
  'gpt-4-turbo',
  'gpt-3.5-turbo',
  'claude-3-5-sonnet-20241022',
  'claude-3-opus-20240229',
  'claude-3-haiku-20240307',
  'deepseek-chat',
  'deepseek-coder',
  'qwen-turbo',
  'qwen-plus',
  'glm-4',
]
