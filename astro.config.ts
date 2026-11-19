import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import { defineConfig, logHandlers, svgoOptimizer } from "astro/config";
import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";

const isProductionBuild =
	process.argv.includes("build") || process.env.CI === "true";

export default defineConfig({
	site: "https://alexanderniebuhr.me",
	output: "server",
	adapter: cloudflare({
		imageService: {
			build: "compile",
			runtime: "cloudflare-binding",
		},
	}),
	compressHTML: "jsx",
	session: false,
	...(isProductionBuild ? { logger: logHandlers.json() } : {}),
	experimental: {
		contentIntellisense: true,
		svgOptimizer: svgoOptimizer(),
		incrementalBuild: true,
	},
	integrations: [sitemap()],
	devToolbar: {
		enabled: false,
	},
	vite: {
		css: {
			transformer: "lightningcss",
			lightningcss: {
				targets: browserslistToTargets(
					browserslist(["baseline widely available"]),
				),
				drafts: {
					customMedia: true,
				},
			},
		},
	},
});
