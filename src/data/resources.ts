import { IDirectory, TYPE_CONTENT } from "@/interfaces/Directory"

export const RESOURCES: IDirectory[] = [
	{
		title: "React",
		items: [
			{
				title: "Sonner - Notificaciones toast",
				type: TYPE_CONTENT.ANCHOR,
				url: "https://sonner.emilkowal.ski",
				image: "/images/resources/sonner.ico",
			},
			{
				title: "Chakra UI - Catalogo de componentes",
				image: "/images/resources/chakraui.ico",
				type: TYPE_CONTENT.ANCHOR,
				url: "https://www.chakra-ui.com/",
			},
		],
	},
	{
		title: "Creadores de contenido",
		items: [
			{
				title: "Midudev - Programación Web",
				type: TYPE_CONTENT.ANCHOR,
				image: "/images/resources/midudev.svg",
				url: "https://midu.dev/",
			},
			{
				title: "Fazt - Programación Web",
				image: "/images/resources/fazttech.png",
				type: TYPE_CONTENT.ANCHOR,
				url: "https://faztweb.com/",
			},
			{
				title: "Web Dev Simplified - Programación Web",
				type: TYPE_CONTENT.ANCHOR,
				image: "/images/resources/web-dev-simplified.ico",
				url: "https://www.youtube.com/@WebDevSimplified",
			},
			{
				title: "Gentleman Programming - Programación Web",
				image: "/images/resources/gentleman-programming.jpg",
				type: TYPE_CONTENT.ANCHOR,
				url: "https://www.youtube.com/@GentlemanProgramming",
			},
			{
				title: "Carmen Ansio - Design Engineer & Creative Developer",
				image: "/images/resources/carmen-ansio.svg",
				type: TYPE_CONTENT.ANCHOR,
				url: "https://www.carmenansio.com/",
			},
		],
	},
	{
		title: "AI",
		items: [
			{
				title: "V0 - UI generada por IA",
				image: "/images/resources/v0.png",
				type: TYPE_CONTENT.ANCHOR,
				url: "https://v0.dev/",
			},
			{
				title: "Bolt - UI generada por IA",
				image: "/images/resources/bolt.svg",
				type: TYPE_CONTENT.ANCHOR,
				url: "https://bolt.new/",
			},
			{
				title: "Claude - Alternativa a Chatgpt",
				image: "/images/resources/claude.ico",
				type: TYPE_CONTENT.ANCHOR,
				url: "https://claude.ai/",
			},
		],
	},
	{
		title: "Despliegue",
		items: [
			{
				title: "Vercel",
				image: "/images/resources/vercel.png",
				type: TYPE_CONTENT.ANCHOR,
				url: "https://vercel.com/",
			},
			{
				title: "Netlify",
				image: "/images/resources/netlify.ico",
				type: TYPE_CONTENT.ANCHOR,
				url: "https://www.netlify.com/",
			},
			{
				title: "Railway",
				image: "/images/resources/railway.png",
				type: TYPE_CONTENT.ANCHOR,
				url: "https://railway.com/",
			},
			{
				title: "Render",
				image: "/images/resources/render.avif",
				type: TYPE_CONTENT.ANCHOR,
				url: "https://render.com/",
			},
		],
	},
	{
		title: "Iconos",
		items: [
			{
				title: "Heroicons",
				image: "/images/resources/heroicons.png",
				type: TYPE_CONTENT.ANCHOR,
				url: "https://heroicons.com/",
			},
			{
				title: "Tabler",
				image: "/images/resources/tabler.ico",
				type: TYPE_CONTENT.ANCHOR,
				url: "https://tabler.io/icons",
			},
		],
	},
]
