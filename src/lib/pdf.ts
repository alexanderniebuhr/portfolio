import { CAPABILITIES, EXPERIENCE, PROJECTS, SITE } from "../data/profile";

type FontKey = "F1" | "F2";

interface LinkAnnotation {
	readonly x1: number;
	readonly y1: number;
	readonly x2: number;
	readonly y2: number;
	readonly uri: string;
}

interface PdfPage {
	readonly commands: string[];
	readonly links: LinkAnnotation[];
}

// Adobe AFM Helvetica (regular) widths in 1/1000 em for ASCII 32..126
const HELVETICA_WIDTHS: readonly number[] = [
	278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278,
	278, 556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 278, 278, 584, 584,
	584, 556, 1015, 667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556,
	833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278,
	278, 278, 469, 556, 333, 556, 556, 500, 556, 556, 278, 556, 556, 222, 222,
	500, 222, 833, 556, 556, 556, 556, 333, 500, 278, 556, 500, 722, 500, 500,
	500, 334, 260, 334, 584,
];

// Adobe AFM Helvetica-Bold widths in 1/1000 em for ASCII 32..126
const HELVETICA_BOLD_WIDTHS: readonly number[] = [
	278, 333, 474, 556, 556, 889, 722, 238, 333, 333, 389, 584, 278, 333, 278,
	278, 556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 333, 333, 584, 584,
	584, 611, 975, 722, 722, 722, 722, 667, 611, 778, 722, 278, 556, 722, 611,
	833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 333,
	278, 333, 584, 556, 333, 556, 611, 556, 611, 556, 333, 611, 611, 278, 278,
	556, 278, 889, 611, 611, 611, 611, 389, 556, 333, 611, 556, 778, 556, 556,
	500, 389, 280, 389, 584,
];

const WIN_ANSI_EXTENDED: Record<number, { code: number; width: number }> = {
	8211: { code: 0x96, width: 556 }, // en dash –
	8212: { code: 0x97, width: 1000 }, // em dash —
	8216: { code: 0x91, width: 222 }, // left single quote ‘
	8217: { code: 0x92, width: 222 }, // right single quote ’
	8220: { code: 0x93, width: 333 }, // left double quote “
	8221: { code: 0x94, width: 333 }, // right double quote ”
	8226: { code: 0x95, width: 350 }, // bullet •
	183: { code: 0xb7, width: 278 }, // middle dot ·
	215: { code: 0xd7, width: 584 }, // multiplication sign ×
	196: { code: 0xc4, width: 667 }, // Ä
	214: { code: 0xd6, width: 778 }, // Ö
	220: { code: 0xdc, width: 722 }, // Ü
	228: { code: 0xe4, width: 556 }, // ä
	246: { code: 0xf6, width: 556 }, // ö
	252: { code: 0xfc, width: 556 }, // ü
	223: { code: 0xdf, width: 611 }, // ß
	233: { code: 0xe9, width: 556 }, // é
	167: { code: 0xa7, width: 556 }, // §
};

const PAGE_WIDTH = 595.28; // A4 width in pt
const PAGE_HEIGHT = 841.89; // A4 height in pt
const MARGIN_X = 48;
const MARGIN_TOP = 48;
const MARGIN_BOTTOM = 48;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;

const COLOR_INK = "0.102 0.098 0.090";
const COLOR_MUTED = "0.329 0.318 0.294";
const COLOR_ACCENT = "0.612 0.239 0.102";
const COLOR_RULE = "0.839 0.827 0.796";

function charWidth(codePoint: number, font: FontKey): number {
	if (codePoint >= 32 && codePoint <= 126) {
		const table = font === "F2" ? HELVETICA_BOLD_WIDTHS : HELVETICA_WIDTHS;
		return table[codePoint - 32] ?? 556;
	}
	const ext = WIN_ANSI_EXTENDED[codePoint];
	if (ext) return ext.width;
	return 556;
}

