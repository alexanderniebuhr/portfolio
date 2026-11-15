import { bindings, defineConfig } from "cf/config";

export default defineConfig({
	accountId: "1dc7f5dfd6f1830ea5b903d051c6d624",
	worker: {
		name: "alexanderniebuhr-portfolio",
		compatibilityDate: "2026-11-08",
		compatibilityFlags: [
			"new_module_registry",
			"enable_request_signal",
			"pipe_to_backward_propagation",
			"cache_option_preserves_cache_control",
			"temporal",
			"wasm_source_url_support",
			"global_fetch_strictly_public",
		],
		entrypoint: "./src/worker.ts",
		domains: [
			"alexanderniebuhr.me",
			{
				hostname: "preview.alexanderniebuhr.me",
				production: false,
				previews: true,
			},
		],
		workersDev: false,
		previewUrls: false,
		placement: {
			mode: "smart",
		},
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
			issues: {
				enabled: true,
			},
		},
		env: {
			ASSETS: bindings.assets(),
			IMAGES: bindings.images({
				dev: {
					remote: true,
				},
			}),
		},
	},
});
