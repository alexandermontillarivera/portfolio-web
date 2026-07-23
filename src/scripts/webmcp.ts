import { EDUCATION } from "@/data/education"
import { EXPERIENCE } from "@/data/experience"
import { PROJECTS } from "@/data/project"

type ToolInput = Record<string, unknown>

interface WebMCPTool {
	name: string
	title: string
	description: string
	inputSchema?: Record<string, unknown>
	execute: (input: ToolInput) => unknown | Promise<unknown>
	annotations?: {
		readOnlyHint?: boolean
		untrustedContentHint?: boolean
	}
}

interface ModelContext {
	registerTool: (
		tool: WebMCPTool,
		options?: { signal?: AbortSignal; exposedTo?: string[] },
	) => Promise<void>
}

declare global {
	interface Document {
		modelContext?: ModelContext
	}

	interface Window {
		portfolioWebMCPController?: AbortController
	}
}

const PROFILE = {
	name: "Alexander Montilla Rivera",
	role: "Desarrollador Full Stack",
	location: "República Dominicana",
	summary:
		"Diseña y construye aplicaciones rápidas, mantenibles y pensadas para las personas que las usan.",
	availability: "Disponible para nuevos proyectos",
}

const CONTACT = {
	email: "info@alexandermontillarivera.com",
	linkedin: "https://www.linkedin.com/in/alexander-montilla-rivera/",
	github: "https://github.com/alexandermontillarivera",
	resumePath: "/cv.pdf",
}

const SECTION_IDS = [
	"hero",
	"experience",
	"projects",
	"education",
	"skills",
	"inspiration",
	"resources",
] as const

const cleanQuery = (value: unknown) =>
	typeof value === "string"
		? value.trim().slice(0, 80).toLocaleLowerCase("es")
		: ""

const absoluteUrl = (path: string) =>
	new URL(path, window.location.origin).toString()

const includesQuery = (values: unknown[], query: string) =>
	!query ||
	values
		.flat(Infinity)
		.filter((value): value is string => typeof value === "string")
		.some((value) => value.toLocaleLowerCase("es").includes(query))

const tools: WebMCPTool[] = [
	{
		name: "get_portfolio_profile",
		title: "Consultar perfil profesional",
		description:
			"Devuelve el perfil profesional público de Alexander Montilla Rivera, incluyendo rol, ubicación, resumen y disponibilidad.",
		inputSchema: {
			type: "object",
			properties: {},
			additionalProperties: false,
		},
		execute: async () => PROFILE,
		annotations: { readOnlyHint: true },
	},
	{
		name: "list_portfolio_projects",
		title: "Consultar proyectos",
		description:
			"Devuelve los proyectos públicos del portfolio. Puede filtrarlos por texto o tecnología sin modificar el sitio.",
		inputSchema: {
			type: "object",
			properties: {
				query: {
					type: "string",
					maxLength: 80,
					description:
						"Texto opcional para buscar en el nombre, descripción o tecnologías del proyecto.",
				},
			},
			additionalProperties: false,
		},
		execute: async ({ query }) => {
			const normalizedQuery = cleanQuery(query)
			const projects = PROJECTS.filter((project) =>
				includesQuery(
					[project.title, project.description, project.technologies],
					normalizedQuery,
				),
			).map(({ image: _image, ...project }) => ({
				...project,
				url: absoluteUrl(project.url),
			}))

			return {
				count: projects.length,
				query: normalizedQuery || null,
				projects,
			}
		},
		annotations: { readOnlyHint: true },
	},
	{
		name: "list_portfolio_experience",
		title: "Consultar experiencia",
		description:
			"Devuelve la experiencia laboral pública, responsabilidades, logros y tecnologías de Alexander Montilla Rivera.",
		inputSchema: {
			type: "object",
			properties: {},
			additionalProperties: false,
		},
		execute: async () => ({
			count: EXPERIENCE.length,
			experience: EXPERIENCE.map((item) => ({
				...item,
				startDate: item?.startDate.toISOString().slice(0, 10),
				endDate: item?.endDate?.toISOString().slice(0, 10),
				achievement: item?.achievement?.trim().replace(/\s+/g, " "),
			})),
		}),
		annotations: { readOnlyHint: true },
	},
	{
		name: "list_portfolio_education",
		title: "Consultar formación",
		description:
			"Devuelve la formación académica y certificaciones públicas. Puede filtrar por institución, título o habilidad.",
		inputSchema: {
			type: "object",
			properties: {
				query: {
					type: "string",
					maxLength: 80,
					description:
						"Texto opcional para buscar en títulos, instituciones, descripciones o habilidades.",
				},
			},
			additionalProperties: false,
		},
		execute: async ({ query }) => {
			const normalizedQuery = cleanQuery(query)
			const education = EDUCATION.filter((item) =>
				includesQuery(
					[item.title, item.institution, item.description, item.skills],
					normalizedQuery,
				),
			).map(({ image: _image, certificate, ...item }) => ({
				...item,
				certificate: certificate ? absoluteUrl(certificate) : null,
			}))

			return {
				count: education.length,
				query: normalizedQuery || null,
				education,
			}
		},
		annotations: { readOnlyHint: true },
	},
	{
		name: "get_portfolio_contact",
		title: "Consultar formas de contacto",
		description:
			"Devuelve únicamente los canales públicos para contactar a Alexander Montilla Rivera y la URL de su currículum. No envía mensajes ni inicia descargas.",
		inputSchema: {
			type: "object",
			properties: {},
			additionalProperties: false,
		},
		execute: async () => ({
			email: CONTACT.email,
			linkedin: CONTACT.linkedin,
			github: CONTACT.github,
			resume: absoluteUrl(CONTACT.resumePath),
		}),
		annotations: { readOnlyHint: true },
	},
	{
		name: "navigate_portfolio",
		title: "Navegar por el portfolio",
		description:
			"Desplaza la página hasta una sección pública concreta del portfolio. Solo cambia la posición visible de la página.",
		inputSchema: {
			type: "object",
			properties: {
				section: {
					type: "string",
					enum: SECTION_IDS,
					description:
						"Identificador exacto de la sección que se desea mostrar.",
				},
			},
			required: ["section"],
			additionalProperties: false,
		},
		execute: async ({ section }) => {
			if (
				typeof section !== "string" ||
				!SECTION_IDS.includes(section as (typeof SECTION_IDS)[number])
			) {
				return {
					success: false,
					error: "Sección no válida.",
					availableSections: SECTION_IDS,
				}
			}

			const target = document.getElementById(section)
			if (!target) {
				return {
					success: false,
					error: "La sección no está disponible en esta página.",
				}
			}

			target.scrollIntoView({
				behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
					? "auto"
					: "smooth",
				block: "start",
			})

			history.replaceState(null, "", `#${section}`)
			return { success: true, section }
		},
	},
]

const registerWebMCPTools = async () => {
	const modelContext = document.modelContext
	if (!modelContext?.registerTool) return

	window.portfolioWebMCPController?.abort()
	const controller = new AbortController()
	window.portfolioWebMCPController = controller

	const registrations = tools.map((tool) =>
		modelContext.registerTool(tool, { signal: controller.signal }),
	)
	const results = await Promise.allSettled(registrations)

	const failed = results.filter((result) => result.status === "rejected")
	if (failed.length > 0 && !controller.signal.aborted) {
		console.warn(
			`WebMCP: ${failed.length} herramienta(s) no pudieron registrarse.`,
		)
	}
}

document.addEventListener("astro:page-load", registerWebMCPTools)
void registerWebMCPTools()
