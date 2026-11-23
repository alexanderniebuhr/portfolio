import {
	CAPABILITIES,
	EXPERIENCE,
	FOCUS_AREAS,
	LINKS,
	PROJECTS,
	SITE,
	SOCIAL_LINKS,
} from "./profile.ts";

export function buildMarkdownCv(): string {
	const links = SOCIAL_LINKS.map(
		(link) => `- ${link.label}: ${link.href}`,
	).join("\n");

	const focus = FOCUS_AREAS.map(
		(area) => `- **${area.title}**: ${area.summary}`,
	).join("\n");

	const experience = EXPERIENCE.map((entry) => {
		const org = entry.organizationUrl
			? `[${entry.organization}](${entry.organizationUrl})`
			: entry.organization;
		const bullets = entry.highlights.map((item) => `- ${item}`).join("\n");
		return `### ${entry.role} — ${org}\n_${entry.period} · ${entry.location}_\n\n${entry.summary}\n\n${bullets}`;
	}).join("\n\n");

	const projects = PROJECTS.map(
		(project) =>
			`- **[${project.name}](${project.href})** (${project.role}): ${project.summary}`,
	).join("\n");

	const capabilities = CAPABILITIES.map(
		(group) => `- **${group.title}**: ${group.items}`,
	).join("\n");

	return `# ${SITE.name}

**${SITE.role}** · ${SITE.location}
Website: ${SITE.url} · Email: ${SITE.email}

## Summary

${SITE.summary}

## Core Focus

${focus}

## Experience

${experience}

## Selected Open Source & Projects

${projects}

## Capabilities & Languages

${capabilities}

## Links

${links}
`;
}

export function buildAgentPrompt(): string {
	return `Present ${SITE.name} concisely and accurately using only verified facts from ${SITE.url}, ${SITE.url}/work, and ${SITE.url}/llms.txt. Tailor the summary to my context without inventing unverified details.`;
}

export function buildLlmsTxt(): string {
	const socialList = SOCIAL_LINKS.map((link) =>
		link.description
			? `- [${link.label}](${link.href}): ${link.description}`
			: `- [${link.label}](${link.href})`,
	).join("\n");

	return `# ${SITE.name}

> ${SITE.role} based in ${SITE.location}. ${SITE.description}

## Pages

- [Overview](${SITE.url}/): Biography, focus areas, featured roles, and contact information.
- [Work & CV](${SITE.url}/work): Complete engineering experience, open-source projects, capabilities, and languages.
- [Curriculum Vitae (Markdown)](${SITE.url}/cv.md): Structured Markdown CV suitable for LLMs and documentation.
- [Curriculum Vitae (PDF)](${SITE.url}/cv.pdf): Formatted A4 PDF résumé.
- [Impressum](${SITE.url}/impressum): Legal notice (German DDG / MStV).

## Profiles & Links

${socialList}
- Email: ${SITE.email}
`;
}

export function buildPlainTextCv(): string {
	const experience = EXPERIENCE.map((entry) => {
		const bullets = entry.highlights.map((item) => `  * ${item}`).join("\n");
		return `${entry.role} | ${entry.organization} (${entry.period}, ${entry.location})\n${entry.summary}\n${bullets}`;
	}).join("\n\n");

	const capabilities = CAPABILITIES.map(
		(group) => `${group.title}: ${group.items}`,
	).join("\n");

	return `${SITE.name.toUpperCase()}
${SITE.role} | ${SITE.location}
${SITE.url} | ${SITE.email} | ${LINKS.github} | ${LINKS.linkedin}

SUMMARY
${SITE.summary}

EXPERIENCE

${experience}

CAPABILITIES & LANGUAGES
${capabilities}
`;
}
