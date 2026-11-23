import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { applyResponseHeaders, isPreviewHost } from "../src/lib/headers.ts";

describe("isPreviewHost", () => {
	it("matches preview root and subdomains case-insensitively", () => {
		assert.equal(isPreviewHost("preview.alexanderniebuhr.me"), true);
		assert.equal(isPreviewHost("pr-42.preview.alexanderniebuhr.me"), true);
		assert.equal(isPreviewHost("PR-42.PREVIEW.ALEXANDERNIEBUHR.ME"), true);
	});

	it("rejects production and unrelated hostnames", () => {
		assert.equal(isPreviewHost("alexanderniebuhr.me"), false);
		assert.equal(isPreviewHost("notpreview.alexanderniebuhr.me"), false);
		assert.equal(isPreviewHost("preview.alexanderniebuhr.me.evil.test"), false);
	});
});

describe("applyResponseHeaders", () => {
	it("applies strict security headers and omits X-Robots-Tag on production HTML", () => {
		const req = new Request("https://alexanderniebuhr.me/missing");
		const res = applyResponseHeaders(
			req,
			new Response("Not Found", { status: 404 }),
		);

		assert.equal(res.status, 404);
		assert.equal(res.headers.get("X-Content-Type-Options"), "nosniff");
		assert.equal(
			res.headers.get("Referrer-Policy"),
			"strict-origin-when-cross-origin",
		);
		assert.equal(
			res.headers.get("Cross-Origin-Opener-Policy"),
			"same-origin-allow-popups",
		);
		assert.equal(
			res.headers.get("Cross-Origin-Resource-Policy"),
			"same-origin",
		);
		assert.equal(res.headers.get("X-Frame-Options"), "DENY");
		assert.ok(
			res.headers
				.get("Content-Security-Policy")
				?.includes("frame-ancestors 'none'"),
		);
		assert.equal(res.headers.get("X-Robots-Tag"), null);
	});

	it("allows same-origin framing for /cv.pdf so iframe printing works", () => {
		const req = new Request("https://alexanderniebuhr.me/cv.pdf");
		const res = applyResponseHeaders(
			req,
			new Response(new Uint8Array([1, 2, 3]), {
				headers: { "Content-Type": "application/pdf" },
			}),
		);

		assert.equal(res.headers.get("X-Frame-Options"), "SAMEORIGIN");
		assert.ok(
			res.headers
				.get("Content-Security-Policy")
				?.includes("frame-ancestors 'self'"),
		);
		assert.equal(res.headers.get("Content-Type"), "application/pdf");
	});

	it("adds X-Robots-Tag: noindex, nofollow on preview hosts", () => {
		const req = new Request("https://pr-7.preview.alexanderniebuhr.me/cv.pdf");
		const res = applyResponseHeaders(req, new Response("ok"));

		assert.equal(res.headers.get("X-Robots-Tag"), "noindex, nofollow");
	});
});
