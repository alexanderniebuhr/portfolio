import type { APIRoute } from "astro";
import { generateCvPdf } from "../lib/pdf.ts";

export const prerender = false;

let cachedPdf: Uint8Array | undefined;

function getPdfBytes(): Uint8Array {
	cachedPdf ??= generateCvPdf();
	return cachedPdf;
}

function buildHeaders(url: URL, byteLength: number): Headers {
	const disposition = url.searchParams.has("download")
		? "attachment"
		: "inline";
	return new Headers({
		"Content-Type": "application/pdf",
		"Content-Disposition": `${disposition}; filename="alexander-niebuhr-cv.pdf"`,
		"Content-Length": String(byteLength),
		"Cache-Control": "public, max-age=3600",
		"X-Content-Type-Options": "nosniff",
	});
}

export const GET: APIRoute = ({ url }) => {
	const pdfBytes = getPdfBytes();
	return new Response(new Uint8Array(pdfBytes), {
		headers: buildHeaders(url, pdfBytes.byteLength),
	});
};

export const HEAD: APIRoute = ({ url }) => {
	const pdfBytes = getPdfBytes();
	return new Response(null, {
		headers: buildHeaders(url, pdfBytes.byteLength),
	});
};
