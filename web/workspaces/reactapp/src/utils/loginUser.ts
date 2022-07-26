import { Either, right, left } from "@sweet-monads/either"
import { httpFetch, NetWorkError } from "../services/httpFetch"

export interface UserNotFoundError {
	error: string
}

export interface AccessToken {
	access_token: string
	role: "admin" | "user"
}

export async function loginUser(
	queryData: any
): Promise<Either<Either<NetWorkError, UserNotFoundError>, AccessToken>> {
	const userLoginUrl = "http://localhost:3001/api/auth/login"
	const response = await httpFetch({
		method: "post",
		route: userLoginUrl,
		data: queryData,
	})

	return response.mapLeft((networkError) => {
		if (networkError.error_response) {
			const clientResponse = networkError.error_response
			const clientErrorStatus = clientResponse.data.statusCode
			const userErrorMessage = clientResponse.data.error
			if (clientErrorStatus === 419) return right({ error: userErrorMessage })
			else {
				return right({ error: "some error with user" })
			}
		} else {
			return left(networkError)
		}
	})
}
