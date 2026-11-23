import type { APIRoute } from "astro";
import { buildMarkdownCv } from "../data/export.ts";

export const prerender = true;

export const GET: APIRoute = () => {
	return new Response(buildMarkdownCv(), {
		headers: {
			"Content-Type": "text/markdown; charset=utf-8",
		},
	});
};
