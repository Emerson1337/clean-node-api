import { MissingParamError } from '../Errors/MissingParamError';
import { badRequest } from '../Helpers/HttpHelper';
import { HttpRequest, HttpResponse } from './Protocols/http';

export class SignUpController {
	handle(httpRequest: HttpRequest): HttpResponse {
		if (!httpRequest.body.name) {
			return badRequest(new MissingParamError('name'));
		}

		if (!httpRequest.body.email) {
			return badRequest(new MissingParamError('email'));
		}

		return {
			statusCode: 200,
			body: 'Success',
		};
	}
}
