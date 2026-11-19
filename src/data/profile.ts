export interface LinkItem {
	readonly label: string;
	readonly href: string;
	readonly description?: string;
}

export interface FocusArea {
	readonly title: string;
	readonly summary: string;
	readonly meta: string;
}

export interface ExperienceEntry {
	readonly role: string;
	readonly organization: string;
	readonly organizationUrl?: string;
	readonly period: string;
	readonly location: string;
	readonly summary: string;
	readonly highlights: readonly string[];
}

export interface ProjectItem {
	readonly name: string;
	readonly role: string;
	readonly href: string;
	readonly summary: string;
	readonly tags: readonly string[];
}

export interface CapabilityGroup {
	readonly title: string;
	readonly items: string;
}

export const SITE = {
	name: "Alexander Niebuhr",
	role: "Staff Engineer & Astro Core Maintainer",
	location: "Lübeck, Germany",
	url: "https://alexanderniebuhr.me",
	email: "alexander@craftlions.com",
	description:
		"Staff Engineer with 10+ years of experience in web platforms, cloud-native developer tooling, modern CSS, and accessible interfaces. Astro Core Maintainer and founder of craftlions.",
} as const;

export const IMPRINT = {
	name: "Alexander Niebuhr",
	street: "Amandus-Voigt-Str. 8",
	city: "23617 Stockelsdorf",
	country: "Germany",
	email: "alexander@craftlions.com",
	company: "craftlions UG (haftungsbeschränkt)",
} as const;

export const SOCIAL_LINKS: readonly LinkItem[] = [
	{
		label: "GitHub",
		href: "https://github.com/alexanderniebuhr",
		description: "Open-source work and repositories",
	},
	{
		label: "LinkedIn",
		href: "https://www.linkedin.com/in/alexanderniebuhr/",
		description: "Career history and professional updates",
	},
	{
		label: "X",
		href: "https://x.com/realalexniebuhr",
		description: "Short notes on web platforms and tooling",
	},
	{
		label: "craftlions",
		href: "https://craftlions.com",
		description: "Technical advisory and software engineering",
	},
	{
		label: "Garden",
		href: "https://alexanderniebuhr.garden",
		description: "Digital garden and technical notes",
	},
] as const;

export const FOCUS_AREAS: readonly FocusArea[] = [
	{
		title: "Web Platforms & Developer Infrastructure",
		summary:
			"Core maintainer of Astro, partnering with Cloudflare and AWS to improve hosting adapters, Vite Environment API workflows, and local-to-production parity.",
		meta: "Astro · Cloudflare Workers · AWS",
	},
	{
		title: "AI-Enabled Engineering Workflows",
		summary:
			"Contributed early foundational work that later evolved into Cloudflare Software Factory, alongside production triage and security automation for open-source ecosystems.",
		meta: "Automation · Tooling · Reliability",
	},
	{
		title: "Modern CSS & Browser-Native Features",
		summary:
			"Intrinsic fluid layouts grounded in Every Layout, Cascade Layers, Container Queries, Subgrid, View Transitions, and progressive enhancement with minimal client JavaScript.",
		meta: "Every Layout · Subgrid · Container Queries",
	},
	{
		title: "Accessibility & Inclusive Design",
		summary:
			"Semantic landmarks, keyboard-first interactions, WCAG contrast and Forced Colors Mode support, OS text scaling, and layouts resilient from 320px to 400% zoom.",
		meta: "WCAG · Semantic HTML · Inclusive UX",
	},
] as const;

