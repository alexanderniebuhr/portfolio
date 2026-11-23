import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { EXPERIENCE, LINKS, PROJECTS, SITE } from "../src/data/profile.ts";
import { generateCvPdf } from "../src/lib/pdf.ts";

describe("generateCvPdf", () => {
	const bytes = generateCvPdf();
	const raw = new TextDecoder("latin1").decode(bytes);

	it("produces a structurally valid PDF 1.4 binary with accurate xref byte offsets", () => {
		assert.ok(raw.startsWith("%PDF-1.4\n"), "starts with %PDF-1.4 header");
		assert.ok(raw.endsWith("%%EOF\n"), "ends with %%EOF trailer");

		const startXrefMatch = raw.match(/startxref\n(\d+)\n%%EOF\n$/);
		assert.ok(startXrefMatch?.[1], "contains startxref byte offset");

		const xrefOffset = Number.parseInt(startXrefMatch[1], 10);
		assert.equal(
			raw.slice(xrefOffset, xrefOffset + 5),
			"xref\n",
			"startxref offset points directly to xref table",
		);

		const xrefBlock = raw.slice(xrefOffset);
		const headerMatch = xrefBlock.match(/^xref\n0 (\d+)\n/);
		assert.ok(headerMatch?.[1], "xref header declares object count");

		const size = Number.parseInt(headerMatch[1], 10);
		const lines = xrefBlock
			.split("\n")
			.slice(2, 2 + size)
			.filter(Boolean);
		assert.equal(lines.length, size, "xref contains one entry per object");
		assert.equal(lines[0], "0000000000 65535 f ");

		for (let objId = 1; objId < size; objId++) {
			const entry = lines[objId];
			assert.ok(entry, `xref entry ${objId} exists`);
			const offset = Number.parseInt(entry.slice(0, 10), 10);
			const expectedPrefix = `${objId} 0 obj\n`;
			assert.equal(
				raw.slice(offset, offset + expectedPrefix.length),
				expectedPrefix,
				`xref offset for object ${objId} matches actual byte offset`,
			);
		}
	});

	it("declares exact byte /Length for every content stream", () => {
		const streamRegex = /<< \/Length (\d+) >>\nstream\n([\s\S]*?)\nendstream/g;
		const matches = [...raw.matchAll(streamRegex)];
		assert.ok(matches.length >= 1, "at least one page content stream exists");

		for (const match of matches) {
			const declared = Number.parseInt(match[1] ?? "0", 10);
			const body = match[2] ?? "";
			const actual = new TextEncoder().encode(body).byteLength;
			assert.equal(
				actual,
				declared,
				"stream /Length matches UTF-8 byte length",
			);
		}
	});

	it("includes clickable link annotations for key profiles and projects", () => {
		assert.ok(raw.includes(`/URI (${SITE.url})`));
		assert.ok(raw.includes(`/URI (mailto:${SITE.email})`));
		assert.ok(raw.includes(`/URI (${LINKS.github})`));
		assert.ok(raw.includes(`/URI (${LINKS.linkedin})`));
		assert.ok(raw.includes(`/URI (${LINKS.x})`));

		for (const project of PROJECTS) {
			assert.ok(
				raw.includes(`/URI (${project.href})`),
				`includes link annotation for ${project.name}`,
			);
		}
	});

	it("encodes all text cleanly without unmapped '?' fallback characters", () => {
		const textCalls = [...raw.matchAll(/\(([^()]*)\) Tj/g)];
		assert.ok(textCalls.length > 20, "contains rendered text commands");

		for (const match of textCalls) {
			const text = match[1] ?? "";
			assert.ok(
				!text.includes("?"),
				`unexpected unmapped character '?' in PDF text: ${text}`,
			);
		}
	});

	it("includes all experience organizations and avoids orphaned section headings", () => {
		for (const entry of EXPERIENCE) {
			assert.ok(
				raw.includes(entry.organization),
				`PDF includes experience organization ${entry.organization}`,
			);
		}

		const streamRegex = /<< \/Length \d+ >>\nstream\n([\s\S]*?)\nendstream/g;
		for (const match of raw.matchAll(streamRegex)) {
			const commands = (match[1] ?? "").split("\n").filter(Boolean);
			// Footer adds 3 commands at the end (rule + left title + right page number)
			const bodyCommands = commands.slice(0, -3);
			const lastBodyCmd = bodyCommands.at(-1) ?? "";
			const secondLastBodyCmd = bodyCommands.at(-2) ?? "";
			assert.ok(
				!(
					lastBodyCmd.startsWith("q 0.65 w") &&
					secondLastBodyCmd.includes("Tf 0.612 0.239 0.102 rg")
				),
				"section heading is not orphaned at the bottom of a page",
			);
		}
	});
});
