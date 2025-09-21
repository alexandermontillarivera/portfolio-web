interface SuccessResponse<T> {
	ok: true
	status: number
	data: T
	error?: never
	headers: Headers
}

interface ErrorResponse<E> {
	ok: false
	status: number
	data: null
	error: E
	headers: Headers
}

type ResponseType<T, E> = SuccessResponse<T> | ErrorResponse<E>

interface ConfigParams<GlobalErrorType> {
	baseUrl?: string | null
	headers?: (() => Record<string, string>) | Record<string, string>
	query?: (() => Record<string, string>) | Record<string, string>
	interceptors?: {
		request?: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>
		response?: <T>(
			response: ResponseType<T, GlobalErrorType>,
		) =>
			| ResponseType<T, GlobalErrorType>
			| Promise<ResponseType<T, GlobalErrorType>>
		error?: <T>(
			error: ResponseType<T, GlobalErrorType>,
		) =>
			| ResponseType<T, GlobalErrorType>
			| Promise<ResponseType<T, GlobalErrorType>>
	}
}

interface RequestConfig {
	url: string
	method: string
	headers: Record<string, string>
	body?: BodyInit
	query?: Record<string, string>
}

type ContentType = "json" | "formData" | "text" | "blob" | "arrayBuffer"

const serializeQuery = (query: Record<string, string>): string => {
	const params = new URLSearchParams()
	Object.entries(query).forEach(([key, value]) => {
		if (value !== undefined && value !== null) {
			params.append(key, value)
		}
	})
	return params.toString()
}

const createUrl = (
	baseUrl: string | null,
	path: string,
	query: Record<string, string> = {},
): string => {
	const base = baseUrl !== null ? `${baseUrl}${path}` : path
	const queryString = serializeQuery({ ...query })
	return queryString ? `${base}?${queryString}` : base
}

const getContentType = (headers: Record<string, string>): ContentType => {
	const contentType = headers["Content-Type"] || headers["content-type"] || ""
	if (contentType.includes("application/json")) return "json"
	if (contentType.includes("multipart/form-data")) return "formData"
	if (contentType.includes("text")) return "text"
	if (contentType.includes("application/octet-stream")) return "blob"
	return "json"
}

const parseResponseData = async (
	response: Response,
	contentType: ContentType,
): Promise<any> => {
	try {
		switch (contentType) {
			case "json":
				return await response.json()
			case "formData":
				return await response.formData()
			case "text":
				return await response.text()
			case "blob":
				return await response.blob()
			case "arrayBuffer":
				return await response.arrayBuffer()
			default:
				return await response.json()
		}
	} catch (e) {
		return null
	}
}

const prepareRequestBody = (
	data: any,
	headers: Record<string, string>,
): BodyInit => {
	const contentType = getContentType(headers)

	if (
		data instanceof FormData ||
		data instanceof Blob ||
		data instanceof ArrayBuffer
	) {
		return data
	}

	switch (contentType) {
		case "json":
			return JSON.stringify(data)
		case "formData":
			if (!(data instanceof FormData)) {
				const formData = new FormData()
				Object.entries(data).forEach(([key, value]) => {
					formData.append(key, value as string | Blob)
				})
				return formData
			}
			return data
		case "text":
			return String(data)
		default:
			return JSON.stringify(data)
	}
}

const resolveValue = <T>(value: T | (() => T)): T => {
	return typeof value === "function" ? (value as Function)() : value
}

export const createClientHTTP = <GlobalErrorType>({
	baseUrl = null,
	headers: defaultHeaders = {},
	query: globalQuery = {},
	interceptors = {},
}: ConfigParams<GlobalErrorType>) => {
	const executeRequest = async <T>(
		config: RequestConfig,
	): Promise<ResponseType<T, GlobalErrorType>> => {
		try {
			const finalConfig = interceptors.request
				? await interceptors.request(config)
				: config

			const response = await fetch(finalConfig.url, {
				method: finalConfig.method,
				headers: finalConfig.headers,
				body: finalConfig.body,
			})

			const contentType = getContentType(finalConfig.headers)
			const data = await parseResponseData(response, contentType)

			const responseData: ResponseType<T, GlobalErrorType> = response.ok
				? {
						ok: true,
						status: response.status,
						data: data as T,
						headers: response.headers,
				  }
				: {
						ok: false,
						status: response.status,
						data: null,
						error: data as GlobalErrorType,
						headers: response.headers,
				  }

			if (interceptors.response) {
				return await interceptors.response(responseData)
			}
			return responseData
		} catch (error: any) {
			const errorResponse: ErrorResponse<GlobalErrorType> = {
				ok: false,
				status: 0,
				data: null,
				error: {
					message: error.message || "Network error",
					originalError: error,
				} as GlobalErrorType,
				headers: new Headers(),
			}

			if (interceptors.error) {
				return (await interceptors.error(errorResponse)) as ResponseType<
					T,
					GlobalErrorType
				>
			}
			return errorResponse
		}
	}

	const createMethod = (method: string) => {
		return async <T, E = GlobalErrorType>({
			url: urlPath = "/",
			data,
			query = {},
			headers = {},
		}: {
			url?: string
			data?: any
			query?: Record<string, string>
			headers?: Record<string, string>
		} = {}): Promise<ResponseType<T, E>> => {
			const defaultConfig: Partial<RequestConfig> = {
				headers: {
					"Content-Type": "application/json",
					...resolveValue(defaultHeaders),
				},
				query: resolveValue(globalQuery),
			}

			const resolvedGlobalQuery = resolveValue(globalQuery)
			const resolvedGlobalHeaders = resolveValue(defaultHeaders)

			const mergedQuery = { ...resolvedGlobalQuery, ...query }
			const mergedHeaders = {
				...defaultConfig.headers,
				...resolvedGlobalHeaders,
				...headers,
			}
			const url = createUrl(baseUrl, urlPath, mergedQuery)

			const config: RequestConfig = {
				url,
				method,
				headers: mergedHeaders,
			}

			if (data !== undefined) {
				config.body = prepareRequestBody(data, mergedHeaders)
			}

			return executeRequest<T>(config) as unknown as Promise<ResponseType<T, E>>
		}
	}

	return {
		GET: createMethod("GET"),
		POST: createMethod("POST"),
		PUT: createMethod("PUT"),
		PATCH: createMethod("PATCH"),
		DELETE: createMethod("DELETE"),
	}
}
