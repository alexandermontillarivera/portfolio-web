import type { IEducation } from "@/interfaces/Education"

export const EDUCATION: IEducation[] = [
	{
		title: "Técnico en aplicaciones informáticas",
		description:
			"Educación secundaria técnico profesional en el IPPC, con especialización en aplicaciones informáticas.",
		image: "/images/education/ippc.png",
		institution: "Instituto Politécnico Pilar Constanzo",
		skills: [
			"Estilos CSS",
			"WordPress como CMS",
			"Programación en PHP",
			"Manejo de SQL Server",
			"Analisís de sistemas",
			"El lenguaje de Marcado HTML",
			"Manejo de Microsoft Office",
			"Estructurar base de datos SQL",
			"Introducción a redes y comunicaciones",
			"Manejo básico de Adobe Photoshop y Adobe Illustrator",
			"Introducción a la programación móvil con Dart y Flutter",
		],
		year: 2022,
	},
	{
		title: "Emprendimiento",
		description:
			"Curso para emprendedores, con el objetivo de brindar herramientas para la creación de un negocio propio.",
		image: "/images/education/unapec.png",
		institution: "Universidad APEC",
		skills: [
			"Como encontrar un nicho de mercado",
			"Como crear un plan de negocio",
			"La importancia de la marca",
			"Como hacer un estudio de mercado",
		],
		certificate: "/certificates/emprendimiento.pdf",
		year: 2021,
	},
	{
		title: "Legislación laboral en la República Dominicana",
		description:
			"Curso de legislación laboral en la República Dominicana, con el objetivo de conocer las leyes que rigen el trabajo en el país.",
		image: "/images/education/ja-dominicana.png",
		institution: "JA Dominicana, BID y Emplea Tech",
		skills: [
			"Las leyes laborales en la República Dominicana",
			"Los derechos laborales",
			"Los deberes laborales",
			"Las leyes de seguridad social",
		],
		certificate: "/certificates/legislacion-laboral.pdf",
		year: 2020,
	},
	{
		title: "Marca personal y marketing digital",
		description:
			"Curso de marca personal y marketing digital, con el objetivo de aprender a crear una marca personal y a utilizar las herramientas digitales para promocionarla.",
		image: "/images/education/ja-dominicana.png",
		institution: "JA Dominicana, BID Lab y Emplea Tech",
		skills: [
			"La marca personal",
			"El marketing digital",
			"El llamado a la acción",
			"Plan de marketing digital",
			"Utilizar las redes sociales para promocionar la marca personal",
		],
		certificate: "/certificates/marca-personal.pdf",
		year: 2020,
	},
]
