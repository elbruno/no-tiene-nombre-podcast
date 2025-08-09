/// <reference types="vite/client" />
declare const GITHUB_RUNTIME_PERMANENT_NAME: string
declare const BASE_KV_SERVICE_URL: string
declare module 'virtual:pwa-register' {
	export function registerSW(options?: {
		immediate?: boolean
		onNeedRefresh?: () => void
		onOfflineReady?: () => void
	}): () => void
}