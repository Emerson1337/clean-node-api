import { MissingParamError } from '../Errors/MissingParamError';
import { badRequest } from '../Helpers/HttpHelper';
import { HttpRequest, HttpResponse } from './Protocols/http';

export class SignUpController {
	handle(httpRequest: HttpRequest): HttpResponse {
		const requiredFields = ['name', 'email', 'password'];

		for (const field of requiredFields) {
			if (!httpRequest.body[field]) {
				return badRequest(new MissingParamError(field));
			}
		}

		return {
			statusCode: 200,
			body: 'Success',
		};
	}
}