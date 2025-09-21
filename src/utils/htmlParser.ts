import { parse as parseHTMLString } from "node-html-parser"

export interface HTMLNode {
	type: "element" | "text"
	tagName?: string
	attributes?: Record<string, string>
	content?: string
	children: HTMLNode[]
}

export const parseHTML = (html: string): HTMLNode[] => {
	const root = parseHTMLString(html)

	const processNode = (node: any): HTMLNode | null => {
		if (node.nodeType === 3 && !node.text.trim()) {
			return null
		}

		if (node.nodeType === 3) {
			return {
				type: "text",
				content: node.text.trim(),
				children: [],
			}
		}

		if (node.nodeType === 1) {
			const attributes: Record<string, string> = {}

			if (node.attributes) {
				Object.entries(node.attributes).forEach(([key, value]) => {
					attributes[key] = value as string
				})
			}

			const children: HTMLNode[] = []
			node.childNodes.forEach((childNode: any) => {
				const processed = processNode(childNode)
				if (processed) {
					children.push(processed)
				}
			})

			return {
				type: "element",
				tagName: node.tagName.toLowerCase(),
				attributes: Object.keys(attributes).length > 0 ? attributes : undefined,
				children,
			}
		}

		return null
	}

	const result: HTMLNode[] = []
	root.childNodes.forEach((node) => {
		const processed = processNode(node)
		if (processed) {
			result.push(processed)
		}
	})

	return result
}