export const EXPERIENCE: readonly ExperienceEntry[] = [
	{
		role: "Founder & Staff Engineer",
		organization: "craftlions",
		organizationUrl: "https://craftlions.com",
		period: "May 2024 – Present",
		location: "Lübeck, Germany",
		summary:
			"Independent technical advisory, platform engineering, and hands-on product delivery for teams building durable web and cloud systems.",
		highlights: [
			"Partnered with Cloudflare and AWS engineering teams to streamline deployment workflows and improve developer experience across Astro hosting adapters.",
			"Collaborated with engineers from Google, Meta, Cloudflare, and Vercel on open-source web platform architecture, standards alignment, and developer tooling.",
			"Engineered early foundational automation workflows and architecture patterns that later evolved into Cloudflare Software Factory.",
			"Advised engineering teams on adopting production AI-enabled internal workflows, cloud-native infrastructure, and maintainable full-stack delivery.",
		],
	},
	{
		role: "Core Maintainer",
		organization: "Astro",
		organizationUrl: "https://github.com/withastro/astro",
		period: "Jun 2025 – Present · Contributor since Aug 2023",
		location: "Open Source",
		summary:
			"Core framework steward shaping Astro's technical roadmap, edge runtime integrations, and open-source ecosystem health.",
		highlights: [
			"Reduced open issue backlog by 50%+ (from 200+ to under 100) by building and integrating an AI triage bot into Astro's maintenance workflow.",
			"Identified and resolved dozens of high and critical security vulnerabilities by contributing automated AI security-scanning workflows.",
			"Partnered with Cloudflare to integrate Vite's Environment API into @astrojs/cloudflare, closing the local dev-to-production runtime gap and enabling custom Worker / Durable Object entrypoints.",
			"Stewarded framework roadmap planning, architectural RFCs, and community pull requests while co-maintaining astro-tips.dev under Astrolicious.",
		],
	},
	{
		role: "Senior Software Engineer (DevOps)",
		organization: "Cense AG",
		period: "Sep 2023 – Oct 2023",
		location: "Lübeck, Germany",
		summary:
			"Cloud infrastructure and CI/CD automation for a Glassnode spin-off building scalable crypto compliance and AML tooling.",
		highlights: [
			"Cut production cloud infrastructure costs by 2× by provisioning and right-sizing Terraform-managed infrastructure.",
			"Accelerated deployment speed by 50% and raised code quality metrics by 25% by engineering GitLab CI pipelines with automated static code analysis.",
		],
	},
	{
		role: "Senior Backend Engineer (Platform)",
		organization: "Glassnode",
		period: "Jan 2023 – Aug 2023",
		location: "Lübeck, Germany",
		summary:
			"Backend performance engineering and persistence-layer scaling for high-throughput on-chain analytics systems.",
		highlights: [
			"Reduced latency on hot backend operations from O(n) to O(1) by profiling production bottlenecks and redesigning core data structures.",
			"Increased supported customer portfolio scale by 50% through database index optimization, schema simplification, and batched persistence patterns.",
			"Elevated team-wide backend maintainability via architectural reviews, shared engineering standards, and technical mentoring.",
		],
	},
	{
		role: "Full-Stack & Platform Engineer",
		organization: "Fricke Holding GmbH",
		period: "Jul 2021 – Dec 2022",
		location: "Hamburg, Germany",
		summary:
			"End-to-end architecture and global cloud delivery for an international agricultural machinery platform.",
		highlights: [
			"Launched a multi-brand agricultural machinery platform across 10 countries for 2,500+ clients, generating $300k in annual revenue using PostgreSQL, GraphQL, TypeScript, Web Components, and Svelte.",
			"Architected globally distributed cloud deployment on AWS RDS, Cloudflare Workers and Pages, containers, and global load balancers.",
			"Improved engineering team effectiveness by 50% by standardizing project templates, authoring an internal knowledge base, and mentoring junior engineers on algorithms and code quality.",
		],
	},
] as const;

export const PROJECTS: readonly ProjectItem[] = [
	{
		name: "withastro/astro",
		role: "Core Maintainer",
		href: "https://github.com/withastro/astro",
		summary:
			"Core framework maintenance, Cloudflare adapter architecture, Durable Object & custom Worker entrypoints, Vite Environment API integration, and automated triage/security workflows.",
		tags: ["TypeScript", "Vite", "Cloudflare Workers"],
	},
	{
		name: "astrolicious/astro-tips.dev",
		role: "Co-creator & Maintainer",
		href: "https://github.com/astrolicious/astro-tips.dev",
		summary:
			"Community-driven handbook of practical recipes, deep dives, and architecture patterns that go beyond the official Astro documentation.",
		tags: ["Astro", "MDX", "Community"],
	},
	{
		name: "astro-cloudflare-template",
		role: "Author",
		href: "https://github.com/alexanderniebuhr/astro-cloudflare-template",
		summary:
			"Opinionated, production-ready template pairing Astro with Cloudflare Workers, modern CSS tooling, strict type-checking, and automated CI previews.",
		tags: ["Astro", "Cloudflare", "Template"],
	},
	{
		name: "prettier-plugin-unocss",
		role: "Author",
		href: "https://github.com/alexanderniebuhr/prettier-plugin-unocss",
		summary:
			"Prettier plugin for deterministic class sorting across UnoCSS codebases, continuing earlier open-source work with the WindiCSS organization.",
		tags: ["CSS Tooling", "Prettier", "OSS"],
	},
	{
		name: "mclimate (Home Assistant)",
		role: "Author",
		href: "https://github.com/alexanderniebuhr/mclimate",
		summary:
			"Open-source Home Assistant integration for MClimate LoRaWAN devices via ChirpStack and The Things Stack, starting with the Vicki smart radiator thermostat.",
		tags: ["Python", "LoRaWAN", "IoT"],
	},
	{
		name: "craftlions",
		role: "Founder",
		href: "https://craftlions.com",
		summary:
			"Focused software engineering, architecture advisory, and team workshops centered on legible systems, async collaboration, and long-term maintainability.",
		tags: ["Advisory", "Architecture", "Workshops"],
	},
] as const;

export const CAPABILITIES: readonly CapabilityGroup[] = [
	{
		title: "Platforms & Cloud",
		items:
			"Cloudflare Workers & Images, AWS (RDS, Amplify, serverless), Terraform, Containers, GitLab CI / GitHub Actions, distributed observability.",
	},
	{
		title: "Web & Frontend Architecture",
		items:
			"Astro, TypeScript, Modern CSS (Cascade Layers, Container Queries, Subgrid, View Transitions), Every Layout, Web Components, Accessibility (WCAG).",
	},
	{
		title: "Backend & Data Systems",
		items:
			"Node.js, PostgreSQL, GraphQL, performance profiling, algorithmic optimization, schema design, high-throughput APIs.",
	},
	{
		title: "Languages",
		items:
			"German (Native), English (Full professional proficiency), French & Spanish (Elementary).",
	},
] as const;
