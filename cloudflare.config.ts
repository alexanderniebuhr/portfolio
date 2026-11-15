import { bindings, defineConfig } from "cf/config";

export default defineConfig({
	accountId: "1dc7f5dfd6f1830ea5b903d051c6d624",
	worker: {
		name: "alexanderniebuhr-portfolio",
		compatibilityDate: "2026-11-08",
		entrypoint: "./src/worker.ts",
		domains: ["alexanderniebuhr.me"],
		workersDev: true,
		previewUrls: true,
		limits: {
			cpuMs: 60000,
		},
		observability: {
			logs: {
				enabled: true,
				invocationLogs: true,
				headSamplingRate: 1,
				persist: true,
			},
			traces: {
				enabled: true,
				headSamplingRate: 1,
				persist: true,
			},
		},
		env: {
			ASSETS: bindings.assets(),
			IMAGES: bindings.images({
				dev: {
					remote: true,
				},
			}),
			CF_VERSION_METADATA: bindings.versionMetadata(),
			SESSION: bindings.kv({
				id: "f18e5a9143254147880a0b22d0bbd8e7",
			}),
		},
	},
});
