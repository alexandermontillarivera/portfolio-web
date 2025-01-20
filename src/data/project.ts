import type { IProject } from "@/interfaces/Project"

export const PROJECTS: IProject[] = [
	{
		title: "Markup To JSON",
		description:
			"Una librería para convertir HTML a JSON y viceversa de forma sencilla, rápida y eficiente.",
		image: "/images/projects/markup-to-json.png",
		technologies: ["Svelte", "TypesScript", "Pico.CSS", "Vitest"],
		url: "https://markuptojson.alexandermontillarivera.com/",
	},
	{
		title: "Scrapper",
		description:
			"API para extraer información de una página web de los metadatos de un sitio web.",
		image: "/images/projects/scrapper.png",
		technologies: [
			"Deno",
			"Express",
			"Cheerio",
			"Axios",
			"TypeScript",
			"Svelte",
		],
		url: "https://scraper.alexandermontillarivera.com/",
	},
	{
		title: "Cototasks",
		description:
			"Es una aplicación web para gestionar tareas de forma sencilla y rápida.",
		image: "/images/projects/tasks.png",
		technologies: ["Bootstrap", "Node.js", "Express", "MongoDB", "Handlebars"],
		url: "https://cototasks.onrender.com/",
	},
]
