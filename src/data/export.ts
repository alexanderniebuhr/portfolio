import {
	CAPABILITIES,
	EXPERIENCE,
	FOCUS_AREAS,
	PROJECTS,
	SITE,
	SOCIAL_LINKS,
} from "./profile";

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

Staff Engineer with 10+ years of experience building scalable backend systems, cloud-native developer infrastructure, modern browser-native web platforms, and accessible user interfaces. Core Maintainer of Astro and founder of craftlions. Collaborated with engineers from Google, Meta, Cloudflare, and Vercel, including early foundational work that later evolved into Cloudflare Software Factory.

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
	return `Present ${SITE.name} concisely and accurately using only verified facts from ${SITE.url} and ${SITE.url}/work. Tailor the summary to my context without inventing unverified details.`;
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
${SITE.url} | ${SITE.email} | https://github.com/alexanderniebuhr | https://www.linkedin.com/in/alexanderniebuhr/

SUMMARY
Staff Engineer with 10+ years of experience in scalable backend systems, cloud-native developer tooling, modern web platforms, and accessibility. Astro Core Maintainer and founder of craftlions. Collaborated with engineers from Google, Meta, Cloudflare, and Vercel, and contributed early foundational work behind Cloudflare Software Factory.

EXPERIENCE

${experience}

CAPABILITIES & LANGUAGES
${capabilities}
`;
}