function measureText(text: string, font: FontKey, size: number): number {
	let total = 0;
	for (const ch of text) {
		const cp = ch.codePointAt(0) ?? 32;
		total += charWidth(cp, font);
	}
	return (total * size) / 1000;
}

function encodePdfString(text: string): string {
	let out = "(";
	for (const ch of text) {
		const cp = ch.codePointAt(0) ?? 32;
		let byte = 0x3f; // '?'
		if (cp >= 32 && cp <= 126) {
			byte = cp;
		} else {
			const ext = WIN_ANSI_EXTENDED[cp];
			if (ext) {
				byte = ext.code;
			}
		}

		if (byte === 0x28 || byte === 0x29 || byte === 0x5c) {
			out += `\\${String.fromCharCode(byte)}`;
		} else if (byte < 32 || byte > 126) {
			out += `\\${byte.toString(8).padStart(3, "0")}`;
		} else {
			out += String.fromCharCode(byte);
		}
	}
	out += ")";
	return out;
}

function wrapText(
	text: string,
	font: FontKey,
	size: number,
	maxWidth: number,
): string[] {
	const words = text.split(/\s+/).filter(Boolean);
	const lines: string[] = [];
	let current = "";

	for (const word of words) {
		const candidate = current ? `${current} ${word}` : word;
		if (measureText(candidate, font, size) <= maxWidth || !current) {
			current = candidate;
		} else {
			lines.push(current);
			current = word;
		}
	}

	if (current) {
		lines.push(current);
	}
	return lines;
}

function fmt(n: number): string {
	return n.toFixed(2);
}

class CvPdfBuilder {
	private readonly pages: PdfPage[] = [];
	private currentPage: PdfPage;
	private y: number;

	constructor() {
		this.currentPage = { commands: [], links: [] };
		this.pages.push(this.currentPage);
		this.y = PAGE_HEIGHT - MARGIN_TOP;
	}

	private newPage(): void {
		this.currentPage = { commands: [], links: [] };
		this.pages.push(this.currentPage);
		this.y = PAGE_HEIGHT - MARGIN_TOP;
	}

	ensureSpace(height: number): void {
		if (this.y - height < MARGIN_BOTTOM + 14) {
			this.newPage();
		}
	}

	moveDown(amount: number): void {
		this.y -= amount;
	}

	drawRule(offsetY = 0): void {
		const lineY = this.y - offsetY;
		this.currentPage.commands.push(
			`q 0.65 w ${COLOR_RULE} RG ${fmt(MARGIN_X)} ${fmt(lineY)} m ${fmt(MARGIN_X + CONTENT_WIDTH)} ${fmt(lineY)} l S Q`,
		);
	}

	drawText(
		text: string,
		x: number,
		y: number,
		font: FontKey,
		size: number,
		color = COLOR_INK,
	): void {
		this.currentPage.commands.push(
			`BT /${font} ${fmt(size)} Tf ${color} rg ${fmt(x)} ${fmt(y)} Td ${encodePdfString(text)} Tj ET`,
		);
	}

	drawLinkText(
		text: string,
		uri: string,
		x: number,
		y: number,
		font: FontKey,
		size: number,
		color = COLOR_ACCENT,
	): number {
		const width = measureText(text, font, size);
		this.drawText(text, x, y, font, size, color);
		this.currentPage.links.push({
			x1: x,
			y1: y - size * 0.25,
			x2: x + width,
			y2: y + size * 0.9,
			uri,
		});
		return width;
	}

	drawSectionHeading(title: string): void {
		this.ensureSpace(34);
		this.moveDown(10);
		this.drawText(
			title.toUpperCase(),
			MARGIN_X,
			this.y,
			"F2",
			8.5,
			COLOR_ACCENT,
		);
		this.drawRule(4);
		this.moveDown(16);
	}

