import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import { defineConfig, logHandlers, svgoOptimizer } from "astro/config";
import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";

export default defineConfig({
	site: "https://alexanderniebuhr.me",
	output: "server",
	adapter: cloudflare({
		imageService: {
			build: "cloudflare-binding",
			runtime: "cloudflare-binding",
		},
	}),
	compressHTML: false,
	session: false,
	logger: logHandlers.json(),
	experimental: {
		clientPrerender: true,
		contentIntellisense: true,
		svgOptimizer: svgoOptimizer(),
	},
	prefetch: {
		defaultStrategy: "hover",
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
					browserslist([
						"> 0.5%",
						"last 2 versions",
						"Firefox ESR",
						"not dead",
						"cover 80% in CN",
						"unreleased versions",
					]),
				),
				drafts: {
					customMedia: true,
				},
			},
		},
		build: {
			minify: false,
			cssMinify: false,
		},
	},
});
