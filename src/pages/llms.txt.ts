import type { APIRoute } from "astro";
import { buildLlmsTxt } from "../data/export.ts";

export const prerender = true;

export const GET: APIRoute = () => {
	return new Response(buildLlmsTxt(), {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
		},
	});
};
