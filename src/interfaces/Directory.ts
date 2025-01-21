export enum TYPE_CONTENT {
	DIRECTORY = "directory",
	ANCHOR = "anchor",
}

export interface IItemAnchor {
	title: string
	type: TYPE_CONTENT.ANCHOR
	url: string
	image: string
}

export interface IItemDirectory {
	title: string
	type: TYPE_CONTENT.DIRECTORY
	items: IItem[]
}

export type IItem = IItemAnchor | IItemDirectory

export interface IDirectory {
	title: string
	items: IItem[]
}