	drawWrappedParagraph(
		text: string,
		font: FontKey,
		size: number,
		leading: number,
		color = COLOR_INK,
		indent = 0,
	): void {
		const lines = wrapText(text, font, size, CONTENT_WIDTH - indent);
		for (const line of lines) {
			this.ensureSpace(leading);
			this.drawText(line, MARGIN_X + indent, this.y, font, size, color);
			this.moveDown(leading);
		}
	}

	drawBullet(text: string): void {
		const size = 9.25;
		const leading = 13;
		const bulletIndent = 11;
		const lines = wrapText(text, "F1", size, CONTENT_WIDTH - bulletIndent);
		if (lines.length === 0) return;

		this.ensureSpace(leading * Math.min(lines.length, 2));
		this.drawText("•", MARGIN_X + 1.5, this.y, "F2", size, COLOR_ACCENT);

		for (const line of lines) {
			this.ensureSpace(leading);
			this.drawText(
				line,
				MARGIN_X + bulletIndent,
				this.y,
				"F1",
				size,
				COLOR_INK,
			);
			this.moveDown(leading);
		}
	}

	drawHeader(): void {
		this.drawText(SITE.name, MARGIN_X, this.y, "F2", 20, COLOR_INK);
		this.moveDown(16);
		this.drawText(
			`${SITE.role}  ·  ${SITE.location}`,
			MARGIN_X,
			this.y,
			"F1",
			10.5,
			COLOR_MUTED,
		);
		this.moveDown(15);

		const headerLinks: readonly { label: string; uri: string }[] = [
			{ label: "alexanderniebuhr.me", uri: SITE.url },
			{ label: SITE.email, uri: `mailto:${SITE.email}` },
			{
				label: "github.com/alexanderniebuhr",
				uri: "https://github.com/alexanderniebuhr",
			},
			{
				label: "linkedin.com/in/alexanderniebuhr",
				uri: "https://www.linkedin.com/in/alexanderniebuhr/",
			},
			{
				label: "x.com/realalexniebuhr",
				uri: "https://x.com/realalexniebuhr",
			},
		];

		let cursorX = MARGIN_X;
		const linkSize = 8;
		const sep = " · ";
		const sepWidth = measureText(sep, "F1", linkSize);

		for (let i = 0; i < headerLinks.length; i++) {
			const item = headerLinks[i];
			if (!item) continue;
			const itemWidth = measureText(item.label, "F1", linkSize);

			if (
				cursorX > MARGIN_X &&
				cursorX + itemWidth > MARGIN_X + CONTENT_WIDTH
			) {
				this.moveDown(12);
				cursorX = MARGIN_X;
			} else if (cursorX > MARGIN_X) {
				this.drawText(sep, cursorX, this.y, "F1", linkSize, COLOR_MUTED);
				cursorX += sepWidth;
			}

			cursorX += this.drawLinkText(
				item.label,
				item.uri,
				cursorX,
				this.y,
				"F1",
				linkSize,
				COLOR_ACCENT,
			);
		}

		this.drawRule(7);
		this.moveDown(14);
	}

