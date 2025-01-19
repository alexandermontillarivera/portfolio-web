import type { IExperience } from "@/interfaces/Experience"

export const EXPERIENCE: IExperience[] = [
	{
		startDate: new Date("2022-02-01"),
		title: "Líder de proyectos",
		company: "Codika SRL",
		technologies: [
			"TypeScript",
			"JavaScript",
			"CSS",
			"HTML",
			"Node.js",
			"React",
			"Azure",
			"Git",
			"Material UI",
			"WordPress",
			"PHP",
		],
		responsibilities: [
			"Desarrollar proyectos eficientes y escalables a lo largo del tiempo.",
			"Ayudar a los miembros del equipo a mejorar sus habilidades.",
			"Liderar reuniones de planificación y revisión de proyectos.",
			"Mantener la calidad de los proyectos.",
		],
		achievement: `
      Comencé como pasante, pasando por diversos roles y responsabilidades. 
      Gracias a mi desempeño y dedicación, fui promovido a líder de proyectos. 
      Actualmente, he liderado múltiples proyectos exitosos y he contribuido significativamente 
      a mejorar la calidad de los proyectos en la empresa.
      `,
	},
	{
		company: "RM English Academy",
		startDate: new Date("2020-08-01"),
		endDate: new Date("2021-04-01"),
		responsibilities: [
			"Optimizar el sitio web de la empresa.",
			"Administrar y actualizar el contenido del sitio web.",
			"Agregar nuevas funcionalidades al sitio web.",
		],
		technologies: ["WordPress", "PHP", "CSS", "HTML", "JavaScript"],
		title: "Web Master",
		achievement: `
      Desarrollé la presencia en línea de una empresa de enseñanza de inglés que no contaba con un sitio web. 
      Creé un portal que sirvió como punto de contacto y enlace directo con sus clientes, aumentando significativamente 
      su visibilidad y accesibilidad.
    `,
	},
]
