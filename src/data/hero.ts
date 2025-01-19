import type { SocialMedia } from "@/interfaces/SocialMedia"
import {
	IconBrandLinkedin,
	IconBrandGithub,
	IconMail,
} from "@tabler/icons-react"

export const SOCIAL_MEDIA: SocialMedia[] = [
	{
		icon: IconBrandLinkedin,
		url: "https://www.linkedin.com/in/alexander-montilla-rivera/",
		name: "LinkedIn",
	},
	{
		icon: IconBrandGithub,
		url: "https://github.com/alexandermontillarivera",
		name: "GitHub",
	},
	{
		icon: IconMail,
		url: "mailto:info@alexandermontillarivera.com",
		name: "Email",
	},
]