	drawExperience(): void {
		this.drawSectionHeading("Experience");

		for (let idx = 0; idx < EXPERIENCE.length; idx++) {
			const entry = EXPERIENCE[idx];
			if (!entry) continue;

			// Keep each experience entry unbroken on a single page
			const summaryLines = wrapText(entry.summary, "F1", 9.25, CONTENT_WIDTH);
			let entryHeight = 13.5 + summaryLines.length * 13 + 2;
			for (const bullet of entry.highlights) {
				const bulletLines = wrapText(bullet, "F1", 9.25, CONTENT_WIDTH - 11);
				entryHeight += bulletLines.length * 13;
			}
			this.ensureSpace(entryHeight);

			const metaText = `${entry.period}  ·  ${entry.location}`;
			const metaWidth = measureText(metaText, "F1", 8.5);
			const metaX = MARGIN_X + CONTENT_WIDTH - metaWidth;

			let cursorX = MARGIN_X;
			const rolePrefix = `${entry.role} · `;
			this.drawText(rolePrefix, cursorX, this.y, "F2", 10.5, COLOR_INK);
			cursorX += measureText(rolePrefix, "F2", 10.5);

			if (entry.organizationUrl) {
				this.drawLinkText(
					entry.organization,
					entry.organizationUrl,
					cursorX,
					this.y,
					"F2",
					10.5,
					COLOR_ACCENT,
				);
			} else {
				this.drawText(
					entry.organization,
					cursorX,
					this.y,
					"F2",
					10.5,
					COLOR_INK,
				);
			}

			this.drawText(metaText, metaX, this.y, "F1", 8.5, COLOR_MUTED);
			this.moveDown(13.5);

			this.drawWrappedParagraph(entry.summary, "F1", 9.25, 13, COLOR_MUTED);
			this.moveDown(2);

			for (const bullet of entry.highlights) {
				this.drawBullet(bullet);
			}

			if (idx < EXPERIENCE.length - 1) {
				this.moveDown(8);
			}
		}
	}

	drawProjects(): void {
		this.drawSectionHeading("Selected Open Source & Projects");

		for (const project of PROJECTS) {
			this.ensureSpace(32);

			let cursorX = MARGIN_X;
			cursorX += this.drawLinkText(
				project.name,
				project.href,
				cursorX,
				this.y,
				"F2",
				9.5,
				COLOR_ACCENT,
			);
			this.drawText(
				`  (${project.role})`,
				cursorX,
				this.y,
				"F1",
				8.75,
				COLOR_MUTED,
			);
			this.moveDown(12.5);

			this.drawWrappedParagraph(project.summary, "F1", 9, 12.5, COLOR_INK);
			this.moveDown(4);
		}
	}

	drawCapabilities(): void {
		this.drawSectionHeading("Capabilities & Languages");

		const colWidth = 142;
		for (const group of CAPABILITIES) {
			const lines = wrapText(group.items, "F1", 9.25, CONTENT_WIDTH - colWidth);

			this.ensureSpace(13 * Math.max(lines.length, 1) + 4);
			this.drawText(group.title, MARGIN_X, this.y, "F2", 9.25, COLOR_INK);

			for (const line of lines) {
				this.drawText(line, MARGIN_X + colWidth, this.y, "F1", 9.25, COLOR_INK);
				this.moveDown(13);
			}

			this.moveDown(4);
		}
	}

	private appendFooters(): void {
		const totalPages = this.pages.length;
		const footerY = 26;

		for (let i = 0; i < totalPages; i++) {
			const page = this.pages[i];
			if (!page) continue;

			page.commands.push(
				`q 0.5 w ${COLOR_RULE} RG ${fmt(MARGIN_X)} ${fmt(footerY + 11)} m ${fmt(MARGIN_X + CONTENT_WIDTH)} ${fmt(footerY + 11)} l S Q`,
			);
			page.commands.push(
				`BT /F1 8 Tf ${COLOR_MUTED} rg ${fmt(MARGIN_X)} ${fmt(footerY)} Td ${encodePdfString(`${SITE.name} — Curriculum Vitae`)} Tj ET`,
			);

			const pageLabel = `Page ${i + 1} of ${totalPages}`;
			const labelWidth = measureText(pageLabel, "F1", 8);
			page.commands.push(
				`BT /F1 8 Tf ${COLOR_MUTED} rg ${fmt(MARGIN_X + CONTENT_WIDTH - labelWidth)} ${fmt(footerY)} Td ${encodePdfString(pageLabel)} Tj ET`,
			);
		}
	}

