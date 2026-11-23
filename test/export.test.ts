import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
	buildAgentPrompt,
	buildLlmsTxt,
	buildMarkdownCv,
	buildPlainTextCv,
} from "../src/data/export.ts";
import {
	CAPABILITIES,
	EXPERIENCE,
	PROJECTS,
	SITE,
	SOCIAL_LINKS,
} from "../src/data/profile.ts";

describe("export builders", () => {
	it("buildMarkdownCv includes all profile sections and links", () => {
		const md = buildMarkdownCv();
		assert.ok(md.startsWith(`# ${SITE.name}\n`));
		assert.ok(md.includes(SITE.summary));
		assert.ok(md.includes("## Experience"));
		assert.ok(md.includes("## Selected Open Source & Projects"));
		assert.ok(md.includes("## Capabilities & Languages"));
		for (const entry of EXPERIENCE) {
			assert.ok(md.includes(entry.organization));
		}
		for (const project of PROJECTS) {
			assert.ok(md.includes(project.href));
		}
		for (const link of SOCIAL_LINKS) {
			assert.ok(md.includes(link.href));
		}
	});

	it("buildPlainTextCv outputs uppercase ATS headings and all experience entries", () => {
		const txt = buildPlainTextCv();
		assert.ok(txt.startsWith(SITE.name.toUpperCase()));
		assert.ok(txt.includes("SUMMARY\n"));
		assert.ok(txt.includes("EXPERIENCE\n"));
		assert.ok(txt.includes("CAPABILITIES & LANGUAGES\n"));
		for (const entry of EXPERIENCE) {
			assert.ok(txt.includes(entry.organization));
		}
		for (const group of CAPABILITIES) {
			assert.ok(txt.includes(group.title));
		}
	});

	it("buildAgentPrompt stays concise and references verified URLs", () => {
		const prompt = buildAgentPrompt();
		assert.ok(prompt.length < 300, "agent prompt stays concise");
		assert.ok(prompt.includes(SITE.url));
		assert.ok(prompt.includes(`${SITE.url}/work`));
		assert.ok(prompt.includes(`${SITE.url}/llms.txt`));
	});

	it("buildLlmsTxt exposes pages, CV exports, and social profiles", () => {
		const llms = buildLlmsTxt();
		assert.ok(llms.startsWith(`# ${SITE.name}\n`));
		assert.ok(llms.includes(`${SITE.url}/work`));
		assert.ok(llms.includes(`${SITE.url}/cv.md`));
		assert.ok(llms.includes(`${SITE.url}/cv.pdf`));
		for (const link of SOCIAL_LINKS) {
			assert.ok(llms.includes(link.href));
		}
	});
});
