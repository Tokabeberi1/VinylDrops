// Standalone app parameters - no Base44 dependencies
// All configuration is now handled through environment variables or local storage

export const appParams = {
	appId: import.meta.env.VITE_APP_ID || 'groovehq_local',
	appName: 'GrooveHQ',
	appBaseUrl: import.meta.env.VITE_APP_BASE_URL || window.location.origin,
	apiVersion: 'v1',
}