	toBytes(): Uint8Array {
		this.appendFooters();

		const objects: string[] = [];
		const addObject = (body: string): number => {
			objects.push(body);
			return objects.length;
		};

		// Reserve 1: Catalog, 2: Pages, 3: F1 Helvetica, 4: F2 Helvetica-Bold, 5: Info
		const catalogId = addObject("");
		const pagesId = addObject("");
		const fontRegularId = addObject(
			"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
		);
		const fontBoldId = addObject(
			"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
		);
		const infoId = addObject(
			`<< /Title ${encodePdfString(`${SITE.name} - Curriculum Vitae`)} /Author ${encodePdfString(SITE.name)} /Subject ${encodePdfString(SITE.role)} /Creator ${encodePdfString(SITE.url)} >>`,
		);

		const pageIds: number[] = [];

		for (const page of this.pages) {
			const streamBody = page.commands.join("\n");
			const streamBytes = new TextEncoder().encode(streamBody);
			const contentId = addObject(
				`<< /Length ${streamBytes.length} >>\nstream\n${streamBody}\nendstream`,
			);

			const annotIds: number[] = [];
			for (const link of page.links) {
				const annotId = addObject(
					`<< /Type /Annot /Subtype /Link /Rect [${fmt(link.x1)} ${fmt(link.y1)} ${fmt(link.x2)} ${fmt(link.y2)}] /Border [0 0 0] /A << /Type /Action /S /URI /URI ${encodePdfString(link.uri)} >> >>`,
				);
				annotIds.push(annotId);
			}

			const annotsEntry =
				annotIds.length > 0
					? ` /Annots [${annotIds.map((id) => `${id} 0 R`).join(" ")}]`
					: "";

			const pageId = addObject(
				`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${fmt(PAGE_WIDTH)} ${fmt(PAGE_HEIGHT)}] /Resources << /Font << /F1 ${fontRegularId} 0 R /F2 ${fontBoldId} 0 R >> >> /Contents ${contentId} 0 R${annotsEntry} >>`,
			);
			pageIds.push(pageId);
		}

		objects[catalogId - 1] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;
		objects[pagesId - 1] =
			`<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;

		const encoder = new TextEncoder();
		const chunks: Uint8Array[] = [];
		const offsets: number[] = [];
		let byteLength = 0;

		const pushText = (str: string): void => {
			const bytes = encoder.encode(str);
			chunks.push(bytes);
			byteLength += bytes.length;
		};

		// Header with binary marker comment per PDF 1.4 spec
		pushText("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n");

		for (let i = 0; i < objects.length; i++) {
			offsets.push(byteLength);
			pushText(`${i + 1} 0 obj\n${objects[i]}\nendobj\n`);
		}

		const xrefOffset = byteLength;
		pushText(`xref\n0 ${objects.length + 1}\n`);
		pushText("0000000000 65535 f \n");
		for (const offset of offsets) {
			pushText(`${String(offset).padStart(10, "0")} 00000 n \n`);
		}

		pushText(
			`trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R /Info ${infoId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`,
		);

		const result = new Uint8Array(byteLength);
		let cursor = 0;
		for (const chunk of chunks) {
			result.set(chunk, cursor);
			cursor += chunk.length;
		}
		return result;
	}
}

export function generateCvPdf(): Uint8Array {
	const pdf = new CvPdfBuilder();

	pdf.drawHeader();

	pdf.drawSectionHeading("Summary");
	pdf.drawWrappedParagraph(
		"Staff Engineer with 10+ years of experience building scalable backend systems, cloud-native developer infrastructure, modern browser-native web platforms, and accessible interfaces. Astro Core Maintainer and founder of craftlions. Collaborated with engineers from Google, Meta, Cloudflare, and Vercel, including early foundational work that later evolved into Cloudflare Software Factory.",
		"F1",
		9.5,
		13.5,
		COLOR_INK,
	);
	pdf.moveDown(4);

	pdf.drawExperience();
	pdf.drawProjects();
	pdf.drawCapabilities();

	return pdf.toBytes();
}
