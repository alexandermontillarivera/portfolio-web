import type { IMenuItem } from "@/interfaces/Menu"
import { SECTIONS } from "@/constants"
import {
	IconLayoutBottombarCollapse,
	IconLayoutCollage,
	IconBriefcase,
	IconFileText,
	IconSchool,
	IconHome,
} from "@tabler/icons-react"

export const MENU: IMenuItem[] = [
	{
		href: `#${SECTIONS.HERO}`,
		text: "Inicio",
		icon: IconHome,
	},
	{
		href: `#${SECTIONS.EXPERIENCE}`,
		text: "Experiencia",
		icon: IconBriefcase,
	},
	{
		href: `#${SECTIONS.PROJECTS}`,
		text: "Proyectos",
		icon: IconLayoutCollage,
	},
	{
		href: `#${SECTIONS.EDUCATION}`,
		text: "Educación",
		icon: IconSchool,
	},
	{
		href: `#${SECTIONS.SKILLS}`,
		text: "Habilidades",
		icon: IconFileText,
	},

	{
		href: `#${SECTIONS.INSPIRATION}`,
		text: "Inspiración",
		icon: IconLayoutBottombarCollapse,
	},
]
