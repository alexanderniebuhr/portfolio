import handler from "@astrojs/cloudflare/entrypoints/server";
import { applyResponseHeaders } from "./lib/headers.ts";

export default {
	async fetch(request, env, ctx) {
		const response = await handler.fetch(request, env, ctx);
		return applyResponseHeaders(request, response);
	},
} satisfies ExportedHandler<Env>;
