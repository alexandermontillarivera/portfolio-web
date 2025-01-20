import type { Icon } from "@tabler/icons-react"

export interface ITechSkill {
	type: TECH_SKILL_TYPE
	name: string
	web: string
	icon: Icon
}

export enum TECH_SKILL_TYPE {
	ALL = "Todas",
	FRONTEND = "Frontend",
	BACKEND = "Backend",
	FULL_STACK = "Full Stack",
	DATABASE = "Base de Datos",
	TESTING = "Testing",
	CLOUD = "Cloud",
	TOOL = "Herramientas",
	AI = "IA",
}
