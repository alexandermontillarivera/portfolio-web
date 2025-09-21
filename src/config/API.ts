import { createClientHTTP } from "@/utils/clientHTTP"

export const API = createClientHTTP({
	baseUrl: "https://jsonplaceholder.typicode.com",
})
