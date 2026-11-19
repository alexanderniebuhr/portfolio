import type { APIRoute } from "astro";
import { generateCvPdf } from "../lib/pdf";

export const prerender = false;

export const GET: APIRoute = ({ url }) => {
	const pdfBytes = generateCvPdf();
	const isDownload = url.searchParams.has("download");
	const disposition = isDownload ? "attachment" : "inline";

	return new Response(new Uint8Array(pdfBytes), {
		headers: {
			"Content-Type": "application/pdf",
			"Content-Disposition": `${disposition}; filename="alexander-niebuhr-cv.pdf"`,
			"Cache-Control": "public, max-age=3600",
			"X-Content-Type-Options": "nosniff",
		},
	});
};
