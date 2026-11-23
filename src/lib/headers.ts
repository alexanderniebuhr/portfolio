const PREVIEW_DOMAIN = "preview.alexanderniebuhr.me";

const COMMON_SECURITY_HEADERS: ReadonlyArray<readonly [string, string]> = [
	["X-Content-Type-Options", "nosniff"],
	["Referrer-Policy", "strict-origin-when-cross-origin"],
	[
		"Permissions-Policy",
		"camera=(), geolocation=(), microphone=(), focus-without-user-activation=()",
	],
	["Cross-Origin-Opener-Policy", "same-origin-allow-popups"],
	["Cross-Origin-Resource-Policy", "same-origin"],
];

export function isPreviewHost(hostname: string): boolean {
	const normalized = hostname.toLowerCase();
	return (
		normalized === PREVIEW_DOMAIN || normalized.endsWith(`.${PREVIEW_DOMAIN}`)
	);
}

export function applyResponseHeaders(
	request: Request,
	response: Response,
): Response {
	const url = new URL(request.url);
	const headers = new Headers(response.headers);

	for (const [name, value] of COMMON_SECURITY_HEADERS) {
		if (!headers.has(name)) {
			headers.set(name, value);
		}
	}

	const isPdfRoute = url.pathname === "/cv.pdf";
	if (!headers.has("X-Frame-Options")) {
		headers.set("X-Frame-Options", isPdfRoute ? "SAMEORIGIN" : "DENY");
	}
	if (!headers.has("Content-Security-Policy")) {
		headers.set(
			"Content-Security-Policy",
			isPdfRoute
				? "frame-ancestors 'self'; object-src 'none'; base-uri 'none'"
				: "frame-ancestors 'none'; object-src 'none'; base-uri 'none'; form-action 'self'",
		);
	}

	if (isPreviewHost(url.hostname)) {
		headers.set("X-Robots-Tag", "noindex, nofollow");
	}

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers,
	});
}
